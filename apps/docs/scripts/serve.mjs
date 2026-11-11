import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
}

function locate(pathname) {
  const file = normalize(join(DIST, decodeURIComponent(pathname)))
  if (!file.startsWith(DIST)) return null
  if (existsSync(file) && statSync(file).isFile()) return file
  const page = join(file, 'index.html')
  if (existsSync(page)) return page
  if (existsSync(`${file}.html`)) return `${file}.html`
  return null
}

export function serve(port = Number(process.env.PORT ?? 4173)) {
  const server = createServer((req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost')
    const file = locate(pathname)
    const status = file ? 200 : 404
    const target = file ?? join(DIST, '404/index.html')
    res.writeHead(status, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' })
    createReadStream(target).pipe(res)
  })
  return new Promise((done) => server.listen(port, () => done(server)))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await serve()
  console.log(`WebKit docs on http://localhost:${server.address().port}`)
}
