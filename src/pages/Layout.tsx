import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/large-by-country">Large Cities By Country</Link>
          </li>
          <li>
            <Link to="/20-largest">Twenty Largest Cities</Link>
          </li>
          <li>
            <Link to="/shell">Shell</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}
