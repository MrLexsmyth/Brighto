"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../utils/axios";
import { motion, useReducedMotion } from "framer-motion";
import { Search, X, Home as HomeIcon, RotateCcw } from "lucide-react";

import PropertyCard, { Property } from "../../../components/PropertyCard";
import PropertyCardSkeleton from "../../../components/PropertyCardSkeleton";
import ListingsFilters, {
  DEFAULT_FILTERS,
  FilterState,
  PRICE_BANDS,
  isFilterActive,
} from "../../../components/ListingsFilters";

const PAGE_SIZE = 9;

function getPrice(property: Property) {
  return property.category === "shortlet"
    ? property.pricePerNight ?? property.price
    : property.price ?? property.pricePerNight;
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to load properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const typeOptions = useMemo(
    () => Array.from(new Set(properties.map((p) => p.type).filter(Boolean))).sort(),
    [properties]
  );

  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(properties.map((p) => p.location.area || p.location.city).filter(Boolean))
      ).sort() as string[],
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const band = PRICE_BANDS.find((b) => b.key === filters.priceBand);

    const filtered = properties.filter((property) => {
      if (term) {
        const haystack = [
          property.title,
          property.type,
          property.location.area,
          property.location.city,
          property.location.state,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (filters.category !== "all" && property.category !== filters.category) return false;
      if (filters.type !== "all" && property.type !== filters.type) return false;

      if (
        filters.location !== "all" &&
        (property.location.area || property.location.city) !== filters.location
      )
        return false;

      if (filters.bedrooms !== "all" && (property.bedrooms ?? 0) < Number(filters.bedrooms))
        return false;

      if (band && band.key !== "all") {
        const price = getPrice(property);
        if (price == null) return false;
        if (band.min !== undefined && price < band.min) return false;
        if (band.max !== undefined && price > band.max) return false;
      }

      return true;
    });

    if (filters.sort === "newest") {
      return [...filtered].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    }

    const withPrice = filtered.filter((p) => getPrice(p) != null);
    const withoutPrice = filtered.filter((p) => getPrice(p) == null);
    withPrice.sort((a, b) => {
      const diff = (getPrice(a) ?? 0) - (getPrice(b) ?? 0);
      return filters.sort === "price-asc" ? diff : -diff;
    });
    return [...withPrice, ...withoutPrice];
  }, [properties, searchTerm, filters]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, filters]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;
  const filtersActive = isFilterActive(filters) || searchTerm.trim().length > 0;

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#004274]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
              Explore properties across Nigeria
            </h1>
            <p className="mb-6 text-sm text-blue-100 sm:text-base">
              Verified listings for sale, rent, and short let.
            </p>

            <div className="relative max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, title, or property type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-gray-800 py-3.5 pl-12 pr-10 text-sm text-gray-900 dark:text-white shadow-sm outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-[#00aeff] placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:p-5">
          <ListingsFilters
            filters={filters}
            onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
            onReset={resetAll}
            typeOptions={typeOptions}
            locationOptions={locationOptions}
            resultCount={filteredProperties.length}
            sheetOpen={sheetOpen}
            onSheetOpenChange={setSheetOpen}
          />
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">{filteredProperties.length}</span>{" "}
          {filteredProperties.length === 1 ? "property" : "properties"} found
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-sm">
            <HomeIcon className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              No properties match your search
            </h3>
            <p className="mb-5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Try a different location, property type, or price range.
            </p>
            {filtersActive && (
              <button
                onClick={resetAll}
                className="flex items-center gap-2 rounded-xl bg-[#004274] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003060]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProperties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  index={index}
                  priority={index < 3}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:border-[#004274] hover:text-[#004274] dark:hover:border-[#4db8ff] dark:hover:text-[#4db8ff]"
                >
                  Load more properties
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {visibleProperties.length} of {filteredProperties.length}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
