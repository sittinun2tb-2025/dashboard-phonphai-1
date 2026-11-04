import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import type { UsageIssue } from '@/types/report'

const columns: Column<UsageIssue>[] = [
  { key: 'g', header: 'กลุ่มผู้ใช้งาน', render: (r) => r.userGroup },
  { key: 'p', header: 'ปัญหาการใช้งาน', render: (r) => r.problem },
  { key: 's', header: 'แนวทางการแก้ไข', render: (r) => r.solution },
]

export function IssuesPage() {
  const { report } = useReport()
  return (
    <Card title={`สรุปภาพรวมปัญหาการใช้งานเดือน${report.periodLabel}`}>
      <DataTable columns={columns} rows={report.issues} emptyText="ไม่มีปัญหาการใช้งานในเดือนนี้" />
    </Card>
  )
}
