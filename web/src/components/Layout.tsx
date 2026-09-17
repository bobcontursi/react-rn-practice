import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
