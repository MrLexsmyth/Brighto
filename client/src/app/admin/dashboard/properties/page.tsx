"use client";

import { useEffect, useState } from "react";
import api from "../../../../../utils/axios";
import Link from "next/link";
import Image from "next/image";



interface Property {
  _id: string;
  title: string;
  type: string;
  category: string;
  price?: number;
  pricePerNight?: number;
  location: string;
  size: string;
  images: string[];
  createdAt: string;
  slug: string; 
}

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/admin/properties", { withCredentials: true });
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/admin/properties/${id}`, { withCredentials: true });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Properties</h2>
        <Link
          href="/admin/dashboard/properties/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="border p-4 rounded shadow relative">
            <Link   href={`/admin/dashboard/properties/${prop.slug}`}>
              <Image
                src={prop.images[0]}
                alt={prop.title}
                width={400}
                height={200}
                className="object-cover rounded mb-2 w-full h-40"
              />
              <h3 className="font-bold">{prop.title}</h3>
            </Link>
            <p>{prop.type} - {prop.category}</p>
            {prop.price && <p>₦{prop.price.toLocaleString()}</p>}
            {prop.pricePerNight && <p>₦{prop.pricePerNight.toLocaleString()} / night</p>}
            <p>{prop.location}</p>
            <p>{prop.size}</p>
            <p className="text-xs text-gray-500">
              {new Date(prop.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(prop._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
