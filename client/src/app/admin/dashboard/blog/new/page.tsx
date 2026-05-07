'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import slugify from "slugify";
import api from "../../../../../../utils/axios";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface BlogFormData {
  title: string;
  slug: string;
  categories: string;
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
    categories: "",
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
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none min-h-[200px] border rounded-md p-4 focus:outline-none',
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      setForm((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  // Auto generate slug
  useEffect(() => {
    if (form.title) {
      setForm((prev) => ({
        ...prev,
        slug: slugify(form.title, {
          lower: true,
          strict: true,
        }),
      }));
    }
  }, [form.title]);

  // Handle inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("slug", form.slug);

      // Convert categories to array
      data.append(
        "categories",
        JSON.stringify(
          form.categories
            .split(",")
            .map((cat) => cat.trim())
            .filter(Boolean)
        )
      );

      // Convert tags to array
      data.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      data.append("content", form.content);
      data.append("status", form.status);

      if (form.image) {
        data.append("image", form.image);
      }

      await api.post("/admin/blogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/admin/dashboard/blog");

    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Create New Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block mb-2 font-semibold">
            Slug
          </label>

          <input
            type="text"
            name="slug"
            value={form.slug}
            readOnly
            className="w-full border rounded-md p-3 bg-gray-100"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block mb-2 font-semibold">
            Categories (comma separated)
          </label>

          <input
            type="text"
            name="categories"
            value={form.categories}
            onChange={handleChange}
            placeholder="Tech, Programming, AI"
            className="w-full border rounded-md p-3"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 font-semibold">
            Tags (comma separated)
          </label>

          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="React, NextJS, MongoDB"
            className="w-full border rounded-md p-3"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-semibold">
            Content
          </label>

          {editor && (
            <EditorContent editor={editor} />
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-semibold">
            Feature Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-semibold">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}