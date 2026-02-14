// components/AdminProtected.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "../utils/axios";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

interface AdminProtectedProps {
  children: (admin: Admin) => ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔵 AdminProtected mounted");
    
    const verifyAuth = async () => {
      console.log("🔵 Starting auth verification...");
      
      const token = localStorage.getItem("adminToken");
      console.log("🔵 Token from localStorage:", token ? token.substring(0, 30) + "..." : "NULL");
      
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        router.push("/admin/login");
        return;
      }

      // Check if Authorization header is set
      console.log("🔵 Current Authorization header:", api.defaults.headers.common['Authorization']);
 try {
  console.log("🔵 Calling /admin/dashboard...");
  const token = localStorage.getItem("adminToken");
  const response = await api.get(`/admin/dashboard?token=${token}`);
  console.log("✅ Auth verified successfully!");
  console.log("✅ Admin data:", response.data);
  setAdmin(response.data.admin);
} catch (err) {
        const error = err as AxiosError;
        console.error("❌ Auth verification failed!");
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error response:", error.response?.data);
        
        localStorage.removeItem("adminToken");
        delete api.defaults.headers.common['Authorization'];
        
        console.log("❌ Redirecting to login...");
        router.push("/admin/login");
      } finally {
        console.log("🔵 Setting loading to false");
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  console.log("🔵 Current state - isLoading:", isLoading, "admin:", admin ? "SET" : "NULL");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    console.log("❌ No admin set, returning null");
    return null;
  }

  console.log("✅ Rendering dashboard with admin:", admin.name);
  return <>{children(admin)}</>;
}