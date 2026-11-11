---
name: attribute-editor
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 4bc69a1c6450d29c5012f48f2efb0e67e97dd3f5b1b1b84e77b607b380fef71f
created: 2026-11-11
last_updated: 2026-11-11
---

# AttributeEditor — Component Spec

## Purpose

An editable list of rows with the same fields, after Cloudscape's attribute editor: key and value pairs (environment variables, headers, metadata) or any set of columns given by a `definition`. It owns the row anatomy every hand-built editor repeats: a label per cell, one control per cell, a per-cell error under the field, Add and Remove, an item limit, the empty text, focus after add and remove, and a polite announcement of each change. A grouped mode lays rows out as AND groups joined by OR, the shape of rule criteria. It edits an array and validates nothing itself: the consumer passes `errors`.

## When to use

- Users add, edit and remove a variable number of pairs or tuples: environment variables, request headers, query arguments, labels, metadata.
- Rule criteria: conditions inside a group must all match (and), groups are alternatives (or).
- A bulk form where each row has the same two to four fields and a row-level error can occur.

## When NOT to use

- Key and value tags with limits, reserved prefixes and removal of saved tags → use `tag-editor`, which is built on this component.
- A fixed set of named settings on one resource → use `field` controls in a form.
- Many records the user browses, filters and acts on → use `table` with row actions.
- An ordered list of actions with drag and drop and per-type arguments → compose it by hand as in the `platform/edit/rule-builder` block.

## Related

- `tag-editor` — key and value tags with limits and validation, on top of AttributeEditor.
- `field` — every cell is a `Field` with its label, control and error.
- `input` — the default control of a cell; any control can replace it through `cell-<key>`.
- `button`, `icon-button` — Add and Remove.
- `separator` — the "or" between groups in grouped mode.
- `platform/edit/rule-builder` (block) — its criteria are this component in grouped mode (AND rows inside a group, OR between groups), with a `Combobox` variable cell.

## Best practices

- Keep two to four columns; more columns belong in a drawer per row.
- Pass `errors` only after the first Save (rule of the form-error block), then keep them live while the user fixes the rows.
- Use `minItems: 1` when the form needs at least one row, so the last row keeps its fields and loses its Remove.
- Set `limit` when the backend has one; the component says how many rows are left and disables Add at the limit.
- Replace a cell's control through `cell-<key>` (a `Select` for an operator, a `Switch` for secret) instead of drawing rows by hand; use `row` only when the row needs a layout of its own.
- Name the editor (`ariaLabel`) after what the rows are: "Environment variables", "Request headers".

## Usage

```vue
<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import { computed, ref } from 'vue'

  const definition = [
    { key: 'key', label: 'Key', placeholder: 'MY_VARIABLE', required: true },
    { key: 'value', label: 'Value', placeholder: 'my-value' }
  ]
  const items = ref([{ key: 'API_URL', value: 'https://api.example.com' }])
  const errors = computed(() =>
    items.value.map((item) => (item.key ? undefined : { key: 'Key is required.' }))
  )
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :errors="errors"
    :limit="10"
    add-button-label="Add variable"
    aria-label="Environment variables"
  />
</template>
```

## Props

| Prop                | Type                                     | Default     | Required | JSDoc                                                                                                        |
| ------------------- | ---------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `items`             | `AttributeEditorItem[]`                  | `[]`        | false    | Rows in list mode. Supports v-model:items.                                                                   |
| `groups`            | `AttributeEditorItem[][]`                | `undefined` | false    | Rows in grouped mode: every inner array is an AND group, groups are joined by OR. Supports v-model:groups.   |
| `definition`        | `AttributeEditorColumn[]`                | `[]`        | false    | Columns of every row: key of the item field, label, placeholder, required.                                   |
| `errors`            | `AttributeEditorErrors`                  | `[]`        | false    | Error per cell, aligned with the rows (nested per group in grouped mode). Empty shows none.                  |
| `addButtonLabel`    | `string`                                 | `''`        | false    | Label of the Add button. Empty uses the locale catalog.                                                      |
| `removeButtonLabel` | `string`                                 | `''`        | false    | Accessible name of the Remove button, followed by the row number. Empty uses the locale catalog.             |
| `addGroupLabel`     | `string`                                 | `''`        | false    | Label of the Add group button in grouped mode. Empty uses the locale catalog.                                |
| `empty`             | `string`                                 | `''`        | false    | Text shown when there are no rows. Empty uses the locale catalog.                                            |
| `limit`             | `number`                                 | `undefined` | false    | Most rows allowed (per group in grouped mode); Add is disabled at the limit and the rows left are announced. |
| `groupLimit`        | `number`                                 | `undefined` | false    | Most groups allowed in grouped mode.                                                                         |
| `minItems`          | `number`                                 | `0`         | false    | Fewest rows kept; rows at the minimum lose their Remove button.                                              |
| `newItem`           | `() => AttributeEditorItem`              | `undefined` | false    | Builds a new row. Unset creates an item with an empty string per column key.                                 |
| `itemRemovable`   | `(item: AttributeEditorItem) => boolean` | `undefined` | false    | Hides Remove on the rows it returns false for. Unset makes every row removable.                              |
| `size`              | `'small' \| 'medium' \| 'large'`         | `'medium'`  | false    | Size of the default controls and the Remove button, on the 28 / 32 / 40 rhythm.                              |
| `disabled`          | `boolean`                                | `false`     | false    | Disables every control, Add and Remove.                                                                      |
| `addDisabled`       | `boolean`                                | `false`     | false    | Disables Add only, for example until the last row is filled in.                                              |
| `ariaLabel`         | `string`                                 | `''`        | false    | Accessible name of the list of rows.                                                                         |

