# Rule: imports — flat public name, category in the folder only

Every webkit component is published under a **flat, single-segment public name**. The category (`feedback`, `content`, `inputs`, `data`, `actions`, …) organizes the **source folder** and the **Storybook tree**, but it never appears in the public import path or the `package.json` export key.

## The rule

> The export is **flat**: `@aziontech/webkit/<name>`. **Never** with a category prefix (`@aziontech/webkit/feedback/skeleton`). The category lives in the folder (`src/components/<category>/<name>/`) and in the story title (`Components/<Category>/<Name>`), not in the public name.

| Concern | Correct | Forbidden |
|---|---|---|
| `package.json#exports` key | `"./skeleton"` | `"./feedback/skeleton"` |
| `package.json#exports` value | `"./src/components/feedback/skeleton/skeleton.vue"` | — (folder keeps the category) |
| Consumer / story / spec import | `@aziontech/webkit/skeleton` | `@aziontech/webkit/feedback/skeleton` |
| Source folder | `src/components/feedback/skeleton/skeleton.vue` | `src/components/skeleton/skeleton.vue` |
| Story file location | `apps/storybook/src/stories/components/feedback/skeleton/Skeleton.stories.js` | `apps/storybook/src/stories/webkit/feedback/skeleton/…` |
| Story `title` | `Components/Feedback/Skeleton` | `Webkit/Feedback/Skeleton` |

## Why

- **Stable public surface.** Consumers import `@aziontech/webkit/skeleton`; moving a component between categories (e.g. `content` → `data`) is then an internal folder move, not a breaking import change.
- **One name per component.** A flat export key can't collide with a category segment and reads the same everywhere — export key, import, Code Connect.
- **Folder/tree still carry the category.** The source path (`src/components/<category>/<name>/`) and the Storybook title (`Components/<Category>/<Name>`) keep the taxonomy visible without leaking it into the import.

## What this means in practice

When adding or migrating a component named `<name>` in category `<category>`:

1. **Source** lives at `packages/webkit/src/components/<category>/<name>/<name>.vue` with its local `package.json`.
2. **Export** in `packages/webkit/package.json#exports` is the flat key:
   ```jsonc
   "./<name>": "./src/components/<category>/<name>/<name>.vue"
   ```
3. **Story** lives at `apps/storybook/src/stories/components/<category>/<name>/<PascalName>.stories.js` and sets `title: 'Components/<Category>/<PascalName>'`.
4. **Every import** — in the story, the spec's `## Usage` block, and any consumer — is `@aziontech/webkit/<name>`.

If the flat name is already taken by another component, that is a **naming** problem: rename the new component, do not fall back to a category-prefixed export. Emit `BLOCKED: export key "./<name>" already in use` and resolve the name before shipping.

## Migration note

Components authored before this convention (or branched from an older layout) may carry `@aziontech/webkit/<category>/<name>` imports, a `Webkit/…` story title, or a story under `stories/webkit/…`. When touching such a component, bring it to this rule: flatten the export key, retitle the story to `Components/…`, and move the story under `stories/components/…`. See [`migration.md`](./migration.md).

## Enforcement

- `validate-references.mjs` already rejects imports of any `@aziontech/webkit/*` path absent from `packages/webkit/package.json#exports` — a category-prefixed import therefore fails once the export key is flat.
- The [`storybook-write`](../skills/storybook-write/SKILL.md) skill emits flat imports, `Components/<Category>/<PascalName>` titles, and `stories/components/<category>/…` locations by default.
- Keep the export list and the story tree consistent with this rule; a prefixed export key (`"./feedback/skeleton"`) is a review-blocking deviation.
