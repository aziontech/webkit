# Global Header

> Application chrome for the top menubar: a fixed-height horizontal bar with three composable regions (start, center, end) and a dedicated brand slot for Azion logo variants. Matches the Webkit GlobalHeader (Figma node 4310:19617) — a Shell Core part with symmetric horizontal padding, a hairline bottom border, the menu trigger and brand grouped at the start, a growing nav region in the center, and trailing actions (Create, Copilot, Feedback, help, avatar) at the end. Consumers reorder or omit regions; logo and actions are not baked in. The bar has two placements, chosen with `kind`, and the only difference is where the inset is measured from. `content` is the default and the one every app shell wants: the bar runs full bleed across whatever zone holds it — a content zone beside a rail, or the whole window when nothing sits beside it — insetting its regions by the page boundary (`--layout-boundary-inline`) so the first region opens on the same vertical as the page content. It reads the token the page reads, so retuning the boundary moves both. A third placement, `app`, was removed in favour of that default. It insetted by a flat `--spacing-md` (16 at every width) on the theory that window-wide chrome above a navigation rail has no page column to answer to. Every shell that was placed deliberately chose `content` instead — including the bars that do span the whole window with no zone beside them — because a flat 16 disagrees with the page's 16-then-24 boundary at exactly the widths where nothing sits between the bar and the page, putting the brand on a different vertical from the title under it. Nothing selected `app` on purpose; the only bars on it had inherited it as the default. `site` is the marketing placement, for a page that is a FRAMED column rather than an app zone: the surface stays full bleed (the hairline and the fill run to the window edges, because a bar is chrome) while the regions are capped and centred, so the bar answers to the page under it at every width. It is one declaration, not a sub-component: `padding-inline: max(boundary, (100% - measure) / 2 + boundary)` — the cap and the boundary hand off to each other, so below the measure the boundary is the whole inset and the placement collapses to `content`. An uncapped bar over a capped page comes apart above the measure: the column stops growing and the bar does not, which on a 2560px window put the logo 684px to the left of the headline under it. The cap is the bar's OWN measure — `--layout-measure-site-header` (1620px), one rung wider than the page frame (`--layout-measure-site`, 1388px) that the hero, the sections and the footer share. A bar carries the brand at one end of the window and the account actions at the other, held apart by a navigation region in the middle: it wants the room a reading frame refuses, and held to the page's measure that middle region ran out of room on a laptop long before the page did. The two share one inset up to 1280 and part company only above the caps, by a fixed 92px from 1668 — half the 232px between the measures, less the boundary the bar keeps. It is the one band deliberately outside the frame, and the separate token is what keeps that exception reviewable in both directions.

- Import: `import GlobalHeader from '@aziontech/webkit/global-header'`
- Category: layout · Surface: product · Structure: composition
- API as JSON: [global-header.json](https://github.com/aziontech/webkit/blob/main/.specs/global-header.json)

## When to use

- The top bar of a console-style app: menu trigger and brand at the start, an optional nav or breadcrumb region, and trailing actions (create, help, account) at the end.
- A bar above a content zone that sits beside a navigation rail — `kind="content"` insets its regions by the page boundary so they line up with the page below.
- The bar of a framed marketing page — `kind="site"` keeps the surface full bleed but caps and centres the regions.

## Do

- Keep the default `kind="content"` for app shells; use `kind="site"` only on framed marketing pages.
- Group the menu trigger and the brand in `GlobalHeader.Container` so they stay together and never shrink; `GlobalHeader.Nav` is the same component as `GlobalHeader.Middle`.
- Wrap the logo in `GlobalHeader.Brand` inside a link with its own accessible name (for example `aria-label="Azion home"`).
- Set `aria-label` on the root (default `'Global header'`) when the page has more than one banner-style bar.
- Keep the regions free of layout overrides — the bar owns height, padding and the bottom hairline; put only controls in each region.

## Don’t

- The marketing site's complete navigation bar with mega-menus and a mobile sheet → use `site-nav`, which composes this header.
- The navigation column at the side of the app → use `sidebar`.
- An action row above a list of records → use the `toolbar` slot of `table`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-nav](site-nav.md) — the marketing navigation band built on `global-header`, `brand` and `navigation-menu`.
- [navigation-menu](navigation-menu.md) — the dropdown navigation that usually goes in `GlobalHeader.Middle`.
- [brand](brand.md) — the Azion lockup to place inside `GlobalHeader.Brand`.
- platform-shell` — the console layout template that composes the header with the sidebar and the page.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the header landmark. Empty uses the locale catalog (`Global header`). |
| `kind` | `'content' \| 'site'` | `'content'` | false | Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Root: compose `Container` (or `Left` + `Brand`), `Middle`/`Nav`, and `Right` sub-components. |
| `default` | — | Each sub-component (incl. `Container`) exposes `default` for region content. |
| `default` | — | global-header-brand` exposes `default` for logo markup. |

