"use client";

export default function PropertyCarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-white shadow-md"
        >
          {/* Image shimmer */}
          <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>

          {/* Text shimmer */}
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            </div>

            <div className="h-4 w-1/2 bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            </div>

            <div className="h-6 w-1/3 bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
