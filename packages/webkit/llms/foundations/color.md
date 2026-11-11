# Color

> Semantic color roles, light and dark themes, and the color tokens by group.

## Purpose

A screen that "looks right" is only half-verified — it looks right in the theme you happened to open.
The `@aziontech/theme` tokens make both themes free **if** you style through them: a token names a
**role** (`--bg-surface`, `--text-default`, `--border-default`), and its value flips per theme
automatically. The moment a hex, an `rgb()`, or a Tailwind palette color (`bg-zinc-900`,
`text-white`) lands on an element, you have hard-coded one theme and broken the other. This skill
fixes the discipline that keeps every screen theme-correct with no per-theme branches.

## How to use

- `/webkit-theming-dark-mode` — apply the token discipline to any screen you build in this
  conversation, and switch to the dark check before declaring it done.
- `/webkit-theming-dark-mode <file>` — review the file and report, per gap: the quoted line, the
  hard-coded color, and the semantic token that replaces it.

## How to find the tokens and components

Never guess a token or an import path. Resolve both from the contract, not from memory:

- Token names: read **`node_modules/@aziontech/theme`** (the semantic color set) — a name that is not
  defined there does not exist. Roles you will reach for most: `--bg-canvas`, `--bg-surface`,
  `--bg-surface-raised`, `--bg-surface-overlay`, `--text-default`, `--text-secondary`,
  `--border-default`, `--primary`, `--primary-contrast`.
- Components: ask the **webkit MCP** (`suggest_component`) or read
  **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real subpath.

## How theming works — light is default, dark is opt-in

The tokens default to **light**: the light values live in `:root` (and `[data-theme=light]`). **Dark
is opt-in** — set `data-theme="dark"` on the `<html>` element (the tokens also respond to a `.dark`
class on any ancestor). Nothing else changes; the same `var(--bg-surface)` now resolves to its dark
value.

```html
<!-- dark from the first paint -->
<html data-theme="dark"></html>
```

A runtime toggle is just a write to that attribute — the whole tree re-themes with no re-render:

```ts
function toggleTheme() {
  const el = document.documentElement
  el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark'
}
```

## The core rule — style through the role, never the value

A token carries the role; its value is the theme's job. Reference the role and both themes are handled
at once. Bind a raw color and you have pinned one theme.

```vue
<!-- ✅ role-based: correct in both themes, no branches -->
<div class="bg-(--bg-surface) text-(--text-default) border border-(--border-default)">
  <span class="text-(--primary)">Active</span>
</div>

<!-- ❌ value-based: legible in one theme, broken in the other -->
<div class="bg-white text-[#1a1a1a] border border-zinc-200">
  <span class="text-blue-600">Active</span>
</div>
```

This is the same token catalog the design-system components render with, so a screen built on tokens
sits seamlessly next to `<Button>`, `<Card>`, and the rest in either theme.

## Elevation in dark = a lighter surface, not a heavier shadow

Shadows barely read on a dark ground — stacking depth comes from **surface lightness**, not from a
bigger `box-shadow`. That is exactly what the surface tokens encode: `--bg-surface-raised` and
`--bg-surface-overlay` are _lighter_ than `--bg-surface` in dark, and correctly _shadowed/tinted_ in
light. Use the role for the layer and both themes get the right depth cue. Discover the exact surface
names from the theme package; never invent a `surface-3`.

```vue
<!-- page → card → menu: each layer is a role, depth reads in both themes -->
<div class="bg-(--bg-canvas)">
  <div class="bg-(--bg-surface)">...</div>
  <div class="bg-(--bg-surface-raised)">popover / menu</div>
</div>
```

## Loading placeholders use a translucent role, not a surface

A surface token is opaque and tuned for one background, so a skeleton built from one is only legible on
the surface it was picked against — and it inverts badly across themes. `--bg-placeholder` (the fill)
and `--bg-placeholder-highlight` (the sweep) are **translucent**: they composite over whatever layer
they sit on, so the same token holds its contrast on canvas, surface, raised and overlay alike, in both
themes. Keep the fill as `background-color` and put the sweep in a gradient whose other stops are
`transparent`, so the animated and static states share one base tone.

