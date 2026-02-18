"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0; // Just return 0, don't push here
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

// Separate useEffect to handle redirect when countdown reaches 0
useEffect(() => {
  if (countdown === 0) {
    router.push("/");
  }
}, [countdown, router]);

  const quickLinks = [
    { label: "Browse Listings", href: "/listings", icon: <Search className="w-4 h-4" /> },
    { label: "Our Agents", href: "/agents", icon: <MapPin className="w-4 h-4" /> },
    { label: "Go Home", href: "/", icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center px-4 py-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Text */}
        <div className="relative mb-4">
             <div className="w-48 h-48 sm:w-64 sm:h-64">
              <DotLottieReact
  src="/found.json"
  loop
  autoplay
/>
            </div>
          {/* <div className="absolute inset-0 flex items-center justify-center">
            
            <div className="w-48 h-48 sm:w-64 sm:h-64">
              <DotLottieReact
  src="/found.json"
  loop
  autoplay
/>
            </div>
          </div> */}
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            Property Not Found!
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Looks like this property has been sold, moved, or never existed.
            Let us help you find your perfect home.
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#004274"
                  strokeWidth="2"
                  strokeDasharray={`${(countdown / 10) * 62.8} 62.8`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#004274]">
                {countdown}
              </span>
            </div>
            <span className="text-sm text-slate-500">
              Redirecting to home in{" "}
              <span className="font-semibold text-[#004274]">{countdown}s</span>
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group w-full sm:w-auto justify-center
                first:bg-[#004274] first:text-white first:hover:bg-[#003060] first:shadow-lg first:shadow-blue-200
                [&:not(:first-child)]:bg-white [&:not(:first-child)]:text-slate-700 [&:not(:first-child)]:border [&:not(:first-child)]:border-slate-200 [&:not(:first-child)]:hover:border-[#004274] [&:not(:first-child)]:hover:text-[#004274] [&:not(:first-child)]:shadow-sm"
            >
              <span className="group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#004274] transition-colors mx-auto group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}