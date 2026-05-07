"use client";

import api from "../../../../../../utils/axios";
import Image from "next/image";
import { useEffect, useState, use } from "react";

interface Agent {
  _id: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
  phone?: string;
}

interface Property {
  _id: string;
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
    area?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  address?: string;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  status: string;
  createdAt: string;
  slug: string;
  agent: Agent;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PropertyPage({ params }: Props) {
  const { slug } = use(params);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lightbox state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(
          `/admin/properties/slug/${slug}`,
          { withCredentials: true }
        );
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) return <p className="p-6">Loading property details...</p>;
  if (error || !property)
    return <p className="p-6 text-red-600">Property not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {property.title}
      </h1>

      {/* Description */}
      <div
        className="prose dark:prose-invert text-gray-700 mb-6"
        dangerouslySetInnerHTML={{
          __html: property.description || "",
        }}
      />

      {/* IMAGE GRID (THUMBNAILS) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {property.images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-full h-32 cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(img)}
          >
            <Image
              src={img}
              alt={`${property.title} image ${idx + 1}`}
              fill
              className="object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>

      {/* LIGHTBOX / MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90%] h-[80%]">
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* DETAILS */}
      <ul className="text-gray-800 space-y-1">
        <li><strong>Type:</strong> {property.type}</li>
        <li><strong>Category:</strong> {property.category}</li>

        {property.price && (
          <li>
            <strong>Price:</strong> ₦
            {property.price.toLocaleString()}.00
          </li>
        )}

        {property.pricePerNight && (
          <li>
            <strong>Price/Night:</strong> ₦
            {property.pricePerNight.toLocaleString()}.00
          </li>
        )}

        <li>
          <strong>Location:</strong>{" "}
          {property.location.area && `${property.location.area}, `}
          {property.location.city}, {property.location.state}
        </li>

        {property.address && (
          <li><strong>Address:</strong> {property.address}</li>
        )}

        {property.size && (
          <li><strong>Size:</strong> {property.size}</li>
        )}

        {property.bedrooms && (
          <li><strong>Bedrooms:</strong> {property.bedrooms}</li>
        )}

        {property.bathrooms && (
          <li><strong>Bathrooms:</strong> {property.bathrooms}</li>
        )}

        <p><strong>Agent Name:</strong> {property.agent.name}</p>
        <p><strong>Agent Email:</strong> {property.agent.email}</p>
        <p><strong>Agent Company:</strong> {property.agent.company}</p>

        {property.agent.phone && (
          <p><strong>Agent Phone:</strong> {property.agent.phone}</p>
        )}

        <li><strong>Status:</strong> {property.status}</li>

        <li>
          <strong>Posted:</strong>{" "}
          {new Date(property.createdAt).toLocaleDateString()}
        </li>
      </ul>
    </div>
  );
}