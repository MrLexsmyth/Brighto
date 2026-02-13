'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import slugify from "slugify";
import axios from "../../../../../../utils/axios";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';




// TipTap requires client-side only rendering
interface BlogFormData {
  title: string;
  slug: string;
  category: string;
  tags: string;
  content: string;
  status: "draft" | "published";
  image?: File | null;
}

export default function AdminBlogForm() {
  const router = useRouter();

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    category: "",
    tags: "",
    content: "",
    status: "draft",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // TipTap editor
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-0 focus:outline-none',
      },
    },
    immediatelyRender: false, // ⚠ Important for SSR
    onUpdate({ editor }) {
      setForm(prev => ({ ...prev, content: editor.getHTML() }));
    }
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    if (form.title) {
      setForm(prev => ({ 
        ...prev, 
        slug: slugify(form.title, { lower: true, strict: true }) 
      }));
    }
  }, [form.title]);

  // Input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, image: file }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("slug", form.slug);
      data.append("category", form.category);
      data.append("tags", form.tags);
      data.append("content", form.content);
      data.append("status", form.status);
      if (form.image) data.append("image", form.image);

      await axios.post("/admin/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/admin/dashboard/blog");
    } catch (err) {
      console.error("Error creating blog", err);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          {editor && <EditorContent editor={editor} />}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Feature Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md p-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
