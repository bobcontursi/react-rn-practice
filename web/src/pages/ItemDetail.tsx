import { Link, useParams } from 'react-router-dom'
import { items } from '../data/items'

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const item = items.find((item) => item.id === id)

  if (!item) {
    return (
      <div>
        <h1>Item not found</h1>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  )
}
