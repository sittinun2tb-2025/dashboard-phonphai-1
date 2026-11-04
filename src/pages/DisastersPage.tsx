import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { HBarChart } from '@/components/charts/HBarChart'
import type { DisasterRow } from '@/types/report'
import { fmtNumber, fmtPercent } from '@/utils/format'

const columns: Column<DisasterRow>[] = [
  { key: 'type', header: 'ประเภทภัย', render: (r) => r.type },
  { key: 'req', header: 'แจ้งภัย / ขอความช่วยเหลือ', numeric: true, render: (r) => `${r.reports} / ${r.helpRequests}` },
  { key: 'assisted', header: 'คำร้องที่ช่วยเหลือ', numeric: true, render: (r) => fmtNumber(r.assisted) },
  { key: 'aff', header: 'ครัวเรือนได้รับผลกระทบ', numeric: true, render: (r) => fmtNumber(r.affectedHouseholds) },
  {
    key: 'ahh', header: 'ครัวเรือนได้รับการช่วยเหลือ', numeric: true,
    render: (r) => `${fmtNumber(r.assistedHouseholds)} (${fmtPercent(r.assistedHouseholds, r.affectedHouseholds)})`,
  },
  { key: 'prov', header: 'พื้นที่ได้รับผลกระทบ', render: (r) => r.provinces.join(', ') },
]

export function DisastersPage() {
  const { disasters } = useReport().report
  const sum = (f: (r: DisasterRow) => number) => disasters.rows.reduce((s, r) => s + f(r), 0)
  const aff = sum((r) => r.affectedHouseholds)
  const ahh = sum((r) => r.assistedHouseholds)

  return (
    <>
      <Card
        title="จำนวนคำร้องแยกตามประเภทภัย"
        description={`รวม ${disasters.totalRequests} คำร้อง ใน ${disasters.provinceCount} จังหวัด`}
      >
        <HBarChart
          data={disasters.rows}
          categoryKey="type"
          stacked
          series={[
            { key: 'helpRequests', label: 'ขอความช่วยเหลือ', color: 'var(--series-1)' },
            { key: 'reports', label: 'แจ้งภัย', color: 'var(--series-2)' },
          ]}
        />
      </Card>
      <Card title="ตารางรายละเอียด">
        <DataTable
          columns={columns}
          rows={disasters.rows}
          footer={[
            `รวม ${disasters.rows.length} ภัย`,
            `${sum((r) => r.reports)} / ${sum((r) => r.helpRequests)}`,
            fmtNumber(sum((r) => r.assisted)),
            fmtNumber(aff),
            `${fmtNumber(ahh)} (${fmtPercent(ahh, aff)})`,
            `รวม ${disasters.provinceCount} จังหวัด`,
          ]}
        />
      </Card>
      <div className="note">หมายเหตุ: {disasters.note}</div>
    </>
  )
}
