---
name: copy-text
category: content
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: fc60fac878ce34ae64cabcccb03f2b83b5ffc3d9be179524398401a050e1c539
created: 2026-11-16
last_updated: 2026-11-24
---

# Copy Text — Component Spec

## Purpose

CopyText shows one code value (a CSS custom property, a utility class, a CNAME, a key ID, a one-line command) in monospace inside a quiet bordered box, with an always-visible `CopyButton` at its inline end that copies the value. It composes `CopyButton` for the clipboard write, the copied confirmation, the live announcement and the manual-copy fallback, so it re-implements none of them. Unlike `CopyButton` (icon only, no visible value) and `TableCellId` (an identifier laid out for a table cell), CopyText is the inline "show this value and let me copy it" pattern for prose, key/value lists, token tables and cards.

## When to use

- Show a short code value the reader will paste elsewhere, next to its label: a design token (`--spacing-2xl`), a class (`p-(--spacing-2xl)`), a CNAME, an API key ID, a one-line CLI command.
- Token tables, key/value rows, setup steps and cards outside a data table.

## When NOT to use

- The value is not shown, only copied → use `copy-button`.
- An identifier inside a data table cell → use `table-cell-id`.
- A multi-line snippet or a block of code → use `code-block`.
- A keyboard shortcut → use `kbd`.
- A secret that must stay masked until revealed → use `password-input` (`readonly`) with a `copy-button`.

## Related

- `copy-button` — the control CopyText composes; use it alone when the value is not displayed.
- `table-cell-id` — the same idea laid out for a table cell (fills the cell, outline button).
- `code-block` — multi-line code with its own copy control.
- `kbd` — keycaps for shortcuts, not copyable values.

## Best practices

- Pass the exact text in `value`; CopyText shows and copies the same string.
- Keep values to one line. A long value truncates in the middle: the start ends in an ellipsis and its last characters (up to 12, a third of the value at most) stay visible, so `acme-store-pr…example.com` still shows how the value ends (decision A5P3-L02-3). The full value stays in the `title`, in the accessible name of the copy button and in the clipboard.
- Pass `ariaLabel` when the value alone does not say what it is (`Copy CNAME`); the default reads `Copy {value}`.
- Listen to `copy` for analytics or a toast; it fires only after the clipboard write succeeds.
- Use `size="small"` in dense tables and lists.

## Usage

```vue
<script setup>
  import CopyText from '@aziontech/webkit/copy-text'
</script>

<template>
  <CopyText value="--spacing-2xl" />
</template>
```

## Props

| Prop        | Type                  | Default    | Required | JSDoc                                                                                  |
| ----------- | --------------------- | ---------- | -------- | -------------------------------------------------------------------------------------- |
| `value`     | `string`              | `—`        | true     | The code value shown and copied to the clipboard.                                      |
| `ariaLabel` | `string`              | `''`       | false    | Accessible name of the copy button. Empty uses the locale catalog (`Copy {value}`).    |
| `size`      | `'small' \| 'medium'` | `'medium'` | false    | Size token; sets the code typography and the size of the copy button (28 px or 32 px). |

## Events

| Event  | Payload                              | Notes                                                                                           |
| ------ | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `copy` | `(event: MouseEvent, value: string)` | Re-emitted from the composed `CopyButton` after a successful write; `value` is the copied text. |

## Slots

| _none_ | — | — |

## States

- Visual states: `idle`, `copied` (owned by the composed `CopyButton`: check glyph, tooltip and `role="status"` announcement for 2 s), `focus-visible` on the copy button.
- `data-size` mirrors `size` on the root.
- The composed `CopyButton` carries `data-state` (`idle` | `copied`).
- Clipboard blocked: the composed `CopyButton` opens its manual-copy popover (see `.specs/copy-button.md`); CopyText adds nothing.
- Empty `value`: the box renders empty and the copy click is a no-op (CopyButton ignores an empty value).
- `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`: not states of this component — it is a static value with one action.

## Motion & Animations

