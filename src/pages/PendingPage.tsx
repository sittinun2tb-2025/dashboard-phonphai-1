import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { HBarChart } from '@/components/charts/HBarChart'
import type { PendingRow } from '@/types/report'
import { fmtNumber } from '@/utils/format'

const columns: Column<PendingRow>[] = [
  { key: 'agency', header: 'หน่วยงาน', render: (r) => r.agency },
  { key: 'wait', header: 'รอคัดกรอง / รับเรื่อง', numeric: true, render: (r) => fmtNumber(r.awaitingScreening) },
  { key: 'prog', header: 'กำลังดำเนินการ', numeric: true, render: (r) => fmtNumber(r.inProgress) },
  {
    key: 'areas', header: 'พื้นที่รับผิดชอบ (จำนวนคำร้อง)',
    render: (r) => (r.areas.length ? r.areas.map((a) => `${a.province} (${a.count})`).join(', ') : '-'),
  },
]

export function PendingPage() {
  const { pending } = useReport().report

  const t = pending.totalRow // แถว "รวม" จากไฟล์รายงาน

  return (
    <>
      <Card title="คำร้องรอพิจารณา แยกตามหน่วยงาน" description={`รวม ${pending.total} คำร้อง`}>
        <HBarChart
          data={pending.byAgency}
          categoryKey="agency"
          stacked
          series={[
            { key: 'awaitingScreening', label: 'รอคัดกรอง / รับเรื่อง', color: 'var(--series-1)' },
            { key: 'inProgress', label: 'กำลังดำเนินการ', color: 'var(--series-2)' },
          ]}
        />
      </Card>
      <Card title="ตารางรายละเอียด">
        <DataTable
          columns={columns}
          rows={pending.byAgency}
          footer={['รวม', fmtNumber(t.awaitingScreening), fmtNumber(t.inProgress), t.areaLabel]}
        />
      </Card>
    </>
  )
}
