#!/usr/bin/env node
// @aziontech/webkit-mcp — MCP server (stdio) exposing the pure queries.js functions
// as tools over the installed webkit's version-locked catalog. Intentionally THIN:
// all logic lives in queries.js + catalog.js and the tool table in tools.js. The SDK +
// zod are loaded lazily via dynamic import so running without installed deps fails
// with an actionable message; `registerTool` takes a zod RAW SHAPE (legacy `.tool`
// fallback in tools.js).

import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { loadCatalog } from './catalog.js'
import { registerTools } from './tools.js'

const SDK_MCP = '@modelcontextprotocol/sdk/server/mcp.js'
const SDK_STDIO = '@modelcontextprotocol/sdk/server/stdio.js'
const ZOD = 'zod'

/** This server's own version, read from its package.json (never hardcoded). */
function serverVersion() {
  try {
    const pkgUrl = new URL('../../package.json', import.meta.url)
    return JSON.parse(readFileSync(fileURLToPath(pkgUrl), 'utf-8')).version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

async function main() {
  let McpServer, StdioServerTransport, z
  try {
    ;({ McpServer } = await import(SDK_MCP))
    ;({ StdioServerTransport } = await import(SDK_STDIO))
    ;({ z } = await import(ZOD))
  } catch (err) {
    process.stderr.write(
      `webkit-mcp: missing runtime dependencies ("@modelcontextprotocol/sdk", "zod"). ` +
        `They ship in @aziontech/webkit's dependencies — reinstall the package ` +
        `(e.g. \`npx -y -p @aziontech/webkit webkit-mcp\`) or install them explicitly.\n` +
        `${err?.message ?? err}\n`
    )
    process.exit(1)
    return
  }

  // Resolve the catalog from the directory the server was launched in (the
  // consuming project), so answers are locked to the webkit version it installed.
  const catalog = loadCatalog(process.cwd())

  const server = new McpServer({ name: '@aziontech/webkit-mcp', version: serverVersion() })

  registerTools(server, z, catalog)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  // stderr only — stdout is the MCP transport channel.
  process.stderr.write(
    `@aziontech/webkit-mcp ready` +
      (catalog.available
        ? ` (webkit ${catalog.version}, ${catalog.subpaths.length} exports)\n`
        : ` (webkit catalog NOT resolvable — tools will report unavailable)\n`)
  )
}

main().catch((err) => {
  process.stderr.write(`@aziontech/webkit-mcp failed to start: ${err?.stack || err}\n`)
  process.exit(1)
})
