## @aziontech/webkit design system

This project uses the Azion design system. When building or reviewing UI:

- Reach for an `@aziontech/webkit` component before writing custom UI. Find components via the `webkit` MCP (`suggest_component`) or `node_modules/@aziontech/webkit/catalog.json`.
- Import flat: `import Button from '@aziontech/webkit/button'` (PascalCase binding matching the subpath). Never category-prefixed, `/src/`, deep-internal, or a bare-package barrel.
- Style with `@aziontech/theme` tokens (`var(--primary)`, `var(--spacing-4)`, `text-button-lg`) — never hex, `rgb`, `hsl`, or raw Tailwind palette.
- Keep bundles small: prefer the `<name>-root` path (or specific sub-components) over the full compound, import icons individually, and lazy-load heavy overlays.

Details live in `.claude/rules/webkit-*.md` and the `webkit-usage` skill. Specialist agents: `webkit-expert` (which component + how), `webkit-adopter` (the init/adoption flow), `webkit-reviewer` (review a diff).
