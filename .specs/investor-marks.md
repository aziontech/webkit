---
name: investor-marks
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 8001bc84ee368f2af54e01f6e5f87eba550612d83222cbbb5ec36c9d6993870a
---
# InvestorMarks — Component Spec

## Purpose

The investors band: a centered section title over a two-column bento grid where each cell is an investor's mark, linked to its site, that lifts on hover to reveal a "visit website" line. It is a page section — the site places it from a `{ _id: 'investor-marks', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `bento-grid`.

## When to use

- On the company page, to name the investors with their marks.

## When NOT to use

- For client marks → use `client-mosaic` or `logo-wall-quote`.

## Related

- `bento-grid` — the grid the marks are laid in.

## Best practices

- Give each item a `logoLight` when its mark needs a different file on the light theme; otherwise one `logo` serves both.
- Keep `linkLabel` short; it is revealed under the mark on hover and read before the investor name.

## Usage

```vue
<script setup>
import InvestorMarks from '@aziontech/webkit/investor-marks'
</script>

<template>
  <InvestorMarks
    eyebrow="Investors"
    title="Backed by visionary investors"
    link-label="Visit website"
    :items="[
      { name: 'monashees+', logo: '/logos/monashees-reversed.svg', logoLight: '/logos/monashees-mono.svg', href: 'https://www.monashees.com' },
      { name: 'Qualcomm Ventures', logo: '/logos/qualcomm-reversed.svg', logoLight: '/logos/qualcomm-mono.svg', href: 'https://www.qualcommventures.com' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. |
| `linkLabel` | `string` | `''` | false | Line revealed under a mark on hover, and the start of each link's accessible name. |
| `items` | `InvestorMarksItem[]` | `[]` | false | The investors, in order; each is `{ name, logo, logoLight?, href }` where `logo` is the mark on the dark theme and `logoLight` the one on the light theme. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell (fill rises, mark lifts, the link line appears)
- Empty: when `items` is empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus fill on a cell | `before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance` | inline (matches catalog) | `motion-reduce:before:transition-none` |
| hover / focus lift of the mark | `transition-[translate] duration-moderate-01 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover / focus reveal of the link line | `transition-[opacity,translate] duration-moderate-01 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (link line) | `.text-overline-md` |
| link line text | `var(--text-default)` |
| cell hover fill | `var(--bg-hover)` |
| focus ring | `var(--ring-color)` |
| cell inset | `var(--spacing-xl)` |
| link line offset | `var(--spacing-md)` |
| mark lift | `var(--spacing-sm)` |
| link line gap | `var(--spacing-xxs)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each cell link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset` and shows the same reveal as hover.
- Keyboard map: `Tab` moves between investor links; `Enter` follows one (opens in a new tab).
- ARIA: the band is a `<section>` named by its title (`aria-label`); each link's accessible name is "`linkLabel`, `name` (opens in a new tab)"; the revealed line is `aria-hidden` since the name already carries it; the two theme marks share the investor's name as `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): link line `var(--text-default)` on `var(--bg-hover)`.
- `motion-reduce:transition-none motion-reduce:transform-none` on every transition above.
- Touch target ≥40×40 px — each link is a full 12rem-tall cell.

## Stories (Storybook)

- Default

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
