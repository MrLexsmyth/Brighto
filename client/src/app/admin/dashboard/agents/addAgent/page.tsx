"use client";

import { useState, FormEvent, useEffect } from "react";
import axios from "../../../../../../utils/axios";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

export const dynamic = 'force-dynamic';

interface AgentForm {
  name: string;
  title?: string;
  company?: string;
  email: string;
  bio?: string;
  phone?: string;
  website?: string;
  photo?: File; 
  serviceAreas?: string[]; 
  specialties?: string[];
  propertyTypes?: string[];
}

export default function AddAgent() {
  const router = useRouter();
  const [form, setForm] = useState<AgentForm>({
    name: "",
    title: "",
    company: "",
    email: "",
    bio: "",
    phone: "",
    website: "",
    photo: undefined,
    serviceAreas: [],
    specialties: [],
    propertyTypes: [],
  });

  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
  
    const editor = useEditor({
      extensions: [StarterKit, Link],
      content: form.bio || "",
      onUpdate: ({ editor }) => {
        setForm((prev) => ({ ...prev, bio: editor.getHTML() }));
      },
      // <-- Critical for SSR
      editorProps: {},
      immediatelyRender: false,
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // convert comma-separated values to array
    if (name === "serviceAreas" || name === "specialties" || name === "propertyTypes") {
      setForm((prev) => ({ ...prev, [name]: value.split(",").map((v) => v.trim()) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setForm((prev) => ({ ...prev, photo: e.target.files![0] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken"); // your admin auth token
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.title) formData.append("title", form.title);
      if (form.company) formData.append("company", form.company);
      if (form.bio) formData.append("bio", form.bio);
      if (form.phone) formData.append("phone", form.phone);
      if (form.website) formData.append("website", form.website);
      if (form.serviceAreas) formData.append("serviceAreas", form.serviceAreas.join(","));
      if (form.specialties) formData.append("specialties", form.specialties.join(","));
      if (form.propertyTypes) formData.append("propertyTypes", JSON.stringify(form.propertyTypes));
      if (form.photo) formData.append("photo", form.photo); 

      await axios.post("/admin/agents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Agent added successfully!");
      router.push("/admin/dashboard/agents"); // redirect to agent list
    } catch (err) {
      console.error(err);
      alert("Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="Broker / Agent"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={form.company || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block mb-1">Website</label>
          <input
            type="text"
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
                {/* Bio */}
         

          <div>
                   <label className="block mb-1">Bio</label>
                   <div className="border rounded">
                     {mounted && editor ? (
                       <EditorContent editor={editor} className="min-h-[150px] p-2" />
                     ) : (
                       <p className="p-2 text-gray-500">Loading editor...</p>
                     )}
                   </div>
                 </div>

        {/* Photo */}
        <div>
          <label className="block mb-1">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Service Areas */}
        <div>
          <label className="block mb-1">Service Areas (comma separated)</label>
          <input
            type="text"
            name="serviceAreas"
            value={(form.serviceAreas || []).join(", ")}
            onChange={handleChange}
            placeholder="Island, Eti-Osa"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="block mb-1">Specialties (comma separated)</label>
          <input
            type="text"
            name="specialties"
            value={(form.specialties || []).join(", ")}
            onChange={handleChange}
            placeholder="Consulting, Buyer's Agent, Listing Agent"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Property Types */}
        <div>
          <label className="block mb-1">Property Types (comma separated)</label>
          <input
            type="text"
            name="propertyTypes"
            value={(form.propertyTypes || []).join(", ")}
            onChange={handleChange}
            placeholder="Apartment, House, Land"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Agent"}
        </button>
      </form>
    </div>
  );
}
