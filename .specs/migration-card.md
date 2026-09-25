---
name: migration-card
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: 1ea9470bbc604ed13381ea839c6d6825e6915c16fa431f029edf3b07045692b7
created: 2026-09-22
last_updated: 2026-09-24
---

# Migration Card — Component Spec

## Purpose

A link card stating one completed migration: the platform a customer left, the platform they moved to, and a short label naming the customer or the result. It is the unit of a "who moved, and from where" band, and its two marks are the whole message. The card is a registration frame — a hairline box with a tick at each corner, the label riding as an overline plate on its top edge and the two marks standing on its floor.

## When to use

- As the repeated unit of a migration or switcher proof band.
- Whenever the story is a move from one named platform to another, not a general endorsement.
- Hand-authored a few at a time in a row the page owns, so the layout stays the page's decision.

## When NOT to use

- For a customer statement in words → use `quote`.
- For a wall of customer marks with no before-and-after → use `logo-wall`.
- For a feature or capability tile → use `feature-card`.

## Related

- `logo-wall` — many marks with no narrative; this card carries the from-and-to.
- `quote` — the same proof told in the customer's words.
- `feature-card` — the general marketing tile, when the message is not a migration.

## Best practices

- Give both marks a real `alt` — the platform names are the message, and the card carries no arrow or connector, so the reading order of the two marks is all that says which one was left.
- Keep `label` to a few words: it sets on one line as an overline plate, and a caption long enough to wrap breaks the card's top edge. Make it the outcome rather than a platform name — a label repeating either mark's `alt` inside a linked card is redundant to a screen reader, and axe flags it as `image-redundant-alt`.
- Supply marks with their own transparency; the card renders them at luminosity, so a full-colour mark comes out monochrome and a wall of them reads as one set, but a mark baked onto its own opaque plate keeps that plate.
- Point `href` at a case study worth reading. A card that links nowhere should have no `href`: without one it is not a link, it holds no hover state, and the corner affordance that promises somewhere to go never appears.

## Usage

```vue
<script setup>
import MigrationCard from '@aziontech/webkit/migration-card'
</script>

<template>
  <MigrationCard
    label="Migrated in six weeks"
    from-src="/logos/contoso.svg"
    from-alt="Contoso"
    to-src="/logos/northwind.svg"
    to-alt="Northwind"
    href="/customers/northwind"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `fromSrc` | `string` | `—` | true | URL of the mark for the platform being left. |
| `fromAlt` | `string` | `—` | true | Name of the platform being left, as the mark's alternative text. |
| `toSrc` | `string` | `—` | true | URL of the mark for the platform moved to. |
| `toAlt` | `string` | `—` | true | Name of the platform moved to, as the mark's alternative text. |
| `label` | `string` | `''` | false | Short caption naming the customer or the outcome. |
| `href` | `string` | `''` | false | When set, the whole card renders as an anchor link to this URL. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, and `hover` / `focus-visible` when `href` is set
- `data-linked` present when the card carries an `href`
- At rest the card paints no ground of its own — the page shows through the frame, and only the label plate and the corner ticks are drawn
- Hovered or focused while linked: the card fills with `var(--bg-surface-raised)`, the label plate inverts to `var(--bg-contrast)` / `var(--text-contrast)`, and the corner affordance fades in at the top right
- The corner affordance is rendered only on a linked card, since it promises a destination
- The root element switches between `<a>` and `<article>` on the `href` data prop, never on an `as` string

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus on a linked card | `transition-colors duration-150 ease-out` on the card and its label plate | inline (matches catalog) | `motion-reduce:transition-none` |
| hover / focus on a linked card | `transition-opacity duration-150 ease-out` on the corner affordance | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-overline-md` |
| label plate surface | `var(--bg-surface-raised)` |
| label plate text | `var(--text-default)` |
| label plate surface (hover) | `var(--bg-contrast)` |
| label plate text (hover) | `var(--text-contrast)` |
| card surface (hover) | `var(--bg-surface-raised)` |
| frame rule | `var(--border-default)` |
| corner ticks | `var(--bg-contrast)` |
| corner affordance plate | `var(--primary)` |
| corner affordance glyph | `var(--primary-contrast)` |
| spacing (card padding) | `var(--spacing-xxs)` |
| spacing (label plate padding) | `var(--spacing-sm)` / `var(--spacing-xxs)` |
| spacing (marks gap) | `var(--spacing-xl)` |
| spacing (floor under the marks) | `var(--spacing-lg)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked card carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; an unlinked card is not focusable.
- Keyboard map: `Tab` reaches a linked card and `Enter` follows it — native anchor behaviour, no key handler of its own.
- ARIA: both marks carry their platform name as `alt`, so the migration reads as "Contoso Northwind" in that order without sight; the corner ticks and the corner affordance are decorative and `aria-hidden`; the card's accessible name is its own text content, so no `aria-label` is added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the label sets in `var(--text-default)` on `var(--bg-surface-raised)`, and on hover in `var(--text-contrast)` on `var(--bg-contrast)` — both full-contrast pairs; the marks are consumer-supplied and carry their own contrast.
- `motion-reduce:transition-none` on the hover/focus colour and opacity transitions.
- Touch target ≥40×40 px — a linked card's anchor is the whole card.

## Stories (Storybook)

- Default
- Linked — the card as an anchor with its hover and focus affordances (justified: the `href` polymorphism swaps the root element and is the only path to the card's interactive states)

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
