import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ReportProvider } from '@/components/layout/ReportContext'
import { routes } from '@/routes'
import { initLayout } from '@/utils/layout'
import '@/styles/global.css'

initLayout() // ตั้งโหมด Web/Mobile ก่อน render ครั้งแรก

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReportProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {routes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </ReportProvider>
  </StrictMode>,
)