```vue
<!-- ❌ opaque surface as a placeholder: near-invisible on a card in light -->
<div class="bg-(--bg-surface-overlay)" />
<!-- ✅ translucent placeholder role, correct on any layer in both themes -->
<div class="bg-(--bg-placeholder)" />
```

Prefer the design system's `Skeleton` component over hand-rolling this — it already pairs the tokens
with the shimmer animation and its reduced-motion fallback.

## Don't fight the tokens with `dark:` overrides

If a role has a token, the token already handles both themes — adding `dark:bg-…` on top is redundant
at best and drifts the two themes apart at worst. Reach for Tailwind's `dark:` variant **only** for
the rare property no token expresses (and even then, prefer proposing the missing token). A screen
full of `dark:` overrides is a screen that stopped trusting the tokens.

```vue
<!-- ❌ re-implements what --bg-surface already does per theme -->
<div class="bg-white dark:bg-zinc-900 text-black dark:text-white">
<!-- ✅ one role, no per-theme branch -->
<div class="bg-(--bg-surface) text-(--text-default)">
```

## A card that needs zero changes across themes

Every color here is a role. Toggle `data-theme` and it re-themes with no edit — surface, text, border,
and accent all move together.

```vue
<script setup lang="ts">
  function toggleTheme() {
    const el = document.documentElement
    el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark'
  }
</script>

<template>
  <article
    class="rounded-(--shape-card) p-(--spacing-md)
           bg-(--bg-surface) text-(--text-default)
           border border-(--border-default)"
  >
    <h3 class="text-(--text-default)">Workload health</h3>
    <p class="text-(--text-secondary)">Requests are within normal range.</p>
    <span class="text-(--primary)">View details</span>
    <button
      class="mt-(--spacing-sm) text-(--primary)"
      @click="toggleTheme"
    >
      Toggle theme
    </button>
  </article>
</template>
```

## Accents that appear on both grounds

A brand accent tuned for a white page can vibrate or wash out on a dark one. Use the theme's own
accent tokens (`--primary` and friends), which are already balanced per theme; if you must introduce a
new accent, verify its **contrast against both** `--bg-canvas` values and desaturate it until it reads
on both — do not ship a single saturated hex for both grounds.

## Validate BOTH themes before "done"

A screen tested in one theme is **not done**. The `webkit-ui-verify` runtime check screenshots the
view in light **and** dark — run it, look at both, and confirm text contrast, surface separation, and
accents all hold. A regression that only shows in dark is invisible until someone opens dark mode in
production; the two-theme screenshot is what catches it first.

## Hard rules

- Style through **semantic tokens** only — no hex, `rgb()`/`hsl()`, or Tailwind palette color
  (`bg-white`, `text-zinc-900`, `border-slate-200`) anywhere on the screen.
- Dark is `data-theme="dark"` on `<html>` (or a `.dark` ancestor); light is the default `:root`. Don't
  ship a second stylesheet or a JS color map for dark.
- Depth in dark comes from **lighter surface tokens** (`--bg-surface-raised` / `--bg-surface-overlay`),
  not a heavier shadow.
- No `dark:` override for a role a token already covers; reserve `dark:` for the property no token
  expresses, and prefer proposing the token.
- Every new accent is contrast-checked and desaturated for **both** grounds.
- A screen is done only after it is verified in **both** themes (`webkit-ui-verify` two-theme
  screenshots).

## Review output

For `/webkit-theming-dark-mode <file>`, list gaps grouped by element. Each:

```
✗ WorkloadCard.vue:14  class="bg-white text-zinc-900 border-slate-200"
  theme: hard-coded light values — dark renders white-on-dark, unreadable.
  fix: bg-(--bg-surface) text-(--text-default) border-(--border-default)
```

End with: `theme-safe (both themes)` or `N gaps — fix before verifying`.

## Definition of Done

- [ ] Every color on the screen is a semantic token — zero hex / rgb / palette / one-theme values.
- [ ] Dark is driven by `data-theme` / `.dark`, not a duplicate stylesheet or JS color branch.
- [ ] Stacked layers use surface-role tokens; depth reads correctly in dark without heavier shadows.
- [ ] No `dark:` override stands in for a role a token already carries.
- [ ] The screen was screenshotted and checked in **both** light and dark before being called done.

## Color tokens

