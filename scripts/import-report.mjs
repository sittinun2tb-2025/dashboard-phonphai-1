/**
 * แปลงไฟล์ sum_app_report.xls (ออกจาก JasperReports) → src/data/reports/<id>.json
 *
 * วิธีใช้:
 *   npm run import:report -- data/raw/sum_app_report_2569-11.xls
 *
 * สคริปต์อ่านตามข้อความหัวตารางในไฟล์ ถ้ารูปแบบรายงานเปลี่ยน ให้แก้ที่ไฟล์นี้
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'

const file = process.argv[2]
if (!file) {
  console.error('ระบุไฟล์ .xls เช่น: npm run import:report -- data/raw/sum_app_report_2569-11.xls')
  process.exit(1)
}

const wb = XLSX.read(readFileSync(file))
const sheet = wb.Sheets[wb.SheetNames[0]]
/** แต่ละแถว = เฉพาะเซลล์ที่มีค่า (รายงาน Jasper มี merged cell เยอะ) */
const rows = XLSX.utils
  .sheet_to_json(sheet, { header: 1, defval: '' })
  .map((r) => r.filter((c) => c !== '').map((c) => (typeof c === 'string' ? c.trim() : c)))

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
const num = (s) => Number(String(s).replace(/[^\d.]/g, '')) || 0
const findRow = (re, from = 0) => rows.findIndex((r, i) => i >= from && re.test(String(r[0] ?? '')))
const splitPair = (s) => String(s).split('/').map(num)
const provincesOf = (s) =>
  String(s).replace(/^จังหวัด/, '').split(',').map((p) => p.trim()).filter(Boolean)

// ---------- หัวรายงาน ----------
const title = String(rows[0][0])
const m = title.match(/ประจำเดือน\s*(\S+)\s+(\d{4})/)
if (!m) throw new Error('หาเดือน/ปีจากหัวรายงานไม่เจอ: ' + title)
const [, monthTh, yearBE] = m
const id = `${yearBE}-${String(THAI_MONTHS.indexOf(monthTh) + 1).padStart(2, '0')}`

const asOfMatch = String(rows[1][0]).match(/(\d{1,2})\s+(\S+)\s+(\d{4})\s*$/)
const asOf = asOfMatch
  ? `${Number(asOfMatch[3]) - 543}-${String(THAI_MONTHS.indexOf(asOfMatch[2]) + 1).padStart(2, '0')}-${asOfMatch[1].padStart(2, '0')}`
  : new Date().toISOString().slice(0, 10)

// ---------- ส่วนที่ 1: ประเภทภัย ----------
const s11 = String(rows[findRow(/^1\.1/)][0])
const h1 = findRow(/^ประเภทภัย/)
/** แปลงแถวตารางประเภทภัย (ใช้ทั้งแถวข้อมูลและแถว "รวม") — ค่าทุกตัวอ่านจากไฟล์ตรง ๆ ไม่คำนวณเอง */
const parseDisasterRow = (r) => {
  const [reports, helpRequests] = splitPair(r[1])
  const hh = String(r[4]).match(/(\d+)\s*ครัวเรือน\s*\(([\d.]+%)\)/)
  return {
    type: r[0], reports, helpRequests, assisted: num(r[2]),
    affectedHouseholds: num(r[3]),
    assistedHouseholds: hh ? Number(hh[1]) : 0,
    assistedPercent: hh ? hh[2] : '-',
    provinces: provincesOf(r[5]),
  }
}
const disasterRows = []
let note = ''
let disasterTotal
for (let i = h1 + 1; i < rows.length; i++) {
  const r = rows[i]
  if (/^หมายเหตุ/.test(r[0])) { note = String(r[0]).replace(/^หมายเหตุ\s*:\s*/, ''); continue }
  if (/^รวม/.test(r[0])) {
    const { provinces, ...t } = parseDisasterRow(r)
    disasterTotal = { ...t, provinceLabel: String(r[5]) }
    break
  }
  disasterRows.push(parseDisasterRow(r))
}

// ---------- ส่วนที่ 2: การเข้าใช้งาน ----------
const s21 = String(rows[findRow(/^2\.1/)][0])
const s22 = String(rows[findRow(/^2\.2/)][0])
const statsTitle = String(rows[findRow(/^สถิติผู้ใช้งาน/)][0])
const h2 = findRow(/^หน่วยงาน/)
const byAgency = []
for (let i = h2 + 1; i < rows.length && !/^3\./.test(rows[i][0]); i++) {
  byAgency.push({ agency: rows[i][0], registered: num(rows[i][1]), active: num(rows[i][2]) })
}

// ---------- ส่วนที่ 3: คำร้องรอพิจารณา ----------
const s31 = String(rows[findRow(/^3\.1/)][0])
const h3 = findRow(/^หน่วยงาน/, h2 + 1)
const pendingRows = []
const pendingTotalRow = rows.slice(h3 + 1).find((r) => /^รวม/.test(r[0]))
const [pAwait, pProg] = splitPair(pendingTotalRow[1])
const pendingTotal = { awaitingScreening: pAwait, inProgress: pProg, areaLabel: String(pendingTotalRow[2]) }
for (let i = h3 + 1; i < rows.length && !/^รวม/.test(rows[i][0]); i++) {
  const [awaitingScreening, inProgress] = splitPair(rows[i][1])
  const areas = [...String(rows[i][2]).matchAll(/(?:จ\.)?([^\s()]+)\s*\((\d+)\)/g)]
    .map(([, province, c]) => ({ province, count: Number(c) }))
  pendingRows.push({ agency: String(rows[i][0]).replace(/\(.*\)$/, ''), awaitingScreening, inProgress, areas })
}

// ---------- ส่วนที่ 4: ปัญหาการใช้งาน ----------
const h4 = findRow(/^กลุ่มผู้ใช้งาน/)
const issues = []
for (let i = h4 + 1; i < rows.length; i++) {
  const [userGroup, problem, solution] = rows[i]
  if (userGroup && userGroup !== '-') issues.push({ userGroup, problem, solution })
}

const report = {
  id,
  title: title.replace(/\s*ประจำเดือน.*$/, ''),
  periodLabel: `${monthTh} ${yearBE}`,
  asOf,
  disasters: {
    totalRequests: num(s11.match(/(\d+)\s*คำร้อง/)?.[1]),
    provinceCount: num(s11.match(/(\d+)\s*จังหวัด/)?.[1]),
    note,
    rows: disasterRows,
    total: disasterTotal,
  },
  usage: {
    citizenLogins: num(s21.match(/รวม\s*([\d,]+)/)?.[1]),
    citizenChannels: (s21.match(/ผ่านระบบ\s*([^)]+)/)?.[1] ?? '').split(/\s+/).filter(Boolean),
    agencyUsers: num(s22.match(/จำนวน\s*([\d,]+)\s*คน/)?.[1]),
    agencyProvinceCount: num(s22.match(/พื้นที่\s*(\d+)\s*จังหวัด/)?.[1]),
    statsPeriod: statsTitle.replace(/^.*ประจำวันที่\s*/, ''),
    byAgency,
  },
  pending: {
    total: num(s31.match(/รวม\s*(\d+)/)?.[1]),
    provinceCount: num(s31.match(/(\d+)\s*จังหวัด/)?.[1]),
    byAgency: pendingRows,
    totalRow: pendingTotal,
  },
  issues,
}

const out = resolve('src/data/reports', `${id}.json`)
writeFileSync(out, JSON.stringify(report, null, 2) + '\n')
console.log(`✔ บันทึกรายงาน ${report.periodLabel} → ${out}`)
