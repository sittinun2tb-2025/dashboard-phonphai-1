import { createContext, useContext, useState, type ReactNode } from 'react'
import { getReport, listReports } from '@/services/reportService'
import type { MonthlyReport } from '@/types/report'

interface Ctx {
  report: MonthlyReport
  reportId: string
  setReportId: (id: string) => void
}

const ReportContext = createContext<Ctx | null>(null)

/** เก็บว่ากำลังดูรายงานเดือนไหน ให้ทุกหน้าใช้ร่วมกัน */
export function ReportProvider({ children }: { children: ReactNode }) {
  const [reportId, setReportId] = useState(listReports()[0]?.id ?? '')
  const report = getReport(reportId)
  if (!report) return <p style={{ padding: 24 }}>ยังไม่มีข้อมูลรายงานใน src/data/reports</p>
  return (
    <ReportContext.Provider value={{ report, reportId, setReportId }}>
      {children}
    </ReportContext.Provider>
  )
}

export function useReport() {
  const ctx = useContext(ReportContext)
  if (!ctx) throw new Error('useReport must be used inside <ReportProvider>')
  return ctx
}
