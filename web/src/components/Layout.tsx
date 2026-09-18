import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/flags">Flags</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
