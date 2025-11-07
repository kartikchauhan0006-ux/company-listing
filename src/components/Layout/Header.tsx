import { useEffect, useState } from 'react'
import { useDirectory } from '@/context/DirectoryContext'

export function Header() {
  const { filters, setFilters } = useDirectory()
  const [localQuery, setLocalQuery] = useState(filters.query)

  useEffect(() => {
    const id = setTimeout(() => setFilters({ query: localQuery }), 250)
    return () => clearTimeout(id)
  }, [localQuery, setFilters])

  return (
    <header className="sticky top-0 z-10 bg-[#303134] border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gray-600 flex items-center justify-center text-gray-200 font-semibold">
              CD
            </div>
            <h1 className="text-xl font-medium tracking-tight text-gray-100">
              Companies Directory
            </h1>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="search"
              className="w-full rounded-lg border border-gray-600 bg-[#202124] px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:bg-[#2d2e30] transition-colors"
              placeholder="Search companies..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
