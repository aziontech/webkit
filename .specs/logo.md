---
name: logo
category: content
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: 354a34f87e423b8574527fc29d3e27d0415b8c3a0f2ac02ef9832cd74c134eda
created: 2026-11-14
last_updated: 2026-11-14
---

# Logo — Component Spec

## Purpose

A third-party mark (a client, a competitor, an analyst firm, a standard or certification, a coding agent) drawn right on both themes. The asset registries already hold the files (`@aziontech/webkit/assets/client-registry`, `@aziontech/webkit/assets/competitor-registry` and the `@aziontech/webkit/assets/<file>.svg` exports); every surface that drew one repeated the same theme rule by hand (two `img` tags revealed per `[data-theme]`, a `brightness-0` silhouette, a CSS mask in `currentColor`) and none had every route. `Logo` holds the rule once: a light/dark pair of files, or one file inverted on the theme where it would vanish, or one ink (the theme's black or white, the surrounding `currentColor`, or black pinned for a coloured fill), and the company's name as a typographic wordmark when there is no file yet. It replaces the design sample's `AgentMark` and `ClientMark`. It is a renderer: it takes the file URLs from a registry entry and imports no registry itself, so a page pays only for the marks it shows.

## When to use

- A logo wall, a trust strip, a client story card, a quote attribution, a comparison column head: any place that shows another company's mark.
- The coding agents a prompt works with (Claude, Codex, Gemini, Cursor), drawn in the ink of the surface they sit on.
- A list of standards or analyst firms (SOC, PCI DSS, Gartner, Forrester).

## When NOT to use

- The Azion logo → use `Brand`.
- A card network beside a payment method → use `PaymentBrand`.
- A person or an account → use `Avatar`.
- A product icon or a UI glyph → use an icon from `@aziontech/icons`.
- A grid of client marks → use `LogoWall`; it renders each mark and can render `Logo` in its `mark` slot.

## Related

- `brand` — the Azion lockup; `Logo` is everyone else's.
- `payment-brand` — card-network plates, drawn in tokens.
- `logo-wall` — the grid that lays marks out; `Logo` draws one mark.
- `avatar` — a person's or an organization's picture with initials.

## Best practices

- Pass a registry entry as it stands: `name`, `src` from `logo`, `src-light` from `logoLight`, `artwork` from `artwork`. The registry knows which theme each file is drawn for.
- Set the height with `size`: `small` (16 px) beside a label or in a table cell, `medium` (24 px, the default) in a card or a list, `large` (32 px) in a logo wall or a quote attribution. The width follows each file's own aspect ratio. Cap wide wordmarks with `max-w-*`.
- In a list of many clients, use `kind="monochrome"`: per-brand colour reads as noise next to twenty others.
- On a coloured fill (white, `--primary`), use `kind="knockout"`: a fill does not follow the theme, so the ink must not either.
- On a surface that is dark in both themes, or among drawn diagram parts, use `kind="current"` so the mark takes the surface's own ink.
- When the text beside the mark already names the company, set `decorative`.

## Usage

```vue
<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import Logo from '@aziontech/webkit/logo'

  const client = CLIENTS[0]
</script>

<template>
  <Logo
    :name="client.name"
    :src="client.logo"
    :src-light="client.logoLight"
    :artwork="client.artwork"
    size="large"
    class="max-w-40"
  />
</template>
```

## Props

| Prop         | Type                                                 | Default    | Required | JSDoc                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | `string`                                             | —          | true     | The company or product the mark belongs to; the accessible name, and the typographic wordmark drawn when no file is set.                                                                                                     |
| `src`        | `string`                                             | `''`       | false    | URL of the mark; on its own it serves both themes, and with `srcLight` it is the dark-theme file. Empty draws the wordmark.                                                                                                  |
| `srcLight`   | `string`                                             | `''`       | false    | URL of the light-theme file; with `src` both files render and the theme reveals one.                                                                                                                                         |
| `artwork`    | `'color' \| 'light' \| 'dark'`                       | `'color'`  | false    | The ink a single file is drawn in: `light` art (for dark surfaces) is inverted on the light theme, `dark` art is inverted on the dark theme, `color` is kept as is. Ignored when `srcLight` is set or `kind` is not `color`. |
| `kind`       | `'color' \| 'monochrome' \| 'current' \| 'knockout'` | `'color'`  | false    | Ink: `color` keeps the vendor's colours, `monochrome` paints one silhouette black on light and white on dark, `current` paints it in the surrounding text colour, `knockout` pins it black for a mark on a coloured fill.    |
| `ariaLabel`  | `string`                                             | `''`       | false    | Accessible name when it should differ from `name`.                                                                                                                                                                           |
| `size`       | `'small' \| 'medium' \| 'large'`                     | `'medium'` | false    | Height of the mark: `small` 16 px, `medium` 24 px, `large` 32 px; the width follows the file's aspect ratio.                                                                                                                 |
| `decorative` | `boolean`                                            | `false`    | false    | Hides the mark from assistive technology when the text beside it already names the company.                                                                                                                                  |

## Events

_none_

## Slots

_none_

## States

- `data-kind` on the root: `color` | `monochrome` | `current` | `knockout`.
- `data-route` on the root: `pair` (both files in the DOM, the theme reveals one), `single` (one file, filtered by `artwork` or the ink of `kind`), `wordmark` (no file: the name in type).
- `data-artwork` on the root mirrors `artwork`.
- `data-size` on the root mirrors `size`: `small` is `h-4`, `medium` is `h-6`, `large` is `h-8`.
- `data-sized` on the root when the caller's class sets a height (`h-*` or `size-*`, with or without a breakpoint); it then wins over `size`.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed` (a static mark).

## Motion & Animations

_none_

## Tokens

| Region        | Token (DESIGN.md)     |
| ------------- | --------------------- |
| wordmark type | `.text-heading-xxs`   |
| wordmark ink  | `var(--text-default)` |

The inks need no colour token: `current` paints `currentColor` through a CSS mask, `monochrome` and `knockout` are filters (`brightness-0`, then `invert` on the dark theme for `monochrome`).

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: an image (`role="img"` on the root) named by `ariaLabel`, else `name`. The files inside have empty `alt` and are `aria-hidden`, so a light/dark pair is announced once.
- With `decorative` the root is `aria-hidden="true"` and has no role.
- Not focusable; no keyboard map (a static mark).
- Contrast: marks are logos (WCAG 1.4.3 exempts logotypes); the `monochrome` route makes a mark pure black or white against the page, and `knockout` pure black on a light fill.
- Forced colors: the `current` route paints `currentColor`, so it follows `CanvasText`.
- No motion.

## Internationalization

No built-in strings: the accessible name and the wordmark are the `name` the consumer passes (a trademark, not translated).

- Formatting: none.

## Right-to-left

- Layout: one inline element; no physical spacing.
- Icons: logos are never mirrored.
- Keyboard: none.
- User data: the wordmark is the company name, wrapped in `dir="auto"` so a name in another script keeps its own direction.

## Responsive

- Container queries: none; `size` sets the height and the caller sets the width cap (`max-w-*`).
- Narrow: the files keep their aspect ratio inside the cap (`object-contain`); the wordmark does not wrap.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px when the caller caps the width.

## Performance

- Bundle budget: 1.5 KB gzip for `./logo` in `.size-limit.json`.
- Runtime budget: one or two `img` elements per mark; files decode asynchronously (`decoding="async"`).
- Heavy parts: none. The component imports no registry and no asset; the caller imports only the files it shows.

## Examples

- Default — a client from the registry with its light/dark pair.
- Sizes — `small`, `medium` and `large` on the same client pair and a wordmark.
- Types — the four inks (`color`, `monochrome`, `current`, `knockout`) on the same row of marks: a client pair, a single `light` artwork file inverted on the light theme, a coding agent and a wordmark with no file.

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
