"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    eruda?: {
      init: () => void;
    };
  }
}

export default function ErudaLoader() {
  useEffect(() => {
    // Load Eruda console for mobile debugging
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      document.body.appendChild(script);
      script.onload = () => {
        window.eruda?.init();
      };
    }
  }, []);

  return null;
}