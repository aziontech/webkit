#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import {
  getBestPractices,
  getBlock,
  getComponent,
  getImport,
  getUsageExample,
  LAYOUT_CLASS_FAMILIES,
  listAssets,
  listCategories,
  listComponents,
  listTokens,
  loadCatalog,
  searchBlocks,
  searchComponents,
  suggestComponent,
  validateUsage
} from '@aziontech/webkit/catalog-queries'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

function serverVersion() {
  try {
    const pkgUrl = new URL('../package.json', import.meta.url)
    return JSON.parse(readFileSync(fileURLToPath(pkgUrl), 'utf-8')).version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

const LIST_LIMIT = 60

function json(result) {
  return { content: [{ type: 'text', text: JSON.stringify(result) }] }
}

async function main() {
  const catalog = loadCatalog(process.cwd())

  const server = new McpServer(
    { name: '@aziontech/webkit-mcp', version: serverVersion() },
    {
      instructions:
        'Azion webkit design system. For a whole screen (login, signup, settings, list, create, ' +
        'detail), call search_blocks, then get_block, and start from that SFC — never build ' +
        'the screen from scratch. For a single piece, use suggest_component and get_component. ' +
        'For a marketing band, suggest_component returns the page section to import.'
    }
  )

  const tool = (name, config, handler) => {
    if (typeof server.registerTool === 'function') {
      server.registerTool(name, config, handler)
    } else {
      server.tool(name, config.inputSchema ?? {}, handler)
    }
  }

  tool(
    'list_components',
    {
      title: 'List webkit components',
      description:
        'List every renderable @aziontech/webkit component (compact cards: name, category, ' +
        'surface, structure, import, tree-shakeable import, PascalCase binding). Optionally filter ' +
        'by category or by surface: "app" (console and apps), "site" (the azion.com site: ' +
        'sections, bands, brand assets) or "docs" (the documentation site). Returns ' +
        `${LIST_LIMIT} cards per page; pass the answer's \`nextCursor\` as \`cursor\` for the next page.`,
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe('Restrict to one category (e.g. "action", "data", "input", "feedback").'),
        surface: z
          .enum(['app', 'site', 'docs', 'edge'])
          .optional()
          .describe('Restrict to one surface. Console screens use "app" only.'),
        cursor: z
          .string()
          .optional()
          .describe('The `nextCursor` of the previous page. Omit for the first page.'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(300)
          .optional()
          .describe(`Cards per page (default ${LIST_LIMIT}).`)
      }
    },
    async ({ category, surface, cursor, limit }) =>
      json(listComponents(catalog, { category, surface, cursor, limit: limit ?? LIST_LIMIT }))
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
        '(variant over kind or appearance, severity over tone for colour meaning, status for job ' +
        'state, …); with a category ("primary", "bg", "text", "chart", "spacing", "shape", ' +
        '"typography", "animations", …) returns that group, and with a token name ("--bg-surface") ' +
        'that one token. Every semantic token carries its light and dark value (colours) or its ' +
        'value and breakpoints (lengths, type classes), and a one-line purpose: pick by purpose.',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Token group to expand (e.g. "primary", "bg", "chart", "spacing", "typography") or one token name (e.g. "--bg-surface"). Omit for the index.'
          )
      }
    },
    async ({ category }) => json(listTokens(catalog, { category }))
  )

  tool(
    'list_assets',
    {
      title: 'List webkit named assets',
      description:
        'The names a component accepts for its artwork, which live in registries and nowhere else: ' +
        'illustration scenes (Illustration name, section illustration), Diagram names, ' +
        'brand marks (Marquee marks, QuoteTabs / ClientQuotesSection mark) and icon classes with ' +
        'keywords. Without a kind, returns each kind with its count and the components that use it; ' +
        'with a kind, every valid name (filtered by query over name, label and keywords).',
      inputSchema: {
        kind: z
          .string()
          .optional()
          .describe('illustrations, diagrams, brandMarks or icons. Omit for the index.'),
        query: z
          .string()
          .optional()
          .describe('Words to filter by name, label or keyword (e.g. "ddos", "delete", "react").')
      }
    },
    async ({ kind, query }) => json(listAssets(catalog, { kind, query }))
  )

  tool(
    'get_component',
    {
      title: 'Get a webkit component API',
      description:
        'Full API for one component: purpose, when to use / when not to use, props, events, ' +
        'slots, sub-components, structure, compound-root info, runnable examples taken from its ' +
        'examples and the classes allowed on its tag. A deprecated part carries deprecated: true, its note ' +
        'and replacedBy; use the replacement. Returns fuzzy suggestions when the name is unknown.',
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
        'The import line for a component and its PascalCase binding. For a compound root it is the ' +
        '"<name>-root" import bound as <Name>Root (the root alone, no dot-notation parts), plus the ' +
        'compound import that dot-notation (<Name>.<Part>) needs.',
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
        query: z
          .string()
          .describe('Free-text query in en, pt-BR or es, e.g. "dropdown", "date picker", "botão".'),
        surface: z
          .enum(['app', 'site', 'docs', 'edge'])
          .optional()
          .describe('Restrict to one surface. Console screens use "app" only.')
      }
    },
    async ({ query, surface }) => json(searchComponents(catalog, query, { surface }))
  )

  tool(
    'suggest_component',
    {
      title: 'Suggest a webkit component for a need',
      description:
        'Given a plain-language need, suggest the single best-fitting component (plus runners-up) so ' +
        'the AI uses a real webkit component instead of reinventing one or reaching for another UI kit. ' +
        'When the need is a whole screen it returns the block first (recommendation "block"); ' +
        'for a marketing band it returns the page section (recommendation "section").',
      inputSchema: {
        need: z
          .string()
          .describe('What you are trying to build, e.g. "a searchable paginated table".'),
        surface: z
          .enum(['app', 'site', 'docs', 'edge'])
          .optional()
          .describe('Restrict to one surface. Console screens use "app" only.')
      }
    },
    async ({ need, surface }) => json(suggestComponent(catalog, need, { surface }))
  )

  tool(
    'search_blocks',
    {
      title: 'Search webkit blocks',
      description:
        'Find the reviewed block for an intent ("login", "sign up", "account settings", ' +
        '"delete dialog", "tela de login"). Blocks are whole screens built from WebKit ' +
        'components: start every screen from one. Returns ranked ids with a one-line summary, the ' +
        'first intents, components, skills, steps and `guidelinesSummary` (the job the screen ' +
        'serves); get_block has the detail. An empty query lists every block.',
      inputSchema: {
        query: z
          .string()
          .describe(
            'The screen you need, in plain words (en, pt-BR or es), e.g. "login page", "cadastro".'
          ),
        surface: z
          .enum(['app', 'site', 'docs', 'edge'])
          .optional()
          .describe('Restrict to one surface. Console screens use "app" only.'),
        fragments: z
          .boolean()
          .optional()
          .describe(
            'Fragments are cards dropped into a page, not screens. They are left out when the query asks for a page or screen; pass true to include them, false to never include them.'
          )
      }
    },
    async ({ query, surface, fragments }) =>
      json(searchBlocks(catalog, query, { surface, fragments }))
  )

  tool(
    'get_block',
    {
      title: 'Get a webkit block',
      description:
        'The whole block: a runnable SFC (script setup + template) with the webkit imports, the ' +
        'components it uses, the skills to follow, its steps, the other variants (states) of ' +
        "the same screen and its `guidelines` (when to use, building blocks, do and don't, copy, " +
        'accessibility). Read the guidelines, copy the SFC and change only the content. Pass ' +
        '`sections: ["guidelines"]` to read the guidelines first and fetch the SFC with ' +
        '`sections: ["sfc"]` after. A pre-v6 id (e.g. ' +
        '"platform/lists/table-view") resolves to its new block and carries a `note`.',
      inputSchema: {
        id: z.string().describe('Block id from search_blocks, e.g. "view/table-view".'),
        variant: z
          .string()
          .optional()
          .describe('A variant name from the block, e.g. "IncorrectCredentials".'),
        sections: z
          .array(z.enum(['sfc', 'guidelines']))
          .optional()
          .describe('Return only these heavy parts. Omit for both.')
      }
    },
    async ({ id, variant, sections }) => json(getBlock(catalog, id, { variant, sections }))
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
        'legacy UI-kit color). With `component`, also checks the classes against the layout utilities ' +
        'allowed on a webkit tag. Returns { ok, problems }.',
      inputSchema: {
        import: z
          .string()
          .optional()
          .describe('An import path to check, e.g. "@aziontech/webkit/button".'),
        classes: z
          .string()
          .optional()
          .describe('A class string to scan for forbidden hardcoded colors / raw utilities.'),
        component: z
          .string()
          .optional()
          .describe(
            `The webkit component the classes sit on (kebab-case). When set, any class outside the layout utilities (${LAYOUT_CLASS_FAMILIES.join(', ')}) is reported as a style override.`
          )
      }
    },
    async ({ import: importPath, classes, component }) =>
      json(validateUsage(catalog, { import: importPath, classes, component }))
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
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
