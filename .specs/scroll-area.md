---
name: scroll-area
category: layout
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit
checksum: 0a0158b971afdaa194eb95b4f0ed69c887db4eb062b0ee7935642bd1ecc655b4
created: 2026-05-22
last_updated: 2026-11-09
---
# Scroll Area — Component Spec

## Purpose

Structural layout primitive for scrolling regions: native overflow with themed thin scrollbars and keyboard scrolling. With `fade`, the edges that still have content to scroll to fade out, each sized by the distance left on that side (capped at 64px or a sixth of the viewport), so a list reads as continuing past its frame. A sticky header inside the viewport keeps its full opacity; the top fade starts below it.

## When to use

- A region that must scroll inside a bounded box: a navigation list, a panel body, a wide table (`orientation="horizontal"`), a code region (`orientation="both"`).
- A long list whose edges should fade while more content lies beyond them (`fade`).

## When NOT to use

- The region is one of several the reader resizes by dragging → use `resizable-panel`, with a ScrollArea inside a pane if its content overflows.
- It is an application navigation rail → use `sidebar`, which already scrolls its items.
- It is a code sample → use `code-block`, which already scrolls its lines.

## Related

- `sidebar` — scrolls its navigation inside a built-in ScrollArea.
- `code-block` — runs its code lines in a ScrollArea with `orientation="both"`.
- `resizable-panel` — draggable regions; each pane can hold a ScrollArea.

## Best practices

- Give it a bounded height, or a flex parent that constrains it. Without a limit the content never overflows and nothing scrolls.
- The root is focusable (`tabindex` 0) and scrolls with the arrow keys, Page Up/Down and Home/End. Set `aria-label` when no visible heading names the region.
- Pass `tabindex="-1"` only when the content is itself focusable and keyboard users can already reach all of it.
- Match `orientation` to the overflow axis: `vertical` clips horizontal overflow, and `horizontal` clips vertical overflow.

## Usage

```vue
<script setup>
import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <ScrollArea aria-label="Recent activity" orientation="vertical" fade class="max-h-80">
    <ul>
      <li>Deploy finalized</li>
      <li>Domain attached</li>
      <li>Cache purged</li>
    </ul>
  </ScrollArea>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | false | Scroll direction: `vertical` (lists, sidebars), `horizontal` (wide tables), `both` for two-axis overflow. |
| `ariaLabel` | `string` | `''` | false | Accessible name when the region is not labelled by visible text; omit when content provides context. |
| `fade` | `boolean` | `false` | false | Fades the edges that still have content to scroll to, sized by the distance left on each side. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-fade` is present while `fade` is on and at least one edge has content beyond it; the per-edge fade lengths are exposed as `--scroll-area-fade-top|bottom|left|right` on the root.

## Motion & Animations

_none_

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
- ARIA: the viewport sets only `aria-label` (from the prop) and `tabindex` itself. Every other consumer attribute — `role`, `aria-*`, `id`, listeners — is forwarded to it, so a log body can be `role="log"` with `aria-live`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Orientations
- Fade

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
