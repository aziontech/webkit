---
name: card-list
category: data
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: 736a7fd90741b19f5807e1c38785e0aaaa0992b8eef281b89d388c1d8c8933d6
created: 2026-11-11
last_updated: 2026-11-15
---

# CardList — Component Spec

## Purpose

Use CardList to show a collection of records as selectable cards instead of table rows; for one bordered box use Card, and for the frame of a dashboard chart use ChartCard.

A collection shown as cards, after Cloudscape's cards: one card per item, named by its `header` slot, with the item's fields in the default slot. It follows Cloudscape's collection model — `items`, `itemKey`, `selectedKeys` (a key array) — which is not yet the same as Table's (`data`, `rowKey`, `rowSelection` record); `useCollection` binds it through `cardListProps`, and selection (single or multiple, with a visible select-all) survives paging. Four cards a row in a wide container, then three, two and one as the container narrows.

## When to use

- Items people recognise by a few fields or a picture rather than compare column by column (applications, templates, environments).
- The card form of a list page (`view/view-card`), filtered and paged by `useCollection`.

## When NOT to use

- Records compared, sorted or scanned across many fields → use `table`.
- A fixed marketing grid of features or links → use `card-grid`.
- A single content box → use `card`.

## Related

- `use-collection` — filters, pages and selects; `cardListProps` is the binding.
- `table` — the same collection as rows; same item and selection model.
- `property-filter`, `collection-preferences`, `pagination` — the controls around it.
- `card` — one standalone card.

## Best practices

- Put the item's name, as a link to the item, in the `header` slot: it also names the selection control.
- Keep each card to a handful of label and value pairs; let `collection-preferences` choose which.
- Use `selectionMode="multiple"` only when a bulk action exists next to the list.
- Pass items typed with your own interface (`Domain[]`): the slots read `item.name` with that type, so never cast `item` in a slot or widen the items to `Record<string, unknown>[]`.

## Usage

```vue
<script setup>
  import CardList from '@aziontech/ui/card-list'

  const items = [
    { id: 'a', name: 'storefront', domain: 'shop.example.com' },
    { id: 'b', name: 'checkout', domain: 'pay.example.com' }
  ]
</script>

<template>
  <CardList :items="items">
    <template #header="{ item }">{{ item.name }}</template>
    <template #default="{ item }">{{ item.domain }}</template>
  </CardList>
</template>
```

## Props

| Prop            | Type                               | Default  | Required | JSDoc                                                                  |
| --------------- | ---------------------------------- | -------- | -------- | ---------------------------------------------------------------------- |
| `items`         | `TItem[]`                          | `[]`     | false    | The items, one card each.                                              |
| `itemKey`       | `string`                           | `'id'`   | false    | Field that identifies an item; selection keys read it.                 |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | false    | No selection, one card, or several cards with a select-all above them. |
| `loading`       | `boolean`                          | `false`  | false    | Shows placeholder cards and sets aria-busy while true.                 |
| `ariaLabel`     | `string`                           | `''`     | false    | Accessible name of the list. Empty uses the locale catalog.            |

The component is generic over the item: `TItem extends object`, inferred from `items` (default `Record<string, unknown>`), so the `header` and `default` slots receive `item` typed as the consumer's own interface. Types (exported from `@aziontech/ui/card-list`): `CardListSelectionMode = 'none' | 'single' | 'multiple'`; `CardListItemSlotProps<TItem> = { item: TItem; index: number; selected: boolean }`.

## v-model

- **`v-model:selected-keys`** — `string[]`, default `[]`. Keys (`item[itemKey]`) of the selected cards; keys of items not on the current page are kept.

## Events

_none_ — `update:selectedKeys` (payload `string[]`) comes from `v-model:selected-keys` (see v-model above).

## Slots