## Sub-components

- `global-header-container.vue` — Start cluster wrapper; groups the menu trigger (`Left`) and `Brand` into one `shrink-0` flex unit, mirroring the Figma `Container` region. Optional — consumers may still place `Left`/`Brand` directly in the root.
- `global-header-left.vue` — Start region; flex row for menu and leading actions.
- `global-header-middle.vue` — Center region; grows to fill space between start and end. Also exposed as `GlobalHeader.Nav` (Figma `Nav` name); both names reference the same component.
- `global-header-right.vue` — End region; trailing actions aligned to the end.
- `global-header-brand.vue` — Brand slot wrapper sized for Azion logo SVGs (default / min).

## States

- Visual states: `default`
- Placement: `data-kind="content" | "site"` on the root (from `kind`).
- No interactive states on the shell; children own focus/hover/disabled.

## Accessibility

- Root renders as `<header role="banner">` with `aria-label` from `ariaLabel`.
- Keyboard map: none on the shell; interactive children supply Tab order.
- ARIA: landmark only on root; brand slot should include an accessible name on the logo link or `aria-label` on the SVG parent.
- Contrast ≥4.5:1 for text and icons in slotted content.
- `motion-reduce:*` on any animated slotted controls (owned by children).
- Touch target ≥40×40 px on slotted buttons (owned by children).

## Examples

### DefaultHeader

```vue
<script setup>
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Default from '@aziontech/webkit/svg/azion/default'
</script>

<template>
  <GlobalHeader aria-label="Global header">
    <GlobalHeader.Left>
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
        >
          <Default />
        </a>
      </GlobalHeader.Brand>
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right />
  </GlobalHeader>
</template>
```

### ContentZone

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console header">
      <GlobalHeader.Left class="justify-start!">
        <Breadcrumb :items="[{ label: 'Build', href: '/build' }, { label: 'Custom Pages' }]" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Create"
          kind="secondary"
          size="medium"
          icon="pi pi-plus-circle"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
    <div class="layout-boundary">
      <h1 class="text-heading-xl text-(--text-default)">Custom Pages</h1>
      <p class="text-body-md text-(--text-muted)">
        Manage the pages served for an error or a maintenance window.
      </p>
    </div>
  </div>
</template>
```

### SitePlacement

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <GlobalHeader
      kind="site"
      aria-label="Azion"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          ><Brand
            kind="default"
            size="small"
        /></a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle class="justify-start!">
        <a
          class="text-label-md text-(--text-default) no-underline"
          href="/pricing"
          >Pricing</a
        >
      </GlobalHeader.Middle>
      <GlobalHeader.Right>
        <Button
          label="Start for Free"
          kind="primary"
          size="medium"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
    <section
      class="mx-auto w-full max-w-(--layout-measure-site) px-(--layout-boundary-inline) py-(--spacing-xl)"
    >
      <h1 class="text-heading-xl text-(--text-default)">
        Distributed infrastructure for modern workloads
      </h1>
      <p class="text-body-md text-(--text-muted)">
        The page frame is one rung narrower than the bar above it: the two share an inset until the
        window passes their caps.
      </p>
    </section>
  </div>
</template>
```
