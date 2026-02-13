"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "../../../../../../utils/axios";
import Image from "next/image";


interface Agent {
  _id: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  bio?: string;
  phone?: string;
  website?: string;
  photo?: string;
  serviceAreas?: string[];
  specialties?: string[];
  propertyTypes?: string[];
  properties?: {
    _id: string;
    title: string;
    type: string;
    price?: number;
    location: string;
    slug: string;
    images?: string[];
  }[];
}

export default function AgentDetails() {
  const router = useRouter();
  const { id } = useParams(); // get agent ID from route
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`/admin/agents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgent(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch agent details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAgent();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!agent) return <p className="p-6 text-center">Agent not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <button
        className="bg-gray-200 px-4 py-2 rounded"
        onClick={() => router.back()}
      >
        ← Back to Agents
      </button>

      {/* Agent Info */}
      <h1 className="text-2xl font-bold mb-4">{agent.name}</h1>
      <div className="flex items-center space-x-4">
        {agent.photo && (
          <Image
            width={48}
            height={48}
            src={agent.photo}
            alt={agent.name}
            className="w-60 h-60 object-cover rounded-xl"
          />
        )}
        </div>
        <div>
          
           <div
                 className="prose dark:prose-invert text-gray-700"
                 dangerouslySetInnerHTML={{ __html: agent.bio || "" }}
            />
          {agent.title && <p className="text-gray-600">{agent.title}</p>}
          {agent.company && <p className="text-gray-600">{agent.company}</p>}
          <p className="text-gray-800">Email: {agent.email}</p>
          {agent.phone && <p className="text-gray-800">Phone: {agent.phone}</p>}
          {agent.website && <p className="text-gray-800">Website: {agent.website}</p>}
        </div>
      

      {/* Optional Arrays */}
      {agent.serviceAreas?.length ? (
        <p>
          <strong>Service Areas:</strong> {agent.serviceAreas.join(", ")}
        </p>
      ) : null}

      {agent.specialties?.length ? (
        <p>
          <strong>Specialties:</strong> {agent.specialties.join(", ")}
        </p>
      ) : null}

      {agent.propertyTypes?.length ? (
        <p>
          <strong>Property Types:</strong> {agent.propertyTypes.join(", ")}
        </p>
      ) : null}

      {/* Properties */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Properties</h2>
        {agent.properties?.length ? (
          <ul className="space-y-2">
            {agent.properties.map((prop) => (
              <li
                key={prop._id}
                className="border p-3 rounded hover:shadow cursor-pointer"
                onClick={() => router.push(`/admin/dashboard/properties/${prop.slug}`)}
              >
                <h3 className="font-semibold">{prop.title}</h3>
                <p className="text-gray-600">
                  {prop.type} - {prop.location}{" "}
                  {prop.price && `- $${prop.price.toLocaleString()}`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No properties added yet.</p>
        )}
      </div>
    </div>
  );
}
