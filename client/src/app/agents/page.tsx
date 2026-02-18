"use client";

import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Building2, MessageCircle} from "lucide-react";
import { motion } from "framer-motion";


interface Agent {
  _id: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone?: string;
  photo?: string;
  properties?: {
    _id: string;
    title: string;
    slug: string;
  }[];
}

export default function PublicAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchAgents = async (retryCount = 0) => {
    try {
      console.log("Fetching agents from API...");
      const res = await api.get("/agents/public/list");
      console.log("Agents fetched successfully:", res.data);
      
      // Filter out any agents with malformed data
      const validAgents = res.data.filter((agent: Agent) => {
        try {
          // Basic validation
          return agent._id && agent.name && agent.email;
        } catch (filterErr) {
          console.error("Invalid agent data:", agent, filterErr);
          return false;
        }
      });
      
      setAgents(validAgents);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      
      console.error("Failed to fetch agents - Full error:", err);
      console.error("Error response:", axiosError.response?.data);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error message:", axiosError.message);
      
      // Retry once if it's a network error
      if (retryCount < 1 && (!axiosError.response || axiosError.code === 'ERR_NETWORK')) {
        console.log("Retrying API call...");
        setTimeout(() => fetchAgents(retryCount + 1), 1000);
        return;
      } else {
        setError(axiosError.message || "Failed to load agents");
      }
   } finally {
  setLoading(false);
}
  };

  fetchAgents();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium text-lg">Loading our team of experts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-12 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 text-xl font-semibold mb-2">Failed to load agents</p>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="min-h-screen mb-4 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg border border-slate-200 max-w-md">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 text-lg">No agents found at the moment.</p>
          <p className="text-slate-500 mt-2">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 mt-12">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2aDRWMTJoLTR2NHptMCA4aDRWMjBoLTR2NHptMCA4aDRWMjhoLTR2NHptMCA4aDRWMzZoLTR2NHptLTggMGg0VjM2aC00djR6bTAtOGg0VjI4aC00djR6bTAtOGg0VjIwaC00djR6bTAtOGg0VjEyaC00djR6bS04IDhoNFYyMGgtNHY0em0wIDhoNFYyOGgtNHY0em0wIDhoNFYzNmgtNHY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-semibold mb-4"
          >
            Meet Our Team
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent"
          >
            Our Expert Agents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Dedicated professionals ready to help you find your perfect property
          </motion.p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {agents.map((agent) => (
            <motion.div
              key={agent._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-slate-200 hover:border-amber-400"
            >
              {/* Agent Photo */}
              <div className="relative h-80 overflow-hidden bg-slate-200">
                {agent.photo ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7 }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={agent.photo}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-32 h-32 bg-slate-400 rounded-full flex items-center justify-center"
                    >
                      <span className="text-6xl text-white font-bold">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                  </div>
                )}
                
                {/* Properties Badge */}
                {agent.properties && agent.properties.length > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
                  >
                    <Building2 className="w-4 h-4" />
                    {agent.properties.length}
                  </motion.div>
                )}
              </div>

              {/* Agent Info */}
              <div className="p-6">
                {/* Name & Title */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {agent.name}
                  </h2>
                  {agent.title && (
                    <p className="text-slate-600 font-medium">{agent.title}</p>
                  )}
                  {agent.company && (
                    <p className="text-amber-600 font-semibold flex items-center gap-1 mt-1">
                      <Building2 className="w-4 h-4" />
                      {agent.company}
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 text-sm hover:text-amber-600 transition-colors">
                    <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm hover:text-amber-600 transition-colors">
                      <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href={`/agents/${agent._id}`}
                    className="block px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold text-center hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    View Profile →
                  </Link>
                  
                  {agent.phone && (
                    <a
                      href={`https://wa.me/${agent.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(agent.name)}, I found your profile on Brighto and would like to discuss properties with you.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-12 text-white shadow-2xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold mb-4"
          >
            Ready to Find Your Dream Property?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 mb-6 text-lg"
          >
            Our experienced agents are here to guide you every step of the way
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/listings"
              className="inline-block px-8 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}