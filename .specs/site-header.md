---
name: site-header
category: sections
structure: monolithic
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-15
checksum: f766247227295377d7627efa354c98c3f071efdeee1aa18f12b479a5c557dc4c
template: 2
---

# SiteHeader — Component Spec

## Purpose

The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-header', props }` entry and binds `props` straight onto it — and it composes `app-header`, `brand`, `navigation-menu`, `icon-button`, `search-trigger`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `sidebar-menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state. Search is the folded `search-trigger` last in the bar: the section owns no palette, it emits `search` (on a click and on ⌘K / Ctrl K) and the page opens its own `command`, as every header does under `rules/webkit-header-search.md`.

## When to use

- Use SiteHeader for the marketing site's top bar (mega-menus and mobile sheet).
- At the top of every marketing page, once.

## When NOT to use

- For the Console's application header → use `app-header` directly.
- For an in-page list of links → use `navigation-menu` or `sidebar-menu` directly.

## Related

- `app-header` — the bar primitive the navigation is rendered in.
- `navigation-menu` — the mega-menu the bar opens from `xl` up.
- `sidebar-menu` — the drill-down tree the sheet carries below `xl`.

## Best practices

- Keep a panel to one, two or four columns; only the four-column panel is stretched to the page column.
- Stack a short group under another in the same column (Platform under Observe) instead of adding a fifth column.
- Give every entry an `href`; an entry without one links to `#`.
- Listen to `search` and open the page's `Command` from it (`@search="searchOpen = true"` beside `<Command v-model:open="searchOpen">`); the trigger already carries ⌘K / Ctrl K.
- Leave `secondaryActionOnPhones` off: on a phone the bar keeps the menu button, the mark, the call to action and search, as azion.com does, and Login stays in the sheet footer.
- The bar is `--layout-header-height` tall: `HeroSection` already takes it out of a screen-filling band; a bare `Hero variant="screen"` takes `offset="var(--layout-header-height)"`, never a literal length.
- Don't wrap the bar, add a second search button beside it, or bind ⌘K yourself.

## Usage

```vue
<script setup>
  import Command from '@aziontech/webkit/command'
  import SiteHeader from '@aziontech/webkit/site-header'
  import { ref } from 'vue'

  const searchOpen = ref(false)
</script>

<template>
  <SiteHeader
    home="/"
    :menus="[
      {
        value: 'developer',
        label: 'Developer',
        columns: [
          [
            {
              label: 'Docs',
              items: [
                {
                  label: 'Azion Docs',
                  description: 'Documentation and technical references',
                  href: '/docs'
                }
              ]
            }
          ]
        ]
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

| Prop                      | Type               | Default     | Required | JSDoc                                                                                                                                                                                                             |
| ------------------------- | ------------------ | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`                    | `string`           | `'/'`       | false    | Where the Azion mark links.                                                                                                                                                                                       |
| `menus`                   | `SiteHeaderMenu[]` | `—`         | true     | The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. |
| `links`                   | `SiteHeaderLink[]` | `[]`        | false    | Bar entries that open no panel, after the menus; each is `{ label, href }`.                                                                                                                                       |
| `contact`                 | `SiteHeaderLink`   | `undefined` | false    | Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`.                                                                                                                         |
| `primaryAction`           | `SiteHeaderLink`   | `undefined` | false    | The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`.                                                                                                                                |
| `secondaryAction`         | `SiteHeaderLink`   | `undefined` | false    | The login button beside it, in the bar from `sm` up and in the sheet footer; `{ label, href }`.                                                                                                                   |
| `secondaryActionOnPhones` | `boolean`          | `false`     | false    | Keeps the login button in the bar below `sm` too; off, it steps out on phones, as on azion.com, and stays in the sheet footer.                                                                                    |

## Events

| Event    | Payload                                | Description                                                                                                                                  |
| -------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `search` | `(event: MouseEvent \| KeyboardEvent)` | Fired when the search trigger is clicked or ⌘K / Ctrl K is pressed with no mounted `Command` claiming it; open the page's `Command` from it. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the sheet is `open` or closed (local state, owned by `drawer`)
- Closing the sheet resets its drill path; following a leaf of the tree closes the sheet
- The sheet closes on its own when the viewport reaches `xl` (80rem), where the bar shows every entry and the menu button is gone
- The bar reads its own inline inset on mount and on resize, so the four-column panel's collision padding lands it on the page column's leading edge
- Each panel's column count is mirrored on `data-columns` and drives its track count; only a four-column panel is stretched to the page column
- An absent `contact`, `primaryAction` or `secondaryAction` is omitted from the bar and the sheet
- The secondary action steps out of the bar below `sm` unless `secondaryActionOnPhones`; the sheet footer always carries it

## Motion & Animations

| Trigger    | Animation / Transition                                         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ---------- | -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| mark hover | `transition-opacity duration-fast-02 ease-productive-entrance` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region             | Token (DESIGN.md)                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------- |
| focus ring         | `var(--ring-color)`, offset `var(--bg-canvas)`                                            |
| mark link shape    | `var(--shape-control)`                                                                    |
| panel column width | `var(--layout-measure-site-header)`, `var(--layout-boundary-inline)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the mark link draws the ring token; triggers, items and buttons own theirs.
- Keyboard map: `Tab` moves through the bar; ⌘K / Ctrl K fires `search` (a mounted `Command` claims the shortcut first); the mega-menu and the sheet own their keyboard models (arrows, `Enter`, `Esc` closes and restores focus to the trigger).
- ARIA: the bar is the `app-header` landmark named "Azion", so the root is a plain `div`; the mark link is named "Azion home"; the menu button "Open navigation" is an icon button with a name; the search trigger is named "Search" and announces `aria-keyshortcuts` (`Meta+K Control+K`); the sheet is titled "Menu".
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link; the sheet and the panels own their reduced-motion fallbacks.
- Touch target ≥40×40 px — the medium buttons and icon buttons meet it.

## Internationalization

| Key                 | English source  | Override prop |
| ------------------- | --------------- | ------------- |
| `siteHeader.open`   | Open navigation | —             |
| `siteHeader.home`   | Azion home      | —             |
| `siteHeader.search` | Search          | —             |
| `siteHeader.menu`   | Menu            | —             |

- Formatting: none; menu, link and action labels are the page's own text.

## Right-to-left

- Layout: logical utilities only; the bar, the panels and the sheet mirror under `dir="rtl"`, and the sheet slides from the end edge as `drawer` places it.
- Icons: the menu, search and arrow glyphs belong to the composed components; the drill-in chevrons mirror as `sidebar-menu` draws them; the mark is not mirrored.
- Keyboard: the mega-menu and the sheet tree own their arrow keys and follow the direction.
- User data: none.

## Responsive

- Container queries: none; the bar switches at viewport breakpoints.
- Narrow (below `xl`, 80rem): the menus, links and contact leave the bar for the sheet behind the menu button; below `sm` the secondary action steps out unless `secondaryActionOnPhones`. Reaching `xl` while the sheet is open closes it.
- Touch: medium buttons and icon buttons meet 40 px; the mega-menu opens on click as well as hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the sheet scrolls inside `scroll-area`.

## Performance

- Bundle budget: 55.95 KB gzip, the `.size-limit.json` entry `site-header` (it carries `navigation-menu`, `sidebar-menu`, `drawer` and `app-header`).
- Runtime budget: one resize listener and one media query, both removed on dispose.
- Heavy parts: none; the panels render on open.

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
