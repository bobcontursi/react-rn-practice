import { useEffect, useState } from 'react'
import { getFlags, setFlag, type Flags } from '../flags'

export default function FlagsPage() {
  const [flags, setFlags] = useState<Flags | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getFlags()
      .then(setFlags)
      .catch(() => setError('Could not reach the flags-server. Is it running on port 4000?'))
  }, [])

  async function handleToggle(name: string, value: boolean) {
    try {
      const updated = await setFlag(name, value)
      setFlags(updated)
    } catch {
      setError('Could not reach the flags-server. Is it running on port 4000?')
    }
  }

  return (
    <div>
      <h1>Feature flags</h1>
      {error && <p>{error}</p>}
      {!error && !flags && <p>Loading…</p>}
      {flags && (
        <ul>
          {Object.entries(flags).map(([name, value]) => (
            <li key={name}>
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleToggle(name, e.target.checked)}
                />
                {name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