| Group | Count | Tokens |
| --- | --- | --- |
| primary | 4 | `--primary` · `--primary-contrast` · `--primary-mask` · `--primary-selected` |
| secondary | 4 | `--secondary` · `--secondary-contrast` · `--secondary-mask` · `--secondary-selected` |
| accent | 4 | `--accent` · `--accent-contrast` · `--accent-mask` · `--accent-selected` |
| bg | 13 | `--bg-active` · `--bg-backdrop` · `--bg-canvas` · `--bg-contrast` · `--bg-disabled` · `--bg-hover` · `--bg-mask` · `--bg-placeholder` · `--bg-placeholder-highlight` · `--bg-selected` · `--bg-surface` · `--bg-surface-overlay` · `--bg-surface-raised` |
| surface | 18 | `--surface-0` · `--surface-100` · `--surface-150` · `--surface-200` · `--surface-250` · `--surface-275` · `--surface-300` · `--surface-400` · `--surface-50` · `--surface-500` · `--surface-600` · `--surface-650` · `--surface-700` · `--surface-750` · `--surface-775` · `--surface-800` · `--surface-900` · `--surface-950` |
| text | 190 | `--text-2xl` · `--text-2xl--line-height` · `--text-3xl` · `--text-3xl--line-height` · `--text-4xl` · `--text-4xl--line-height` · `--text-5xl` · `--text-5xl--line-height` · `--text-6xl` · `--text-6xl--line-height` · `--text-7xl` · `--text-7xl--line-height` · `--text-8xl` · `--text-8xl--line-height` · `--text-9xl` · `--text-9xl--line-height` · `--text-amount-lg-font-size` · `--text-amount-lg-font-weight` · `--text-amount-lg-letter-spacing` · `--text-amount-lg-line-height` · `--text-amount-lg-text-wrap-style` · `--text-amount-md-font-size` · `--text-amount-md-font-weight` · `--text-amount-md-letter-spacing` · `--text-amount-md-line-height` · `--text-amount-md-text-wrap-style` · `--text-amount-sm-font-size` · `--text-amount-sm-font-weight` · `--text-amount-sm-letter-spacing` · `--text-amount-sm-line-height` · `--text-base` · `--text-base--line-height` · `--text-big-number-lg-font-family` · `--text-big-number-lg-font-size` · `--text-big-number-lg-font-weight` · `--text-big-number-lg-line-height` · `--text-big-number-md-font-family` · `--text-big-number-md-font-size` · `--text-big-number-md-font-weight` · `--text-big-number-md-line-height` · `--text-big-number-sm-font-family` · `--text-big-number-sm-font-size` · `--text-big-number-sm-font-weight` · `--text-big-number-sm-line-height` · `--text-body-code-sm-font-family` · `--text-body-code-sm-font-size` · `--text-body-code-sm-font-weight` · `--text-body-code-sm-letter-spacing` · `--text-body-code-sm-line-height` · `--text-body-code-sm-text-wrap-style` · `--text-body-lg-font-size` · `--text-body-lg-font-weight` · `--text-body-lg-line-height` · `--text-body-lg-text-wrap-style` · `--text-body-md-font-size` · `--text-body-md-font-weight` · `--text-body-md-line-height` · `--text-body-md-text-wrap-style` · `--text-body-prose-md-font-size` · `--text-body-prose-md-font-weight` · `--text-body-prose-md-line-height` · `--text-body-sm-font-size` · `--text-body-sm-font-weight` · `--text-body-sm-line-height` · `--text-body-sm-text-wrap-style` · `--text-body-xs-font-size` · `--text-body-xs-font-weight` · `--text-body-xs-line-height` · `--text-body-xs-text-wrap-style` · `--text-body-xxs-font-size` · `--text-body-xxs-font-weight` · `--text-body-xxs-line-height` · `--text-body-xxs-text-wrap-style` · `--text-button-lg-font-family` · `--text-button-lg-font-size` · `--text-button-lg-font-weight` · `--text-button-lg-letter-spacing` · `--text-button-lg-line-height` · `--text-button-md-font-family` · `--text-button-md-font-size` · `--text-button-md-font-weight` · `--text-button-md-letter-spacing` · `--text-button-md-line-height` · `--text-contrast` · `--text-default` · `--text-disabled` · `--text-heading-2xl-font-size` · `--text-heading-2xl-font-weight` · `--text-heading-2xl-letter-spacing` · `--text-heading-2xl-line-height` · `--text-heading-2xl-text-wrap-style` · `--text-heading-3xl-font-size` · `--text-heading-3xl-font-weight` · `--text-heading-3xl-letter-spacing` · `--text-heading-3xl-line-height` · `--text-heading-3xl-text-wrap-style` · `--text-heading-lg-font-size` · `--text-heading-lg-font-weight` · `--text-heading-lg-letter-spacing` · `--text-heading-lg-line-height` · `--text-heading-lg-text-wrap-style` · `--text-heading-md-font-size` · `--text-heading-md-font-weight` · `--text-heading-md-letter-spacing` · `--text-heading-md-line-height` · `--text-heading-md-text-wrap-style` · `--text-heading-sm-font-size` · `--text-heading-sm-font-weight` · `--text-heading-sm-letter-spacing` · `--text-heading-sm-line-height` · `--text-heading-sm-text-wrap-style` · `--text-heading-xl-font-size` · `--text-heading-xl-font-weight` · `--text-heading-xl-letter-spacing` · `--text-heading-xl-line-height` · `--text-heading-xl-text-wrap-style` · `--text-heading-xs-font-size` · `--text-heading-xs-font-weight` · `--text-heading-xs-letter-spacing` · `--text-heading-xs-line-height` · `--text-heading-xs-text-wrap-style` · `--text-heading-xxs-font-size` · `--text-heading-xxs-font-weight` · `--text-heading-xxs-letter-spacing` · `--text-heading-xxs-line-height` · `--text-heading-xxs-text-wrap-style` · `--text-label-code-lg-font-family` · `--text-label-code-lg-font-size` · `--text-label-code-lg-font-weight` · `--text-label-code-lg-letter-spacing` · `--text-label-code-lg-line-height` · `--text-label-code-md-font-family` · `--text-label-code-md-font-size` · `--text-label-code-md-font-weight` · `--text-label-code-md-letter-spacing` · `--text-label-code-md-line-height` · `--text-label-code-sm-font-family` · `--text-label-code-sm-font-size` · `--text-label-code-sm-font-weight` · `--text-label-code-sm-letter-spacing` · `--text-label-code-sm-line-height` · `--text-label-lg-font-size` · `--text-label-lg-font-weight` · `--text-label-lg-letter-spacing` · `--text-label-lg-line-height` · `--text-label-md-font-size` · `--text-label-md-font-weight` · `--text-label-md-letter-spacing` · `--text-label-md-line-height` · `--text-label-sm-font-size` · `--text-label-sm-font-weight` · `--text-label-sm-letter-spacing` · `--text-label-sm-line-height` · `--text-lg` · `--text-lg--line-height` · `--text-link` · `--text-link-border-radius` · `--text-link-color` · `--text-link-font-size` · `--text-link-hover` · `--text-link-line-height` · `--text-link-transition` · `--text-muted` · `--text-overline-md-font-family` · `--text-overline-md-font-size` · `--text-overline-md-letter-spacing` · `--text-overline-md-line-height` · `--text-overline-md-text-transform` · `--text-overline-sm-font-family` · `--text-overline-sm-font-size` · `--text-overline-sm-letter-spacing` · `--text-overline-sm-line-height` · `--text-overline-sm-text-transform` · `--text-overline-xs-font-family` · `--text-overline-xs-font-size` · `--text-overline-xs-letter-spacing` · `--text-overline-xs-line-height` · `--text-overline-xs-text-transform` · `--text-sm` · `--text-sm--line-height` · `--text-tag-md-font-size` · `--text-tag-md-font-weight` · `--text-tag-md-line-height` · `--text-tag-sm-font-size` · `--text-tag-sm-font-weight` · `--text-tag-sm-line-height` · `--text-xl` · `--text-xl--line-height` · `--text-xs` · `--text-xs--line-height` |
| border | 10 | `--border-0` · `--border-1` · `--border-2` · `--border-3` · `--border-4` · `--border-default` · `--border-muted` · `--border-selected` · `--border-strong` · `--border-width-default` |
| ring | 2 | `--ring-color` · `--ring-offset` |
| success | 3 | `--success` · `--success-border` · `--success-contrast` |
| warning | 3 | `--warning` · `--warning-border` · `--warning-contrast` |
| danger | 3 | `--danger` · `--danger-border` · `--danger-contrast` |
| info | 3 | `--info` · `--info-border` · `--info-contrast` |
| severity | 5 | `--severity-critical` · `--severity-high` · `--severity-info` · `--severity-low` · `--severity-medium` |
| chart | 29 | `--chart-axis` · `--chart-crosshair` · `--chart-diverging-negative` · `--chart-diverging-neutral` · `--chart-diverging-positive` · `--chart-grid` · `--chart-label` · `--chart-sequential-1` · `--chart-sequential-2` · `--chart-sequential-3` · `--chart-sequential-4` · `--chart-sequential-5` · `--chart-sequential-6` · `--chart-sequential-7` · `--chart-series-1` · `--chart-series-2` · `--chart-series-3` · `--chart-series-4` · `--chart-series-5` · `--chart-series-6` · `--chart-series-other` · `--chart-status-danger` · `--chart-status-info` · `--chart-status-success` · `--chart-status-warning` · `--chart-tooltip-bg` · `--chart-tooltip-border` · `--chart-tooltip-muted` · `--chart-tooltip-text` |
| code | 8 | `--code-sintax-comment` · `--code-sintax-function` · `--code-sintax-identifier` · `--code-sintax-keyword` · `--code-sintax-line-number` · `--code-sintax-punctuation` · `--code-sintax-string` · `--code-sintax-type` |
| illustration | 21 | `--illustration-accent` · `--illustration-block` · `--illustration-code-keyword` · `--illustration-code-punctuation` · `--illustration-danger` · `--illustration-ground` · `--illustration-highlight` · `--illustration-info` · `--illustration-info-surface` · `--illustration-ink` · `--illustration-ink-muted` · `--illustration-line` · `--illustration-line-muted` · `--illustration-line-strong` · `--illustration-primary` · `--illustration-success` · `--illustration-success-surface` · `--illustration-surface` · `--illustration-surface-raised` · `--illustration-warning` · `--illustration-warning-surface` |
| color | 214 | `--color-absolute-black` · `--color-absolute-white` · `--color-alpha-absolute-black` · `--color-alpha-absolute-white` · `--color-alpha-black-100` · `--color-alpha-black-200` · `--color-alpha-black-300` · `--color-alpha-black-400` · `--color-alpha-black-50` · `--color-alpha-black-500` · `--color-alpha-black-600` · `--color-alpha-black-700` · `--color-alpha-black-800` · `--color-alpha-black-900` · `--color-alpha-blue-100` · `--color-alpha-blue-200` · `--color-alpha-blue-300` · `--color-alpha-blue-400` · `--color-alpha-blue-50` · `--color-alpha-blue-500` · `--color-alpha-blue-600` · `--color-alpha-blue-700` · `--color-alpha-blue-800` · `--color-alpha-blue-900` · `--color-alpha-green-100` · `--color-alpha-green-200` · `--color-alpha-green-300` · `--color-alpha-green-400` · `--color-alpha-green-50` · `--color-alpha-green-500` · `--color-alpha-green-600` · `--color-alpha-green-700` · `--color-alpha-green-800` · `--color-alpha-green-900` · `--color-alpha-orange-100` · `--color-alpha-orange-200` · `--color-alpha-orange-300` · `--color-alpha-orange-400` · `--color-alpha-orange-50` · `--color-alpha-orange-500` · `--color-alpha-orange-600` · `--color-alpha-orange-700` · `--color-alpha-orange-800` · `--color-alpha-orange-900` · `--color-alpha-red-100` · `--color-alpha-red-200` · `--color-alpha-red-300` · `--color-alpha-red-400` · `--color-alpha-red-50` · `--color-alpha-red-500` · `--color-alpha-red-600` · `--color-alpha-red-700` · `--color-alpha-red-800` · `--color-alpha-red-900` · `--color-alpha-violet-100` · `--color-alpha-violet-200` · `--color-alpha-violet-300` · `--color-alpha-violet-400` · `--color-alpha-violet-50` · `--color-alpha-violet-500` · `--color-alpha-violet-600` · `--color-alpha-violet-700` · `--color-alpha-violet-800` · `--color-alpha-violet-900` · `--color-alpha-white-100` · `--color-alpha-white-200` · `--color-alpha-white-300` · `--color-alpha-white-400` · `--color-alpha-white-50` · `--color-alpha-white-500` · `--color-alpha-white-600` · `--color-alpha-white-700` · `--color-alpha-white-800` · `--color-alpha-white-900` · `--color-alpha-yellow-100` · `--color-alpha-yellow-200` · `--color-alpha-yellow-300` · `--color-alpha-yellow-400` · `--color-alpha-yellow-50` · `--color-alpha-yellow-500` · `--color-alpha-yellow-600` · `--color-alpha-yellow-700` · `--color-alpha-yellow-800` · `--color-alpha-yellow-900` · `--color-base-black` · `--color-base-white` · `--color-blue-100` · `--color-blue-200` · `--color-blue-300` · `--color-blue-400` · `--color-blue-50` · `--color-blue-500` · `--color-blue-600` · `--color-blue-700` · `--color-blue-800` · `--color-blue-900` · `--color-blue-950` · `--color-brand-accent-100` · `--color-brand-accent-200` · `--color-brand-accent-300` · `--color-brand-accent-400` · `--color-brand-accent-50` · `--color-brand-accent-500` · `--color-brand-accent-600` · `--color-brand-accent-700` · `--color-brand-accent-800` · `--color-brand-accent-900` · `--color-brand-accent-950` · `--color-brand-primary-100` · `--color-brand-primary-200` · `--color-brand-primary-300` · `--color-brand-primary-400` · `--color-brand-primary-50` · `--color-brand-primary-500` · `--color-brand-primary-600` · `--color-brand-primary-700` · `--color-brand-primary-800` · `--color-brand-primary-900` · `--color-brand-primary-950` · `--color-gray-100` · `--color-gray-150` · `--color-gray-200` · `--color-gray-250` · `--color-gray-275` · `--color-gray-300` · `--color-gray-400` · `--color-gray-50` · `--color-gray-500` · `--color-gray-600` · `--color-gray-650` · `--color-gray-700` · `--color-gray-750` · `--color-gray-775` · `--color-gray-800` · `--color-gray-900` · `--color-gray-950` · `--color-green-100` · `--color-green-200` · `--color-green-300` · `--color-green-400` · `--color-green-50` · `--color-green-500` · `--color-green-600` · `--color-green-700` · `--color-green-800` · `--color-green-900` · `--color-green-950` · `--color-orange-100` · `--color-orange-200` · `--color-orange-300` · `--color-orange-400` · `--color-orange-50` · `--color-orange-500` · `--color-orange-600` · `--color-orange-700` · `--color-orange-800` · `--color-orange-900` · `--color-orange-950` · `--color-red-100` · `--color-red-200` · `--color-red-300` · `--color-red-400` · `--color-red-50` · `--color-red-500` · `--color-red-600` · `--color-red-700` · `--color-red-800` · `--color-red-900` · `--color-red-950` · `--color-slate-100` · `--color-slate-200` · `--color-slate-300` · `--color-slate-400` · `--color-slate-50` · `--color-slate-500` · `--color-slate-600` · `--color-slate-700` · `--color-slate-800` · `--color-slate-900` · `--color-slate-950` · `--color-surface-0` · `--color-surface-100` · `--color-surface-200` · `--color-surface-300` · `--color-surface-400` · `--color-surface-50` · `--color-surface-500` · `--color-surface-600` · `--color-surface-700` · `--color-surface-800` · `--color-surface-900` · `--color-surface-950` · `--color-violet-100` · `--color-violet-200` · `--color-violet-300` · `--color-violet-400` · `--color-violet-50` · `--color-violet-500` · `--color-violet-600` · `--color-violet-700` · `--color-violet-800` · `--color-violet-900` · `--color-violet-950` · `--color-yellow-100` · `--color-yellow-200` · `--color-yellow-300` · `--color-yellow-400` · `--color-yellow-50` · `--color-yellow-500` · `--color-yellow-600` · `--color-yellow-700` · `--color-yellow-800` · `--color-yellow-900` · `--color-yellow-950` |
