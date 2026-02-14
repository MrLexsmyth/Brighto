"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../utils/axios";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Globe, MapPin, Award, Home, MessageCircle } from "lucide-react";



interface Property {
  _id: string;
  title: string;
  slug: string;
  price?: number;
  pricePerNight?: number;
  type: string;
  location: string;
  images: string[];
}

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
  properties?: Property[];
}

export default function AgentDetailPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await api.get(`/agents/public/${id}`);
        setAgent(res.data);
      } catch (err) {
        console.error("Failed to fetch agent", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium text-lg">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <p className="text-red-600 text-xl font-semibold">Agent not found.</p>
          <p className="text-slate-600 mt-2">The agent youre looking for doesnt exist.</p>
          <Link
            href="/agents"
            className="inline-block mt-6 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            View All Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2aDRWMTJoLTR2NHptMCA4aDRWMjBoLTR2NHptMCA4aDRWMjhoLTR2NHptMCA4aDRWMzZoLTR2NHptLTggMGg0VjM2aC00djR6bTAtOGg0VjI4aC00djR6bTAtOGg0VjIwaC00djR6bTAtOGg0VjEyaC00djR6bS04IDhoNFYyMGgtNHY0em0wIDhoNFYyOGgtNHY0em0wIDhoNFYzNmgtNHY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Agent Photo */}
            {agent.photo && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-72 h-72 rounded-2xl overflow-hidden ring-4 ring-white/10 shadow-2xl">
                  <Image 
                    src={agent.photo} 
                    alt={agent.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Agent Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-semibold mb-4">
                Real Estate Professional
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                {agent.name}
              </h1>
              {agent.title && (
                <p className="text-xl text-slate-300 mb-6">
                  {agent.title} at{" "}
                  <span className="text-amber-400 font-semibold">{agent.company}</span>
                </p>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-8">
                <a
                  href={`mailto:${agent.email}`}
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Me</span>
                </a>

                {agent.phone && (
                  <>
                    <a
                      href={`tel:${agent.phone}`}
                      className="group flex items-center gap-2 px-6 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="hidden sm:inline">Call Now</span>
                      <span className="sm:hidden">{agent.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${agent.phone}?text=Hello ${encodeURIComponent(agent.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}

                {agent.website && (
                  <a
                    href={agent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-6 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* About Section */}
        {agent.bio && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              About Me
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div
                className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: agent.bio }}
              />
            </div>
          </div>
        )}

        {/* Expertise Grid */}
        {(agent.serviceAreas && agent.serviceAreas.length > 0) || 
         (agent.specialties && agent.specialties.length > 0) || 
         (agent.propertyTypes && agent.propertyTypes.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Service Areas */}
            {agent.serviceAreas && agent.serviceAreas.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Service Areas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.serviceAreas.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {agent.specialties && agent.specialties.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Specialties</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((specialty: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Property Types */}
            {agent.propertyTypes && agent.propertyTypes.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Property Types</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.propertyTypes.map((type: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Properties Section */}
       <div>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
        <Home className="w-6 h-6 text-white" />
      </div>
      <span className="line-clamp-2">Properties by {agent.name}</span>
    </h2>
    {agent.properties && agent.properties.length > 0 && (
      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-semibold text-sm sm:text-base whitespace-nowrap self-start sm:self-auto">
        {agent.properties.length} {agent.properties.length === 1 ? 'Property' : 'Properties'}
      </span>
    )}
  </div>

  {agent.properties && agent.properties.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {agent.properties.map((prop: Property) => (
        <Link
          href={`/listings/${prop.slug}`}
          key={prop._id}
          className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-400 hover:-translate-y-1"
        >
          {prop.images && prop.images[0] && (
            <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-200">
              <Image
                src={prop.images[0]}
                alt={prop.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full">
                {prop.type}
              </div>
            </div>
          )}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
              {prop.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{prop.location}</span>
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {prop.price && (
                <p className="text-xl sm:text-2xl font-bold text-amber-600">
                  ₦{prop.price.toLocaleString()}
                </p>
              )}
              {prop.pricePerNight && (
                <p className="text-xl sm:text-2xl font-bold text-amber-600">
                  ₦{prop.pricePerNight.toLocaleString()}
                  <span className="text-xs sm:text-sm text-slate-500 font-normal">/night</span>
                </p>
              )}
              <div className="text-sm sm:text-base text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">
                View →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200 shadow-md">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Home className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-600 text-base sm:text-lg">
        {agent.name} currently has no listed properties.
      </p>
      <p className="text-slate-500 mt-2 text-sm sm:text-base">Check back soon for new listings!</p>
    </div>
  )}
</div>
      </div>
    </div>
  );
}