import type { Company } from '@/types'

export function CompanyTable({ companies }: { companies: Company[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[#303134]">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#2d2e30]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Industry</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Employees</th>
          </tr>
        </thead>
        <tbody className="bg-[#303134] divide-y divide-gray-700">
          {companies.map((c, idx) => (
            <tr 
              key={c.id} 
              className={`transition-colors ${
                idx % 2 === 0 
                  ? 'bg-[#303134]' 
                  : 'bg-[#2d2e30]'
              } hover:bg-[#35363a]`}
            >
              <td className="px-6 py-4 font-medium text-gray-100">{c.name}</td>
              <td className="px-6 py-4 text-gray-300">{c.location}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-[#2d2e30] text-gray-300 px-2.5 py-1 text-xs font-medium border border-gray-700">
                  {c.industry}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-300 font-medium">{c.employees.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


