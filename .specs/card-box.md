---
name: card-box
category: content
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6473
  node_id: 562:6473
checksum: 8262400399f5624e53a5a6f3523bc9ede57c6c9c72d4a8a2fe3394551be3a007
created: 2026-05-22
last_updated: 2026-11-09
---
# Card Box — Component Spec

## Purpose

Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/card-box/`.

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the `content` slot.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.

## When NOT to use

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `card-pricing`.
- It is a framed cell or band of a marketing page → use `frame-box` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.

## Related

- `item` — rows inside the card; with `padded` set to false, an `Item` list runs its dividers to the card edges.
- `card-pricing` — pricing tier card with its own price hierarchy and action.
- `card-grid` — responsive grid of cells for marketing pages.
- `panel` — the layered shell behind overlays, not an in-page card.
- `empty-state` — goes in the `content` slot when the card has no data yet.

## Best practices

- Put the body in the `content` slot. There is no `default` slot, so children passed without `#content` don't render.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-action`.
- `header-action` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.

## Usage

```vue
<script setup>
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
</script>

<template>
  <CardBox title="Domains">
    <template #header-action>
      <Button label="Edit" kind="text" size="small" />
    </template>
    <template #content>
      <p>Associate a custom domain to handle user access.</p>
    </template>
    <template #footer>
      <Button label="Save" kind="primary" size="medium" />
    </template>
  </CardBox>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Heading rendered in the header when the `header` slot is empty. |
| `padded` | `boolean` | `true` | false | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `header` | — | Replaces the default header layout (title + header-action). |
| `header-action` | — | Actions aligned to the end of the default header; visible on header hover. |
| `content` | — | Main card body. |
| `footer` | — | Footer actions or metadata; omitted when empty. |

> There is no `default` slot — content goes through `content`.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| header action reveal | `transition-opacity` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-body-sm |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| spacing | `var(--spacing-3)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default — title header + `content`
- Header — an action rendered in the `header` slot, aligned to the end (justified: demonstrates the full-control header path)
- Footer — `footer` region with actions (justified: the footer bar only renders when the slot is filled)
- Flush — `padded=false` edge-to-edge content (mutually-exclusive boolean state of the `padded` prop)

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
