import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { items } from '../data/items'
import { getFlags } from '../flags'

export default function Home() {
  const [betaBadge, setBetaBadge] = useState(false)

  useEffect(() => {
    getFlags()
      .then((flags) => setBetaBadge(Boolean(flags.betaBadge)))
      .catch(() => setBetaBadge(false))
  }, [])

  return (
    <div>
      <h1>
        React / React Native Practice Build
        {betaBadge && <span> 🔵 Beta</span>}
      </h1>
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
