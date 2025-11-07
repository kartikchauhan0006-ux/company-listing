import { useMemo } from "react";
import { useDirectory } from "@/context/DirectoryContext";

export function ViewAndSort() {
  const {
    view,
    setView,
    sortOrder,
    setSortOrder,
    filtered,
    companies,
    filters,
    setFilters,
  } = useDirectory();

  const locations = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.location))).sort();
  }, [companies]);

  const industries = useMemo(() => {
    return Array.from(new Set(companies.map((c) => c.industry))).sort();
  }, [companies]);

  return (
    <div className="bg-[#303134] rounded-xl border border-gray-700 p-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex rounded-lg border border-gray-600 bg-[#2d2e30] overflow-hidden">
          {["table", "cards"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === type
                  ? "bg-[#202124] text-gray-100"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#35363a]"
              }`}
              onClick={() => setView(type as "cards" | "table")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <span className="text-sm font-medium text-gray-400">
            <span className="font-semibold text-gray-200 text-base">
              {filtered.length}
            </span>{" "}
            results
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-600 bg-[#2d2e30] text-gray-300 hover:bg-[#35363a] hover:border-gray-500 transition-colors"
            >
              {sortOrder === "asc" ? "A → Z" : "Z → A"}
            </button>
          </div>
        </div>
      </div>


      <div className="grid gap-5 sm:grid-cols-2 border-t border-gray-700 pt-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Location
          </label>
          <select
            className="w-full rounded-md border border-gray-600 bg-[#202124] px-3 py-2 text-gray-100 focus:outline-none focus:border-gray-500 focus:bg-[#2d2e30] transition-colors cursor-pointer"
            value={filters.location}
            onChange={(e) => setFilters({ location: e.target.value })}
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Industry
          </label>
          <select
            className="w-full rounded-md border border-gray-600 bg-[#202124] px-3 py-2 text-gray-100 focus:outline-none focus:border-gray-500 focus:bg-[#2d2e30] transition-colors cursor-pointer"
            value={filters.industry}
            onChange={(e) => setFilters({ industry: e.target.value })}
          >
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
