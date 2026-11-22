# App Header

> Application chrome for the top menubar: a fixed-height horizontal bar with three composable regions (start, center, end) and a dedicated brand slot for Azion logo variants. Matches the Webkit AppHeader (Figma node 4310:19617) — a Shell Core part with symmetric horizontal padding, a hairline bottom border, the menu trigger and brand grouped at the start, a growing nav region in the center, and trailing actions (Create, Copilot, Feedback, help, avatar) at the end. Consumers reorder or omit regions; logo and actions are not baked in. The bar has two placements, chosen with `variant`, and the only difference is where the inset is measured from. `content` is the default and the one every app shell wants: the bar runs full bleed across whatever zone holds it — a content zone beside a rail, or the whole window when nothing sits beside it — insetting its regions by the page boundary (`--layout-boundary-inline`) so the first region opens on the same vertical as the page content. It reads the token the page reads, so retuning the boundary moves both. A third placement, `app`, was removed in favour of that default. It insetted by a flat `--spacing-md` (16 at every width) on the theory that window-wide chrome above a navigation rail has no page column to answer to. Every shell that was placed deliberately chose `content` instead — including the bars that do span the whole window with no zone beside them — because a flat 16 disagrees with the page's 16-then-24 boundary at exactly the widths where nothing sits between the bar and the page, putting the brand on a different vertical from the title under it. Nothing selected `app` on purpose; the only bars on it had inherited it as the default. `site` is the marketing placement, for a page that is a FRAMED column rather than an app zone: the surface stays full bleed (the hairline and the fill run to the window edges, because a bar is chrome) while the regions are capped and centred, so the bar answers to the page under it at every width. It is one declaration, not a sub-component: `padding-inline: max(boundary, (100% - measure) / 2 + boundary)` — the cap and the boundary hand off to each other, so below the measure the boundary is the whole inset and the placement collapses to `content`. An uncapped bar over a capped page comes apart above the measure: the column stops growing and the bar does not, which on a 2560px window put the logo 684px to the left of the headline under it. The cap is the bar's OWN measure — `--layout-measure-site-header` (1620px), one rung wider than the page frame (`--layout-measure-site`, 1388px) that the hero, the sections and the footer share. A bar carries the brand at one end of the window and the account actions at the other, held apart by a navigation region in the middle: it wants the room a reading frame refuses, and held to the page's measure that middle region ran out of room on a laptop long before the page did. The two share one inset up to 1280 and part company only above the caps, by a fixed 92px from 1668 — half the 232px between the measures, less the boundary the bar keeps. It is the one band deliberately outside the frame, and the separate token is what keeps that exception reviewable in both directions.

- Import: `import AppHeaderRoot from '@aziontech/webkit/app-header-root'`
- Compound import (dot notation, not tree-shakeable): `import AppHeader from '@aziontech/webkit/app-header'`
- Category: layout · Surface: app · Structure: composition
- API as JSON: [app-header.json](app-header.json)

## When to use

- Use AppHeader for the console's top bar; inside ConsoleLayout it is already rendered.
- The top bar of a console-style app: menu trigger and brand at the start, an optional nav or breadcrumb region, and trailing actions (create, help, account) at the end.
- A bar above a content zone that sits beside a navigation rail — `variant="content"` insets its regions by the page boundary so they line up with the page below.
- The bar of a framed marketing page — `variant="site"` keeps the surface full bleed but caps and centres the regions.

## Do

