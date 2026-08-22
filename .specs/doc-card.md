---
name: doc-card
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 7e90c3628d3dc025410ca84b8fb6168e19dc75fc420629af3584bd405d696d93
created: 2026-08-22
last_updated: 2026-08-22
---

# DocCard — Component Spec

## Purpose

One cell of the grid a documentation page scans across: a leading glyph, an optional overline, the title, the copy, and an optional call-to-action row at the foot. It renders as an anchor when it has an `href` and as a plain block when it does not, so a card is either a destination or a statement — never a dead link.

## When to use

- A grid of peer destinations: "what you can build", the product tiles a landing section opens with.
- A set of short, scannable entries whose titles carry most of the meaning.

## When NOT to use

- When each entry needs a sentence to be understood — use `DocItem` rows, one column, so every description is read at the page's own measure instead of squeezed into a cell.
- For a single call to action at the end of a page — that is a button, not a card.
- For an application surface — use `CardBox`, which is the console's carded surface.

## Related

- `DocCardGroup` — the frame and grid this is a cell of; a card outside one has no cell ring.
- `DocItem` — the row counterpart. A card claims a whole tile; a row claims one line.

## Best practices

- Keep the title to a noun phrase and let the copy carry the verb.
- Use `overline` only when the title alone does not say who or when; it is not a category label.
- Set `link` when the card should close on an explicit call to action; otherwise the whole tile being the link is enough.

## Usage

```vue
<script setup>
import DocCard from '@aziontech/webkit/doc-card'
</script>

<template>
  <DocCard
    title="Edge Application"
    icon="pi pi-server"
    href="/docs/edge-application"
    link="Read the guide"
  >
    Serve and cache your application at the edge, close to the people using it.
  </DocCard>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Card heading. |
| `overline` | `string` | `''` | false | Small muted line above the title — who makes the thing, when the title does not say. |
| `icon` | `string` | `''` | false | PrimeIcons class for the leading glyph. Ignored when the `icon` slot is filled. |
| `href` | `string` | `''` | false | Destination; when set the whole card becomes the link. |
| `target` | `'_self' \| '_blank'` | `'_self'` | false | Where the link opens. |
| `label` | `string` | `''` | false | Fallback copy when the default slot is empty. |
| `link` | `string` | `''` | false | Call-to-action text; when set the card closes on a link row. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Card copy. |
| `icon` | — | The leading mark, when a font glyph will not do. Replaces `icon`. |

## States

- Visual states: `default`, `hover` and `focus-visible` — the last two only when the card is a link
- The root element switches on data, not on an `as` prop: an anchor when `href` is set, a plain block otherwise
- `data-doc-chrome` is the `DocProse` contract (prose rules stop at the card's edge)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover on a linked card | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover on the trailing glyph | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | semantic | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (title) | `.text-heading-xs` |
| typography (copy) | `.text-body-sm` |
| typography (overline) | `.text-overline-sm` |
| typography (cta) | `.text-label-md` |
| text | `var(--text-default)` |
| text (overline, copy) | `var(--text-muted)` |
| link (cta) | `var(--text-link)` |
| surface | `var(--bg-surface)` |
| surface.hover | `var(--bg-hover)` |
| spacing | `var(--spacing-md)` / `var(--spacing-sm)` / `var(--spacing-xxs)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked card takes `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the anchor root.
- Keyboard map: `Tab` reaches a linked card; `Enter` follows it. A card with no `href` is not focusable and not announced as interactive.
- ARIA: the accessible name is the card's own title text — the anchor wraps the content, so nothing is duplicated into an `aria-label`. The glyph is decorative (`aria-hidden`).
- A card that leaves the documentation (absolute URL, `mailto:`, or explicit `target="_blank"`) carries `rel="noreferrer"` and swaps the chevron for a diagonal arrow, so the destination change is visible and not colour-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the whole tile is the hit area, comfortably over 40×40 px.

## Stories (Storybook)

- Default — a single linked card with a glyph, copy and a call-to-action row.
- Variants — composite story covering the axes that change the anatomy: with and without an overline, with a slotted mark instead of a font glyph, an external destination, and a non-linked card. Justified in writing here because the root element itself changes with `href`, which no single-arg story can show.

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
