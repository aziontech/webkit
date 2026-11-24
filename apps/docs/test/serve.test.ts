import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'

const { SECURITY_HEADERS, serve } = await import('../scripts/serve.mjs')

const root = mkdtempSync(join(tmpdir(), 'docs-serve-'))
let base = ''
let server: { close: () => void; address: () => AddressInfo | string | null }

before(async () => {
  writeFileSync(join(root, 'index.html'), '<!doctype html><title>Docs</title>')
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
  const res = await fetch(`${base}/`)
  assert.equal(res.status, 200)
  for (const [name, value] of Object.entries(SECURITY_HEADERS))
    assert.equal(res.headers.get(name), value, name)
})

test('the build manifests under .vite are never served', async () => {
  const res = await fetch(`${base}/.vite/ssr-manifest.json`)
  assert.equal(res.status, 404)
  assert.ok(!(await res.text()).includes('/abs/build/host/path'))
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff')
})
