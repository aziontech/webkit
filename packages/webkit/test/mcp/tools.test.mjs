import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { z } from 'zod'

const CATALOG_PATH = fileURLToPath(new URL('../../catalog.json', import.meta.url))
const SERVER_PATH = fileURLToPath(new URL('../../src/mcp/server.js', import.meta.url))
process.env.WEBKIT_CATALOG_PATH = CATALOG_PATH

const { loadCatalog, _resetCatalogCache } = await import('../../src/mcp/catalog.js')
const { registerTools } = await import('../../src/mcp/tools.js')

_resetCatalogCache()
const catalog = loadCatalog()

const TOOLS = [
  'get_best_practices',
  'get_component',
  'get_import',
  'get_usage_example',
  'list_categories',
  'list_components',
  'list_tokens',
  'search_components',
  'suggest_component',
  'validate_usage'
]

test('registerTools uses registerTool when the SDK has it', async () => {
  const calls = []
  registerTools({ registerTool: (...args) => calls.push(args) }, z, catalog)

  assert.deepEqual(calls.map(([name]) => name).sort(), TOOLS)
  for (const [name, config] of calls) {
    assert.ok(config.title, `${name} has a title`)
    assert.ok(config.description, `${name} has a description`)
    assert.equal(typeof config.inputSchema, 'object', `${name} has a raw input shape`)
  }

  const [, , handler] = calls.find(([name]) => name === 'get_component')
  const res = await handler({ name: 'button' })
  assert.equal(res.content[0].type, 'text')
  assert.equal(JSON.parse(res.content[0].text).name, 'button')
})

test('registerTools falls back to the legacy tool(name, shape, handler) signature', async () => {
  const calls = []
  registerTools({ tool: (...args) => calls.push(args) }, z, catalog)

  assert.deepEqual(calls.map(([name]) => name).sort(), TOOLS)
  const [, shape, handler] = calls.find(([name]) => name === 'validate_usage')
  assert.deepEqual(Object.keys(shape).sort(), ['classes', 'import'])
  const res = JSON.parse((await handler({ import: '@aziontech/webkit/button' })).content[0].text)
  assert.equal(res.ok, true)
})

/** Send newline-delimited JSON-RPC requests over stdio and collect replies by id. */
function rpc(child, messages) {
  return new Promise((resolve, reject) => {
    const replies = new Map()
    const want = messages.filter((m) => m.id != null).length
    let buffer = ''
    child.stdout.on('data', (chunk) => {
      buffer += chunk
      let nl
      while ((nl = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (!line) continue
        const msg = JSON.parse(line)
        if (msg.id != null) replies.set(msg.id, msg)
        if (replies.size === want) resolve(replies)
      }
    })
    child.on('error', reject)
    child.on('exit', (code) => reject(new Error(`server exited early (${code})`)))
    for (const m of messages) child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...m })}\n`)
  })
}

test('server.js answers initialize + tools/list over stdio', async () => {
  const child = spawn(process.execPath, [SERVER_PATH], {
    env: { ...process.env, WEBKIT_CATALOG_PATH: CATALOG_PATH },
    stdio: ['pipe', 'pipe', 'pipe']
  })
  try {
    const replies = await rpc(child, [
      {
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'webkit-mcp-test', version: '0.0.0' }
        }
      },
      { method: 'notifications/initialized' },
      { id: 2, method: 'tools/list' }
    ])
    assert.equal(replies.get(1).result.serverInfo.name, '@aziontech/webkit-mcp')
    const names = replies
      .get(2)
      .result.tools.map((t) => t.name)
      .sort()
    assert.deepEqual(names, TOOLS)
  } finally {
    child.removeAllListeners('exit')
    child.kill()
  }
})
