import type { ReactElement } from 'react'
import { OverviewPage } from '@/pages/OverviewPage'
import { DisastersPage } from '@/pages/DisastersPage'
import { UsagePage } from '@/pages/UsagePage'
import { PendingPage } from '@/pages/PendingPage'

export interface AppRoute {
  path: string
  label: string
  element: ReactElement
}

/** เพิ่มหน้าใหม่: สร้างไฟล์ใน src/pages แล้วเพิ่มบรรทัดที่นี่ (เมนูจะขึ้นเอง) */
export const routes: AppRoute[] = [
  { path: '/', label: 'ภาพรวม', element: <OverviewPage /> },
  { path: '/disasters', label: 'แจ้งภัย / ขอความช่วยเหลือ', element: <DisastersPage /> },
  { path: '/usage', label: 'การเข้าใช้งาน', element: <UsagePage /> },
  { path: '/pending', label: 'คำร้องรอพิจารณา', element: <PendingPage /> },]
