"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw, ArrowUpDown } from "lucide-react";

export type CategoryFilter = "all" | "sale" | "rent" | "shortlet";
export type SortOption = "newest" | "price-asc" | "price-desc";

export interface FilterState {
  category: CategoryFilter;
  type: string;
  location: string;
  priceBand: string;
  bedrooms: string;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  category: "all",
  type: "all",
  location: "all",
  priceBand: "all",
  bedrooms: "all",
  sort: "newest",
};

export const PRICE_BANDS: { key: string; label: string; min?: number; max?: number }[] = [
  { key: "all", label: "Any price" },
  { key: "0-5m", label: "Under ₦5M", max: 5_000_000 },
  { key: "5-20m", label: "₦5M - ₦20M", min: 5_000_000, max: 20_000_000 },
  { key: "20-50m", label: "₦20M - ₦50M", min: 20_000_000, max: 50_000_000 },
  { key: "50-100m", label: "₦50M - ₦100M", min: 50_000_000, max: 100_000_000 },
  { key: "100-300m", label: "₦100M - ₦300M", min: 100_000_000, max: 300_000_000 },
  { key: "300m+", label: "Above ₦300M", min: 300_000_000 },
];

const CATEGORY_OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sale", label: "For sale" },
  { key: "rent", label: "For rent" },
  { key: "shortlet", label: "Short let" },
];

const BEDROOM_OPTIONS = ["all", "1", "2", "3", "4", "5"];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isFilterActive(filters: FilterState) {
  return (
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.location !== "all" ||
    filters.priceBand !== "all" ||
    filters.bedrooms !== "all"
  );
}

const selectClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none transition-colors focus:border-[#004274] dark:focus:border-[#4db8ff]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      {children}
    </label>
  );
}

function FilterFields({
  filters,
  onChange,
  typeOptions,
  locationOptions,
}: {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  typeOptions: string[];
  locationOptions: string[];
}) {
  return (
    <>
      <Field label="Location">
        <select
          className={selectClass}
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
        >
          <option value="all">All locations</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Property type">
        <select
          className={selectClass}
          value={filters.type}
          onChange={(e) => onChange({ type: e.target.value })}
        >
          <option value="all">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {capitalize(type)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Price range">
        <select
          className={selectClass}
          value={filters.priceBand}
          onChange={(e) => onChange({ priceBand: e.target.value })}
        >
          {PRICE_BANDS.map((band) => (
            <option key={band.key} value={band.key}>
              {band.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Bedrooms">
        <select
          className={selectClass}
          value={filters.bedrooms}
          onChange={(e) => onChange({ bedrooms: e.target.value })}
        >
          {BEDROOM_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n === "all" ? "Any" : `${n}+`}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}

export default function ListingsFilters({
  filters,
  onChange,
  onReset,
  typeOptions,
  locationOptions,
  resultCount,
  sheetOpen,
  onSheetOpenChange,
}: {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
  typeOptions: string[];
  locationOptions: string[];
  resultCount: number;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const active = isFilterActive(filters);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  return (
    <div className="space-y-4">
      {/* Category segmented control - shared across breakpoints */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onChange({ category: opt.key })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filters.category === opt.key
                ? "bg-[#004274] text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Desktop inline filter bar */}
      <div className="hidden items-end gap-3 lg:flex">
        <div className="grid flex-1 grid-cols-4 gap-3">
          <FilterFields
            filters={filters}
            onChange={onChange}
            typeOptions={typeOptions}
            locationOptions={locationOptions}
          />
        </div>
        {active && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:border-[#004274] hover:text-[#004274] dark:hover:border-[#4db8ff] dark:hover:text-[#4db8ff]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sort by</span>
          <select
            className={`${selectClass} min-w-[180px]`}
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile trigger row */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => onSheetOpenChange(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {active && <span className="h-1.5 w-1.5 rounded-full bg-[#004274]" />}
        </button>
        <label className="relative flex items-center">
          <ArrowUpDown className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" />
          <select
            className="appearance-none rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pl-9 pr-3 text-sm text-gray-700 dark:text-gray-200"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => onSheetOpenChange(false)}
            />
            <motion.div
              key="sheet"
              initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-800 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl lg:hidden"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => onSheetOpenChange(false)}
                  aria-label="Close filters"
                  className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <FilterFields
                  filters={filters}
                  onChange={onChange}
                  typeOptions={typeOptions}
                  locationOptions={locationOptions}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    onReset();
                  }}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => onSheetOpenChange(false)}
                  className="flex-1 rounded-xl bg-[#004274] py-3 text-sm font-semibold text-white"
                >
                  Show {resultCount} {resultCount === 1 ? "property" : "properties"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
