/** โครงสร้างข้อมูลรายงานสรุปการใช้งานแอปพลิเคชัน "พ้นภัย" รายเดือน */

export interface MonthlyReport {
  id: string // เช่น "2569-10"
  title: string
  periodLabel: string // เช่น "ตุลาคม 2569"
  asOf: string // วันที่ของข้อมูล
  disasters: DisasterSummary
  usage: UsageSummary
  pending: PendingSummary
  issues: UsageIssue[]
}

/** ส่วนที่ 1: จำนวนแจ้งภัยและร้องขอความช่วยเหลือ แยกตามประเภทภัย */
export interface DisasterSummary {
  totalRequests: number
  provinceCount: number
  note: string
  rows: DisasterRow[]
}

export interface DisasterRow {
  type: string // ประเภทภัย
  reports: number // แจ้งภัย
  helpRequests: number // ขอความช่วยเหลือ
  assisted: number // จำนวนคำร้องที่ช่วยเหลือ
  affectedHouseholds: number // ครัวเรือนได้รับผลกระทบ
  assistedHouseholds: number // ครัวเรือนได้รับการช่วยเหลือ
  provinces: string[]
}

/** ส่วนที่ 2: จำนวนการเข้าใช้งาน */
export interface UsageSummary {
  citizenLogins: number
  citizenChannels: string[]
  agencyUsers: number
  agencyProvinceCount: number
  statsPeriod: string
  byAgency: AgencyUsage[]
}

export interface AgencyUsage {
  agency: string
  registered: number // ผู้ใช้งานทั้งหมด
  active: number // ผู้ใช้งานจริง
}

/** ส่วนที่ 3: คำร้องที่กำลังรอพิจารณา */
export interface PendingSummary {
  total: number
  provinceCount: number
  byAgency: PendingRow[]
}

export interface PendingRow {
  agency: string
  awaitingScreening: number // รอคัดกรอง/รับเรื่อง
  inProgress: number // กำลังดำเนินการ
  areas: { province: string; count: number }[]
}

/** ส่วนที่ 4: ปัญหาการใช้งาน */
export interface UsageIssue {
  userGroup: string
  problem: string
  solution: string
}