| Trigger                         | Animation / Transition                                    | Token                                        | Reduced-motion fallback                     |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| copy button hover and icon swap | inherited from `CopyButton` / `IconButton`                | `@aziontech/theme` semantic duration + curve | `motion-reduce:transition-none` (inherited) |
| tooltip open / close            | owned by the composed `Tooltip` (see `.specs/tooltip.md`) | `semantic/animations.js`                     | handled by `Tooltip`                        |

## Tokens

| Region                  | Token (DESIGN.md)                      |
| ----------------------- | -------------------------------------- |
| typography (medium)     | `.text-label-code-md`                  |
| typography (small)      | `.text-label-code-sm`                  |
| surface                 | `var(--bg-surface)`                    |
| border                  | `var(--border-muted)`                  |
| text                    | `var(--text-default)`                  |
| spacing (inline start)  | `var(--spacing-xs)`                    |
| spacing (text ↔ button) | `var(--spacing-2xs)`                   |
| shape                   | `var(--shape-control)`                 |
| ring                    | `var(--ring-color)` (via `IconButton`) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: static text plus a native `button` (WAI-ARIA APG Button pattern, provided by `CopyButton`). The value is plain text, readable and selectable; only the copy button is interactive, so there is one tab stop.
- Visible focus: inherited from `IconButton` (`focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`).
- Keyboard map: `Tab` focuses the copy button; `Enter` / `Space` copies; `Esc` closes the manual-copy popover when the clipboard is blocked (owned by `CopyButton`).
- ARIA: the copy button's name is `ariaLabel` or `Copy {value}` (it carries the full value even when the visible text truncates); `Copied` replaces it for 2 s and is announced through CopyButton's `role="status"` region. The value has `title` set to the full value.
- Attributes: consumer `class`, `id` and listeners land on the root `span` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Contrast ≥4.5:1 for the value (`--text-default` on `--bg-surface`) and ≥3:1 for the copy glyph.
- `motion-reduce:transition-none` on every motion (inherited).
- Touch target: the copy button is 28 px (`small`) or 32 px (`medium`), above the 24 px minimum, with IconButton's 44 px hit area on `pointer: coarse`.

## Internationalization

| Key             | English source | Override prop         |
| --------------- | -------------- | --------------------- |
| `copyText.copy` | `Copy {value}` | `ariaLabel`           |
| `common.copied` | `Copied`       | — (from `CopyButton`) |

- Formatting: none; the value is user data and is never translated.

## Right-to-left

- Layout: logical utilities only (`ps-`, `text-start`); the copy button sits at the inline end, so it moves to the left under `dir="rtl"`.
- Icons: the copy and check glyphs do not mirror.
- Keyboard: no arrow-key logic.
- User data: the value is code, rendered with `dir="ltr"` so `--spacing-2xl` and `p-(--spacing-2xl)` never reorder inside a right-to-left page.

## Responsive

- Container queries: none; the box is inline and as wide as its value, capped at `max-w-full`.
- Narrow (≤ 640 px or a narrow container): the value never wraps (`whitespace-nowrap`, no break at hyphens) and truncates in the middle, keeping its last characters; the copy button never shrinks.
- The truncating value keeps 2 px of block padding (`py-0.5`) inside its clip, because the code typography sets a line height of 1: without it the clip cuts descenders (`g` in `--bg-canvas` reads as `q`).
- Touch: the copy button is always visible (no hover-only affordance); 28 / 32 px with a 44 px hit area on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom — the value truncates instead.

## Performance

- Bundle budget: `.size-limit.json` entry `copy-text`, 10 KB gzip (CopyButton's 9.5 KB plus the wrapper; the manual-copy popover stays an async chunk).
- Runtime budget: none: static; one timer owned by `CopyButton`.
- Heavy parts: none beyond CopyButton's lazy fallback popover.

## Examples

- Default
- Sizes — composite example rendering `small` and `medium` side by side.
- Long value — a long CNAME in a narrow container, to show truncation without wrapping. Justified: truncation is the main layout behaviour of the component and the reason it replaces the hand-rolled chip.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
