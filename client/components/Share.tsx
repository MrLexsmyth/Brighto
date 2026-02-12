"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Facebook, Twitter, Linkedin, Mail, Pin, Copy, Check,  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shareLinks = {
  whatsapp: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string) =>
    `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`,
  linkedin: (url: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  pinterest: (url: string) =>
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
  email: (url: string) =>
    `mailto:?subject=Check this out&body=${encodeURIComponent(url)}`,
};

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: keyof typeof shareLinks) => {
    const link = shareLinks[platform](currentUrl);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    { name: "whatsapp", icon: <Share2 size={16} /> },
    { name: "facebook", icon: <Facebook size={16} /> },
    { name: "twitter", icon: <Twitter size={16} /> },
    { name: "linkedin", icon: <Linkedin size={16} /> },
    { name: "pinterest", icon: <Pin size={16} /> },
    { name: "email", icon: <Mail size={16} /> },
  ] as const;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Share Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Share"
      >
        <Share2 size={20} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-2xl p-3 space-y-2 z-50"
          >
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => handleShare(item.name)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-xl transition capitalize"
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-xl transition"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
