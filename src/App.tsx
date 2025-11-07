import { DirectoryProvider } from '@/context/DirectoryContext'
import { Header } from '@/components/Layout/Header'
import { ViewAndSort } from '@/components/Controls/ViewAndSort'
import { CompaniesList } from '@/components/Companies/CompaniesList'

export function App() {
  return (
    <DirectoryProvider>
      <div className="min-h-screen bg-[#202124] text-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6">
          <ViewAndSort />
          <CompaniesList />
        </main>
      </div>
    </DirectoryProvider>
  )
}


