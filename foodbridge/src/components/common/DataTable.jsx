import React from 'react'
import EmptyState from './EmptyState'

export default function DataTable({ columns, rows, keyField = 'id', emptyLabel = 'No records yet' }) {
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyLabel} description="Try adjusting your filters or check back later." />
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-forest-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-sand-200 text-ink-400 text-xs uppercase tracking-wide">
            {columns.map(col => (
              <th key={col.key} className="text-left font-medium px-4 py-3 whitespace-nowrap">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-100">
          {rows.map(row => (
            <tr key={row[keyField]} className="hover:bg-sand-100 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-ink-600 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
