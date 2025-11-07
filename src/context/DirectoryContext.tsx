import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import type { Company, SortOrder } from "@/types";
import { fetchCompanies } from "@/services/mockApi";

type Filters = {
  query: string;
  location: string | "all";
  industry: string | "all";
};

type DirectoryState = {
  companies: Company[];
  filtered: Company[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  view: "cards" | "table";
  sortBy: "name";
  sortOrder: SortOrder;
  filters: Filters;
  hasMore: boolean;
};

type DirectoryActions = {
  setView: (v: "cards" | "table") => void;
  setSortOrder: (o: SortOrder) => void;
  setFilters: (f: Partial<Filters>) => void;
  loadMore: () => Promise<void>;
  reload: () => void;
  setHasMore: (b: boolean) => void;
};

const DirectoryContext = createContext<
  (DirectoryState & DirectoryActions) | null
>(null);

const ITEMS_PER_PAGE = 20;
const MAX_COMPANIES = 100;

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [view, setView] = useState<"table" | "cards">("table");
  const [sortBy] = useState<"name">("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFiltersState] = useState<Filters>({
    query: "",
    location: "all",
    industry: "all",
  });

  const isLoadingRef = useRef(false);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const loadInitial = useCallback(async () => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      setCompanies([]);
      setCurrentPage(1);

      const data = await fetchCompanies({ page: 1, pageSize: ITEMS_PER_PAGE });
      setCompanies(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (
      isLoadingRef.current ||
      loadingMore ||
      loading ||
      companies.length >= MAX_COMPANIES ||
      !hasMore
    ) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoadingMore(true);
      setError(null);

      const nextPage = currentPage + 1;
      const data = await fetchCompanies({
        page: nextPage,
        pageSize: ITEMS_PER_PAGE,
      });

      if (data.length > 0) {
        setCompanies((prev) => {
          const newCompanies = [...prev, ...data];

          const limited = newCompanies.slice(0, MAX_COMPANIES);

          return limited;
        });
        setCurrentPage(nextPage);
      }
    } catch (e: any) {
      console.error("Load more error:", e);
      setError(e?.message ?? "Failed to load more");
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [currentPage, loadingMore, loading, companies.length]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let result = companies;

    if (q || filters.location !== "all" || filters.industry !== "all") {
      result = companies.filter((c) => {
        if (q && !c.name.toLowerCase().includes(q)) return false;
        if (filters.location !== "all" && c.location !== filters.location)
          return false;
        if (filters.industry !== "all" && c.industry !== filters.industry)
          return false;
        return true;
      });
    }

    return [...result].sort((a, b) => {
      const cmp = a[sortBy].localeCompare(b[sortBy]);
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [companies, filters, sortBy, sortOrder]);

  const value = useMemo(
    () => ({
      companies,
      filtered,
      loading,
      loadingMore,
      error,
      view,
      sortBy,
      sortOrder,
      filters,
      hasMore,
      setView,
      setSortOrder,
      setFilters,
      loadMore,
      reload: loadInitial,
      setHasMore,
    }),
    [
      companies,
      filtered,
      loading,
      loadingMore,
      error,
      view,
      sortBy,
      sortOrder,
      filters,
      hasMore,
      setFilters,
      loadMore,
      loadInitial,
      setHasMore,
    ]
  );

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
}

export function useDirectory() {
  const ctx = useContext(DirectoryContext);
  if (!ctx)
    throw new Error("useDirectory must be used within DirectoryProvider");
  return ctx;
}
