# Rule: compound API — composition first, props for data, names from anatomy

Composition (`structure: composition`) components in the webkit layer expose a **compound API**: every public sub-component is importable on its own **and** attached to the root for dot-notation (`<Table.Row>`, `<Paginator.Button>`). This rule fixes how that API is shaped, named, and typed so every composition component reads the same way.

It rests on three decisions, in priority order:

1. **Anatomy is elements, not props.** The structural parts of a component (where things go) are sub-components the consumer composes by hand. Props are for **bulk data** (the data-driven `data` + `columns` model) and **scalar configuration** (`maxHeight`, `paginated`, `pageSize`) — never for things that have the shape of a slot.
2. **Shared state flows through `provide`/`inject`,** surfaced as **context-aware sub-components** so the consumer wires nothing. `<Table.Search>` reads and drives the table's global filter through the injected context; it takes no `model-value` / `@update`.
3. **Names come from the component's own anatomy,** not from a convention copied between components. `<Table.SortButton>`, not `<Table.Trigger>`.

## The compound API shape

Each composition component ships an **`index.ts`** next to the root `.vue`. The root is the default export with the sub-components attached via `Object.assign`. Because it is a `.ts` file, `vue-tsc` generates the adjacent `index.d.ts` at build time — so `<Table.Row>` is fully typed.

```ts
// index.ts — one source of truth (runtime + the type vue-tsc derives from it).
import Table from './table.vue'
import TableRow from './table-row/table-row.vue'
import TableCell from './table-cell/table-cell.vue'
// ...one import per public sub-component

export default Object.assign(Table, {
  Row: TableRow,
  Cell: TableCell
  // ...
})
```

`Object.assign` returns `typeof Table & { Row: ..., Cell: ... }`, so the generated `index.d.ts` types `<Table.Row>` / `<Table.Cell>` with no manual annotation. **Do not hand-write `index.d.ts`** — `.d.ts` is gitignored (a build artifact); a hand-written one is never committed, and `vue-tsc` cannot derive types from a plain `index.js` (the package does not enable `allowJs`). The index must be `.ts`.

Both forms stay available to the consumer:

```vue
<script setup>
import Table from '@aziontech/webkit/data/table'        // compound — leads the docs
import TableRow from '@aziontech/webkit/data/table-row'  // standalone — for tree-shaking
</script>

<template>
  <Table>
    <Table.Header><Table.Row><Table.HeadCell>Name</Table.HeadCell></Table.Row></Table.Header>
  </Table>
</template>
```

The dot-notation **must** use a PascalCase root binding (`Table`). `table` (lowercase) collides with the native `<table>` element and will not resolve to the component.

## Wiring rules (package.json + exports)

- **Root local `package.json`** points at the `.ts` source (types at the generated `.d.ts`):
  ```json
  { "main": "./index.ts", "module": "./index.ts", "types": "./index.d.ts", "browser": { "./sfc": "./index.ts" }, "sideEffects": ["*.vue"] }
  ```
- **Root export** in `packages/webkit/package.json#exports` points the component's public path at `index.ts` (not the root `.vue`):
  ```json
  "./data/table": "./src/components/data/table/index.ts"
  ```
- **Sub-component exports stay flat and unchanged** — one entry per public sub-component pointing at its `.vue` (`"./data/table-row": ".../table-row/table-row.vue"`).
- **The package ships source and is consumed as source** (the exports map points at `./src/...`, and `.vue` files already import `.ts` such as `injection-key.ts`). A `.ts` index is therefore safe — the consumer's build transpiles it the same way it transpiles every `.vue` and the shared `injection-key.ts`. `.d.ts` files are gitignored; `build:dts` regenerates them.

## Naming — anatomy, not generic convention

The members of the compound mirror **that component's** real anatomy. Do not copy a part name from another component because it exists there.

| Concern | Correct | Wrong |
|---|---|---|
| A part that is structural | `Header`, `Body`, `Row`, `Cell` | — |
| A control that toggles state but opens nothing | `SortButton` (says what it does) | `Trigger` (it opens no `Content`) |
| A part that opens a paired overlay with `open`/`closed` + `aria-expanded` | `Trigger` + `Content` | naming it after the table/list it sits in |

`Trigger` / `Content` / `Portal` belong to **overlay / disclosure** components (dropdown, dialog, popover) — anything with `data-state="open|closed"`. A component with no open/close state has **no** `Trigger`. When a non-overlay component needs an overlay (row-action menu, filter popover), it **composes** the overlay component; the trigger comes from that overlay, not from the host's compound.

## Elements vs props — the anti-pattern

Anything slot-shaped stays a slot/sub-component; do not collapse it into a config array.

```vue
<!-- ✅ Compose real elements -->
<template #toolbar>
  <IconButton icon="pi pi-filter" />
  <Table.Search placeholder="Search" />
</template>

<!-- ❌ Config-array for UI — inextensible on the first customization -->
<Table :toolbar-actions="[{ icon: 'pi pi-filter' }, { type: 'search' }]" />
```

Repeated **data** is the one thing that earns props (`:data` + `:columns`) — hand-authoring N rows as elements is the wrong trade. That data-driven mode renders through the same sub-components (our markup / tokens / a11y); it does not bypass them.

## When a sub-component earns its existence

Interactivity alone does not justify a sub-component. A clickable row is `@click` fallthrough (or a `row-click` event in data-driven mode); a clickable cell is a `clickable` prop + composed content. A part becomes a sub-component only when it owns enough of its **own** markup, a11y, or state to stand alone (`SortButton`: glyph + three sort states + focus ring + touch target).

## Hard prohibitions

- Do not export composition sub-components without also attaching them to the root compound (`index.ts` via `Object.assign`).
- Do not make the index a plain `index.js` — `vue-tsc` cannot derive types from it (no `allowJs`), so `<Root.Part>` ends up untyped. It must be `index.ts`.
- Do not hand-write `index.d.ts` — it is gitignored and regenerated by `build:dts` from `index.ts`. Point the root `types` at the generated `index.d.ts`.
- Do not invent a `Trigger` (or any overlay part name) on a component that has no `data-state="open|closed"`.
- Do not turn a slot-shaped concern into a prop (config arrays of UI). Anatomy is elements; props are data + scalar config.
- Do not require the consumer to wire shared state by hand when a context-aware sub-component can read it from `inject`.

## Enforcement

- `scaffolder` emits `index.ts` for every `structure: composition` component and points the local `package.json` `main`/`module` at `index.ts`, `types` at the generated `index.d.ts` (see [`.claude/skills/component-scaffold/SKILL.md`](../skills/component-scaffold/SKILL.md)).
- The spec's `## Usage` block (composition) **leads with the compound dot-notation** form; the standalone imports are documented as the tree-shaking alternative. See [`.specs/_template.md`](../../.specs/_template.md).
- `validate-references.mjs` blocks any phantom `@aziontech/webkit/*` import; the standalone sub-component paths must exist in `packages/webkit/package.json#exports`.
- Sub-agent prompts inject this rule alongside [`no-invention.md`](./no-invention.md), [`styling.md`](./styling.md), [`dependencies.md`](./dependencies.md), and [`migration.md`](./migration.md). Any deviation surfaces as `BLOCKED:` and stops the run.
