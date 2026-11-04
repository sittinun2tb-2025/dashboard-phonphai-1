import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  numeric?: boolean
  render: (row: T) => ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  footer?: ReactNode[]
  emptyText?: string
}

/** ตารางข้อมูลทั่วไป ใช้ร่วมกันทุกหน้า */
export function DataTable<T>({ columns, rows, footer, emptyText = 'ไม่มีข้อมูล' }: Props<T>) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.numeric ? 'num' : undefined}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="empty" colSpan={columns.length}>{emptyText}</td></tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className={c.numeric ? 'num' : undefined}>{c.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              {footer.map((cell, i) => (
                <th key={i} className={columns[i]?.numeric ? 'num' : undefined}>{cell}</th>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
