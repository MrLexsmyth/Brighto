"use client";

import axios from "../../../../../../utils/axios";
import Image from "next/image";
import { useEffect, useState, use } from "react";

export const dynamic = 'force-dynamic';

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
  location: string;
  address?: string;
  size?: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  status: string;
  createdAt: string;
  slug: string;
  agent: Agent; // ✅ agent object now
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PropertyPage({ params }: Props) {
  const { slug } = use(params); // ✅ unwrap the Promise
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/admin/properties/slug/${slug}`, {
          withCredentials: true,
        });
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
  if (error || !property) return <p className="p-6 text-red-600">Property not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <div
        className="prose dark:prose-invert text-gray-700"
        dangerouslySetInnerHTML={{ __html: property.description || "" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {property.images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`${property.title} image ${idx + 1}`}
            width={500}
            height={300}
            className="object-cover rounded"
          />
        ))}
      </div>

      <ul className="text-gray-800 space-y-1">
        <li><strong>Type:</strong> {property.type}</li>
        <li><strong>Category:</strong> {property.category}</li>
        {property.price && <li><strong>Price:</strong> ₦{property.price.toLocaleString()}.00</li>}
        {property.pricePerNight && <li><strong>Price/Night:</strong> ₦{property.pricePerNight.toLocaleString()}.00</li>}
        <li><strong>Location:</strong> {property.location}</li>
        {property.address && <li><strong>Address:</strong> {property.address}</li>}
        {property.size && <li><strong>Size:</strong> {property.size}</li>}
        {property.bedrooms && <li><strong>Bedrooms:</strong> {property.bedrooms}</li>}
        {property.bathrooms && <li><strong>Bathrooms:</strong> {property.bathrooms}</li>}

        <p><strong>Agent Name:</strong> {property.agent.name}</p>
        <p><strong>Agent Email:</strong> {property.agent.email}</p>  
        <p><strong>Agent Company:</strong> {property.agent.company}</p>
        {property.agent.phone && <p><strong>Agent Phone:</strong> {property.agent.phone}</p>}


        <li><strong>Status:</strong> {property.status}</li>
        <li><strong>Posted:</strong> {new Date(property.createdAt).toLocaleDateString()}</li>
      </ul>
    </div>
  );
}
