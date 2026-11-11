# Site Nav

> The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-nav', props }` entry and binds `props` straight onto it — and it composes `global-header`, `brand`, `navigation-menu`, `icon-button`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state.

- Import: `import SiteNav from '@aziontech/webkit/site-nav'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [site-nav.json](https://github.com/aziontech/webkit/blob/main/.specs/site-nav.json)

## When to use

- At the top of every marketing page, once.

## Do

- Keep a panel to one, two or four columns; only the four-column panel is stretched to the page column.
- Stack a short group under another in the same column (Platform under Observe) instead of adding a fifth column.
- Give every entry an `href`; an entry without one links to `#`.

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
| `secondaryAction` | `SiteNavLink` | `undefined` | false | The login button beside it, in the bar and in the sheet footer; `{ label, href }`. |

## States

- Visual states: `default`; the sheet is `open` or closed (local state, owned by `drawer`)
- Closing the sheet resets its drill path; following a leaf of the tree closes the sheet
- The bar reads its own inline inset on mount and on resize, so the four-column panel's collision padding lands it on the page column's leading edge
- Each panel's column count is mirrored on `data-columns` and drives its track count; only a four-column panel is stretched to the page column
- An absent `contact`, `primaryAction` or `secondaryAction` is omitted from the bar and the sheet

## Accessibility

- Visible focus: the mark link draws the ring token; triggers, items and buttons own theirs.
- Keyboard map: `Tab` moves through the bar; the mega-menu and the sheet own their keyboard models (arrows, `Enter`, `Esc` closes and restores focus to the trigger).
- ARIA: the bar is the `global-header` landmark named "Azion", so the root is a plain `div`; the mark link is named "Azion home"; the menu button "Open navigation" and the search button "Search" are icon buttons with names; the sheet is titled "Menu".
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link; the sheet and the panels own their reduced-motion fallbacks.
- Touch target ≥40×40 px — the medium buttons and icon buttons meet it.

## Usage

```vue
<script setup>
import SiteNav from '@aziontech/webkit/site-nav'
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
  />
</template>
```
