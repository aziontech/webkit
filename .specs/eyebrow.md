---
name: eyebrow
category: content
structure: monolithic
status: implemented
spec_version: 7
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6482-17218
  node_id: 6482:17218
checksum: 31115382af7c77cb01a400f3ebb311902ba6498344fe065544f058c0d567e551
created: 2026-11-10
last_updated: 2026-11-16
---

# Eyebrow — Component Spec

## Purpose

Overline is the short uppercase label set above a headline to name the section, panel or group it opens (the "eyebrow"). It renders its default slot in `.text-overline-md` in the brand orange (`--text-brand`: the logo orange `#F3652B` in light and dark), optionally behind a preset code-style prefix (`//`, `<>`, `</>`) and followed by a blinking terminal-style cursor. It is purely presentational text with no interaction; the marketing headers (`section-title`, `hero-title`, `call-to-action`, `media-split`, `marquee`) and several page sections render their eyebrow (the `eyebrow` prop, or `label` on `marquee`) through it.

## When to use

- Name a section, panel or column group with one or two words set above its headline.
- Build a custom marketing header that must match the eyebrow treatment of `section-title` and `hero-title` (the `//` prefix and the blinking cursor).
- Label a band inside a page section (a comparison group, a closing panel) with the same uppercase code-style mark.

## When NOT to use

- The header has a headline, description and actions → use `section-title` (or `hero-title` for the hero), which already renders its `eyebrow` through Eyebrow.
- The text is a status, count or category attached to an item → use `tag` or `badge`.
- The text is the heading itself → use a real heading element; Eyebrow renders a `div` and is not a heading.
- The text is a keyboard shortcut → use `kbd`.
- The text is a field label → use `Field.Label`.

## Related

- `section-title` — the framed section header; renders its `eyebrow` as an Eyebrow with `prefix="//"` and `cursor`.
- `hero-title` — the hero copy block; renders its `eyebrow` as an Eyebrow closed by the cursor, with `single-line` turned off.
- `tag` — a compact label attached to an item, not a heading companion.
- `badge` — a compact count or status indicator.

## Best practices

- Keep the label to one or two words: it is set uppercase and, with the default `single-line`, stays on one line whenever it fits its container.
- Turn `single-line` off only when the label can be longer than its container (narrow columns, translated copy); the label then wraps under `text-pretty`, which avoids a lone word on the last line.
- Use a `prefix` from the preset set only (`//`, `<>`, `</>`); the prefix is decorative and hidden from screen readers (`aria-hidden="true"`), so never put meaning in it.
- Use `cursor` for one eyebrow per view at most; it blinks four times and then stays solid, and never blinks under reduced motion.
- Keep the semantic heading in the element after the Eyebrow; the Eyebrow itself carries no heading role.

## Usage

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <Eyebrow
    prefix="//"
    cursor
    >Platform</Eyebrow
  >
</template>
```

## Props

| Prop         | Type                          | Default | Required | JSDoc                                                                                                           |
| ------------ | ----------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `singleLine` | `boolean`                     | `true`  | false    | Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. |
| `cursor`     | `boolean`                     | `false` | false    | Shows a blinking terminal-style cursor after the label.                                                         |
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
- Cursor: a decorative, `aria-hidden` `span` after the label is rendered only when `cursor` is set; the root carries `data-cursor` and drops its end padding (`data-[cursor]:pe-0`) while the cursor is shown.
- Wrapping: with `singleLine` (default) the root carries `data-single-line` and the prefix turns `whitespace-nowrap` and the label sits on one line because the root is `w-fit`; it wraps (with `text-pretty`) only when the container is narrower than the label. With it off the prefix may wrap too.
- Attributes (including `class`) are forwarded to the root `div` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Test ids: root `eyebrow` (consumer `data-testid` wins); the label `<root>__label`.
- Reflow: the root is capped at the width of its container, and a label that does not fit wraps instead of overflowing at any width, at 200% zoom and with translated copy (no viewport breakpoint involved).

## Motion & Animations

| Trigger                 | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                           |
| ----------------------- | ---------------------- | ------------------------------------------------- | ------------------------------------------------- |
| cursor shown (`cursor`) | `animate-blink-settle` | theme `blink-settle` (1s step-end, 4 runs, 4s)    | `motion-reduce:animate-none` (cursor stays solid) |

## Tokens

| Region                      | Token (DESIGN.md)                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| typography (prefix, label)  | `.text-overline-md` with `font-medium`                                                       |
| text (prefix)               | `var(--text-default)` (`text-(--text-default)`)                                              |
| text (label)                | `var(--text-brand)` (`text-(--text-brand)`): the logo orange `primary-500` in light and dark |
| cursor surface              | `var(--brand-blue)`, the brand blue in both themes                                           |
| cursor size                 | `w-1` · `h-5`                                                                                |
| gap (prefix, label, cursor) | `var(--spacing-2xs)`                                                                         |
| padding.x                   | `var(--spacing-2xs)` start and end (`pr-0` with the cursor)                                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the component renders no focusable element.
- Keyboard map: none; the component is not interactive.
- ARIA: no role; the root is a plain `div` and the label is read as text. The prefix `span` is decorative and carries `aria-hidden="true"`, so only the label is announced; the cursor `span` is empty and contributes no text.
- Contrast: the prefix uses `var(--text-default)` (≥4.5:1). The label uses `var(--text-brand)`, the logo orange `primary-500` in both themes: 5.5:1 or more on every dark surface, but about 2.9–3.1:1 on the light surfaces, under WCAG 2 AA 4.5:1 and APCA Lc 60. This is an owner-accepted brand exception (the eyebrow matches the logo orange; owner decision 2026-11-16), recorded in `rules/webkit-tokens.md` § "Contrast: APCA and WCAG 2"; the automated axe checks skip `color-contrast` on the `<root>__label` part in light only.
- `motion-reduce:animate-none` on the cursor's `animate-blink-settle`.
- Pause, Stop, Hide (WCAG 2.2.2): the cursor blinks four times and stops by itself after 4 seconds, resting solid, so it needs no pause control.
- Touch target: not applicable (non-interactive).

## Examples

- Default
- Prefixes — every preset `prefix` (`//`, `<>`, `</>`) side by side. Justified: `prefix` is a string union rather than a `kind`, and the three glyphs are the component's main visual axis.
- Cursor — the blinking cursor with and without a prefix. Justified: `cursor` adds an animated element that the Default story does not show.

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
