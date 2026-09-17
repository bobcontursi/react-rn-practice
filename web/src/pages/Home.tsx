import { Link } from 'react-router-dom'
import { items } from '../data/items'

export default function Home() {
  return (
    <div>
      <h1>React / React Native Practice Build</h1>
      <p>
        A small, spec-driven practice project for hands-on React, React Native, and CI/CD
        skill-building.
      </p>

      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
