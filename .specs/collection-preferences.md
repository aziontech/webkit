---
name: collection-preferences
category: data
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 5308e6cccf584eac24abb034229480966a8651362a736e29dc3ef28e57ed81b4
created: 2026-11-11
last_updated: 2026-11-11
---

# CollectionPreferences — Component Spec

## Purpose

The preferences panel of a collection, after Cloudscape's collection preferences: a cog button opens a dialog (or a drawer) with the page size, the columns (shown, hidden and ordered; a locked column always shows), wrapped lines, striped rows and density. Changes are a draft until Confirm; Cancel, `Esc` and the close button discard them. It holds no saved state itself: `useCollection` saves the confirmed value in `localStorage` and `preferencesProps` binds the value, the columns and the page sizes in one `v-bind`.

## When to use

- A table or card collection whose people choose how many items a page shows and which fields they see.
- Any collection driven by `useCollection`, which saves the result per collection.

## When NOT to use

- A single column-visibility toggle inside a table toolbar → use `table-column-selector`.
- Settings of the resource itself (not of how the list shows it) → use a form page or `dialog`.

## Related

- `use-collection` — saves the preferences; `preferencesProps` is the binding.
- `table` — takes `density`, `wrapLines`, `striped`, the visible columns and their order.
- `cards` — takes the page size and the visible fields.
- `property-filter` — sits beside it in the controls row.

## Best practices

- Lock the column that names the item (`locked: true`): a row without its name is unreadable.
- Show only the sections the collection uses (`sections`): cards have no striped rows.
- Keep the trigger at the end of the controls row, after Refresh and Download.

## Usage

```vue
<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { ref } from 'vue'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'status', label: 'Status' }
  ]
  const preferences = ref({ pageSize: 25 })
</script>

<template>
  <CollectionPreferences
    v-model:preferences="preferences"
    :columns="columns"
    :page-size-options="[10, 25, 50]"
  />
</template>
```

## Props

| Prop              | Type                                                                        | Default                                                      | Required | JSDoc                                                                    |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------------------ |
| `preferences`     | `CollectionPreferencesValue`                                                | `{}`                                                         | false    | The saved preferences. Supports v-model:preferences; changes apply on Confirm. |
| `columns`         | `CollectionPreferencesColumn[]`                                             | `[]`                                                         | false    | Columns to show, hide and order. Empty hides the columns section.        |
| `pageSizeOptions` | `number[]`                                                                  | `[]`                                                         | false    | Page sizes offered. Empty hides the page size section.                   |
| `sections`        | `CollectionPreferencesSection[]`                                            | `['page-size', 'columns', 'wrap-lines', 'striped', 'density']` | false  | Sections the panel shows, in this order.                                 |
| `container`       | `'dialog' \| 'drawer'`                                                      | `'dialog'`                                                   | false    | Opens in a centered dialog or a side drawer.                             |
| `title`           | `string`                                                                    | `''`                                                         | false    | Panel title and trigger label. Empty uses the locale catalog.            |
| `disabled`        | `boolean`                                                                   | `false`                                                      | false    | Disables the trigger.                                                    |

Types: `CollectionPreferencesValue = { pageSize?: number; columns?: { id: string; visible: boolean }[]; wrapLines?: boolean; striped?: boolean; density?: 'comfortable' | 'compact' }`; `CollectionPreferencesColumn = { id: string; label: string; locked?: boolean }`; `CollectionPreferencesSection = 'page-size' | 'columns' | 'wrap-lines' | 'striped' | 'density'`.

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether the panel is open; the trigger, Confirm, Cancel, the close button and `Esc` update it.
- **`v-model:preferences`** — `CollectionPreferencesValue`. Emitted on Confirm with the sections shown.

## Events

| Event                 | Payload                      | Notes                                         |
| --------------------- | ---------------------------- | --------------------------------------------- |
| `update:preferences`  | `CollectionPreferencesValue` | Confirm was activated.                        |
| `confirm`             | `CollectionPreferencesValue` | Same value, for a handler that is not a model. |
| `cancel`              | `void`                       | Cancel was activated; the draft is discarded. |

## Slots

| Slot      | Scope                  | Notes                                                   |
| --------- | ---------------------- | ------------------------------------------------------- |
| `trigger` | `{ open: () => void }` | Replaces the cog button; call `open` to open the panel. |

## States

- Visual states: `closed`, `open`; the trigger reflects `disabled`
- `data-state` on the root: `open` | `closed`
- Move up is disabled on the first column, move down on the last; a locked column's switch is disabled and on

## Motion & Animations

_none_ — the open and close motion is owned by `dialog` and `drawer`.

## Tokens

| Region        | Token (DESIGN.md)        |
| ------------- | ------------------------ |
| section gap   | `var(--spacing-lg)`      |
| row gap       | `var(--spacing-xs)`      |
| column border | `var(--border-default)`  |
| muted text    | `var(--text-muted)`      |
| shape         | `var(--shape-elements)`  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the buttons, switches, radios and the toggle group.
- Keyboard map: `Enter`/`Space` on the trigger opens; `Tab` is trapped in the panel; `Esc` closes; focus returns to the trigger on close; after a move, focus stays on the moved column's button.
- ARIA: the trigger has `aria-haspopup="dialog"` and `aria-expanded`; the panel is a dialog named by its title; the page size and the columns are `fieldset`s with a `legend`; each move button is named `Move <column> up|down`; the density group is labelled by its heading.
- Columns reorder with buttons, never by drag only (WCAG 2.5.7).
- Contrast ≥4.5:1 from the semantic text tokens.

## Internationalization

| Key                                          | English source                               | Override prop |
| -------------------------------------------- | -------------------------------------------- | ------------- |
| `collectionPreferences.title`                | Preferences                                  | `title`       |
| `collectionPreferences.confirm` / `cancel`   | Confirm / Cancel                             | —             |
| `collectionPreferences.pageSize`             | Page size                                    | —             |
| `collectionPreferences.pageSizeOption`       | {count} item / {count} items (plural)        | —             |
| `collectionPreferences.columns`              | Columns                                      | —             |
| `collectionPreferences.columnsDescription`   | Choose which columns show, and their order.  | —             |
| `collectionPreferences.alwaysShown`          | Always shown                                 | —             |
| `collectionPreferences.moveUp` / `moveDown`  | Move {column} up / Move {column} down        | —             |
| `collectionPreferences.wrapLines` (+ `Description`) | Wrap lines / Show the whole text of every cell. | —     |
| `collectionPreferences.striped` (+ `Description`)   | Striped rows / Shade every other row.    | —             |
| `collectionPreferences.density`, `comfortable`, `compact` | Density, Comfortable, Compact       | —             |

- Formatting: page sizes go through the plural rules and number format of the active locale.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`); the drawer opens from its own side logic.
- Icons: the up and down arrows are vertical and not mirrored; the cog is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: column labels are plain text; none.

## Responsive

- Container queries: `@container/preferences` on the sections and `@container/preferences-actions` on the footer (`@md`: buttons side by side).
- Narrow (≤ 640 px or a narrow container): the dialog becomes a bottom sheet (from `dialog`), the footer buttons stack at full width.
- Touch: radios and column rows are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long column labels truncate.

## Performance

- Bundle budget: 32 KB gzip for `./collection-preferences` (it carries `dialog` and `drawer`) in `.size-limit.json`.
- Runtime budget: none: the panel renders only while open.
- Heavy parts: none.

## Stories (Storybook)

- Default — every section in a dialog.
- InADrawer — `container="drawer"`, two sections and the `trigger` slot; justified because the container and the slot change the anatomy.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
