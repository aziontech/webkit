---
name: overflow-count
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: be8b2864f750a3c686d5526d01f0ae3ab6cc67b4f0597e8d7be239075375bca9
created: 2026-11-11
last_updated: 2026-11-11
---

# OverflowCount — Component Spec

## Purpose

A small `+N` chip that stands for the items a slot cannot show, and opens a popover with the whole list. It replaces the design sample's `DomainOverflowPopover`, the overflow badge of `TagListCell` and `WorkloadCell`, and the Console Kit's `OverflowCountButton`. The popover follows the overflow rule of `webkit-ux-heuristics`: a summary line (`12 domains`, `10 of 34 domains` while paged), a search box once the list holds more than 7 items, a scrolling list, a **Load N more** footer while items remain, a no-match line quoting the query, and a polite status region that announces the summary. Closing it clears the query and the paging.

## When to use

- A table cell or a detail row shows the first value of a list and the rest hide behind a count: the domains of a workload, the tags of a row, the workloads a rule applies to.
- A card or a header names one item of many and the reader may want the full list without leaving the screen.

## When NOT to use

- The list is the content of the page → render it as a `Table` or an `Item` list.
- The reader picks from the list → use `Select`, `Combobox` or `MultiSelect`.
- A single count without a list behind it → use `Badge`.

## Related

- `table` — `Table.CellTags` and `Table.CellLink` put this chip after the values they fit.
- `tag` — the chip is a small secondary `Tag`.
- `popover` — the list opens in a `Popover`.

## Best practices

- Show the first item (or as many as fit) beside the chip; the chip counts only the hidden ones, and `items` passes only those.
- Name the items with `noun` (`{ one: 'domain', other: 'domains' }`) so the summary reads `12 domains`, not `12 items`.
- Give an item an `href` only when it opens something; an item without one renders as plain text.
- Use the `item` slot for a router link or a richer entry; keep every entry to one truncating line.

## Usage

```vue
<script setup>
  import OverflowCount from '@aziontech/webkit/overflow-count'

  const domains = ['api.example.com', 'cdn.example.com', 'img.example.com']
</script>

<template>
  <OverflowCount
    :items="domains.map((label) => ({ label, href: `https://${label}` }))"
    :noun="{ one: 'domain', other: 'domains' }"
  />
</template>
```

## Props

| Prop    | Type                                                | Default     | Required | JSDoc                                                                                                  |
| ------- | --------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `items` | `Array<string \| { label: string; href?: string }>` | `[]`        | false    | The hidden items. The chip reads `+<length>`; an item with `href` opens in a new tab.                  |
| `noun`  | `string \| { one: string; other: string }`          | `undefined` | false    | What the items are, for the summary and the trigger's name. Empty uses the catalog (`item` / `items`). |

## Events

_none_

## Slots

| Slot   | Props                                                       | Notes                                               |
| ------ | ----------------------------------------------------------- | --------------------------------------------------- |
| `item` | `{ item: { label: string; href?: string }, index: number }` | One list entry; replaces the built-in text or link. |

## States

- `data-state` on the trigger: `open` | `closed` (from `Popover`).
- Search shows when `items` holds more than 7 entries; Load more shows while entries beyond the loaded batches (10 per batch) match.
- Empty `items` renders nothing.

## Motion & Animations

| Trigger              | Animation / Transition                                                 | Token                    | Reduced-motion fallback                  |
| -------------------- | ---------------------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| popover open / close | inherited from `Popover` (its scale-in and scale-out popup animations) | `semantic/animations.js` | inherited (`motion-reduce` on the panel) |
| entry hover          | `transition-colors duration-fast-02`                                   | `semantic/animations.js` | `motion-reduce:transition-none`          |

## Tokens

| Region      | Token                                   |
| ----------- | --------------------------------------- |
| summary     | `.text-label-sm` · `var(--text-muted)`  |
| entry       | `.text-body-sm` · `var(--text-default)` |
| entry hover | `var(--bg-hover)`                       |
| dividers    | `var(--border-default)`                 |
| list height | `var(--container-xs)`                   |
| ring        | `var(--ring-color)`                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The trigger is a button named `Show all <count> <noun>` (the visible `+N` alone does not say what it counts); `aria-expanded` and `aria-controls` come from `Popover`.
- Keyboard: `Enter`/`Space` opens, `Esc` closes and returns focus to the chip, `Tab` moves through the search box, the links and Load more.
- A polite `role="status"` region announces the summary after a search or Load more.
- A link that opens a new tab carries a visually hidden `(opens in a new tab)`.
- Contrast: the secondary `Tag` and the muted summary meet 4.5:1 in both themes.

## Internationalization

| Key                      | English source              | Override prop |
| ------------------------ | --------------------------- | ------------- |
| `overflowCount.noun`     | `item` / `items` (plural)   | `noun`        |
| `overflowCount.summary`  | `{count} {noun}`            | —             |
| `overflowCount.paged`    | `{shown} of {count} {noun}` | —             |
| `overflowCount.showAll`  | `Show all {count} {noun}`   | —             |
| `overflowCount.search`   | `Search`                    | —             |
| `overflowCount.noMatch`  | `Nothing matches “{query}”` | —             |
| `overflowCount.loadMore` | `Load {count} more`         | —             |
| `overflowCount.newTab`   | `(opens in a new tab)`      | —             |

- Formatting: counts go through the locale's number format.

## Right-to-left

- Layout: logical utilities only; the external-link glyph sits at the inline end.
- Icons: `pi-external-link` and `pi-search` are not mirrored.
- Keyboard: unchanged.
- User data: each entry is wrapped in `dir="auto"` so a domain keeps its order inside right-to-left text.

## Responsive

- Container queries: none; the popover is `width="small"` (`--container-xs`).
- Narrow: the popover keeps its width and flips to fit (from `Popover`).
- Touch: the chip sits in a 24 px row; the popover entries are 28 px tall with their own padding.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 9 KB gzip for `./overflow-count` in `.size-limit.json` (Popover, Tag, Input and Button included).
- Runtime budget: renders at most one batch per Load more; search filters in memory.
- Heavy parts: none.

## Examples

- Default — a domain cell: the first domain, then `+3` with links.
- Long list — 34 tags: search past 7, Load more in batches of 10, the no-match line.

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