Types: `AttributeEditorItem = Record<string, unknown>`; `AttributeEditorColumn = { key: string; label: string; placeholder?: string; required?: boolean }`; `AttributeEditorRowErrors = Record<string, string | undefined>`; `AttributeEditorErrors = (AttributeEditorRowErrors | undefined)[] | (AttributeEditorRowErrors | undefined)[][]`.

## Events

| Event           | Payload                                                             | Notes                                                        |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `update:items`  | `AttributeEditorItem[]`                                             | A row was added, removed or edited in list mode.             |
| `update:groups` | `AttributeEditorItem[][]`                                           | A row or group was added, removed or edited in grouped mode. |
| `add`           | `{ index: number; groupIndex?: number }`                            | After a row is added; `groupIndex` only in grouped mode.     |
| `remove`        | `{ index: number; item: AttributeEditorItem; groupIndex?: number }` | After a row is removed.                                      |

## Slots

| Slot          | Scope                                                                         | Notes                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `row`         | `{ item, index, groupIndex, errors, update, remove, removable, removeLabel }` | Replaces the whole row; the column header is not drawn.                                                                     |
| `row-actions` | `{ item, index, groupIndex, remove, removable, removeLabel }`                 | Replaces the Remove button at the end of a default row (for example Remove / Undo that marks a row instead of deleting it). |
| `empty`       | —                                                                             | Replaces the empty text.                                                                                                    |
| `actions`     | —                                                                             | Extra buttons after Add (for example Upload or Paste .env).                                                                 |
| `info`        | —                                                                             | Extra help text under the buttons, after the limit text.                                                                    |
| `limit`       | `{ count, limit, left }`                                                      | Replaces the limit text in list mode (for example "You can add 3 more tags.").                                              |

Dynamic slot `cell-<key>` (scope `{ item, index, groupIndex, value, update, invalid }`): replaces the default `Input` of one column; the control sits inside the cell's `Field`.

## States

- Visual states: `default`, `empty`, `at limit` (Add disabled), `invalid` (per cell), `disabled`
- `data-size` mirrors `size`; `data-disabled` mirrors `disabled`; `data-mode` is `list` or `grouped`
- Each row carries `data-row` with its index (and `data-group` in grouped mode)

## Motion & Animations

_none_

Rows appear and leave without animation; the controls keep their own transitions.

## Tokens

| Region                        | Token (DESIGN.md)                                               |
| ----------------------------- | --------------------------------------------------------------- |
| column header                 | `.text-label-sm`, `var(--text-default)`                         |
| empty text, limit text, joins | `.text-body-sm`, `var(--text-muted)`                            |
| row separator when stacked    | `var(--border-muted)`                                           |
| group surface                 | `var(--bg-surface)`, `var(--border-muted)`, `var(--shape-card)` |
| gaps                          | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)`   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every control and button keeps its own ring.
- Keyboard map: Tab moves through the cells of a row, its Remove, then the next row; Add moves focus to the first control of the new row; Remove moves focus to the same position in the next row, else the previous row, else Add.
- ARIA: the rows are a `list` named by `ariaLabel`; each cell is a `Field` whose label is programmatically tied to its control (visually hidden on wide containers, where one header row shows the labels and is `aria-hidden`); an error is a `FieldError` referenced by `aria-describedby` and sets `aria-invalid`; each Remove is named "Remove item n" (or `removeButtonLabel` n); groups are `group`s named "Group n"; a polite `status` region announces "Item n added" and "Item n removed".
- Contrast ≥4.5:1 from the semantic text tokens, including the disabled state.
- Touch target: Remove follows `size` (40 px at `large`); the stacked layout keeps it at the row's end.

## Internationalization

| Key                            | English source                               | Override prop       |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `attributeEditor.add`          | Add new item                                 | `addButtonLabel`    |
| `attributeEditor.remove`       | Remove item                                  | `removeButtonLabel` |
| `attributeEditor.rowAction`    | {label} {index}                              | —                   |
| `attributeEditor.addGroup`     | Add OR group                                 | `addGroupLabel`     |
| `attributeEditor.empty`        | No items yet.                                | `empty`             |
| `attributeEditor.remaining`    | You can add {count} more item(s) (plural)    | —                   |
| `attributeEditor.limitReached` | You have reached the limit of {limit} items. | —                   |
| `attributeEditor.added`        | Item {index} added.                          | —                   |
| `attributeEditor.removed`      | Item {index} removed.                        | —                   |
| `attributeEditor.group`        | Group {index}                                | —                   |
| `attributeEditor.and` / `or`   | and / or                                     | —                   |

- Formatting: the rows left go through the plural rules of the active locale.

## Right-to-left

- Layout: logical utilities only; the Remove column sits at the inline end.
- Icons: the trash and plus glyphs are not mirrored.
- Keyboard: no arrow-key handling of its own.
- User data: values stay in their controls, which set no direction of their own.

## Responsive

- Container queries: `@container/attribute-editor` on the root; at `@md` (448 px) the cells sit in one grid row under a shared header, below it every cell stacks with its own visible label and rows are divided by a line.
- Narrow (≤ 640 px or a narrow container): stacked cells, Remove at the end of the row.
- Touch: buttons follow `size`; nothing depends on hover (the Remove tooltip repeats its accessible name).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: see `.size-limit.json` entry `attribute-editor` (it carries `input`, `field`, `button`, `icon-button`, `tooltip` and `separator`).
- Runtime budget: 100 rows render and update under one frame per keystroke (one row re-renders per edit).
- Heavy parts: none.

## Examples

- Default — key and value rows with an error and a limit.
- Grouped — rule criteria as AND groups joined by OR; justified because the grouped mode is a distinct anatomy.
- CustomCells — a `Select` and a `Switch` in place of the default inputs through `cell-<key>`; justified because replacing a control is the main extension point.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
