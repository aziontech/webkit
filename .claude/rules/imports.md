# Rule: imports — flat public name, category in the folder only

Every webkit component is published under a **flat, single-segment public name**. The category (`feedback`, `content`, `inputs`, `data`, `actions`, …) organizes the **source folder** and the **docs site's navigation**, but it never appears in the public import path or the `package.json` export key.

## The rule

> The export is **flat**: `@aziontech/webkit/<name>`. **Never** with a category prefix (`@aziontech/webkit/feedback/skeleton`). The category lives in the folder (`src/components/<category>/<name>/`) and in the `title` of its `examples.json` (`Components/<Category>/<Name>`), not in the public name.

| Concern | Correct | Forbidden |
|---|---|---|
| `package.json#exports` key | `"./skeleton"` | `"./feedback/skeleton"` |
| `package.json#exports` value | `"./src/components/feedback/skeleton/skeleton.vue"` | — (folder keeps the category) |
| Consumer / example / spec import | `@aziontech/webkit/skeleton` | `@aziontech/webkit/feedback/skeleton` |
| Source folder | `src/components/feedback/skeleton/skeleton.vue` | `src/components/skeleton/skeleton.vue` |
| Examples folder | `packages/webkit/examples/skeleton/` | `packages/webkit/examples/feedback/skeleton/` |
| `examples.json` `title` | `Components/Feedback/Skeleton` | `Webkit/Feedback/Skeleton` |

## Why

- **Stable public surface.** Consumers import `@aziontech/webkit/skeleton`; moving a component between categories (e.g. `content` → `data`) is then an internal folder move, not a breaking import change.
- **One name per component.** A flat export key can't collide with a category segment and reads the same everywhere — export key, import, Code Connect.
- **Folder/tree still carry the category.** The source path (`src/components/<category>/<name>/`) and the examples `title` (`Components/<Category>/<Name>`) keep the taxonomy visible without leaking it into the import.

## What this means in practice

When adding or migrating a component named `<name>` in category `<category>`:

1. **Source** lives at `packages/webkit/src/components/<category>/<name>/<name>.vue`.
2. **Export** in `packages/webkit/package.json#exports` is the flat key:
   ```jsonc
   "./<name>": "./src/components/<category>/<name>/<name>.vue"
   ```
3. **Examples** live at `packages/webkit/examples/<name>/` (one `.vue` per example plus `examples.json` with `component: '<name>'` and `title: 'Components/<Category>/<PascalName>'`); the docs site and the visual suite pick them up from there.
4. **Every import** — in the examples, the spec's `## Usage` block, and any consumer — is `@aziontech/webkit/<name>`.

If the flat name is already taken by another component, that is a **naming** problem: rename the new component, do not fall back to a category-prefixed export. Emit `BLOCKED: export key "./<name>" already in use` and resolve the name before shipping.

## Marketing — primitives and page sections

The two marketing categories follow the flat rule like every other category; only their docs navigation is grouped under one `Marketing` node.

| Category | Source folder | Export / import | Examples `title` |
|---|---|---|---|
| `marketing` (building blocks) | `src/components/marketing/<name>/` | `"./<name>"` · `@aziontech/webkit/<name>` | `Components/Marketing/Primitives/<Pascal>` |
| `sections` (page sections) | `src/components/sections/<name>/` | `"./<name>"` · `@aziontech/webkit/<name>` | `Components/Marketing/Sections/<Pascal>` |

- A page section's `<name>` is the `_id` the marketing site writes in a page's `sections[]` JSON, so the `_id` and the import subpath are the same string (see [`SECTIONS.md`](../docs/SECTIONS.md)).
- The `<name>` is unique across every category (`.specs/<name>.md` is a flat folder): `sections/use-cases` and a future `content/use-cases` cannot coexist.

## Migration note

Components authored before this convention (or branched from an older layout) may carry `@aziontech/webkit/<category>/<name>` imports or a `Webkit/…` examples title. When touching such a component, bring it to this rule: flatten the export key and retitle the examples to `Components/…`. See [`migration.md`](./migration.md).

## Enforcement

- `validate-references.mjs` already rejects imports of any `@aziontech/webkit/*` path absent from `packages/webkit/package.json#exports` — a category-prefixed import therefore fails once the export key is flat.
- `catalog.json` is built from the exports and the examples (`node scripts/build-catalog.mjs`); the catalog drift gate fails when they disagree.
- Keep the export list and the examples consistent with this rule; a prefixed export key (`"./feedback/skeleton"`, `"./sections/use-cases"`) is a review-blocking deviation.
