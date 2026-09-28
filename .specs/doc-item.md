---
name: doc-item
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: aa0d62f50ea9855c6fb4915213687f835a646e4dcafb6c7397770a77e55d6dcf
created: 2026-08-22
last_updated: 2026-08-22
---

# DocItem — Component Spec

## Purpose

One row of the documentation's related-content list: a leading glyph in a framed 32px tile, the row's name, and the sentence that says what the thing is. When it has an `href` the title becomes an anchor stretched over the whole row — one tab stop, the full row as the hit area — closed by a trailing chevron, or a diagonal arrow when the destination leaves the documentation. The shell keeps `role="listitem"`, so a set of rows inside an `ItemList` is a real list to assistive technology.

## When to use

- The "Related products" band a page ends on — peer destinations where each entry needs a sentence to be understood.
- A one-column list of concepts or next steps, read at the page's own measure, with or without links.

## When NOT to use

- For a grid of scannable entries whose titles carry most of the meaning — use `DocCard` inside a `DocCardGroup`; a card claims a tile, a row claims one line.
- For an application resource list — compose `Item` and its parts directly; this row is documentation chrome.
- For a single call to action at the end of a page — that is a button, not a row.

## Related

- `DocCard` — the cell counterpart. A card claims a whole tile; this claims one line.
- `Item` / `ItemMedia` / `ItemContent` / `ItemTitle` / `ItemDescription` / `ItemActions` — the webkit anatomy this row composes.
- `FrameBox` + `ItemList` — the documented group pattern: the page draws one framed surface holding an `ItemList`, and the list rules between the rows. There is no `DocItemGroup` in the package; the group is this composition.

## Best practices

- Keep the title to a noun phrase and let the sentence carry the verb; inline code in the sentence renders as the chip.
- Give every row of one list the same shape — all with glyphs or none, all linked or none — so the column reads as one object.
- Compose rows inside a `FrameBox` (with a solid surface) holding an `ItemList`: the frame draws the single box and the list draws full-width dividers, and the `role="list"` parent is what makes each row's `role="listitem"` valid.

## Usage

```vue
<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'
</script>

<template>
  <FrameBox class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Edge Functions"
        icon="pi pi-code"
        href="/docs/edge-functions"
      >
        Build serverless applications on Azion's global network.
      </DocItem>
      <DocItem
        title="Edge SQL"
        icon="pi pi-database"
        href="/docs/edge-sql"
      >
        Store relational data across the network.
      </DocItem>
    </ItemList>
  </FrameBox>
</template>
```

## Props

| Prop     | Type                  | Default   | Required | JSDoc                                                 |
| -------- | --------------------- | --------- | -------- | ----------------------------------------------------- |
| `title`  | `string`              | `''`      | false    | The row's name — what the reader is choosing.         |
| `icon`   | `string`              | `''`      | false    | PrimeIcons class for the leading glyph.               |
| `href`   | `string`              | `''`      | false    | Destination; when set the whole row becomes the link. |
| `target` | `'_self' \| '_blank'` | `'_self'` | false    | Where the link opens.                                 |
| `label`  | `string`              | `''`      | false    | Fallback copy when the default slot is empty.         |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                 |
| --------- | ----- | ----------------------------------------------------- |
| `default` | —     | The row's copy: one or two sentences of inline prose. |

## States

- Visual states: `default`, `hover` and `focus-visible` — the last two exist only when the row is a link, and both are driven off the single title anchor via the shell's `has-[a:hover]` / `has-[a:focus-visible]` variants; a row with no `href` is inert
- The anchor appears on data, not on a mode prop: the title wraps in an anchor when `href` is set, and the trailing glyph region renders only then
- An external destination (absolute URL, `mailto:`, or explicit `target="_blank"`) swaps the chevron for the diagonal arrow and, for `target="_blank"`, adds `rel="noreferrer"`
- `data-doc-chrome` is the `DocProse` contract (prose rules stop at the row's edge)

## Motion & Animations

| Trigger                     | Animation / Transition                                                 | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover on a linked row       | `transition-colors duration-150 ease-out`                              | inline (matches catalog)                          | `motion-reduce:transition-none` |
| hover on the trailing glyph | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | semantic                                          | `motion-reduce:transition-none` |

## Tokens

| Region                           | Token (DESIGN.md)          |
| -------------------------------- | -------------------------- |
| typography (inline code)         | `.text-label-code-sm`      |
| text (glyph, title, inline code) | `var(--text-default)`      |
| text (trailing glyph)            | `var(--text-muted)`        |
| tile surface                     | `var(--bg-surface-raised)` |
| tile border                      | `var(--border-muted)`      |
| tile shape                       | `var(--shape-elements)`    |
| row hover + inline-code surface  | `var(--bg-hover)`          |
| inline-code border               | `var(--border-default)`    |
| inline-code shape                | `var(--shape-flat)`        |
| spacing (title to copy)          | `var(--spacing-xxs)`       |
| ring                             | `var(--ring-color)`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the shell draws `has-[a:focus-visible]:ring-2` with `var(--ring-color)`, inset, so the whole row lights when its one anchor is focused; the anchor itself suppresses its own outline.
- Keyboard map: `Tab` reaches a linked row's title anchor — one stop per row; `Enter` follows it. A row with no `href` is not focusable and not announced as interactive.
- ARIA: `role="listitem"` lives on the shell, never on the anchor (axe `aria-allowed-role` forbids it there), so rows inside an `ItemList` with `role="list"` form a valid list. The anchor wraps only the title text, so the accessible name is the row's name with no duplicated `aria-label`; the stretched after-pseudo makes the whole row the pointer hit area without changing the accessible structure. Both glyphs are decorative (`aria-hidden`).
- A row that leaves the documentation carries `rel="noreferrer"` on `target="_blank"` and swaps the chevron for a diagonal arrow, so the destination change is visible and not colour-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the full row is the hit area, comfortably over 40×40 px.

## Stories (Storybook)

- Default — the documented pattern: a `FrameBox` holding an `ItemList` of linked rows. Justified in writing here: a lone row is not the unit the page composes — `role="listitem"` requires a `role="list"` parent to be valid (axe `aria-required-parent`), so even the default render is the composed list rather than a single-row arg canvas.
- Variants — composite story covering the axes that change the anatomy: an external destination (diagonal arrow + `rel="noreferrer"`), a row without a glyph, and inert rows with no `href` at all — where the anchor and the trailing glyph region disappear. Justified in writing here because the rendered structure itself changes with `href` and the destination, which no single-arg story can show.

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
