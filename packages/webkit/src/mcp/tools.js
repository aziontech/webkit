// The webkit-mcp tool table: every tool's name, description, zod input shape and
// handler, registered on an McpServer. Kept apart from server.js (which owns the
// SDK import + stdio transport) so the registration is testable with a stub server.

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

/** Wrap a plain-JSON result as an MCP tool response. */
export function json(result) {
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
}

/**
 * Register every webkit tool on `server`, answering from `catalog`. `z` is the zod
 * module the server loaded (its raw shapes become each tool's input schema).
 */
export function registerTools(server, z, catalog) {
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
        'structure, spec status, deprecated / replacedBy, import, tree-shakeable import, PascalCase ' +
        'binding). Every listed component is published; `status` is its spec lifecycle ' +
        '(draft / approved / implemented), not availability. Optionally filter by category.',
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
        '"text", "spacing", "radius", "shadow", …) returns that group\'s CSS custom properties; ' +
        '"animations" (alias "motion") returns each animate-* class with its timing and use-when.',
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
        'Full API for one component: props, events, slots, sub-components, structure, ' +
        'compound-root info, and deprecated / replacedBy (use the replacement when deprecated). ' +
        'Returns fuzzy suggestions when the name is unknown.',
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
        'the AI uses a real webkit component instead of reinventing one or reaching for PrimeVue. ' +
        'Deprecated components rank last and name their replacement.',
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
}
