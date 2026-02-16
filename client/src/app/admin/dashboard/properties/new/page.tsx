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
  location: {
    address: string;
    city: string;
    state: string;
    area: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  images: File[];
  agentId?: string;
}

interface Agent {
  _id: string;
  name: string;
}

// Popular Nigerian locations for quick selection
const popularLocations = {
  "Victoria Island": { lat: 6.4281, lng: 3.4219 },
  "Lekki": { lat: 6.4698, lng: 3.5852 },
  "Ikoyi": { lat: 6.4549, lng: 3.4316 },
  "Ajah": { lat: 6.4698, lng: 3.6145 },
  "Ikeja": { lat: 6.5964, lng: 3.3406 },
  "Yaba": { lat: 6.5074, lng: 3.3823 },
};

export default function CreateProperty() {
  const router = useRouter();

  const [agents, setAgents] = useState<Agent[]>([]);

  const [form, setForm] = useState<PropertyForm>({
    title: "",
    description: "",
    type: "",
    category: "",
    price: undefined,
    pricePerNight: undefined,
    location: {
      address: "",
      city: "",
      state: "",
      area: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    size: "",
    bedrooms: undefined,
    bathrooms: undefined,
    images: [],
    agentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  // Fetch agents
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

  const handleLocationChange = (field: string, value: string | number) => {
    if (field === "lat" || field === "lng") {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            ...prev.location.coordinates,
            [field]: Number(value),
          },
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    }
  };

  // Quick fill coordinates from popular locations
  const handleQuickLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationName = e.target.value;
    if (locationName && popularLocations[locationName as keyof typeof popularLocations]) {
      const coords = popularLocations[locationName as keyof typeof popularLocations];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          area: locationName,
          coordinates: coords,
        },
      }));
    }
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

      // Handle regular fields
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("category", form.category);
      
      if (form.price) formData.append("price", String(form.price));
      if (form.pricePerNight) formData.append("pricePerNight", String(form.pricePerNight));
      if (form.size) formData.append("size", form.size);
      if (form.bedrooms) formData.append("bedrooms", String(form.bedrooms));
      if (form.bathrooms) formData.append("bathrooms", String(form.bathrooms));
      if (form.agentId) formData.append("agentId", form.agentId);

      // Handle location as JSON
      formData.append("location", JSON.stringify(form.location));

      // Handle images
      form.images.forEach((file) => formData.append("images", file));

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="e.g., Luxury 3 Bedroom Apartment"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <div className="border border-gray-300 rounded-lg">
            {mounted && editor ? (
              <EditorContent editor={editor} className="min-h-[150px] p-3 prose max-w-none" />
            ) : (
              <p className="p-3 text-gray-500">Loading editor...</p>
            )}
          </div>
        </div>

        {/* Assign Agent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Agent *
          </label>
          <select
            name="agentId"
            value={form.agentId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select type</option>
              <option value="land">Land</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select category</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="shortlet">Shortlet</option>
            </select>
          </div>
        </div>

        {/* Price & Price per Night */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦)
            </label>
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., 50000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night (₦)
            </label>
            <input
              type="number"
              name="pricePerNight"
              value={form.pricePerNight || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., 50000"
            />
          </div>
        </div>

        {/* LOCATION SECTION */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Location Details</h3>
          
          {/* Quick Location Selector */}
          <div className="mb-4 bg-amber-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🚀 Quick Fill (Popular Lagos Areas)
            </label>
            <select
              onChange={handleQuickLocation}
              className="w-full border border-amber-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="">Select a popular area to auto-fill coordinates</option>
              {Object.keys(popularLocations).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-2">
              This will auto-fill the area name and coordinates
            </p>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address *
            </label>
            <input
              type="text"
              value={form.location.address}
              onChange={(e) => handleLocationChange("address", e.target.value)}
              placeholder="e.g., 123 Admiralty Way"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                value={form.location.city}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Select City</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Ibadan">Ibadan</option>
                <option value="Kano">Kano</option>
                <option value="Benin City">Benin City</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={form.location.state}
                onChange={(e) => handleLocationChange("state", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Select State</option>
                <option value="Lagos">Lagos State</option>
                <option value="FCT">Federal Capital Territory</option>
                <option value="Rivers">Rivers State</option>
                <option value="Oyo">Oyo State</option>
                <option value="Kano">Kano State</option>
                <option value="Edo">Edo State</option>
              </select>
            </div>
          </div>

          {/* Area/Neighborhood */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area/Neighborhood
            </label>
            <input
              type="text"
              value={form.location.area}
              onChange={(e) => handleLocationChange("area", e.target.value)}
              placeholder="e.g., Lekki Phase 1, Victoria Island, Ikoyi"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={form.location.coordinates.lat || ""}
                onChange={(e) => handleLocationChange("lat", e.target.value)}
                placeholder="e.g., 6.4281"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={form.location.coordinates.lng || ""}
                onChange={(e) => handleLocationChange("lng", e.target.value)}
                placeholder="e.g., 3.4219"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Helper text */}
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Use{" "}
            <a
              href="https://www.latlong.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline font-medium"
            >
              latlong.net
            </a>{" "}
            to find coordinates, or use the quick selector above
          </p>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Size
          </label>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="e.g., 500 sqm, 2000 sqft"
          />
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={form.bedrooms || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={form.bathrooms || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., 2"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Images *
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload multiple images (PNG, JPG, WEBP)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Property..." : "Create Property"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}