"use client";

import dynamic from "next/dynamic";

// Leaflet reads `window` at import time, so it can never render on the server.
// ssr:false defers the import to the browser, and must be called from a client
// component — the App Router rejects it inside server components.
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400 shadow-lg">
      Loading map…
    </div>
  ),
});

export default PropertyMap;