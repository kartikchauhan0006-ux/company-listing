import type { Company } from '@/types'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group rounded-lg border border-gray-700 bg-[#303134] p-5 hover:bg-[#35363a] hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium tracking-tight text-gray-100 group-hover:text-white transition-colors">
            {company.name}
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#2d2e30] text-gray-300 px-2.5 py-1 text-xs font-medium border border-gray-700">
              {company.industry}
            </span>
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center text-gray-200 font-semibold text-sm">
          {company.name.charAt(0)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-[#2d2e30] px-3 py-2.5 border border-gray-700/50">
          <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Location</div>
          <div className="text-sm font-medium text-gray-200">📍 {company.location}</div>
        </div>
        <div className="rounded-md bg-[#2d2e30] px-3 py-2.5 border border-gray-700/50">
          <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Employees</div>
          <div className="text-sm font-medium text-gray-200">👥 {company.employees.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}


