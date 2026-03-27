# Azion Design System Documentation Platform

A product-grade documentation platform for the Azion Design System, built with Astro and Vue.

## Overview

This documentation platform serves as the central hub for the Azion Design System, providing:

- **Component Documentation**: Comprehensive docs for all Vue/Webkit components
- **Design Foundations**: Principles, tokens, and guidelines (color, typography, etc.)
- **Interactive Demos**: Live component previews with code examples
- **Playground**: Interactive component playground with prop controls
- **Search**: Full-text search over documentation (search index built at build time)
- **i18n**: Multilingual support (English and Portuguese) via `v1/en` and `v1/pt` content
- **Accessibility Guidelines**: WCAG compliance and keyboard/ARIA documentation

## Tech Stack

- **[Astro](https://astro.build/)** (v5): Static site generator with Islands architecture
- **[Vue 3](https://vuejs.org/)**: Interactive components via Astro integration
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling
- **MDX**: Markdown with JSX for rich content
- **Shiki**: Syntax highlighting for code blocks
- **PrimeVue** (theme): UI primitives where needed
- **@aziontech/webkit**: Design system components used in demos and playground

## Architecture

### Key Decisions

1. **Astro without Starlight**: Custom documentation platform for full control over layout, behavior, and components.

2. **Islands Architecture**: Vue components are hydrated selectively:
   - `client:load` for immediately interactive components
   - `client:visible` for below-fold content
   - `client:only` for heavy interactive features (e.g. playground, search)

3. **Content Collections**: Documentation is in Astro Content Collections with Zod schema validation. Content is organized by version and language: `src/content/v1/en` and `src/content/v1/pt`.

4. **Monorepo Integration**: The app consumes workspace packages: `@aziontech/icons`, `@aziontech/theme`, `@aziontech/webkit`.

5. **Build Pipeline**: Production build runs search index generation, component API extraction, and doc scaffolding before the Astro build.

### Directory Structure

```
apps/ds-docs/
├── scripts/                    # Build-time and tooling scripts
│   ├── build-search-index.ts   # Generates public/search-index.json
│   ├── extractComponentApi.ts  # Extracts props/slots/events from Vue/Webkit
│   ├── scaffoldComponentDocs.ts # Scaffolds/updates component MDX from webkit
│   ├── check-docs.ts           # Lint (links, rules, all)
│   ├── checkComponentDocs.ts   # Doc coverage checks
│   └── generateChangelog.ts   # Changelog generation
│
├── src/
│   ├── components/
│   │   ├── docs/               # Documentation UI (PageHeader, StatusBadge, etc.)
│   │   ├── demo/               # Demo wrappers (e.g. AzButton)
│   │   ├── playground/        # Playground Vue components and code generator
│   │   └── search/            # Search modal and engine
│   │
│   ├── content/
│   │   └── config.ts          # Content collection schemas (Zod)
│   │   └── v1/
│   │       ├── en/            # English: components/, foundations/, get-started/, etc.
│   │       └── pt/            # Portuguese (same structure)
│   │
│   ├── generated/             # Generated at build time (do not edit)
│   │   ├── component-api/     # Extracted API JSON per component
│   │   ├── component-props/   # Webkit component props (for playground)
│   │   └── playground-registry.ts
│   │
│   ├── layouts/               # BaseLayout, PatternPageLayout, etc.
│   ├── pages/                 # Astro routes (components/, foundations/, pt/, etc.)
│   ├── lib/                   # Utilities (content, docs, search)
│   ├── styles/                # global.css, primevue-theme.scss
│   └── integrations/         # Astro integration (e.g. search-index)
│
├── public/                    # Static assets (includes search-index.json after build)
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# From the monorepo root
pnpm install
```

### Development

```bash
# From monorepo root (if using pnpm workspaces)
pnpm --filter ds-docs run dev

# Or from this directory
cd apps/ds-docs && pnpm dev
```

### Build

The full build runs search index, API extraction, and scaffold steps, then Astro:

```bash
# From apps/ds-docs
pnpm build

# Preview production build
pnpm preview
```

Optional steps (usually run as part of `build`):

```bash
pnpm build:search    # Build search index only
pnpm build:api       # Extract component API from Vue/Webkit only
pnpm build:scaffold   # Scaffold/update component docs from webkit
pnpm build:scaffold:dry  # Dry run with verbose output
pnpm build:api:webkit   # Extract API from webkit core (../../packages/webkit/src/core)
```

### Deploy (Azion)

This app is configured for Azion (preset Astro). The monorepo uses **pnpm** and `workspace:*` dependencies; **do not** run `npm install` inside `apps/ds-docs` or the Azion CLI step that installs dependencies will fail.

**CI (GitHub Actions):** The workflow **Deploy Application using Azion CLI** (`.github/workflows/azion-deploy-ds-docs.yml` at repo root) runs on Linux. Add the secret `AZION_PERSONAL_TOKEN`, then run the workflow manually from the Actions tab (it must exist on the default branch to appear).

**Local deploy (Windows) — sem `azion build`:**

No Windows o `azion build` falha (paths com `\` nos polyfills e chunk do Astro). Use **apenas** o script que não chama o bundler da Azion:

1. Na **raiz do monorepo**: `pnpm install`
2. Instale o [Azion CLI](https://github.com/aziontech/cli) e faça login: `azion -t SEU_TOKEN` (ou `azion login`)
3. Em **apps/ds-docs**: **`pnpm run deploy:azion`** (faz: `pnpm build` → `manifest generate` → `azion deploy --local --skip-build --path dist`)

Se mesmo assim aparecer `[Azion] [Build]` e erros de "Syntax error n" / "Could not resolve chunk", o CLI pode estar ignorando `--skip-build` no preset Astro. Nesse caso:
- **Workaround:** rode o deploy no **WSL** (ex.: `wsl` e depois `pnpm run deploy:azion` no mesmo repo), ou
- Use o **GitHub Actions** (workflow "Deploy Application using Azion CLI") para publicar a partir do Linux.

**Local deploy (Linux / WSL / Mac):** Pode rodar `azion build` e em seguida `azion deploy --local --skip-build --path dist`; o preset Astro funciona nesses ambientes.

Replace `$BUCKET_NAME`, `$APPLICATION_NAME`, etc. in `azion.config.mjs` and `azion/azion.json` as needed for your Azion project.

### Lint & Checks

```bash
pnpm lint            # Lint docs (content rules)
pnpm lint:links      # Check internal/external links
pnpm lint:rules      # Lint rule files
pnpm lint:coverage   # Check component doc coverage
pnpm check           # Run all checks (lint + links + rules)
pnpm changelog       # Generate changelog
```

## Content Authoring

### Creating a Component Page

1. Create a new MDX file under `src/content/v1/en/components/` (and optionally `v1/pt/components/` for Portuguese):

```mdx
---
title: ComponentName
description: Brief description of the component.
type: component
category: form
status: stable
since: 1.0.0
figma: https://figma.com/...
storybook: https://storybook.azion.com/...
source: https://github.com/aziontech/webkit/...
apiFrom: ComponentName   # Optional: load API from generated/component-api/ComponentName.json
---

## Overview

Description of the component...

## Examples

<ComponentPreview title="Example title">
  <!-- Vue/HTML demo -->
</ComponentPreview>

## API

Props/slots/events can be written manually or loaded via `apiFrom` from extracted API.
```

2. The page will be available at `/components/[slug]` (and `/pt/components/[slug]` for PT).

### Frontmatter Schema

Required for component pages:

```yaml
title: string
description: string
type: component
```

Optional:

```yaml
category: form | navigation | feedback | data-display | layout | utility
status: stable | beta | deprecated | planned | experimental
since: string
deprecatedIn: string
figma: string
storybook: string
source: string
related: string[]
apiFrom: string      # Key for generated/component-api/<apiFrom>.json
navLabel: string
order: number
hidden: boolean
version: string      # default v1
language: string     # default en
```

Other content types (foundation, token, block, pattern, template, guide, icon, contributing, playground) use the same base schema with type-specific fields; see `src/content/config.ts`.

## Documentation Components

- **PageHeader**: Page title, status, and metadata links (Figma, Storybook, source).
- **StatusBadge**: Component status with semantic styling.
- **MetadataLinks**: Links to Figma, Storybook, source.
- **ComponentPreview / DemoPreview**: Renders demos with optional code.
- **CodeBlock**: Syntax-highlighted code with copy.
- **Playground**: Interactive playground with prop controls (see `components/playground/`).

## Path Aliases

Configured in `astro.config.mjs`:

- `@` → `src`
- `@components` → `src/components`
- `@layouts` → `src/layouts`
- `@lib` → `src/lib`

## Integration with Design System Packages

The app depends on:

```json
{
  "@aziontech/icons": "workspace:*",
  "@aziontech/theme": "workspace:*",
  "@aziontech/webkit": "workspace:*"
}
```

- **Icons**: Used across the docs and in demos.
- **Theme**: Tokens and SCSS partials (via `@theme-azion` alias) for PrimeVue theme.
- **Webkit**: Component demos, playground, and API extraction source.

## Future / Roadmap

- **Versioning**: Support for multiple doc versions (e.g. v1 vs v2) in the URL and nav.
- **Search**: Possible enhancements (filters, scoped search).
- **Playground**: More components registered and more control types.

See the `plans/` folder in the monorepo for architecture and migration docs.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
