---
name: cards
category: data
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: dd20f652b7592c3021252d2adf410f03d2a8e171e8a953d80e374ea446bccd55
created: 2026-11-11
last_updated: 2026-11-11
---

# Cards — Component Spec

## Purpose

A collection shown as cards, after Cloudscape's cards: one card per item, named by its `header` slot, with the item's fields in the default slot. It shares Table's item and selection model — `items`, `trackBy`, `selectedKeys` — so `useCollection` binds it through `cardsProps`, and selection (single or multi, with a visible select-all) survives paging. Four cards a row in a wide container, then three, two and one as the container narrows.

## When to use

- Items people recognise by a few fields or a picture rather than compare column by column (applications, templates, environments).
- The card form of a list page (`platform/view/card-view`), filtered and paged by `useCollection`.

## When NOT to use

- Records compared, sorted or scanned across many fields → use `table`.
- A fixed marketing grid of features or links → use `card-grid`.
- A single content box → use `card`.

## Related

- `use-collection` — filters, pages and selects; `cardsProps` is the binding.
- `table` — the same collection as rows; same item and selection model.
- `property-filter`, `collection-preferences`, `pagination` — the controls around it.
- `card` — one standalone card.

## Best practices

- Put the item's name, as a link to the item, in the `header` slot: it also names the selection control.
- Keep each card to a handful of label and value pairs; let `collection-preferences` choose which.
- Use `selectionMode="multi"` only when a bulk action exists next to the list.

## Usage

```vue
<script setup>
  import Cards from '@aziontech/webkit/cards'

  const items = [
    { id: 'a', name: 'storefront', domain: 'shop.example.com' },
    { id: 'b', name: 'checkout', domain: 'pay.example.com' }
  ]
</script>

<template>
  <Cards :items="items">
    <template #header="{ item }">{{ item.name }}</template>
    <template #default="{ item }">{{ item.domain }}</template>
  </Cards>
</template>
```

## Props

| Prop            | Type                            | Default  | Required | JSDoc                                                                  |
| --------------- | ------------------------------- | -------- | -------- | ---------------------------------------------------------------------- |
| `items`         | `Record<string, unknown>[]`     | `[]`     | false    | The items, one card each.                                              |
| `trackBy`       | `string`                        | `'id'`   | false    | Field that identifies an item; selection keys read it.                 |
| `selectionMode` | `'none' \| 'single' \| 'multi'` | `'none'` | false    | No selection, one card, or several cards with a select-all above them. |
| `loading`       | `boolean`                       | `false`  | false    | Shows placeholder cards and sets aria-busy while true.                 |
| `ariaLabel`     | `string`                        | `''`     | false    | Accessible name of the list. Empty uses the locale catalog.            |

## v-model

- **`v-model:selected-keys`** — `string[]`, default `[]`. Keys (`item[trackBy]`) of the selected cards; keys of items not on the current page are kept.

## Events

_none_ — `update:selectedKeys` (payload `string[]`) comes from `v-model:selected-keys` (see v-model above).

## Slots

| Slot      | Scope                                                                 | Notes                                                 |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| `header`  | `{ item: Record<string, unknown>; index: number; selected: boolean }` | Card title; names the card and its selection control. |
| `default` | `{ item: Record<string, unknown>; index: number; selected: boolean }` | Card body: the item's fields.                         |
| `empty`   | —                                                                     | Shown when there are no items.                        |

## States

- Visual states: `default`, `selected`, `loading`, `empty`
- `data-state` on each card: `selected` | `unselected`; `data-selected` when selected
- `data-selection` on the root mirrors `selectionMode`; `aria-busy` while loading

## Motion & Animations

| Trigger          | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ---------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| selection change | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region           | Token (DESIGN.md)        |
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
- ARIA: the cards are a named `list` of `listitem`s; each selection control is labelled by its card's header (`aria-labelledby`); the select-all has a visible label; the root sets `aria-busy` while loading.
- Selection is never conveyed by color alone: the control is checked.
- Contrast ≥4.5:1 (text) and ≥3:1 for the selected border.

## Internationalization

| Key                      | English source              | Override prop |
| ------------------------ | --------------------------- | ------------- |
| `cards.label`            | Items                       | `ariaLabel`   |
| `cards.selectAll`        | Select all items            | —             |
| `cards.emptyTitle`       | No items yet                | `empty` slot  |
| `cards.emptyDescription` | Items you create show here. | `empty` slot  |

- Formatting: none; the slots format the item's fields.

## Right-to-left

- Layout: logical utilities only; the selection control sits at the end of the header row.
- Icons: none of its own.
- Keyboard: no arrow-key navigation of its own.
- User data: the slots isolate user data (`<bdi>` around domains in the examples).

## Responsive

- Container queries: `@container/cards`; one column below `@xl` (36rem), two from `@xl`, three from `@4xl` (56rem), four from `@7xl` (80rem).
- Narrow (≤ 640 px or a narrow container): one card a row at full width.
- Touch: the checkbox and radio grow their hit area on `pointer: coarse` (from the inputs); nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 19 KB gzip for `./cards` (it carries `checkbox`, `radio-button`, `skeleton` and `empty-state`) in `.size-limit.json`.
- Runtime budget: a page of cards (≤ 100) renders in one frame; paging is the answer to more.
- Heavy parts: none.

## Examples

- Default — four cards, no selection.
- Selectable — bound to `useCollection` with multi selection and pagination; justified because the binding is the main use.

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
