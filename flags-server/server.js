const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 4000
const FLAGS_FILE = path.join(__dirname, 'flags.json')

function readFlags() {
  return JSON.parse(fs.readFileSync(FLAGS_FILE, 'utf8'))
}

function writeFlags(flags) {
  fs.writeFileSync(FLAGS_FILE, JSON.stringify(flags, null, 2) + '\n')
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url !== '/flags') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(readFlags()))
    return
  }

  if (req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const { name, value } = JSON.parse(body)
        if (typeof name !== 'string' || typeof value !== 'boolean') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Expected { name: string, value: boolean }' }))
          return
        }
        const flags = readFlags()
        flags[name] = value
        writeFlags(flags)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(flags))
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return
  }

  res.writeHead(405, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Method not allowed' }))
})

server.listen(PORT, () => {
  console.log(`flags-server listening on http://localhost:${PORT}`)
})
