import type { ReactElement } from 'react'
import { OverviewPage } from '@/pages/OverviewPage'
import { DisastersPage } from '@/pages/DisastersPage'
import { UsagePage } from '@/pages/UsagePage'
import { PendingPage } from '@/pages/PendingPage'
import { IconAlert, IconClock, IconOverview, IconUsers } from '@/components/ui/icons'

export interface AppRoute {
  path: string
  label: string
  icon: ReactElement // แสดงในแถบเมนูด้านล่างบนมือถือ
  element: ReactElement
}

/** เพิ่มหน้าใหม่: สร้างไฟล์ใน src/pages แล้วเพิ่มบรรทัดที่นี่ (เมนูจะขึ้นเอง) */
export const routes: AppRoute[] = [
  { path: '/', label: 'ภาพรวม', icon: <IconOverview />, element: <OverviewPage /> },
  { path: '/disasters', label: 'แจ้งภัย', icon: <IconAlert />, element: <DisastersPage /> },
  { path: '/usage', label: 'การใช้งาน', icon: <IconUsers />, element: <UsagePage /> },
  { path: '/pending', label: 'รอพิจารณา', icon: <IconClock />, element: <PendingPage /> },
]
