---
name: banner
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: de89a379a268b56391e65b857daee894de97e463a35058b1197f71f9d6e57c30
created: 2026-09-22
last_updated: 2026-09-23
---

# Banner — Component Spec

## Purpose

A split promotional band: the announcement and its actions in the wide leading column, a short supporting note on a raised surface in the narrow trailing one. It is the page's one loud interruption between sections — wider and more assertive than `call-to-action`, which is a single-column closing ask.

## When to use

- To announce a launch, programme or offer part-way down a marketing page.
- Whenever an announcement needs both a primary action and a short piece of supporting context beside it.
- Once per page. A second banner turns the first into furniture.

## When NOT to use

- For the closing ask at the end of a page or section → use `call-to-action`, a single-column panel.
- For the page's leading statement → use `hero`, whose `Hero.Title` owns the `h1`.
- For a dismissible or status-bearing notice inside the product → use `message`.
- For a feature tile in a grid → use `feature-card`.

## Related

- `call-to-action` — the single-column closing ask; this is the wider mid-page announcement.
- `hero` — the page's leading band; its `Hero.Title` owns the page's statement and `h1`.
- `message` — the in-product notice, which can be dismissed and carries severity.

## Best practices

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.

- Put the announcement in `title` and keep the trailing column to one supporting sentence — it is context, not a second pitch.
- Lead with one primary action in the `actions` slot; the band's whole job is that one target.
- Use `eyebrow` to name the programme the banner belongs to, so the band reads in context when a reader lands mid-page.
- Keep the trailing note short enough not to set the band's height; it sits beside the announcement, not under it.

## Usage

```vue
<script setup>
import Banner from '@aziontech/webkit/banner'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Banner
    eyebrow="Now available"
    title="Deploy WebAssembly at every edge location."
    description="Included on every plan, with no change to how you build."
  >
    <template #actions>
      <Button label="Read the announcement" />
    </template>
  </Banner>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | The announcement, rendered as the band's `h2` in the leading column. |
| `description` | `string` | `''` | false | Supporting note set on the raised trailing column; overridden by the `aside` slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline naming the programme, above the announcement. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `actions` | — | The controls the band exists to offer, under the announcement. |
| `aside` | — | Trailing column content; replaces the `description` prop when provided. |

## States

- Visual states: `default`
- The band holds no state of its own; controls composed into `actions` keep theirs
- Below `md` the two columns stack, announcement first, so reading order matches visual order

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (announcement) | `.text-heading-xl` |
| typography (trailing note) | `.text-heading-sm` |
| announcement text | `var(--text-default)` |
| trailing note text | `var(--text-muted)` |
| leading surface | `var(--bg-surface)` |
| trailing surface | `var(--bg-surface-raised)` |
| band rules and marks | `var(--border-default)` |
| spacing (column padding) | `var(--spacing-xxl)` |
| spacing (copy stack) | `var(--spacing-lg)` |
| spacing (copy to actions) | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the band itself; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the announcement is a real `h2` rendered by the composed `section-title`, and the band is a `<section>` named by its `title`, so it is reachable as a named landmark; no `role` is added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the announcement is `var(--text-default)` on `var(--bg-surface)`; the trailing note uses `var(--text-muted)` on `var(--bg-surface-raised)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target ≥40×40 px — the `actions` row stretches its children to full width below `md`, so slotted buttons keep their own target size.

## Stories (Storybook)

- Default
- WithAside — the trailing column filled through the `aside` slot rather than the `description` prop (justified: the slot replaces the prop and is the only way to put richer content in that column)

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