- Keep the default `variant="content"` for app shells; use `variant="site"` only on framed marketing pages.
- Group the menu trigger and the brand in `AppHeader.Container` so they stay together and never shrink.
- Make the logo the home link with `href` on `AppHeader.Brand` (`<AppHeader.Brand href="/" aria-label="Azion home">`) instead of wrapping it in a hand-made anchor: the brand owns the focus ring, the hover affordance and the hit area. Empty `aria-label` names the link from the locale catalog (`Azion home`).
- Put the signed-in account at the end with `AppHeaderAccount` (`import AppHeaderAccount from '@aziontech/webkit/app-header-account'`, then `<AppHeaderAccount :name="account.name" :src="account.src" />`) instead of a hand-made button around an `Avatar`: the part owns the focus ring, the hover affordance and the accessible name. To open the account menu, place it in `DropdownMenu.Trigger`, which forwards the menu state onto it.
- Name the product beside the mark with `label` on `AppHeader.Brand` (`label="Docs"`, `label="Console"`) instead of a `Tag` or a hand-made span: the brand draws the one product lockup every Azion header shares.
- Set `aria-label` on the root (default `'Global header'`) when the page has more than one banner-style bar.
- Keep the regions free of layout overrides — the bar owns height, padding and the bottom hairline; put only controls in each region.
- Every header that navigates (console, demo, docs, site) carries `SearchTrigger` first in `AppHeader.End`, wired to a `Command` palette; wrap the header in an `@container` so it unfolds into the `Search … ⌘K` field. Never hand-roll the field or use a bare magnifier `IconButton` (lint `webkit/require-header-search`).

## Don’t

- The marketing site's complete navigation bar with mega-menus and a mobile sheet → use `site-header-section`, which composes this header.
- The navigation column at the side of the app → use `sidebar`.
- An action row above a list of records → use the `toolbar` slot of `table`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-header-section](site-header-section.md) — the marketing navigation band built on `app-header`, `brand` and `navigation-menu`.
- [navigation-menu](navigation-menu.md) — the dropdown navigation that usually goes in `AppHeader.Center`.
- [brand](brand.md) — the Azion lockup to place inside `AppHeader.Brand`.
- [console-layout](console-layout.md) — the console layout template that composes the header with the sidebar and the page.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the header landmark. Empty uses the locale catalog (`Global header`). |
| `variant` | `'content' \| 'site'` | `'content'` | false | Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Root: compose `Container` (or `Start` + `Brand`), `Center`, and `End` sub-components. |
| `default` | — | Each sub-component (incl. `Container`) exposes `default` for region content. |
| `default` | — | `app-header-brand` exposes `default` for logo markup. |

## Sub-component imports

- `@aziontech/webkit/app-header-account`

## Sub-components

- `app-header-container.vue` — Start cluster wrapper; groups the menu trigger (`Start`) and `Brand` into one `shrink-0` flex unit, mirroring the Figma `Container` region. Optional — consumers may still place `Start`/`Brand` directly in the root.
- `app-header-start.vue` — `AppHeader.Start`. Start region; flex row for the menu trigger and leading actions. Logical name: it sits on the right under `dir="rtl"`.
- `app-header-center.vue` — `AppHeader.Center`. Center region; grows to fill the space between start and end.
- `app-header-end.vue` — `AppHeader.End`. End region; trailing actions aligned to the end.

The regions are named start / center / end, not left / right, because the bar mirrors under
right-to-left: the start region is on the right there. 6.0 removed the physical names (`Left`,
`Middle`, `Nav`, `Right`). The parts derive `__start`, `__center` and `__end` testids from the root.

