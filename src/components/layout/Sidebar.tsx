import { NavLink } from 'react-router-dom'
import { routes } from '@/routes'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/favicon.svg" alt="" />
        <span>พ้นภัย Dashboard</span>
      </div>
      <nav className="nav">
        {routes.map((r) => (
          <NavLink key={r.path} to={r.path} end={r.path === '/'}>
            {r.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
