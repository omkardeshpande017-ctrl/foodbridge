import React from 'react'
import { FileText, Download, Eye } from 'lucide-react'
import { reportsCatalog, initialDonations } from '../data/mockData'
import { useToast } from '../context/ToastContext.jsx'

export default function Reports() {
  const { notify } = useToast()

  const downloadCsv = (report) => {
    const header = 'Donation ID,Food Name,Category,Quantity,Unit,City,Status\n'
    const rows = initialDonations
      .map(d => [d.id, d.foodName, d.category, d.quantity, d.unit, d.city, d.status].join(','))
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.name.replace(/\s+/g, '_')}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    notify(`${report.name} downloaded as CSV.`, 'success')
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-1">Reports</h2>
      <p className="text-sm text-ink-400 mb-6">Generate and download reports summarizing platform activity.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {reportsCatalog.map(r => (
          <div key={r.id} className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-3">
            <span className="w-10 h-10 rounded-lg bg-leaf-100 text-forest-700 flex items-center justify-center">
              <FileText size={18} />
            </span>
            <div>
              <h4 className="font-display text-ink">{r.name}</h4>
              <p className="text-xs text-ink-400 mt-0.5">{r.period}</p>
            </div>
            <p className="text-sm text-ink-600">{r.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => notify(`Opening a preview of ${r.name}.`, 'info')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium border border-forest-200 text-forest-700 rounded-full px-4 py-2 hover:bg-sand-100 transition-colors"
              >
                <Eye size={14} /> View Report
              </button>
              <button
                onClick={() => downloadCsv(r)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-forest-700 text-white rounded-full px-4 py-2 hover:bg-forest-900 transition-colors"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
