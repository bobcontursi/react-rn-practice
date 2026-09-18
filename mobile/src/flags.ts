export type Flags = Record<string, boolean>

const FLAGS_SERVER_URL = process.env.EXPO_PUBLIC_FLAGS_SERVER_URL ?? 'http://localhost:4000'
console.log('flags-server URL:', FLAGS_SERVER_URL)

export async function getFlags(): Promise<Flags> {
  const res = await fetch(`${FLAGS_SERVER_URL}/flags`)
  return res.json()
}

export async function setFlag(name: string, value: boolean): Promise<Flags> {
  const res = await fetch(`${FLAGS_SERVER_URL}/flags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, value }),
  })
  return res.json()
}
