"use client";

import { useState, FormEvent, useEffect } from "react";
import api from "../../../../../../utils/axios";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";



interface PropertyForm {
  title: string;
  description: string;
  type: string;
  category: string;
  price?: number;
  pricePerNight?: number;
  location: string;
  address?: string;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  images: File[];
  agentId?: string; // ✅ NEW
}

interface Agent {
  _id: string;
  name: string;
}

export default function CreateProperty() {
  const router = useRouter();

  const [agents, setAgents] = useState<Agent[]>([]); // ✅ NEW

  const [form, setForm] = useState<PropertyForm>({
    title: "",
    description: "",
    type: "",
    category: "",
    price: undefined,
    pricePerNight: undefined,
    location: "",
    address: "",
    size: "",
    bedrooms: undefined,
    bathrooms: undefined,
    images: [],
    agentId: "", // ✅ NEW
  });

  const [loading, setLoading] = useState(false);

  // Ensure editor only renders on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/admin/agents", { withCredentials: true });
        setAgents(res.data);
      } catch (err) {
        console.error("Failed to fetch agents", err);
      }
    };

    fetchAgents();
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: form.description || "",
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, description: editor.getHTML() }));
    },
    editorProps: {},
    immediatelyRender: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "pricePerNight" ||
        name === "bedrooms" ||
        name === "bathrooms"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setForm((prev) => ({ ...prev, images: Array.from(files) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "images" && value) {
          (value as File[]).forEach((file) => formData.append("images", file));
        } else if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      await api.post("/admin/properties", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property created successfully!");
      router.push("/admin/dashboard/properties");
    } catch (err) {
      console.error(err);
      alert("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <div className="border rounded">
            {mounted && editor ? (
              <EditorContent editor={editor} className="min-h-[150px] p-2" />
            ) : (
              <p className="p-2 text-gray-500">Loading editor...</p>
            )}
          </div>
        </div>

        {/* ✅ Assign Agent Dropdown */}
        <div>
          <label className="block mb-1">Assign Agent</label>
          <select
            name="agentId"
            value={form.agentId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select type</option>
              <option value="land">Land</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select category</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
              <option value="shortlet">Shortlet</option>
            </select>
          </div>
        </div>

        {/* Price & Price per Night */}
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" value={form.price || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Price" />
          <input type="number" name="pricePerNight" value={form.pricePerNight || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Price per Night" />
        </div>

        {/* Location */}
        <input type="text" name="location" value={form.location} onChange={handleChange} required className="w-full border px-3 py-2 rounded" placeholder="Location" />

        {/* Address */}
        <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Address" />

        {/* Size */}
        <input type="text" name="size" value={form.size} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Size" />

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="bedrooms" value={form.bedrooms || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Bedrooms" />
          <input type="number" name="bathrooms" value={form.bathrooms || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Bathrooms" />
        </div>

        {/* Images */}
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full" />

        {/* Submit */}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>
    </div>
  );
}
