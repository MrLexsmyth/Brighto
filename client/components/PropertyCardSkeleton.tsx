export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-2.5">
          <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 p-3">
        <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
