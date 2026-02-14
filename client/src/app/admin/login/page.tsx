"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";

import api from "../../../../utils/axios";

interface ErrorResponse {
  message: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", { email, password });
      
      // Store token in localStorage for mobile compatibility
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        
        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log("✅ Token stored and header set");
      }
      
      // Small delay to ensure token is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row`}>
      {/* LEFT: Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <Image
          src="/adminlogin.jpg" 
          alt="Admin Login"
          fill
          className="object-cover"
          priority
        />
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex-1 md:w-1/2 flex justify-center items-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-4"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Login</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}