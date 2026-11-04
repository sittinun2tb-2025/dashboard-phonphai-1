# Dashboard พ้นภัย

Dashboard สรุปการใช้งานแอปพลิเคชัน "พ้นภัย" รายเดือน
React + Vite + TypeScript + Recharts

## เริ่มใช้งาน

```bash
npm install
npm run dev        # เปิด http://localhost:5173
npm run build      # build ไปที่ dist/
```

## เพิ่มรายงานเดือนใหม่

1. วางไฟล์ `.xls` ที่ export จากระบบไว้ใน `data/raw/` เช่น `sum_app_report_2569-11.xls`
2. รัน `npm run import:report -- data/raw/sum_app_report_2569-11.xls`
3. จะได้ไฟล์ `src/data/reports/2569-11.json` และในเมนูเลือกเดือนจะมีเดือนนี้เพิ่มขึ้นมาเอง

## โครงสร้างโปรเจกต์

```
dashboard-phonphai-1/
├─ data/raw/                  ไฟล์ .xls ต้นฉบับ (เก็บไว้อ้างอิง)
├─ scripts/import-report.mjs  แปลง .xls → JSON
├─ public/                    ไฟล์ static (favicon)
└─ src/
   ├─ main.tsx                จุดเริ่มแอป + router
   ├─ routes.tsx              รายการหน้า/เมนู (เพิ่มหน้าใหม่ที่นี่)
   ├─ types/report.ts         โครงสร้างข้อมูลรายงาน
   ├─ data/reports/*.json     ข้อมูลรายงานแต่ละเดือน
   ├─ services/reportService.ts  ชั้นดึงข้อมูล (เปลี่ยนเป็น API ได้ที่นี่ที่เดียว)
   ├─ components/
   │  ├─ layout/              Header (แถบบน + เมนู), AppLayout, ReportContext
   │  ├─ ui/                  Card, StatCard, DataTable
   │  └─ charts/              HBarChart
   ├─ pages/                  ภาพรวม / แจ้งภัย / การเข้าใช้งาน / คำร้องรอพิจารณา
   ├─ utils/format.ts         จัดรูปแบบตัวเลข/วันที่ภาษาไทย
   └─ styles/global.css       design tokens (สี, light/dark) + layout
```

## หน้าใน Dashboard

| เส้นทาง | หน้า | ข้อมูลจากรายงานส่วนที่ |
|---|---|---|
| `/` | ภาพรวม (KPI + กราฟผลกระทบ/ช่วยเหลือ) | 1–3 |
| `/disasters` | แจ้งภัย / ขอความช่วยเหลือ แยกตามประเภทภัย | 1 |
| `/usage` | การเข้าใช้งานของประชาชนและหน่วยงาน | 2 |
| `/pending` | คำร้องรอพิจารณา แยกหน่วยงาน/จังหวัด | 3 |