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

  // รวมจำนวนคำร้องรายจังหวัดจากทุกหน่วยงาน
  const byProvince = Object.entries(
    pending.byAgency
      .flatMap((a) => a.areas)
      .reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.province]: (acc[a.province] ?? 0) + a.count }), {}),
  )
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count)

  const sumWait = pending.byAgency.reduce((s, r) => s + r.awaitingScreening, 0)
  const sumProg = pending.byAgency.reduce((s, r) => s + r.inProgress, 0)

  return (
    <>
      <div className="grid grid--2">
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
        <Card title="คำร้องรอพิจารณา แยกตามจังหวัด" description={`${pending.provinceCount} จังหวัด`}>
          <HBarChart
            data={byProvince}
            categoryKey="province"
            series={[{ key: 'count', label: 'คำร้อง', color: 'var(--series-1)' }]}
          />
        </Card>
      </div>
      <Card title="ตารางรายละเอียด">
        <DataTable
          columns={columns}
          rows={pending.byAgency}
          footer={['รวม', fmtNumber(sumWait), fmtNumber(sumProg), `รวม ${pending.provinceCount} จังหวัด`]}
        />
      </Card>
    </>
  )
}
