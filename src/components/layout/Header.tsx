import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/routes'
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

/** แถบบนสุด: โลโก้ + เมนูหน้า + เลือกเดือน + สลับธีม */
export function Header() {
  const { report, reportId, setReportId } = useReport()
  const [theme, setTheme] = useState<Theme | null>(readTheme)

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    try { if (theme) localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])

  const isDark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches

  return (
    <header className="header">
      <div className="brand">
        <img className="brand__mark" src="/favicon.svg" alt="" />
        <div>
          <div className="brand__name">พ้นภัย</div>
          <div className="brand__sub">รายงานสรุปการใช้งาน</div>
        </div>
      </div>

      <nav className="nav">
        {routes.map((r) => (
          <NavLink key={r.path} to={r.path} end={r.path === '/'}>
            {r.label}
          </NavLink>
        ))}
      </nav>

      <div className="header__tools">
        <div className="header__asof">
          ข้อมูล ณ<br />{fmtThaiDate(report.asOf)}
        </div>
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
