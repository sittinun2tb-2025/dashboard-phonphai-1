import type { MonthlyReport } from '@/types/report'

/**
 * แหล่งข้อมูลรายงาน
 * ตอนนี้อ่านจากไฟล์ JSON ใน src/data/reports/*.json
 * ในอนาคตเปลี่ยนเป็นเรียก API ได้ที่ไฟล์นี้ไฟล์เดียว โดยหน้าเว็บไม่ต้องแก้
 */
const files = import.meta.glob<MonthlyReport>('@/data/reports/*.json', {
  eager: true,
  import: 'default',
})

const reports: MonthlyReport[] = Object.values(files).sort((a, b) =>
  b.id.localeCompare(a.id),
)

export function listReports(): Pick<MonthlyReport, 'id' | 'periodLabel'>[] {
  return reports.map(({ id, periodLabel }) => ({ id, periodLabel }))
}

export function getReport(id?: string): MonthlyReport | undefined {
  return id ? reports.find((r) => r.id === id) : reports[0]
}
