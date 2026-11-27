import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { createSecureServer } from 'node:http2'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

const EXAMPLE_FRAME = '/frame/example/'

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

export const SECURITY_HEADERS = {
  'Content-Security-Policy': "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const DATA_BLOCK = /\btype\s*=\s*["']?application\/(?:ld\+)?json/i

export function pagePolicy(html) {
  const hashes = new Set()
  for (const [, attributes, code] of html.matchAll(INLINE_SCRIPT)) {
    if (/\bsrc\s*=/i.test(attributes) || DATA_BLOCK.test(attributes)) continue
    hashes.add(`'sha256-${createHash('sha256').update(code).digest('base64')}'`)
  }
  return [
    SECURITY_HEADERS['Content-Security-Policy'],
    `script-src 'self' ${[...hashes].join(' ')}`.trim(),
    "worker-src 'self' blob:"
  ].join('; ')
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.md', '.txt', '.svg'])

const ENCODERS = {
  br: (raw) =>
    brotliCompressSync(raw, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 5,
        [constants.BROTLI_PARAM_SIZE_HINT]: raw.length
      }
    }),
  gzip: (raw) => gzipSync(raw, { level: 6 })
}

function pickEncoding(header) {
  const accepted = String(header ?? '')
    .split(',')
    .map((part) => part.trim().split(';')[0])
  return Object.keys(ENCODERS).find((name) => accepted.includes(name)) ?? null
}

function tlsFromEnv() {
  const { TLS_KEY: key, TLS_CERT: cert } = process.env
  return key && cert ? { key: readFileSync(key), cert: readFileSync(cert) } : null
}

function locator(root, spa) {
  const locate = (pathname) => {
    if (pathname.split('/').some((segment) => segment.startsWith('.'))) return null
    const file = normalize(join(root, decodeURIComponent(pathname)))
    if (!file.startsWith(root)) return null
    if (existsSync(file) && statSync(file).isFile()) return file
    const page = join(file, 'index.html')
    if (existsSync(page)) return page
    if (existsSync(`${file}.html`)) return `${file}.html`
    if (pathname.startsWith(EXAMPLE_FRAME)) return locate(EXAMPLE_FRAME)
    if (spa && !extname(pathname)) return join(root, 'index.html')
    return null
  }
  return locate
}

function responder(root, spa) {
  const locate = locator(root, spa)
  const encoded = new Map()
  const policies = new Map()
  const policy = (file) => {
    if (!policies.has(file)) policies.set(file, pagePolicy(readFileSync(file, 'utf8')))
    return policies.get(file)
  }
  const body = (file, encoding) => {
    const key = `${encoding}:${file}`
    if (!encoded.has(key)) {
      const raw = readFileSync(file)
      encoded.set(key, encoding ? ENCODERS[encoding](raw) : raw)
    }
    return encoded.get(key)
  }
  return (req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost')
    const file = locate(pathname)
    const target = file ?? join(root, '404/index.html')
    if (!existsSync(target)) {
      res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': TYPES['.txt'] })
      res.end('Not found')
      return
    }
    const type = extname(target)
    const encoding = COMPRESSIBLE.has(type) ? pickEncoding(req.headers['accept-encoding']) : null
    const payload = body(target, encoding)
    res.writeHead(file ? 200 : 404, {
      ...SECURITY_HEADERS,
      ...(type === '.html' ? { 'Content-Security-Policy': policy(target) } : {}),
      'Content-Type': TYPES[type] ?? 'application/octet-stream',
      'Content-Length': payload.length,
      Vary: 'Accept-Encoding',
      ...(encoding ? { 'Content-Encoding': encoding } : {})
    })
    res.end(req.method === 'HEAD' ? undefined : payload)
  }
}

export function serve(
  port = Number(process.env.PORT ?? 4173),
  { root = DIST, spa = false, tls = tlsFromEnv() } = {}
) {
  const respond = responder(resolve(root), spa)
  const server = tls
    ? createSecureServer({ ...tls, allowHTTP1: true }, respond)
    : createServer(respond)
  return new Promise((done) => server.listen(port, () => done(server)))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      root: { type: 'string' },
      spa: { type: 'boolean', default: false },
      port: { type: 'string' }
    }
  })
  const server = await serve(Number(values.port ?? process.env.PORT ?? 4173), {
    root: values.root ? resolve(values.root) : DIST,
    spa: values.spa
  })
  const scheme = tlsFromEnv() ? 'https' : 'http'
  console.log(`Azion UI ${values.root ?? 'docs'} on ${scheme}://localhost:${server.address().port}`)
}
