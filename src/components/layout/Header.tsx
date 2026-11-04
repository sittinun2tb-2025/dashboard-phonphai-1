import { useEffect, useState } from 'react'
import { listReports } from '@/services/reportService'
import { fmtThaiDate } from '@/utils/format'
import { useReport } from './ReportContext'

type Theme = 'light' | 'dark'

function readTheme(): Theme | null {
  try {
    return localStorage.getItem('theme') as Theme | null
  } catch {
    return null
  }
}

export function Header({ title }: { title: string }) {
  const { report, reportId, setReportId } = useReport()
  const [theme, setTheme] = useState<Theme | null>(readTheme)

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    try { if (theme) localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])

  const isDark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches

  return (
    <header className="header">
      <div>
        <h1 className="header__title">{title}</h1>
        <div className="header__sub">
          {report.title} · ข้อมูล ณ {fmtThaiDate(report.asOf)}
        </div>
      </div>
      <div className="header__tools">
        <select value={reportId} onChange={(e) => setReportId(e.target.value)} aria-label="เลือกเดือนรายงาน">
          {listReports().map((r) => (
            <option key={r.id} value={r.id}>{r.periodLabel}</option>
          ))}
        </select>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="สลับธีม">
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
