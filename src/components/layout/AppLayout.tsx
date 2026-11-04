import { Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/routes'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const { pathname } = useLocation()
  const current = routes.find((r) => r.path === pathname)
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header title={current?.label ?? ''} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
