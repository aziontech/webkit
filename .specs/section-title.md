---
name: section-title
category: content
structure: monolithic
status: approved
spec_version: 2
checksum: 0faf26ecb887972348aca58986648e5260169bf5ddad72180083d6ec5f2c8699
figma:
  url: https://www.figma.com/design/QEbHSTFDWfh4VHkBp6NWN3/Azion.com?node-id=7495-24338
  node_id: 7495:24338
created: 2026-08-11
last_updated: 2026-08-11
---

# Section Title — Component Spec

## Purpose

The framed header row that opens a page section: an optional overline, the section's `h2`, an optional description and an optional row of actions, held inside a registration frame whose bottom rule is what divides the header from the section body. `kind` picks the layout — `centered` for a symmetric opener, `left` for a reading-order one, and `horizontal` for a wide row that sets the headline against its description.

## When to use

- Opening a marketing or landing page section that needs a framed header.
- Whenever the header itself should carry the rule that separates it from the content below, with no extra margin.
- For a wide band whose headline and supporting sentence should sit side by side rather than stacked — `kind="horizontal"`.

## When NOT to use

- For the page's leading band and its `h1` → use `hero-title` instead.
- For the top bar of an application shell → use `global-header` instead.
- For a plain framed container with arbitrary content → use `frame-box` instead.

## Related

- `hero-title` — the hero counterpart; renders the page's `h1` at hero scale.
- `frame-box` — the frame this component composes.
- `section-gap` — the empty frame that sets the air before and after a section header; this component holds no vertical air of its own beyond its padding.
- `overline` — the eyebrow treatment rendered above the headline.

## Best practices

- Keep one `section-title` per section, and let it own the section's `h2` so the page keeps one document outline.
- Write the eyebrow as one or two words: it is set uppercase and prefixed with `//`, so a sentence in it reads as noise.
- Reach for `horizontal` when the description is long enough to earn its own column — on a narrow viewport it stacks back under the headline.
- Put the section's CTAs in the `actions` slot rather than in the body; the slot already stacks them fluid below `sm` and aligns them with the chosen `kind` above it.
- The vertical rhythm around the header belongs to the `section-gap` frames on either side, not to this component.

## Usage

```vue
<script setup>
import SectionTitle from '@aziontech/webkit/section-title'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <SectionTitle
    eyebrow="Platform"
    title="Everything runs at the edge"
    description="One platform for applications, security and observability."
  >
    <template #actions>
      <Button label="Start building" />
    </template>
  </SectionTitle>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | Headline of the section, rendered as the section's `h2`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `kind` | `'centered' \| 'left' \| 'horizontal'` | `'centered'` | false | Layout of the header: `centered` stacks and centers the copy, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns. |
| `hatch` | `boolean` | `false` | false | Draw the frame's vertical hatch texture behind the copy. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Description body; replaces the `description` prop when provided. |
| `actions` | — | Call-to-action row under the copy, aligned with the chosen `kind`. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop: `centered` | `left` | `horizontal`
- `data-hatch` present when the hatch texture is drawn

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (headline) | `.text-heading-xl` |
| typography (description) | `.text-heading-sm` |
| headline text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| spacing (copy stack) | `var(--spacing-lg)` |
| spacing (copy → actions) | `var(--spacing-xl)` |
| spacing (actions gap) | `var(--spacing-md)` |
| spacing (padding) | `var(--spacing-xl)` / `var(--spacing-xxl)` |
| copy max width | `var(--container-2xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `spacing/elements/gap-elements-base` (48) | `var(--spacing-xl)` | The theme's named spacing scale has no 48px step of its own; `--spacing-xl` resolves to 3rem at the large breakpoint. TODO: confirm whether the theme should carry the Figma element-gap family. |
| `sizing/max-width/max-w-3xl` (768) | `var(--container-2xl)` (752) | Closest step on the theme's own container scale; no follow-up expected. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the header itself; controls composed into the `actions` slot keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the headline is a real `h2` (the page's `h1` belongs to `hero-title`), so no `role` or `aria-label` is added; the frame's rules, corner marks and hatch stay `aria-hidden="true"`. In `horizontal` the headline precedes its description in DOM order, so the reading order matches the visual one.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline on `var(--text-default)`, description on `var(--text-muted)`, both over the page canvas.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — the `actions` row stretches its children to full width below `sm`, so slotted buttons keep their own target size.

## Stories (Storybook)

- Default
- Kinds — composite story rendering every `kind` value stacked, so the three layouts can be compared (justified: `kind` is the component's only enum axis and the difference is structural)
- WithActions — an `actions` row under the description (justified: the slot owns its own responsive layout, which no prop-driven story shows)
- Hatch — the `hatch` texture on (mutually-exclusive boolean state of the `hatch` prop)

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
