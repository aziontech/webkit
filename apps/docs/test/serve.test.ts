import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'

const { SECURITY_HEADERS, pagePolicy, serve } = await import('../scripts/serve.mjs')

const INLINE = "document.documentElement.dataset.theme='dark'"
const PAGE = `<!doctype html><title>Docs</title><script>${INLINE}</script><script type="module" src="/app.js"></script><script type="application/ld+json">{}</script>`

const root = mkdtempSync(join(tmpdir(), 'docs-serve-'))
let base = ''
let server: { close: () => void; address: () => AddressInfo | string | null }

before(async () => {
  writeFileSync(join(root, 'index.html'), PAGE)
  writeFileSync(join(root, 'notes.txt'), 'notes')
  mkdirSync(join(root, '.vite'))
  writeFileSync(join(root, '.vite/ssr-manifest.json'), '{"/abs/build/host/path": []}')
  server = await serve(0, { root, tls: null })
  base = `http://localhost:${(server.address() as AddressInfo).port}`
})

after(() => {
  server.close()
  rmSync(root, { recursive: true, force: true })
})

test('every response carries the security headers', async () => {
  const res = await fetch(`${base}/notes.txt`)
  assert.equal(res.status, 200)
  for (const [name, value] of Object.entries(SECURITY_HEADERS))
    assert.equal(res.headers.get(name), value, name)
})

test('a page allows only its own scripts and the inline scripts it carries, by hash', async () => {
  const res = await fetch(`${base}/`)
  const policy = res.headers.get('Content-Security-Policy') ?? ''
  const hash = createHash('sha256').update(INLINE).digest('base64')
  assert.ok(policy.startsWith(SECURITY_HEADERS['Content-Security-Policy']))
  assert.match(
    policy,
    new RegExp(`script-src 'self' 'sha256-${hash.replace(/[+/]/g, '\\$&')}'(;|$)`)
  )
  assert.doesNotMatch(policy, /unsafe-inline/)
  assert.equal(policy, pagePolicy(PAGE))
})

test('the build manifests under .vite are never served', async () => {
  const res = await fetch(`${base}/.vite/ssr-manifest.json`)
  assert.equal(res.status, 404)
  assert.ok(!(await res.text()).includes('/abs/build/host/path'))
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff')
})

test('the demos are previewed through this server, so a client route carries the same policy', async () => {
  const demos = JSON.parse(
    (await import('node:fs')).readFileSync(
      new URL('../../demos/package.json', import.meta.url),
      'utf8'
    )
  ) as { scripts: Record<string, string> }
  assert.match(demos.scripts.preview, /\.\.\/docs\/scripts\/serve\.mjs --root dist --spa/)
  const spa = await serve(0, { root, spa: true, tls: null })
  try {
    const port = (spa.address() as AddressInfo).port
    const response = await fetch(`http://localhost:${port}/resources/edit`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    const hash = createHash('sha256').update(INLINE).digest('base64')
    assert.match(
      response.headers.get('content-security-policy') ?? '',
      new RegExp(`script-src 'self' 'sha256-${hash.replace(/[+/]/g, '\\$&')}'`)
    )
  } finally {
    spa.close()
  }
})
