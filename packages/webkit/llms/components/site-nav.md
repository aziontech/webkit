# Site Nav

> The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-nav', props }` entry and binds `props` straight onto it — and it composes `global-header`, `brand`, `navigation-menu`, `icon-button`, `search-trigger`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state. Search is the folded `search-trigger` last in the bar: the section owns no palette, it emits `search` (on a click and on ⌘K / Ctrl K) and the page opens its own `command`, as every header does under `rules/webkit-header-search.md`.

- Import: `import SiteNav from '@aziontech/webkit/site-nav'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [site-nav.json](https://github.com/aziontech/webkit/blob/main/.specs/site-nav.json)

## When to use

- At the top of every marketing page, once.

## Do

- Keep a panel to one, two or four columns; only the four-column panel is stretched to the page column.
- Stack a short group under another in the same column (Platform under Observe) instead of adding a fifth column.
- Give every entry an `href`; an entry without one links to `#`.
- Listen to `search` and open the page's `Command` from it (`@search="searchOpen = true"` beside `<Command v-model:open="searchOpen">`); the trigger already carries ⌘K / Ctrl K.
- Leave `secondaryActionOnPhones` off: on a phone the bar keeps the menu button, the mark, the call to action and search, as azion.com does, and Login stays in the sheet footer.
- The bar is `--layout-header-height` tall: `HeroBand` already takes it out of a screen-filling band; a bare `Hero kind="screen"` takes `offset="var(--layout-header-height)"`, never a literal length.
- Don't wrap the bar, add a second search button beside it, or bind ⌘K yourself.

## Don’t

- For the Console's application header → use `global-header` directly.
- For an in-page list of links → use `navigation-menu` or `menu` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [global-header](global-header.md) — the bar primitive the navigation is rendered in.
- [navigation-menu](navigation-menu.md) — the mega-menu the bar opens from `xl` up.
- [menu](menu.md) — the drill-down tree the sheet carries below `xl`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `home` | `string` | `'/'` | false | Where the Azion mark links. |
| `menus` | `SiteNavMenu[]` | `—` | true | The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. |
| `links` | `SiteNavLink[]` | `[]` | false | Bar entries that open no panel, after the menus; each is `{ label, href }`. |
| `contact` | `SiteNavLink` | `undefined` | false | Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`. |
| `primaryAction` | `SiteNavLink` | `undefined` | false | The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`. |
| `secondaryAction` | `SiteNavLink` | `undefined` | false | The login button beside it, in the bar from `sm` up and in the sheet footer; `{ label, href }`. |
| `secondaryActionOnPhones` | `boolean` | `false` | false | Keeps the login button in the bar below `sm` too; off, it steps out on phones, as on azion.com, and stays in the sheet footer. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `search` | `(event: MouseEvent \| KeyboardEvent)` |  |

## States

- Visual states: `default`; the sheet is `open` or closed (local state, owned by `drawer`)
- Closing the sheet resets its drill path; following a leaf of the tree closes the sheet
- The bar reads its own inline inset on mount and on resize, so the four-column panel's collision padding lands it on the page column's leading edge
- Each panel's column count is mirrored on `data-columns` and drives its track count; only a four-column panel is stretched to the page column
- An absent `contact`, `primaryAction` or `secondaryAction` is omitted from the bar and the sheet
- The secondary action steps out of the bar below `sm` unless `secondaryActionOnPhones`; the sheet footer always carries it

## Accessibility

- Visible focus: the mark link draws the ring token; triggers, items and buttons own theirs.
- Keyboard map: `Tab` moves through the bar; ⌘K / Ctrl K fires `search` (a mounted `Command` claims the shortcut first); the mega-menu and the sheet own their keyboard models (arrows, `Enter`, `Esc` closes and restores focus to the trigger).
- ARIA: the bar is the `global-header` landmark named "Azion", so the root is a plain `div`; the mark link is named "Azion home"; the menu button "Open navigation" is an icon button with a name; the search trigger is named "Search" and announces `aria-keyshortcuts` (`Meta+K Control+K`); the sheet is titled "Menu".
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link; the sheet and the panels own their reduced-motion fallbacks.
- Touch target ≥40×40 px — the medium buttons and icon buttons meet it.

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
  <Command v-model:open="searchOpen"></Command>
</template>
```
