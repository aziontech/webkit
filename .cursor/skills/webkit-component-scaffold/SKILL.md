---
name: webkit-component-scaffold
description: Scaffolds webkit component docs (MDX, API, playground registry) and fills Playground previews with example data. Use when scaffolding or updating component documentation, adding new webkit components to ds-docs, or when previews (dropdown, checkbox, selector, etc.) need placeholder, description, or options filled so they do not render empty.
---

# Webkit Component Scaffold with Preview Examples

## Quick start

From repo root, run the full pipeline (scaffold + preview examples):

```bash
cd apps/ds-docs && pnpm build:scaffold:full
```

This:

1. Discovers components in `packages/webkit/src/core` and `packages/webkit/src/components`
2. Extracts API (props, events, slots) via `scripts/extractComponentApi.ts`
3. Writes `src/generated/component-api/<slug>.json` and `src/generated/component-props/<slug>.json`
4. Scaffolds `src/content/v1/{en,pt}/components/<slug>.mdx` (skipped if exists unless `--force`)
5. Generates `src/generated/playground-registry.ts`
6. Patches component-props JSON with example defaults so previews show labels, placeholders, descriptions, and options

Scaffold only (no preview examples):

```bash
cd apps/ds-docs && pnpm build:scaffold
```

Preview examples only (after scaffold already ran):

```bash
cd apps/ds-docs && pnpm build:preview-examples
```

## Adding a new component

1. Add the Vue component under `packages/webkit/src/core` or `packages/webkit/src/components` (one folder per component, with an `index.vue` or named `.vue` file).
2. Ensure the package export exists in `packages/webkit/package.json` for that path.
3. Run from `apps/ds-docs`: `pnpm build:scaffold:full`.
4. If the new component has props that still render empty, extend example data (see below).

## Extending example data

Example defaults are applied by `scripts/generatePreviewExamples.ts`.

**Prop name heuristics** — Apply to any component when the prop has an empty default:

| Prop name | Example value |
|-----------|----------------|
| `label` | `"Label"` |
| `placeholder` | `"Type here..."` |
| `description` | `"Brief description of the field."` |
| `title` | `"Title"` |
| `subtitle` | `"Subtitle"` |
| `helpText` | `"This is a help text."` |
| `nameField` | `"example-field"` |
| `nameId` | `"example-id"` |
| `emptyMessage` | `"No available options"` |
| `emptyFilterMessage` | `"No results found"` |
| `optionLabel` | `"label"` |
| `optionValue` | `"value"` |
| `icon` | `"pi pi-box"` (PrimeVue icon class for icon prop/slot) |

To add a new heuristic: edit `PROP_NAME_EXAMPLES` in `apps/ds-docs/scripts/generatePreviewExamples.ts`.

**Component-specific overrides** — For a given slug, force specific prop values (e.g. dropdown `options` as JSON array):

Edit `COMPONENT_SPECIFIC_OVERRIDES` in the same script. Keys are slugs (e.g. `form-field-dropdown`), values are `{ propName: exampleValue }`. Use JSON strings for array/object props, e.g. `options: '[{"label":"Option A","value":"a"}]'`.

After editing, run `pnpm build:preview-examples` from `apps/ds-docs`.

## Manual overrides

To fully control props for a component without running the example generator:

1. Create `apps/ds-docs/src/generated/component-props-overrides/<slug>.json`.
2. Copy the structure from `src/generated/component-props/<slug>.json` and set the desired `default` (and any other fields) per prop.
3. Run `pnpm build:scaffold` (not `build:scaffold:full`). The scaffold copies overrides on top of the props directory; the preview-examples script then still runs if you use `build:scaffold:full`, so prefer override files for one-off fixes and extend `generatePreviewExamples.ts` for reusable patterns.

## Scripts reference

| Script | Command | Purpose |
|--------|---------|---------|
| Full pipeline | `pnpm build:scaffold:full` | Scaffold + patch preview examples |
| Scaffold only | `pnpm build:scaffold` | API extraction, props JSON, MDX, registry |
| Preview examples only | `pnpm build:preview-examples` | Patch existing component-props JSON |
| Dry run (scaffold) | `pnpm build:scaffold:dry` | Scaffold with `--dry-run --verbose` |

Preview examples script flags: `--dry-run`, `--verbose` (or `-v`).
