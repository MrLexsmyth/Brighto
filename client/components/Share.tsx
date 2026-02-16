"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Facebook, Twitter, Linkedin, Mail, Pin, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  title?: string;
  image?: string; 
  description?: string;
}

const shareLinks = {
  whatsapp: (image?: string,  title?: string, description?: string, url?: string) => {
    const text = `${title || ""}\n${url || ""}\n${description || ""}${image ? `\n${image}` : ""}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  },
  facebook: (url: string, title: string, description: string, image?: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&picture=${encodeURIComponent(image || "")}&name=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
  twitter: (url: string, title: string) =>
    `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  linkedin: (url: string, title: string, description: string, image?: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image || "")}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
  pinterest: (url: string, title: string, image: string) =>
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`,
  email: (url: string, title: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
};

export default function ShareButton({ title, image, description }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const pageTitle = title || (typeof document !== "undefined" ? document.title : "Check this out!");

  const pageDescription =
    description ||
    (typeof document !== "undefined"
      ? document.querySelector('meta[name="description"]')?.getAttribute("content") || "Check this out!"
      : "Check this out!");

  const handleShare = (platform: keyof typeof shareLinks) => {
    let link = "";

    switch (platform) {
      case "twitter":
      case "email":
        link = shareLinks[platform](currentUrl, pageTitle);
        break;

      case "whatsapp":
      case "facebook":
      case "linkedin":
        link = shareLinks[platform](currentUrl, pageTitle, pageDescription, image);
        break;

      case "pinterest":
        if (!image) {
          console.warn("Pinterest sharing requires an image!");
          return;
        }
        link = shareLinks[platform](currentUrl, pageTitle, image);
        break;

      default:
        return;
    }

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
            className="absolute left-0 md:right-0 md:left-auto mt-2 w-52 bg-white shadow-xl rounded-2xl p-3 space-y-2 z-50"
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
