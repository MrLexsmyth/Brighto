export default function PropertyCarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white shadow p-4 space-y-4"
        >
          {/* Image skeleton */}
          <div className="h-48 w-full bg-gray-300 rounded-xl" />

          {/* Text skeleton */}
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />

          {/* Button skeleton */}
          <div className="h-10 bg-gray-300 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
