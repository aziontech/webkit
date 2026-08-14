---
name: hero-title
category: content
structure: monolithic
status: approved
spec_version: 1
checksum: 2bf7588d5512270821d350b648f33dcd7e8ec6a53df6946bf04d21e7a94ab3b7
created: 2026-08-11
last_updated: 2026-08-11
---

# Hero Title — Component Spec

## Purpose

The copy block of a hero band: an optional overline, the page's `h1` (with an optional opening phrase painted in the brand accent), a description and a row of leading calls to action, at hero scale. It is the hero counterpart of `section-title` and is meant to sit above a hero backdrop rather than to draw a frame of its own.

## When to use

- As the leading copy of a landing or marketing page, inside the hero band's container.
- Whenever a page needs one accented statement, one supporting sentence and up to a couple of primary CTAs.

## When NOT to use

- For a section header further down the page → use `section-title`, which renders an `h2` inside a frame.
- For the top bar of an application shell → use `global-header` instead.
- For a bordered, centered band with no `h1` → use `frame-box` instead.

## Related

- `section-title` — the same anatomy at section scale, framed and centered, rendering an `h2`.
- `overline` — the eyebrow treatment above the headline.
- `frame-box` — the frame a hero band is usually built from.

## Best practices

- Use exactly one `hero-title` per page — it owns the `h1`, and a second one breaks the document outline.
- Keep `highlight` to the opening phrase of the headline: it is part of the same sentence and the same accessible name, only painted differently.
- Leave the block left-aligned (the default) when the backdrop is weighted to one side; `centered` is for a symmetric backdrop or a single statement.
- Put the CTAs in the `actions` slot — it stacks them full-width below `sm`, which is what makes a hero button a comfortable thumb target.

## Usage

```vue
<script setup>
import HeroTitle from '@aziontech/webkit/hero-title'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <HeroTitle
    eyebrow="Edge platform"
    highlight="Build anything."
    title="Run it everywhere."
    description="Ship applications, security and observability from one platform."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to sales"
      />
    </template>
  </HeroTitle>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | Headline of the page, rendered as the page's `h1`. |
| `highlight` | `string` | `''` | false | Opening phrase of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `centered` | `boolean` | `false` | false | Center the whole block — copy, headline and actions — instead of aligning it to the start. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Description body; replaces the `description` prop when provided. |
| `actions` | — | Leading call-to-action row under the copy. |

## States

- Visual states: `default`
- `data-centered` present when the block is centered

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (headline) | `.text-heading-2xl` |
| typography (description) | `.text-body-lg` |
| headline text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| highlight accent | `var(--primary)` |
| spacing (stack) | `var(--spacing-md)` |
| headline max width | `var(--container-4xl)` |
| description max width | `var(--container-2xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| highlight gradient stops | `var(--color-orange-400)` / `var(--color-orange-600)` (primitives) | TODO: tokenize a semantic `--primary-gradient-from` / `--primary-gradient-to` pair so the accent phrase stops referencing palette primitives. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the copy block; controls composed into the `actions` slot keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the headline is a real `h1` and `highlight` is a `span` inside it, so the accessible name is the full sentence; no `role` and no `aria-label` are added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline on `var(--text-default)`, description on `var(--text-muted)`; the accent phrase is large text over the page canvas and stays ≥3:1.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — the `actions` row stretches its children to full width below `sm`, so slotted buttons keep their own target size.

## Stories (Storybook)

- Default
- Highlight — the accented opening phrase (justified: the gradient-painted `highlight` is the component's signature treatment and is absent from the default args)
- Centered — the `centered` layout (mutually-exclusive boolean state of the `centered` prop)
- WithActions — a CTA row under the copy (justified: the slot owns its own responsive layout, which no prop-driven story shows)

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
