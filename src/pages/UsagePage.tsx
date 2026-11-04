import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { HBarChart } from '@/components/charts/HBarChart'
import type { AgencyUsage } from '@/types/report'
import { fmtNumber } from '@/utils/format'

const columns: Column<AgencyUsage>[] = [
  { key: 'agency', header: 'หน่วยงาน', render: (r) => r.agency },
  { key: 'reg', header: 'ผู้ใช้งานทั้งหมด', numeric: true, render: (r) => fmtNumber(r.registered) },
  { key: 'act', header: 'ผู้ใช้งานจริง', numeric: true, render: (r) => fmtNumber(r.active) },
]

export function UsagePage() {
  const { usage } = useReport().report
  return (
    <>
      <div className="grid grid--kpi">
        <StatCard label="ประชาชนเข้าใช้งาน" value={fmtNumber(usage.citizenLogins)} hint={`ครั้ง ผ่าน ${usage.citizenChannels.join(' / ')}`} />
        <StatCard label="เจ้าหน้าที่เข้าใช้งาน" value={fmtNumber(usage.agencyUsers)} hint={`คน ใน ${usage.agencyProvinceCount} จังหวัด`} />
      </div>
      <div className="grid grid--2">
        <Card title="ผู้ใช้งานจริง แยกตามหน่วยงาน" description={`ช่วง ${usage.statsPeriod}`}>
          <HBarChart
            data={usage.byAgency}
            categoryKey="agency"
            series={[{ key: 'active', label: 'ผู้ใช้งานจริง', color: 'var(--series-1)' }]}
          />
        </Card>
        <Card title="สถิติผู้ใช้งานของหน่วยงาน" description={`ช่วง ${usage.statsPeriod}`}>
          <DataTable columns={columns} rows={usage.byAgency} />
        </Card>
      </div>
    </>
  )
}
