---
name: overline
category: content
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6482-17218
  node_id: 6482:17218
checksum: 901ebdce94755c3e65e00311b63d160d2b828f699724b709c375c4f3af510249
created: 2026-11-10
last_updated: 2026-11-11
---

# Overline — Component Spec

## Purpose

Overline is the short uppercase label set above a headline to name the section, panel or group it opens (the "eyebrow"). It renders its default slot in `.text-overline-md` in the brand primary color, optionally behind a preset code-style prefix (`//`, `<>`, `</>`) and followed by a blinking terminal-style cursor. It is purely presentational text with no interaction; the marketing headers (`section-title`, `hero-title`, `call-to-action`, `media-split`, `ticker`) and several page sections render their eyebrow (the `eyebrow` prop, or `label` on `ticker`) through it.

## When to use

- Name a section, panel or column group with one or two words set above its headline.
- Build a custom marketing header that must match the eyebrow treatment of `section-title` and `hero-title` (the `//` prefix and the blinking cursor).
- Label a band inside a page section (a comparison group, a closing panel) with the same uppercase code-style mark.

## When NOT to use

- The header has a headline, description and actions → use `section-title` (or `hero-title` for the hero), which already renders its `eyebrow` through Overline.
- The text is a status, count or category attached to an item → use `tag` or `badge`.
- The text is the heading itself → use a real heading element; Overline renders a `div` and is not a heading.
- The text is a keyboard shortcut → use `kbd`.
- The text is a field label → use `label`.

## Related

- `section-title` — the framed section header; renders its `eyebrow` as an Overline with `prefix="//"` and `show-cursor`.
- `hero-title` — the hero copy block; renders its `eyebrow` as an Overline closed by the cursor, with `single-line` turned off.
- `tag` — a compact label attached to an item, not a heading companion.
- `badge` — a compact count or status indicator.

## Best practices

- Keep the label to one or two words: it is set uppercase and, with the default `single-line`, stays on one line whenever it fits its container.
- Turn `single-line` off only when the label can be longer than its container (narrow columns, translated copy); the label then wraps under `text-pretty`, which avoids a lone word on the last line.
- Use a `prefix` from the preset set only (`//`, `<>`, `</>`); the prefix is decorative and hidden from screen readers (`aria-hidden="true"`), so never put meaning in it.
- Use `show-cursor` for one eyebrow per view at most; the blink stops under reduced motion.
- Keep the semantic heading in the element after the Overline; the Overline itself carries no heading role.

## Usage

```vue
<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <Overline
    prefix="//"
    show-cursor
    >Platform</Overline
  >
</template>
```

## Props

| Prop         | Type                          | Default | Required | JSDoc                                                                                                           |
| ------------ | ----------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `singleLine` | `boolean`                     | `true`  | false    | Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. |
| `showCursor` | `boolean`                     | `false` | false    | Shows a blinking terminal-style cursor after the label.                                                         |
| `prefix`     | `'' \| '//' \| '<>' \| '</>'` | `''`    | false    | Preset prefix rendered before the label; empty renders no prefix.                                               |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                          |
| --------- | ----- | -------------------------------------------------------------- |
| `default` | —     | The label text, rendered uppercase in the brand primary color. |

## States

- Static: no hover, focus, active or disabled states; the root is a non-interactive `div`.
- Prefix: a `span` before the label is rendered only when `prefix` is not empty; it carries `aria-hidden="true"`.
- Cursor: a `span` after the label is rendered only when `showCursor` is set; the root drops its end padding (`pr-0`) while the cursor is shown and keeps `pr-(--spacing-xxs)` otherwise.
- Wrapping: with `singleLine` (default) the prefix carries `whitespace-nowrap` and the label sits on one line because the root is `w-fit`; it wraps (with `text-pretty`) only when the container is narrower than the label. With it off the prefix may wrap too.
- Attributes (including `class`) are forwarded to the root `div` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Test ids: root `content-overline` (consumer `data-testid` wins).
- Reflow: the root is capped at the width of its container, and a label that does not fit wraps instead of overflowing at any width, at 200% zoom and with translated copy (no viewport breakpoint involved).

## Motion & Animations

| Trigger                     | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                           |
| --------------------------- | ---------------------- | ------------------------------------------------- | ------------------------------------------------- |
| cursor shown (`showCursor`) | `animate-blink`        | theme `blink` (1s step-end, infinite)             | `motion-reduce:animate-none` (cursor stays solid) |

## Tokens

| Region                      | Token (DESIGN.md)                                           |
| --------------------------- | ----------------------------------------------------------- |
| typography (prefix, label)  | `.text-overline-md` with `font-medium`                      |
| text (prefix)               | `var(--text-default)` (`text-(--text-default)`)             |
| text (label)                | `var(--text-primary)` (`text-(--text-primary)`)                     |
| cursor surface              | `var(--accent)`                                             |
| cursor size                 | `w-1` · `h-5`                                               |
| gap (prefix, label, cursor) | `var(--spacing-xxs)`                                        |
| padding.x                   | `var(--spacing-xxs)` start and end (`pr-0` with the cursor) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the component renders no focusable element.
- Keyboard map: none; the component is not interactive.
- ARIA: no role; the root is a plain `div` and the label is read as text. The prefix `span` is decorative and carries `aria-hidden="true"`, so only the label is announced; the cursor `span` is empty and contributes no text.
- Contrast ≥4.5:1 (text): the label uses `var(--text-primary)` (`primary-700` in light, 4.77:1 or more on every light surface; `primary-500` in dark) and the prefix `var(--text-default)` on the surface the consumer places it on.
- `motion-reduce:animate-none` on the cursor's `animate-blink`.
- Touch target: not applicable (non-interactive).

## Examples

- Default
- Prefixes — every preset `prefix` (`//`, `<>`, `</>`) side by side. Justified: `prefix` is a string union rather than a `kind`, and the three glyphs are the component's main visual axis.
- Cursor — the blinking cursor with and without a prefix. Justified: `showCursor` adds an animated element that the Default story does not show.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
