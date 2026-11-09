---
name: icon-button
category: actions
structure: monolithic
status: implemented
spec_version: 1
checksum: 71a7716bbdbaaf54a58c51f6feb1b8025f18030fc393d4f9f3d0ebf0846ab0d9
created: 2026-05-22
last_updated: 2026-11-09
---
# Icon Button — Component Spec

## Purpose

Interactive control for user actions. Lives at `packages/webkit/src/components/actions/icon-button/`.

## When to use

- Compact actions in toolbars, table rows, card headers and overlay close controls where the glyph is widely understood (close, refresh, delete, more).
- Swapping between two icons in place (copy to check, show to hide), with `iconTransition` animating the change.
- An icon-only link: set `href` and it renders as an anchor.

## When NOT to use

- The action needs a visible label → use `button`.
- Copying a value to the clipboard → use `copy-button`, which already wires the icon swap, the tooltip and the `copy` event.
- Choosing one of a few mutually exclusive options → use `segmented-button`.

## Related

- `button` — labelled counterpart; sizes line up and its `text` kind matches `transparent` here.
- `copy-button` — IconButton plus Tooltip with the clipboard write built in.
- `tooltip` — wrap an IconButton to show its name on hover and focus.
- `split-button` — uses an IconButton as its chevron menu toggle.

## Best practices

- `ariaLabel` is required and is the only accessible name; describe the action ("Delete domain"), not the glyph ("Trash").
- Wrap it in `tooltip` when the glyph is not self-evident, so pointer users see the name screen readers hear.
- Use `kind="transparent"` in dense rows and toolbars; keep `primary` for a lone emphasized action.
- Set `iconTransition` only when `icon` changes at runtime; with a static icon it adds nothing.
- Use `iconClass` for glyph-level tweaks instead of styling the root.

## Usage

```vue
<script setup>
import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <IconButton icon="pi pi-plus" aria-label="Add domain" />
  <IconButton icon="pi pi-refresh" aria-label="Refresh" kind="transparent" size="medium" />
  <IconButton icon="pi pi-trash" aria-label="Delete domain" kind="danger" size="small" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `icon` | `string` | `—` | true | PrimeIcons class for the leading/trailing icon. |
| `ariaLabel` | `string` | `—` | true | Accessible name for icon-only controls. |
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'transparent' \| 'danger'` | `'primary'` | false | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `href` | `string` | `''` | false | When set, renders as a link (`<a>`). |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when `href` is set. |
| `iconTransition` | `boolean` | `false` | false | Animates icon swaps with enter/leave transitions. |
| `iconClass` | `string` | `''` | false | Extra classes applied to the icon glyph. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| hover / active (state layer fade) | `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` | `@aziontech/theme` semantic duration + curve | `motion-reduce:before:transition-none` |
| icon swap (enter / leave) | `transition-[transform,opacity] duration-moderate-01` / `transition-opacity duration-fast-02 ease-productive-exit` (`presets/icon-transition.js`) | `@aziontech/theme` semantic duration + curve | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-button-lg |
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

- Default
- Primary (kind)
- Secondary (kind)
- Outlined (kind)
- Transparent (kind)
- Danger (kind)
- Small (size)
- Medium (size)
- Large (size)
- Disabled

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