- `app-header-brand.vue` — `AppHeader.Brand`. Brand slot wrapper sized for Azion logo SVGs (default / min). Props `href?: string` (default `''`; when set the brand renders as an anchor to it, and `data-link` on the root carries the link styling: a 40px minimum hit area (44px on `pointer: coarse`), the `--ring-color` focus ring offset against `--bg-surface`, and an opacity hover with a `motion-reduce` fallback; empty renders the plain `div`, unchanged), `ariaLabel?: string` (default `''`; the link's accessible name, written `aria-label="…"` by the consumer; empty with `href` set uses the locale catalog `appHeader.home`, `Azion home` in English) and `label?: string` (default `''`; the product name drawn after the slotted mark as an uppercase label in `.text-overline-sm`, `--text-muted`, inside a `--border-muted` hairline box with `--shape-control` corners and `--spacing-2xs` inline padding, `--spacing-xs` from the mark; `data-label` on the root and `${testId}__label` on the label; empty draws nothing and leaves the part unchanged). With `href` set and no `ariaLabel`, a label names the link from the locale catalog `appHeader.productHome` (`Azion {product} home`, e.g. `Azion Docs home`) instead of `appHeader.home`. No events.

- `app-header-account.vue` — `AppHeaderAccount`, a **companion part**: exported on its own as `@aziontech/webkit/app-header-account` and not attached to the compound, because it composes `Avatar` (and its class merging), which would add about 12 KB to every `AppHeader` import. The account control at the end of the bar: a native `button` that draws the signed-in account as a medium square `Avatar` (initials from `name`, or the photo from `src`). Props `name?: string` (default `''`; the avatar's initials, its first two characters), `src?: string` (default `''`; the photo URL, replacing the initials) and `ariaLabel?: string` (default `''`; the control's accessible name, written `aria-label="…"`; empty uses the locale catalog `appHeader.account`, `Account menu` in English). Event `click: [event: MouseEvent]` when it is activated. It owns the `--ring-color` focus ring offset against `--bg-surface`, corners on `--shape-button` (the square avatar's corner, so the ring follows the avatar) and an opacity hover with a `motion-reduce` fallback. Inside `DropdownMenu.Trigger` it receives the trigger's `aria-haspopup`, `aria-expanded` and `aria-controls` and opens the menu, as shadcn's and Supabase's account menus put the avatar in the menu trigger.

## States

- Visual states: `default`
- Placement: `data-variant="content" | "site"` on the root (from `variant`).
- No interactive states on the shell; children own focus/hover/disabled.
- `AppHeader.Brand` with `href`: `data-link` on its anchor; hover (opacity) and `focus-visible` (ring) are its only states.
- `AppHeader.Brand` with `label`: `data-label` on its root; the label is static (no states of its own).
- `AppHeaderAccount`: hover (opacity) and `focus-visible` (ring); inside `DropdownMenu.Trigger` the trigger adds `aria-expanded`.

## Accessibility

- Root renders as `<header>`, which is the page banner when it is not nested in `<main>` or a sectioning element; `aria-label` comes from `ariaLabel`.
- Keyboard map: none on the shell; interactive children supply Tab order.
- ARIA: landmark only on root. `AppHeader.Brand` with `href` is a native anchor named by `ariaLabel` (locale fallback `appHeader.home`), so the logo link always has an accessible name; without `href` it stays a non-interactive `div`.
- Brand label: with `href` the visible `label` is `aria-hidden` and the link name says where it goes, product included (`appHeader.productHome`, `Azion Docs home`), so the product is read once and the visible word is inside the name (WCAG 2.5.3); a consumer `aria-label` should keep the product word. Without `href` the label stays readable text after the mark. Spacing is logical (`gap`, `px`), so the label follows the mark in the inline direction under `dir="rtl"`.
- Keyboard (brand link): Tab reaches it, Enter follows it; the `focus-visible` ring uses `--ring-color`.
- `AppHeaderAccount` is a native `button` named by `ariaLabel` (locale fallback `appHeader.account`); the avatar inside is decoration of that name. Tab reaches it, Enter and Space activate it; in `DropdownMenu.Trigger`, Arrow Down opens the menu as well.
- Contrast ≥4.5:1 for text and icons in slotted content.
- `motion-reduce:*` on any animated slotted controls (owned by children).
- Touch target ≥40×40 px on slotted buttons (owned by children).

## Examples

### Default

```vue
<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <AppHeader aria-label="Global header">
    <AppHeader.Start>
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand size="small" />
      </AppHeader.Brand>
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End />
  </AppHeader>
</template>
```

### WithLabel

```vue
<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <AppHeader aria-label="Global header">
    <AppHeader.Start>
      <AppHeader.Brand
        href="/"
        label="Console"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End />
  </AppHeader>
</template>
```

### ContentZone

```vue
<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console header">
      <AppHeader.Start>
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <Breadcrumb :items="[{ label: 'Build', href: '/build' }, { label: 'Custom Pages' }]" />
        </div>
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <Button
          label="Create"
          variant="secondary"
          size="medium"
          icon="az az-circle-plus"
        />
      </AppHeader.End>
    </AppHeader>
    <div class="layout-boundary">
      <h1 class="text-heading-xl text-(--text-default)">Custom Pages</h1>
      <p class="text-body-md text-(--text-muted)">
        Manage the pages served for an error or a maintenance window.
      </p>
    </div>
  </div>
</template>
```
