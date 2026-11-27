---
name: skip-link
category: navigation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 6544f2280b299e352d0966028824fe1d18fb8c76ad4c861276017ccfc150d0a8
created: 2026-11-16
last_updated: 2026-11-16
---

# SkipLink — Component Spec

## Purpose

The first focusable element of a page: a link that is visually hidden until it receives keyboard focus, then appears at the top-start corner and jumps to the page's main content, so a keyboard or screen-reader user bypasses the repeated header and navigation (WCAG 2.4.1 Bypass Blocks). On activation it also moves focus into the target, so the next `Tab` continues from the main content in every browser. It differs from `link` in that it is invisible at rest and owns its placement and focus hand-off.

## When to use

- Every page shell (console, marketing site, docs) that renders repeated navigation before the main content: place it as the first child of the shell.
- A layout whose `<main>` (or other main landmark) carries the `id` the link targets (`main` by default).

## When NOT to use

- A link inside content that should always be visible → use `link`.
- Jumping between sections of one page (an in-page table of contents) → use `link` with a `#hash` `href`.
- A page with no repeated block before its content (a bare sign-in form) gains nothing from one; do not add it there.

## Related

- `link` — the always-visible navigation link; use it for any visible jump.
- `console-layout`, `site-layout`, `doc-layout` — the page shells that render the main landmark the skip link targets.

## Best practices

- Render one skip link per page, as the first element inside the shell, before the header; do not wrap it in `nav` or move it into the header.
- Give the main landmark the `id` the link points at (`id="main"` for the default `href`); a missing target makes the link a no-op.
- Keep the label short and name the destination ("Skip to content"); override it with `label` or the default slot only when the target is not the main content.

## Usage

```vue
<script setup>
  import SkipLink from '@aziontech/webkit/skip-link'
</script>

<template>
  <SkipLink />
  <header>…</header>
  <main id="main">…</main>
</template>
```

## Props

| Prop    | Type     | Default   | Required | JSDoc                                                                                            |
| ------- | -------- | --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `label` | `string` | `''`      | false    | Visible label, the default slot's fallback. Empty uses the locale catalog (`Skip to content`).   |
| `href`  | `string` | `'#main'` | false    | In-page hash of the element to jump to; the element with that `id` receives focus on activation. |

## Events

_No events — activation is native anchor navigation plus the focus hand-off in `## States`._

## Slots

| Slot      | Scope | Notes                                                      |
| --------- | ----- | ---------------------------------------------------------- |
| `default` | —     | The link text. Fallback: `label`, then the locale catalog. |

## States

- Visual states: `hidden` (at rest: clipped to 1 px and out of the layout, still in the tab order and the accessibility tree), `focused` (shown at the top-start corner of the viewport with the surface, border, shadow and focus ring), `hover` while shown (label underlined).
- Activation: when `href` is a `#hash` that resolves to an element, the element is focused; if it is not natively focusable and has no `tabindex`, it gets `tabindex="-1"` for the hand-off and loses it on `blur`. Native hash navigation (scroll and URL hash) still runs.
- A `href` that is empty, external or names no element: the link behaves as a plain anchor; no focus hand-off.
- Not applicable: `disabled`, `loading`, `readonly`, `invalid`, `empty`, `error`, `open`/`closed` — a skip link has none of these states; no `data-*` state attribute is rendered.
- Consumer attributes (`id`, `aria-*`, `data-*`, listeners, `class`) land on the anchor through `v-bind="$attrs"`.

## Motion & Animations

_none_

The link appears and disappears instantly on focus and blur; no transition or animation is applied, so reduced motion needs no fallback.

## Tokens

| Region      | Token (TOKENS.md)       |
| ----------- | ----------------------- |
| typography  | `.text-button-md`       |
| surface     | `var(--bg-surface)`     |
| text        | `var(--text-default)`   |
| border      | `var(--border-default)` |
| elevation   | `var(--shadow-md)`      |
| spacing.x   | `var(--spacing-sm)`     |
| offset      | `var(--spacing-sm)`     |
| shape       | `var(--shape-button)`   |
| ring        | `var(--ring-color)`     |
| ring offset | `var(--bg-canvas)`      |

## Theme gaps

| Figma variable                             | Temporary primitive                                                                                                                                                     | Follow-up                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| page-level stacking layer (no Figma frame) | `var(--z-control-overlay)` from `packages/theme/src/tokens/semantic/z-index.js` (shipped, not yet documented in TOKENS.md), so the shown link sits above sticky headers | `TODO: tokenizar` document the z-index scale in TOKENS.md |

## Accessibility (WCAG 2.1 AA)

- Pattern: a native `a href` (no ARIA role); its accessible name is the visible label. It is the first focusable element so it is reached by the first `Tab` (WCAG 2.4.1 Bypass Blocks).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; the link is fully shown on any focus (`:focus`), so it is never focused while invisible (WCAG 2.4.7), and the border keeps the outline in forced-colors mode.
- Keyboard map: `Tab` (first in the page) focuses and reveals it; `Enter` activates: the page jumps to the target and focus moves into it; `Tab` from there continues inside the main content; `Shift+Tab` / moving focus away hides it again.
- ARIA: none needed; the hidden state is visual only (clipped, not `display: none`, not `aria-hidden`), so screen readers list it.
- Contrast: `--text-default` on `--bg-surface` ≥ 4.5:1 in light and dark; the ring token ≥ 3:1 against `--bg-canvas`.
- Motion: none (see `## Motion & Animations`).
- Touch target: min height 40 px while shown (44 px on coarse pointers).

## Internationalization

| Key              | English source    | Override prop                 |
| ---------------- | ----------------- | ----------------------------- |
| `skipLink.label` | `Skip to content` | `label` (or the default slot) |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`start-(--spacing-sm)`), so the link appears at the top-right corner under `dir="rtl"`.
- Icons: none.
- Keyboard: no arrow-key logic.
- User data: none; the label is a catalog string or the consumer's slot text.

## Responsive

- Container queries: none: a fixed-position chip sized by its label.
- Narrow (≤ 640 px or a narrow container): the chip stays at the top-start corner; its width is capped at the viewport minus both offsets and the label wraps instead of overflowing.
- Touch: shown only on focus (keyboard, switch access, screen-reader focus); min height 40 px while shown, 44 px on `pointer: coarse` (`pointer-coarse:min-h-11`); hover only underlines the label, nothing depends on it.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the label wraps.

## Performance

- Bundle budget: 1.9 KB gzip (measured 1.78 KB, most of it the shared `useTranslate` runtime) for `src/components/navigation/skip-link/skip-link.vue`.
- Runtime budget: none: static; one `getElementById` and one `focus()` per activation.
- Heavy parts: none.

## Examples

- Default — the skip link before a row of navigation links, pointing at the content region it skips to (`href="#skip-link-demo-content"`, so the docs page keeps its own `#main`); press `Tab` in the example to reveal it.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
