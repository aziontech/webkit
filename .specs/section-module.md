---
name: section-module
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: 9d1d5387f6f8ac5c222b7c2a1bc1ff36fe7e502e93c63dabab895ebc0b342c43
style_seam: true
created: 2026-09-23
last_updated: 2026-09-23
---

# Section Module — Component Spec

## Purpose

The brick of the page column: a section whose header row is divided from its body by a hairline and which is divided from the module above it by another. Stacked inside a `section-container`, a run of modules reads as one continuous frame, because each module draws only its own top rule and hands its sides to the column. It is where a band's header and a band's content are joined, so no page has to re-draw that join.

## When to use

- For every band stacked inside a `section-container`.
- Whenever a band needs a header row divided from its content by a rule.
- For a body-only band, by passing no title and no header slot.

## When NOT to use

- For the full-bleed band at the top of a page → use `hero`.
- For the column the modules stack inside → use `section-container`.
- For the header alone, with no body → use `section-title`, which this module composes.
- For a hairline grid of cells → use `card-grid` inside this module's body.

## Related

- `section-container` — the framed column this module stacks inside.
- `section-title` — the header row this module renders by default.
- `card-grid` — the edge-to-edge cell grid a module's body commonly holds.
- `frame-box` — the registration frame a body wraps itself in.

## Best practices

- Pass `divided` as `false` on the first module in a column: its top edge is already the hero's bottom rule, and drawing its own would put two hairlines on one pixel.
- Pass `padded` as `false` when the body is an edge-to-edge `card-grid`, so the grid's rules meet the frame with no gutter.
- Use `title` and `eyebrow` for the ordinary header, and reach for the `header` slot only when the row needs markup the default header cannot express.

## Usage

```vue
<script setup>
import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <SectionModule
    :divided="false"
    eyebrow="Platform"
    title="Build, run, and protect applications"
  >
    <p>Everything the band has to say.</p>
  </SectionModule>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Headline of the module's header row, rendered as its `h2`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `kind` | `SectionModuleKind` | `'left'` | false | Layout of the default header row. |
| `divided` | `boolean` | `true` | false | Draw the top rule that divides this module from the one above it. |
| `padded` | `boolean` | `true` | false | Pad the module's body. Leave off for an edge-to-edge grid that owns its cell padding. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The module's body. |
| `header` | — | Replaces the default header row entirely. |
| `actions` | — | Trailing controls inside the default header row. |

## States

- Visual states: `default`
- `data-kind` carries the header layout
- `data-divided` present when the top rule is drawn
- `data-padded` present when the body is padded

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| module rule | `var(--border-default)` |
| body padding | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the module is a container; controls composed into it keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the module is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root renders a `section` and adds no role; the header's heading level comes from `section-title`, so a page's headings stay in order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the header and body own their own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control of its own.

## Stories (Storybook)

- Default
- Kinds — composite story rendering the header layouts side-by-side (justified: the layouts differ only in where the copy sits, which is legible only in comparison)
- Divided — a stack of two modules with the first undivided (justified: a shared edge is invisible on a single module, and the story is what proves the rule is drawn once)
- Padded — the module with an edge-to-edge body (mutually-exclusive boolean state of the `padded` prop)

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
