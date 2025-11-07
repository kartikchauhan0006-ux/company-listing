import { useEffect, useRef, useCallback } from "react";
import { useDirectory } from "@/context/DirectoryContext";
import { CompanyCard } from "./CompanyCard";
import { CompanyTable } from "./CompanyTable";

function Skeleton() {
  const rows = 8;
  const cols = 5;

  return (
    <div className="animate-pulse border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-[#303134]">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className="h-10 px-2 bg-[#303134] border-b border-gray-700"
              ></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-gray-700">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingMore() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-gray-400"></div>
    </div>
  );
}

export function CompaniesList() {
  const {
    view,
    loading,
    loadingMore,
    error,
    filtered,
    loadMore,
    companies,
    hasMore,
    setHasMore,
  } = useDirectory();
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadingInProgressRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (loadingInProgressRef.current) return;

    loadingInProgressRef.current = true;
    loadMore().finally(() => {
      setTimeout(() => {
        loadingInProgressRef.current = false;
      }, 500);
    });
  }, [loadMore]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry?.isIntersecting &&
          !loadingInProgressRef.current &&
          !loadingMore
        ) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [loading, loadingMore, handleLoadMore]);

  useEffect(() => {
    if (companies.length > 59) {
      setHasMore(false);
    }
  }, [companies]);

  if (loading) return <Skeleton />;

  if (error)
    return (
      <div className="p-6 rounded-lg border border-gray-700 bg-[#303134]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center text-gray-200 font-semibold">
            !
          </div>
          <div>
            <h3 className="font-medium text-gray-200">
              Error loading companies
            </h3>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!filtered.length)
    return (
      <div className="p-12 rounded-lg border border-dashed border-gray-700 bg-[#303134] text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-200 mb-2">
          No results found
        </h3>
        <p className="text-sm text-gray-400">
          Try adjusting your filters to see more companies.
        </p>
      </div>
    );

  const renderContent = () => {
    if (view === "cards") {
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      );
    }
    return <CompanyTable companies={filtered} />;
  };

  return (
    <div className="space-y-4">
      {renderContent()}

      {hasMore && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center py-8"
        >
          {loadingMore && <LoadingMore />}
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-8 text-gray-400 text-sm font-medium">
          No more companies.
        </div>
      )}
    </div>
  );
}
