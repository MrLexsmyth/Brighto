// components/AdminProtected.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
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
    const verifyAuth = async () => {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        router.push("/admin/login");
        return;
      }

      try {
        const response = await api.get("/admin/dashboard");
        console.log("✅ Auth verified:", response.data);
        setAdmin(response.data.admin);
      } catch (error) {
        console.error("❌ Auth verification failed:", error);
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

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
    return null;
  }

  return <>{children(admin)}</>;
}