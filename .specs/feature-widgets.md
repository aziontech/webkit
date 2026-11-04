---
name: feature-widgets
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 80647c9f4d0c490272c80709e1b313ab659bed08ed04d7ab8377154bcfe03205
---
# FeatureWidgets — Component Spec

## Purpose

The "three ways to start" band of a product page: a centered section title with up to two calls to action, over a bento grid where every cell is an illustration above a bold-led sentence and one affordance — a link button or a copy button that puts a prompt on the clipboard. It is a page section — the site places it from a `{ _id: 'feature-widgets', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `bento-grid`, `illustration` and `button-highlight`.

## When to use

- To offer the same outcome through two or three entry points (agent, console, terminal), each with its own next step.

## When NOT to use

- For reasons without an action per cell → use `feature-tiles`.
- For a long argument per feature → use `feature-scroll`.

## Related

- `bento-grid` — the grid the cells are laid in.
- `button-highlight` — the copy affordance a cell renders when it carries `copy`.
- `sections` — the registry compound that renders this block from a page's `sections[]` JSON.

## Best practices

- Give each item exactly one of `action` (a link) or `copy` (text to put on the clipboard).
- Keep `copy.text` self-contained; it is what the reader pastes into their agent.
- Set `anchor` when a hero button scrolls to this band.

## Usage

```vue
<script setup>
import FeatureWidgets from '@aziontech/webkit/sections/feature-widgets'
</script>

<template>
  <FeatureWidgets
    anchor="get-started"
    eyebrow="Get started"
    title="Start where you already work"
    description="The same function, three ways to ship it."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    :items="[
      { title: 'Ask your coding agent', description: 'Connect the Azion MCP servers to your agent.', illustration: 'deploy-secure-mcp-server', copy: { label: 'Copy prompt', text: 'Create a function that answers 401 when a request has no Authorization header.' } },
      { title: 'Build it in the Console', description: 'Write the handler in the editor and create it.', illustration: 'build-applications', action: { label: 'Docs', href: '/docs' } }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`, and the accessible name of the band. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `primaryAction` | `FeatureWidgetsAction` | `undefined` | false | First button under the headline; `{ label, href, trailing? }`. Omitted when absent. |
| `secondaryAction` | `FeatureWidgetsAction` | `undefined` | false | Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `columns` | `FeatureWidgetsColumns` | `3` | false | Column count of the grid from the medium breakpoint up: `2`, `3` or `4`. |
| `items` | `FeatureWidgetsItem[]` | `[]` | false | The cells, in order; each is `{ title, description, illustration, action?, copy? }` where `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the two actions ride with it
- A cell's copy button writes `copy.text` to the clipboard on activation; the feedback is `button-highlight`'s own

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (cell copy) | `.text-body-md` |
| cell lead | `var(--text-default)` |
| cell copy | `var(--text-muted)` |
| cell inset | `var(--spacing-xl)` |
| cell rhythm | `var(--spacing-lg)` |
| action row gap | `var(--spacing-sm)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button` and `button-highlight`, which carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` moves between the header actions and each cell's button; `Enter` / `Space` activates.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is an unnamed `bento-grid` inside that landmark, so the name is not duplicated; the cell lead is a `strong` inside the sentence, not a heading, so the outline stays the band's `h2`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lead `var(--text-default)`, copy `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the buttons' motion carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the cell buttons are medium `button` / `button-highlight`.

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
