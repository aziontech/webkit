import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = fileURLToPath(new URL('..', import.meta.url))
const SERVER = fileURLToPath(new URL('../src/server.js', import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

function startServer() {
  const env = { ...process.env }
  delete env.WEBKIT_CATALOG_PATH
  const child = spawn(process.execPath, [SERVER], {
    cwd: PKG_ROOT,
    env,
    stdio: ['pipe', 'pipe', 'pipe']
  })
  const pending = new Map()
  let buffer = ''
  let stderr = ''
  child.stderr.on('data', (chunk) => (stderr += chunk))
  child.stdout.on('data', (chunk) => {
    buffer += chunk
    let newline
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim()
      buffer = buffer.slice(newline + 1)
      if (!line) continue
      const message = JSON.parse(line)
      pending.get(message.id)?.(message)
      pending.delete(message.id)
    }
  })
  let nextId = 1
  const request = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++
      const timer = setTimeout(() => reject(new Error(`${method} timed out\n${stderr}`)), 15000)
      pending.set(id, (message) => {
        clearTimeout(timer)
        resolve(message)
      })
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
    })
  const notify = (method, params = {}) =>
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`)
  return { child, request, notify, stderr: () => stderr }
}

test('the bin points at the server and the package depends on @aziontech/webkit', () => {
  assert.equal(pkg.bin['webkit-mcp'], './src/server.js')
  assert.ok(pkg.dependencies['@aziontech/webkit'])
  assert.ok(pkg.dependencies['@modelcontextprotocol/sdk'])
  assert.ok(pkg.dependencies.zod)
})

test('the server imports the query engine from the published @aziontech/webkit export', () => {
  const source = readFileSync(SERVER, 'utf8')
  assert.match(source, /from '@aziontech\/webkit\/catalog-queries'/)
  assert.doesNotMatch(source, /\.\.\/[^']*src\//)
})

test('the server answers over stdio from the installed @aziontech/webkit catalog', async (t) => {
  const server = startServer()
  t.after(() => server.child.kill())

  const init = await server.request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'webkit-mcp-test', version: '0.0.0' }
  })
  assert.equal(init.result.serverInfo.name, '@aziontech/webkit-mcp')
  assert.equal(init.result.serverInfo.version, pkg.version)
  server.notify('notifications/initialized')

  const list = await server.request('tools/list')
  const names = list.result.tools.map((tool) => tool.name)
  for (const name of [
    'get_block',
    'get_component',
    'get_import',
    'search_blocks',
    'search_components',
    'suggest_component',
    'validate_usage'
  ]) {
    assert.ok(names.includes(name), `missing tool ${name}`)
  }
  assert.ok(!names.some((name) => /pattern/.test(name)), 'no tool keeps the old pattern name')

  const vocabulary = JSON.parse(
    readFileSync(new URL('../../webkit/catalog.json', import.meta.url), 'utf8')
  ).vocabulary.props
  const preferred = []
  for (const tool of list.result.tools) {
    for (const { aliases } of vocabulary) {
      for (const alias of aliases) {
        if (new RegExp(`\\b${alias} over\\b`).test(tool.description)) {
          preferred.push(`${tool.name}: prefers the banned alias "${alias}"`)
        }
      }
    }
  }
  assert.deepEqual(preferred, [], 'a tool description teaches a banned alias')

  const validate = list.result.tools.find((tool) => tool.name === 'validate_usage')
  const componentDoc = validate.inputSchema.properties.component.description
  assert.match(componentDoc, /layout utilities \(w-full, [^)]+\)/)

  const call = await server.request('tools/call', {
    name: 'get_import',
    arguments: { name: 'button' }
  })
  const answer = JSON.parse(call.result.content[0].text)
  assert.equal(answer.importPath, '@aziontech/webkit/button')
  const page = async (args) =>
    JSON.parse(
      (await server.request('tools/call', { name: 'list_components', arguments: args })).result
        .content[0].text
    )
  const first = await page({})
  assert.equal(first.components.length, 60)
  assert.ok(first.count > 60)
  assert.equal(first.nextCursor, '60')
  const second = await page({ cursor: first.nextCursor })
  assert.equal(second.components[0].name > first.components[59].name, true)
  assert.ok(Buffer.byteLength(JSON.stringify(first)) < 20_000)

  const block = JSON.parse(
    (
      await server.request('tools/call', {
        name: 'get_block',
        arguments: { id: 'dashboard/analytics-dashboard', sections: ['guidelines'] }
      })
    ).result.content[0].text
  )
  assert.equal('sfc' in block, false)
  assert.ok(block.guidelines)
  assert.deepEqual(block.omitted, ['sfc'])

  assert.match(server.stderr(), /webkit-mcp ready \(webkit \d+\.\d+\.\d+, \d+ exports\)/)
})
