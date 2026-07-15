#!/usr/bin/env node
// @aziontech/webkit-mcp — a Model Context Protocol server that lets an AI in ANY
// project generate correct + performant @aziontech/webkit code.
//
// It reads the INSTALLED webkit's version-locked catalog.json (resolved from the
// consuming project, with a WEBKIT_CATALOG_PATH override) and exposes the pure
// functions in queries.js as MCP tools over stdio.
//
// This file is intentionally THIN: it only adapts queries.js to MCP. All logic —
// and all of the tests — live in queries.js + catalog.js (which need no SDK).
//
// RUNTIME DEPENDENCIES (declared in package.json#dependencies, resolved at `npx`
// time — NOT bundled or vendored here):
//   - @modelcontextprotocol/sdk  ^1.0.0   → McpServer + StdioServerTransport
//   - zod                        ^3.23.0  → tool input schemas
// They are loaded lazily via dynamic import from named constants so that startup
// can fail with a clear, actionable message if the server is ever run without its
// dependencies installed (e.g. from source without `npm install`).
//
// SDK API assumptions (documented @modelcontextprotocol/sdk, v1.x):
//   - `McpServer` from '@modelcontextprotocol/sdk/server/mcp.js'
//   - `StdioServerTransport` from '@modelcontextprotocol/sdk/server/stdio.js'
//   - `server.registerTool(name, { title, description, inputSchema }, handler)`
//     where `inputSchema` is a ZOD RAW SHAPE ({ key: z.string(), ... }). This is
//     the current API; older builds exposed `server.tool(name, shape, handler)`
//     with the same argument meaning, so a fallback to `.tool` is provided below.
//   - a handler returns `{ content: [{ type: 'text', text }] }`.

import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { loadCatalog } from './catalog.js'
import {
  getBestPractices,
  getComponent,
  getImport,
  getUsageExample,
  listCategories,
  listComponents,
  listTokens,
  searchComponents,
  suggestComponent,
  validateUsage
} from './queries.js'

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

/** Wrap a plain-JSON result as an MCP tool response. */
function json(result) {
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
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

  /** Register a tool across the modern (registerTool) and legacy (tool) SDK shapes. */
  const tool = (name, config, handler) => {
    if (typeof server.registerTool === 'function') {
      server.registerTool(name, config, handler)
    } else {
      // Legacy signature: server.tool(name, inputShape, handler)
      server.tool(name, config.inputSchema ?? {}, handler)
    }
  }

  tool(
    'list_components',
    {
      title: 'List webkit components',
      description:
        'List every renderable @aziontech/webkit component (compact cards: name, category, ' +
        'structure, import, tree-shakeable import, PascalCase binding). Optionally filter by category.',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe('Restrict to one category (e.g. "actions", "data", "inputs", "feedback").')
      }
    },
    async ({ category }) => json(listComponents(catalog, { category }))
  )

  tool(
    'list_categories',
    {
      title: 'List webkit categories',
      description:
        'List the distinct component categories present in the installed webkit catalog.',
      inputSchema: {}
    },
    async () => json(listCategories(catalog))
  )

  tool(
    'list_tokens',
    {
      title: 'List webkit design tokens',
      description:
        'The POSITIVE token inventory (what to USE instead of hardcoding): without a category, ' +
        'returns the token group index + typography classes + the canonical prop/event vocabulary ' +
        '(kind over variant, severity over status, …); with a category ("primary", "bg", ' +
        '"text", "spacing", "radius", "shadow", …) returns that group\'s CSS custom properties.',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Token group to expand (e.g. "primary", "bg", "text", "spacing"). Omit for the index.'
          )
      }
    },
    async ({ category }) => json(listTokens(catalog, { category }))
  )

  tool(
    'get_component',
    {
      title: 'Get a webkit component API',
      description:
        'Full API for one component: props, events, slots, sub-components, structure, and ' +
        'compound-root info. Returns fuzzy suggestions when the name is unknown.',
      inputSchema: {
        name: z.string().describe('Component name (kebab-case), e.g. "button" or "table".')
      }
    },
    async ({ name }) => json(getComponent(catalog, name))
  )

  tool(
    'get_best_practices',
    {
      title: "Get a component's usage guidance",
      description:
        'When-to-use / when-NOT-to-use / related components / best-practice notes for one ' +
        'component — the guidance for picking and using the RIGHT component (e.g. Badge vs Tag, ' +
        'Dialog vs Drawer), distinct from get_component (the raw API).',
      inputSchema: {
        name: z.string().describe('Component name (kebab-case), e.g. "badge" or "dialog".')
      }
    },
    async ({ name }) => json(getBestPractices(catalog, name))
  )

  tool(
    'get_import',
    {
      title: 'Get the correct + performant import',
      description:
        'The correct, tree-shakeable import line for a component (for a compound root this is the ' +
        '"<name>-root" import), plus the PascalCase binding and, when relevant, the compound ' +
        'dot-notation alternative.',
      inputSchema: {
        name: z.string().describe('Component name (kebab-case), e.g. "button" or "table".')
      }
    },
    async ({ name }) => json(getImport(catalog, name))
  )

  tool(
    'search_components',
    {
      title: 'Search webkit components',
      description:
        'Fuzzy / substring search across component names and categories. Ranked results so a phrase ' +
        'like "dropdown" or "paginated table" resolves to a real component.',
      inputSchema: {
        query: z.string().describe('Free-text query, e.g. "dropdown", "date picker", "toast".')
      }
    },
    async ({ query }) => json(searchComponents(catalog, query))
  )

  tool(
    'suggest_component',
    {
      title: 'Suggest a webkit component for a need',
      description:
        'Given a plain-language need, suggest the single best-fitting component (plus runners-up) so ' +
        'the AI uses a real webkit component instead of reinventing one or reaching for PrimeVue.',
      inputSchema: {
        need: z
          .string()
          .describe('What you are trying to build, e.g. "a searchable paginated table".')
      }
    },
    async ({ need }) => json(suggestComponent(catalog, need))
  )

  tool(
    'get_usage_example',
    {
      title: 'Get a runnable usage example',
      description:
        'A runnable single-file component: a script-setup block with the tree-shakeable import and a ' +
        'template using the PascalCase tag with example props from the component API. Paste-and-run.',
      inputSchema: {
        name: z.string().describe('Component name (kebab-case), e.g. "button" or "table".')
      }
    },
    async ({ name }) => json(getUsageExample(catalog, name))
  )

  tool(
    'validate_usage',
    {
      title: 'Validate webkit usage',
      description:
        'Validate an import path (real / denied / unknown + suggestions) and/or a class string ' +
        '(scanned against the catalog token rules: hex, rgb/hsl, tailwind palette, raw text size, ' +
        'PrimeVue color). Returns { ok, problems }.',
      inputSchema: {
        import: z
          .string()
          .optional()
          .describe('An import path to check, e.g. "@aziontech/webkit/button".'),
        classes: z
          .string()
          .optional()
          .describe('A class string to scan for forbidden hardcoded colors / raw utilities.')
      }
    },
    async ({ import: importPath, classes }) =>
      json(validateUsage(catalog, { import: importPath, classes }))
  )

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
