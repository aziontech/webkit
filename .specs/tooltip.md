---
name: tooltip
category: overlay
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4281-4543
  node_id: 4281:4543
checksum: e28796c9014fca80b84be0f89692f42369e3b6507e45361f50052f15285188b1
created: 2026-06-02
last_updated: 2026-11-09
---

# Tooltip — Component Spec

## Purpose

Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. **Not** for rich content or interactive children — use `overlay/popover` instead.

## When to use

- Naming an icon-only control on hover and focus.
- Revealing the full text of a truncated label, or expanding an abbreviation.
- One short, plain-text hint that the user can do without.

## When NOT to use

- The content has links, buttons or more than one line of structure → use `popover`.
- An info glyph beside a field label or column header → use `hint`.
- A glossed term inside documentation prose → use `doc-tooltip`.
- Guidance or errors the user needs to complete a field → use `helper-text`.

## Related

- `popover` — click-opened, interactive, with a header, body and footer.
- `hint` — the focusable info glyph that renders a `Tooltip` for you.
- `doc-tooltip` — inline glossed term for docs pages.
- `icon-button` — the most common trigger; it still needs its own `ariaLabel`.

## Best practices

- Wrap a focusable element. The tooltip opens on the wrapper's `focusin`, and the wrapper itself is not focusable.
- Keep `text` to a few words. It renders as plain text, with no markup.
- The tooltip describes its trigger (`aria-describedby`) but does not name it. Icon-only triggers still need their own accessible name.
- Use `disabled` to suppress the tooltip. An empty `text` also blocks opening, but it reads as a bug.
- Keep the default `delay` (200 ms) unless a dense toolbar needs a longer one.

## Usage

```vue
<script setup>
import Tooltip from '@aziontech/webkit/tooltip'
import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Tooltip text="Delete" placement="top">
    <IconButton icon="pi pi-trash" aria-label="Delete" />
  </Tooltip>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `text` | `string` | — | true | Plain text shown inside the tooltip. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'auto'` | `'top'` | false | Anchor side relative to the trigger; `auto` picks the side with room. |
| `delay` | `number` | `200` | false | Hover-open delay in milliseconds. |
| `disabled` | `boolean` | `false` | false | Disables tooltip activation. |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | v-model:open. Fires on open and close. |
| `show` | `void` | Emitted right after the open transition starts. |
| `hide` | `void` | Emitted right after the close transition starts. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The trigger element. Tooltip anchors to its bounding box. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-state` values: `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-placement`: `top` | `right` | `bottom` | `left`
- `data-anchored` on the panel once its opening position has landed — the flag that lets a re-anchor animate while the entrance stays the open animation

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| open | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| close | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| re-anchor while open (the text changed size) | `transition-[translate] duration-fast-02 ease-productive-entrance`, gated on `data-anchored` | `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |

`--popup-origin` is set per instance based on `placement` (e.g. `top` → `bottom center`).

The panel is positioned with the standalone **`translate`** property, never `top`/`left` — that is what lets a re-anchor be a compositor transition, and it keeps the position independent of the `transform: scale()` the open and close animations use. A tooltip whose text changes while it is up (the copy control swapping `Copy` for `Copied` under the pointer) therefore glides back onto its trigger's centre instead of jumping: measured 21px of width lost, 10.4px off-centre, snapped in one frame before this. The entrance is deliberately excluded — `data-anchored` is only set one frame after the opening placement, so the panel scales in where it belongs rather than travelling in from the off-screen seed.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-body-sm` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| border | `var(--border-muted)` |
| padding | `var(--spacing-xs)` |
| max-width | `var(--container-3xs)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `bg-contrast` | `bg-(--bg-surface)` | `TODO: tokenizar` (add `--bg-contrast` to DESIGN.md when contrast surface diverges) |
| `text-contrast` | `text-(--text-default)` | `TODO: tokenizar` (add `--text-contrast` to DESIGN.md when contrast text diverges) |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger wrapper.
- Keyboard map: `Tab` focuses the trigger → tooltip opens; `Escape` closes; tooltip never traps focus.
- ARIA: `role="tooltip"` on the panel; the trigger references the panel via `aria-describedby`. `aria-hidden="true"` when `data-state="closed"`.
- Contrast ≥4.5:1 — text against surface verified in both light and dark modes.
- `motion-reduce:animate-none` on the panel; reduced-motion users get instant show/hide.
- Touch target ≥40×40 px on the trigger (the consumer's responsibility — flag in docs).

## Stories (Storybook)

- Default — tooltip rendered **closed**; viewer hovers/focuses the trigger to see it open.
- Placements — composite story with all four placements (top/right/bottom/left) side-by-side; each instance defaults to **closed**.
- Disabled — trigger present, tooltip activation no-op.

## Constraints — DO NOT

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
