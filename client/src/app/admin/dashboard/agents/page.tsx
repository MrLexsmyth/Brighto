"use client";

import { useEffect, useState } from "react";
import axios from "../../../../../utils/axios";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

interface Agent {
  _id: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  photo?: string;
  serviceAreas?: string[];
  specialties?: string[];
  propertyTypes?: string[];
  properties?: { _id: string; title: string; slug: string }[];
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/agents", { withCredentials: true });
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading agents...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agents</h1>

      {agents.length === 0 ? (
        <p>No agents found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent._id}
              href={`/admin/dashboard/agents/${agent._id}`}
              className="block border rounded p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                {agent.photo ? (
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                    {agent.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-lg">{agent.name}</h2>
                  <p className="text-sm text-gray-600">
                    {agent.title} {agent.company && `at ${agent.company}`}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <strong>Email:</strong> {agent.email}
              </div>
              {agent.phone && (
                <div className="mb-2">
                  <strong>Phone:</strong> {agent.phone}
                </div>
              )}
               {agent.website && (
                <div className="mb-2">
                  <strong>Website:</strong> {agent.website}
                </div>
              )}
              {agent.serviceAreas && agent.serviceAreas.length > 0 && (
                <div className="mb-2">
                  <strong>Service Areas:</strong> {agent.serviceAreas.join(", ")}
                </div>
              )}
              {agent.specialties && agent.specialties.length > 0 && (
                <div className="mb-2">
                  <strong>Specialties:</strong> {agent.specialties.join(", ")}
                </div>
              )}
              {agent.propertyTypes && agent.propertyTypes.length > 0 && (
                <div className="mb-2">
                  <strong>Property Types:</strong> {agent.propertyTypes.join(", ")}
                </div>
              )}
              
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
