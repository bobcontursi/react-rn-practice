import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/flags">Flags</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer data-testid="env-label">
        Environment: {import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE}
      </footer>
    </>
  )
}
