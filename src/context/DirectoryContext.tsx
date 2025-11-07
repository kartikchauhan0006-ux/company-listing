import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { Company, SortOrder } from '@/types'
import { fetchCompanies } from '@/services/mockApi'

type Filters = {
  query: string
  location: string | 'all'
  industry: string | 'all'
}

type DirectoryState = {
  companies: Company[]
  filtered: Company[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  view: 'cards' | 'table'
  sortBy: 'name'
  sortOrder: SortOrder
  filters: Filters
  hasMore: boolean
}

type DirectoryActions = {
  setView: (v: 'cards' | 'table') => void
  setSortOrder: (o: SortOrder) => void
  setFilters: (f: Partial<Filters>) => void
  loadMore: () => Promise<void>
  reload: () => void
}

const DirectoryContext = createContext<(DirectoryState & DirectoryActions) | null>(null)

const ITEMS_PER_PAGE = 20

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [view, setView] = useState<'table' | 'cards'>('table')
  const [sortBy] = useState<'name'>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filters, setFiltersState] = useState<Filters>({ query: '', location: 'all', industry: 'all' })

  const setFilters = (partial: Partial<Filters>) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev, ...partial }
      if (partial.location !== undefined || partial.industry !== undefined) {
        setCurrentPage(1)
        setHasMore(true)
      }
      return newFilters
    })
  }

  const loadInitial = async () => {
    try {
      setLoading(true)
      setError(null)
      setCurrentPage(1)
      const data = await fetchCompanies({ page: 1, pageSize: ITEMS_PER_PAGE })
      setCompanies(data)
      setHasMore(true)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load')
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return

    try {
      setLoadingMore(true)
      setError(null)
      const nextPage = currentPage + 1
      const data = await fetchCompanies({ page: nextPage, pageSize: ITEMS_PER_PAGE })
      
      if (data.length > 0) {
        setCompanies((prev) => [...prev, ...data])
        setCurrentPage(nextPage)
        setHasMore(data.length === ITEMS_PER_PAGE)
      } else {
        setHasMore(false)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load more')
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [currentPage, hasMore, loadingMore, loading])

  useEffect(() => {
    loadInitial()
  }, [])

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    let result = companies.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false
      if (filters.location !== 'all' && c.location !== filters.location) return false
      if (filters.industry !== 'all' && c.industry !== filters.industry) return false
      return true
    })

    result.sort((a, b) => {
      const cmp = a[sortBy].localeCompare(b[sortBy])
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return result
  }, [companies, filters, sortBy, sortOrder])

  const value = {
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
  }

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>
}

export function useDirectory() {
  const ctx = useContext(DirectoryContext)
  if (!ctx) throw new Error('useDirectory must be used within DirectoryProvider')
  return ctx
}


