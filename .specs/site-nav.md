---
name: site-nav
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-12
checksum: f4d6d916ebca0e3b33bd43151c5af3513c528f79f29c00ab8d31a545d3801f0e
---
# SiteNav — Component Spec

## Purpose

The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-nav', props }` entry and binds `props` straight onto it — and it composes `global-header`, `brand`, `navigation-menu`, `icon-button`, `search-trigger`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state. Search is the folded `search-trigger` last in the bar: the section owns no palette, it emits `search` (on a click and on ⌘K / Ctrl K) and the page opens its own `command`, as every header does under `rules/webkit-header-search.md`.

## When to use

- At the top of every marketing page, once.

## When NOT to use

- For the Console's application header → use `global-header` directly.
- For an in-page list of links → use `navigation-menu` or `menu` directly.

## Related

- `global-header` — the bar primitive the navigation is rendered in.
- `navigation-menu` — the mega-menu the bar opens from `xl` up.
- `menu` — the drill-down tree the sheet carries below `xl`.

## Best practices

- Keep a panel to one, two or four columns; only the four-column panel is stretched to the page column.
- Stack a short group under another in the same column (Platform under Observe) instead of adding a fifth column.
- Give every entry an `href`; an entry without one links to `#`.
- Listen to `search` and open the page's `Command` from it (`@search="searchOpen = true"` beside `<Command v-model:open="searchOpen">`); the trigger already carries ⌘K / Ctrl K.
- Leave `secondaryActionOnPhones` off: on a phone the bar keeps the menu button, the mark, the call to action and search, as azion.com does, and Login stays in the sheet footer.
- The bar is `--layout-header-height` tall: `HeroBand` already takes it out of a screen-filling band; a bare `Hero kind="screen"` takes `offset="var(--layout-header-height)"`, never a literal length.
- Don't wrap the bar, add a second search button beside it, or bind ⌘K yourself.

## Usage

```vue
<script setup>
import Command from '@aziontech/webkit/command'
import SiteNav from '@aziontech/webkit/site-nav'
import { ref } from 'vue'

const searchOpen = ref(false)
</script>

<template>
  <SiteNav
    home="/"
    :menus="[
      {
        value: 'developer',
        label: 'Developer',
        columns: [[{ label: 'Docs', items: [{ label: 'Azion Docs', description: 'Documentation and technical references', href: '/docs' }] }]]
      }
    ]"
    :links="[{ label: 'Pricing', href: '/pricing' }]"
    :contact="{ label: 'Contact', href: '/contact' }"
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Login', href: '/login' }"
    @search="searchOpen = true"
  />
  <Command v-model:open="searchOpen"><!-- Command.Input, Command.List … --></Command>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `home` | `string` | `'/'` | false | Where the Azion mark links. |
| `menus` | `SiteNavMenu[]` | `—` | true | The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. |
| `links` | `SiteNavLink[]` | `[]` | false | Bar entries that open no panel, after the menus; each is `{ label, href }`. |
| `contact` | `SiteNavLink` | `undefined` | false | Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`. |
| `primaryAction` | `SiteNavLink` | `undefined` | false | The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`. |
| `secondaryAction` | `SiteNavLink` | `undefined` | false | The login button beside it, in the bar from `sm` up and in the sheet footer; `{ label, href }`. |
| `secondaryActionOnPhones` | `boolean` | `false` | false | Keeps the login button in the bar below `sm` too; off, it steps out on phones, as on azion.com, and stays in the sheet footer. |

## Events

| Event | Payload | Description |
|---|---|---|
| `search` | `(event: MouseEvent \| KeyboardEvent)` | Fired when the search trigger is clicked or ⌘K / Ctrl K is pressed with no mounted `Command` claiming it; open the page's `Command` from it. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the sheet is `open` or closed (local state, owned by `drawer`)
- Closing the sheet resets its drill path; following a leaf of the tree closes the sheet
- The bar reads its own inline inset on mount and on resize, so the four-column panel's collision padding lands it on the page column's leading edge
- Each panel's column count is mirrored on `data-columns` and drives its track count; only a four-column panel is stretched to the page column
- An absent `contact`, `primaryAction` or `secondaryAction` is omitted from the bar and the sheet
- The secondary action steps out of the bar below `sm` unless `secondaryActionOnPhones`; the sheet footer always carries it

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| mark hover | `transition-opacity duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| focus ring | `var(--ring-color)`, offset `var(--bg-canvas)` |
| mark link shape | `var(--shape-elements)` |
| panel column width | `var(--layout-measure-site-header)`, `var(--layout-boundary-inline)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the mark link draws the ring token; triggers, items and buttons own theirs.
- Keyboard map: `Tab` moves through the bar; ⌘K / Ctrl K fires `search` (a mounted `Command` claims the shortcut first); the mega-menu and the sheet own their keyboard models (arrows, `Enter`, `Esc` closes and restores focus to the trigger).
- ARIA: the bar is the `global-header` landmark named "Azion", so the root is a plain `div`; the mark link is named "Azion home"; the menu button "Open navigation" is an icon button with a name; the search trigger is named "Search" and announces `aria-keyshortcuts` (`Meta+K Control+K`); the sheet is titled "Menu".
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link; the sheet and the panels own their reduced-motion fallbacks.
- Touch target ≥40×40 px — the medium buttons and icon buttons meet it.

## Examples

- Default — the site's navigation; `search` opens a `Command` palette on the page, and Login steps out of the bar on phones.

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