| Slot      | Scope                          | Notes                                                 |
| --------- | ------------------------------ | ----------------------------------------------------- |
| `header`  | `CardListItemSlotProps<TItem>` | Card title; names the card and its selection control. |
| `default` | `CardListItemSlotProps<TItem>` | Card body: the item's fields.                         |
| `empty`   | —                              | Shown when there are no items.                        |

## States

- Visual states: `default`, `selected`, `loading`, `empty`
- `data-state` on each card: `selected` | `unselected`; `data-selected` when selected
- `data-selection` on the root mirrors `selectionMode`; `aria-busy` while loading

## Motion & Animations

| Trigger          | Animation / Transition                    | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ---------------- | ----------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| selection change | `transition-colors duration-150 ease-out` | inline (matches catalog)                               | `motion-reduce:transition-none` |

## Tokens

| Region           | Token (TOKENS.md)        |
| ---------------- | ------------------------ |
| card surface     | `var(--bg-surface)`      |
| card border      | `var(--border-default)`  |
| selected border  | `var(--border-selected)` |
| selected surface | `var(--bg-selected)`     |
| padding          | `var(--spacing-md)`      |
| gap              | `var(--spacing-sm)`      |
| shape            | `var(--shape-card)`      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the checkbox, the radio and the links in the header slot.
- Keyboard map: `Tab` moves through the select-all, each card's control and its content; `Space` toggles a control.
- ARIA: the cards are a named `list` of `listitem`s; each checkbox is labelled by its card's header (`aria-labelledby`), and in single mode each card's `RadioGroup.Item` has no label text and forwards `aria-labelledby` (the header id) to its radio; the select-all has a visible label; the root sets `aria-busy` while loading.
- Selection is never conveyed by color alone: the control is checked.
- Contrast ≥4.5:1 (text) and ≥3:1 for the selected border.

## Internationalization

| Key                         | English source              | Override prop |
| --------------------------- | --------------------------- | ------------- |
| `cardList.label`            | Items                       | `ariaLabel`   |
| `cardList.selectAll`        | Select all items            | —             |
| `cardList.emptyTitle`       | No items yet                | `empty` slot  |
| `cardList.emptyDescription` | Items you create show here. | `empty` slot  |

- Formatting: none; the slots format the item's fields.

## Right-to-left

- Layout: logical utilities only; the checkbox and the single-mode radio both sit at the end of the header row.
- Icons: none of its own.
- Keyboard: no arrow-key navigation of its own.
- User data: the slots isolate user data (`<bdi>` around domains in the examples).

## Responsive

- Container queries: `@container/card-list`; one column below `@xl` (644 px), two from `@xl`, three from `@4xl` (1024 px), four from `@6xl` (1388 px), so a card is never narrower than about 310 px.
- Narrow (≤ 640 px or a narrow container): one card a row at full width.
- Touch: the checkbox and radio grow their hit area on `pointer: coarse` (from the inputs); nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 19 KB gzip for `./card-list` (it carries `checkbox`, `radio-group`, `skeleton` and `empty-state`) in `.size-limit.json`.
- Runtime budget: a page of cards (≤ 100) renders in one frame; paging is the answer to more. Above 120 items the cards mount in chunks of 60 as the list scrolls near them (`useLazyChunks`; a full-row placeholder holds the place of each chunk not yet mounted). Selection is looked up in a `Set` built once per change, so select-all and each card's selected state cost O(1) per card. The `CardList with 1k items: mount and select all` scenario of `performance.test.ts` holds an unpaged list to its budget in `perf-budgets.json`.
- Heavy parts: none.

## Examples

- Default — four cards, no selection.
- Selectable — bound to `useCollection` with multiple selection and pagination; justified because the binding is the main use.
- SingleSelection — `selection-mode="single"`: one radio per card and no select-all; justified because the single mode changes the control and drops the select-all.
- Loading — placeholder cards while `loading`.
- Empty — the `empty` slot replacing the default empty state; justified because `empty` is a state the component owns.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
