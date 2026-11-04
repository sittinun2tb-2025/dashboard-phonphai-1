import { useReport } from '@/components/layout/ReportContext'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { HBarChart } from '@/components/charts/HBarChart'
import { fmtNumber } from '@/utils/format'

/** ทุกตัวเลขในหน้านี้อ่านจากไฟล์รายงานโดยตรง ไม่มีการคำนวณเพิ่ม */
export function OverviewPage() {
  const { report } = useReport()
  const { disasters, usage, pending } = report
  const t = disasters.total

  return (
    <>
      <div className="grid grid--kpi">
        <StatCard label="คำร้องทั้งหมด" value={fmtNumber(disasters.totalRequests)} hint={`ใน ${disasters.provinceCount} จังหวัด`} />
        <StatCard label="คำร้องที่ช่วยเหลือ" value={fmtNumber(t.assisted)} hint={`ช่วยเหลือ ${t.assisted} ครั้ง`} />
        <StatCard label="ครัวเรือนได้รับผลกระทบ" value={fmtNumber(t.affectedHouseholds)} />
        <StatCard label="ครัวเรือนได้รับการช่วยเหลือ" value={fmtNumber(t.assistedHouseholds)} hint={t.assistedPercent} />
        <StatCard label="คำร้องรอพิจารณา" value={fmtNumber(pending.total)} hint={`ใน ${pending.provinceCount} จังหวัด`} />
        <StatCard label="ประชาชนเข้าใช้งาน" value={fmtNumber(usage.citizenLogins)} hint={`ครั้ง ผ่าน ${usage.citizenChannels.join(' / ')}`} />
        <StatCard label="เจ้าหน้าที่เข้าใช้งาน" value={fmtNumber(usage.agencyUsers)} hint={`คน ใน ${usage.agencyProvinceCount} จังหวัด`} />
      </div>

      <Card title="ครัวเรือนได้รับผลกระทบ เทียบกับได้รับการช่วยเหลือ" description="แยกตามประเภทภัย">
        <HBarChart
          data={disasters.rows}
          categoryKey="type"
          series={[
            { key: 'affectedHouseholds', label: 'ได้รับผลกระทบ', color: 'var(--series-1)' },
            { key: 'assistedHouseholds', label: 'ได้รับการช่วยเหลือ', color: 'var(--series-2)' },
          ]}
        />
      </Card>
      <div className="note">หมายเหตุ: {disasters.note}</div>
    </>
  )
}
