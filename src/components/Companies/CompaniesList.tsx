import { useEffect, useRef } from 'react'
import { useDirectory } from '@/context/DirectoryContext'
import { CompanyCard } from './CompanyCard'
import { CompanyTable } from './CompanyTable'

function Skeleton() {
  return (
    <div className="animate-pulse grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 rounded-lg bg-[#303134] border border-gray-700" />
      ))}
    </div>
  )
}

function LoadingMore() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-gray-400"></div>
    </div>
  )
}

export function CompaniesList() {
  const { view, loading, loadingMore, error, filtered, hasMore, loadMore } = useDirectory()
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading || !hasMore || !observerTarget.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, loadMore])

  if (loading) return <Skeleton />
  if (error) return (
    <div className="p-6 rounded-lg border border-gray-700 bg-[#303134]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center text-gray-200 font-semibold">!</div>
        <div>
          <h3 className="font-medium text-gray-200">Error loading companies</h3>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    </div>
  )
  if (!filtered.length) return (
    <div className="p-12 rounded-lg border border-dashed border-gray-700 bg-[#303134] text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-medium text-gray-200 mb-2">No results found</h3>
      <p className="text-sm text-gray-400">Try adjusting your filters to see more companies.</p>
    </div>
  )

  const renderContent = () => {
    if (view === 'cards') {
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )
    }
    return <CompanyTable companies={filtered} />
  }

  return (
    <>
      {renderContent()}
      {hasMore && (
        <div ref={observerTarget} className="h-32 flex items-center justify-center py-8">
          {loadingMore && <LoadingMore />}
        </div>
      )}
      {!hasMore && filtered.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm font-medium">
          No more companies to load
        </div>
      )}
    </>
  )
}


