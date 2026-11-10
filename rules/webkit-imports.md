# Rule: importing from @aziontech/webkit

Every component has one flat import path: a single segment for components, and `sections/<name>` for the marketing page sections. Get the path right and the binding name follows from it.

## Do

- Import from the flat path: `import Button from '@aziontech/webkit/button'`.
- Name the binding in PascalCase matching the last path segment: `@aziontech/webkit/empty-state` -> `EmptyState`, `@aziontech/webkit/mini-button` -> `MiniButton`.
- Import each component you use on its own line, from its own subpath.
- Import a marketing page section from its section path: `import PricingPlans from '@aziontech/webkit/sections/pricing-plans'` (binding = last segment). It is the only two-segment family; see `webkit-sections`.

## Do not

- Do not prefix with a category. Never `@aziontech/webkit/feedback/skeleton` — the category lives in the folder, not the import. `sections/` is not a category prefix: it is part of every section's published path.
- Do not import from `/src/`. Never `@aziontech/webkit/src/components/...`.
- Do not reach into deep internals or a component's private files.
- Do not use a bare-package barrel: never `import { Button } from '@aziontech/webkit'`. There is no barrel entry — it breaks tree-shaking and will not resolve.
- Do not let the binding disagree with the subpath: `import Chip from '@aziontech/webkit/chips'` is wrong (singular binding, plural path). Pick the real path; match the binding to it.

## Correct

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
</script>
```

## How to find the real path

The published subpaths are listed in `node_modules/@aziontech/webkit/catalog.json` (the `imports` object). If a path is not there, it does not exist — do not guess. Ask the webkit MCP (`suggest_component`) or grep the catalog.
