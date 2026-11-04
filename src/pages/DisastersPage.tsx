import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { HBarChart } from '@/components/charts/HBarChart'
import type { DisasterRow } from '@/types/report'
import { fmtNumber } from '@/utils/format'

const columns: Column<DisasterRow>[] = [
  { key: 'type', header: 'ประเภทภัย', render: (r) => r.type },
  { key: 'req', header: 'แจ้งภัย / ขอความช่วยเหลือ', numeric: true, render: (r) => `${r.reports} / ${r.helpRequests}` },
  { key: 'assisted', header: 'คำร้องที่ช่วยเหลือ', numeric: true, render: (r) => fmtNumber(r.assisted) },
  { key: 'aff', header: 'ครัวเรือนได้รับผลกระทบ', numeric: true, render: (r) => fmtNumber(r.affectedHouseholds) },
  {
    key: 'ahh', header: 'ครัวเรือนได้รับการช่วยเหลือ', numeric: true,
    render: (r) => `${fmtNumber(r.assistedHouseholds)} (${r.assistedPercent})`,
  },
  { key: 'prov', header: 'พื้นที่ได้รับผลกระทบ', render: (r) => r.provinces.join(', ') },
]

export function DisastersPage() {
  const { disasters } = useReport().report
  const t = disasters.total // แถว "รวม" จากไฟล์รายงาน

  return (
    <div className="page page--split page--wide-table">
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
            t.type,
            `${t.reports} / ${t.helpRequests}`,
            fmtNumber(t.assisted),
            fmtNumber(t.affectedHouseholds),
            `${fmtNumber(t.assistedHouseholds)} (${t.assistedPercent})`,
            t.provinceLabel,
          ]}
        />
      </Card>
      <div className="note span-all">หมายเหตุ: {disasters.note}</div>
    </div>
  )
}
