# Rule: importing from @aziontech/ui

Every component — marketing page sections included — has one flat, single-segment import path. Get the path right and the binding name follows from it.

## Do

- Import from the flat path: `import Button from '@aziontech/ui/button'`.
- Name the binding in PascalCase matching the last path segment: `@aziontech/ui/empty-state` -> `EmptyState`, `@aziontech/ui/icon-button` -> `IconButton`.
- Import each component you use on its own line, from its own subpath.
- Import a marketing page section the same way: `import PricingPlansSection from '@aziontech/ui/pricing-plans-section'` — the subpath equals the section's `_id` in the site JSON; see `azion-ui-sections`.

## Don't

- Do not prefix with a category. Never `@aziontech/ui/feedback/skeleton` — the category lives in the folder, not the import.
- Do not import from `/src/`. Never `@aziontech/ui/src/components/...`.
- Do not reach into deep internals or a component's private files.
- Do not use a bare-package barrel: never `import { Button } from '@aziontech/ui'`. There is no barrel entry — it breaks tree-shaking and will not resolve.
- Do not let the binding disagree with the subpath: `import Chip from '@aziontech/ui/chips'` is wrong (singular binding, plural path). Pick the real path; match the binding to it.

## Example

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
</script>
```

## How to find the real path

The published subpaths are listed in `node_modules/@aziontech/ui/catalog.json` (the `imports` object). If a path is not there, it does not exist — do not guess. Ask the Azion UI MCP (`suggest_component`) or grep the catalog.
