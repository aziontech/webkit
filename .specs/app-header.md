---
name: app-header
category: layout
structure: composition
status: implemented
spec_version: 10
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4310-19617
  node_id: 4310:19617
checksum: d54a3b988cbfbfb637c92c5cd7033de4f66c3b9f93cee63f2c6943b8e940b5b0
created: 2026-05-23
last_updated: 2026-11-17
---

# Global Header — Component Spec

## Purpose

Application chrome for the top menubar: a fixed-height horizontal bar with three composable regions (start, center, end) and a dedicated brand slot for Azion logo variants. Matches the Webkit AppHeader (Figma node 4310:19617) — a Shell Core part with symmetric horizontal padding, a hairline bottom border, the menu trigger and brand grouped at the start, a growing nav region in the center, and trailing actions (Create, Copilot, Feedback, help, avatar) at the end. Consumers reorder or omit regions; logo and actions are not baked in.

The bar has two placements, chosen with `variant`, and the only difference is where the inset is measured from. `content` is the default and the one every app shell wants: the bar runs full bleed across whatever zone holds it — a content zone beside a rail, or the whole window when nothing sits beside it — insetting its regions by the page boundary (`--layout-boundary-inline`) so the first region opens on the same vertical as the page content. It reads the token the page reads, so retuning the boundary moves both.

A third placement, `app`, was removed in favour of that default. It insetted by a flat `--spacing-md` (16 at every width) on the theory that window-wide chrome above a navigation rail has no page column to answer to. Every shell that was placed deliberately chose `content` instead — including the bars that do span the whole window with no zone beside them — because a flat 16 disagrees with the page's 16-then-24 boundary at exactly the widths where nothing sits between the bar and the page, putting the brand on a different vertical from the title under it. Nothing selected `app` on purpose; the only bars on it had inherited it as the default.

`site` is the marketing placement, for a page that is a FRAMED column rather than an app zone: the surface stays full bleed (the hairline and the fill run to the window edges, because a bar is chrome) while the regions are capped and centred, so the bar answers to the page under it at every width. It is one declaration, not a sub-component: `padding-inline: max(boundary, (100% - measure) / 2 + boundary)` — the cap and the boundary hand off to each other, so below the measure the boundary is the whole inset and the placement collapses to `content`. An uncapped bar over a capped page comes apart above the measure: the column stops growing and the bar does not, which on a 2560px window put the logo 684px to the left of the headline under it.

The cap is the bar's OWN measure — `--layout-measure-site-header` (1620px), one rung wider than the page frame (`--layout-measure-site`, 1388px) that the hero, the sections and the footer share. A bar carries the brand at one end of the window and the account actions at the other, held apart by a navigation region in the middle: it wants the room a reading frame refuses, and held to the page's measure that middle region ran out of room on a laptop long before the page did. The two share one inset up to 1280 and part company only above the caps, by a fixed 92px from 1668 — half the 232px between the measures, less the boundary the bar keeps. It is the one band deliberately outside the frame, and the separate token is what keeps that exception reviewable in both directions.

## When to use

- Use AppHeader for the console's top bar; inside ConsoleLayout it is already rendered.
- The top bar of a console-style app: menu trigger and brand at the start, an optional nav or breadcrumb region, and trailing actions (create, help, account) at the end.
- A bar above a content zone that sits beside a navigation rail — `variant="content"` insets its regions by the page boundary so they line up with the page below.
- The bar of a framed marketing page — `variant="site"` keeps the surface full bleed but caps and centres the regions.

## When NOT to use

- The marketing site's complete navigation bar with mega-menus and a mobile sheet → use `site-header-section`, which composes this header.
- The navigation column at the side of the app → use `sidebar`.
- An action row above a list of records → use the `toolbar` slot of `table`.

## Related

- `site-header-section` — the marketing navigation band built on `app-header`, `brand` and `navigation-menu`.
- `navigation-menu` — the dropdown navigation that usually goes in `AppHeader.Center`.
- `brand` — the Azion lockup to place inside `AppHeader.Brand`.
- `console-layout` — the console layout template that composes the header with the sidebar and the page.

## Best practices

- Keep the default `variant="content"` for app shells; use `variant="site"` only on framed marketing pages.
- Group the menu trigger and the brand in `AppHeader.Container` so they stay together and never shrink.
- Make the logo the home link with `href` on `AppHeader.Brand` (`<AppHeader.Brand href="/" aria-label="Azion home">`) instead of wrapping it in a hand-made anchor: the brand owns the focus ring, the hover affordance and the hit area. Empty `aria-label` names the link from the locale catalog (`Azion home`).
- Set `aria-label` on the root (default `'Global header'`) when the page has more than one banner-style bar.
- Keep the regions free of layout overrides — the bar owns height, padding and the bottom hairline; put only controls in each region.
- Every header that navigates (console, demo, docs, site) carries `SearchTrigger` first in `AppHeader.End`, wired to a `Command` palette; wrap the header in an `@container` so it unfolds into the `Search … ⌘K` field. Never hand-roll the field or use a bare magnifier `IconButton` (lint `webkit/require-header-search`).

## Usage

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import AppHeader from '@aziontech/webkit/app-header'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <AppHeader aria-label="Console header">
    <AppHeader.Container>
      <AppHeader.Start>
        <IconButton
          icon="az az-menu"
          aria-label="Open navigation"
          variant="ghost"
        />
      </AppHeader.Start>
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
    </AppHeader.Container>
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
</template>
```

## Sub-components

- `app-header-container.vue` — Start cluster wrapper; groups the menu trigger (`Start`) and `Brand` into one `shrink-0` flex unit, mirroring the Figma `Container` region. Optional — consumers may still place `Start`/`Brand` directly in the root.
- `app-header-start.vue` — `AppHeader.Start`. Start region; flex row for the menu trigger and leading actions. Logical name: it sits on the right under `dir="rtl"`.
- `app-header-center.vue` — `AppHeader.Center`. Center region; grows to fill the space between start and end.
- `app-header-end.vue` — `AppHeader.End`. End region; trailing actions aligned to the end.

The regions are named start / center / end, not left / right, because the bar mirrors under
right-to-left: the start region is on the right there. 6.0 removed the physical names (`Left`,
`Middle`, `Nav`, `Right`). The parts derive `__start`, `__center` and `__end` testids from the root.

- `app-header-brand.vue` — `AppHeader.Brand`. Brand slot wrapper sized for Azion logo SVGs (default / min). Props `href?: string` (default `''`; when set the brand renders as an anchor to it, and `data-link` on the root carries the link styling: a 40px minimum hit area (44px on `pointer: coarse`), the `--ring-color` focus ring offset against `--bg-surface`, and an opacity hover with a `motion-reduce` fallback; empty renders the plain `div`, unchanged) and `ariaLabel?: string` (default `''`; the link's accessible name, written `aria-label="…"` by the consumer; empty with `href` set uses the locale catalog `appHeader.home`, `Azion home` in English). No events.

## Props

| Prop        | Type                  | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | --------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string`              | `''`        | false    | Accessible name for the header landmark. Empty uses the locale catalog (`Global header`).                                                                                                                                                                                                                                                                                                                                                       |
| `variant`   | `'content' \| 'site'` | `'content'` | false    | Where the bar sits: `content` is the default — full bleed across whatever zone holds it, insetting its regions by the page boundary so the first region opens on the same vertical as the page content under or beside it; `site` keeps that full-bleed surface on a framed marketing page but caps the regions at the site header measure and centres them, so they land on the bar's own column, one rung wider than the page frame under it. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                 |
| --------- | ----- | ------------------------------------------------------------------------------------- |
| `default` | —     | Root: compose `Container` (or `Start` + `Brand`), `Center`, and `End` sub-components. |
| `default` | —     | Each sub-component (incl. `Container`) exposes `default` for region content.          |
| `default` | —     | `app-header-brand` exposes `default` for logo markup.                                 |

## States

- Visual states: `default`
- Placement: `data-variant="content" | "site"` on the root (from `variant`).
- No interactive states on the shell; children own focus/hover/disabled.
- `AppHeader.Brand` with `href`: `data-link` on its anchor; hover (opacity) and `focus-visible` (ring) are its only states.

## Motion & Animations

| Trigger                           | Animation / Transition                                                              | Token                                                               | Reduced-motion fallback         |
| --------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------- |
| brand link hover (`href` set)     | `transition-opacity duration-fast-02 ease-productive-entrance` to `hover:opacity-80` | `duration['fast-02']` · `curve['productive-entrance']` (animate.js) | `motion-reduce:transition-none` |

## Tokens

| Region                                | Token (DESIGN.md)                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| shell height                          | `h-(--layout-header-height)` (56px, the token `SiteHeaderSection`, `HeroSection` and the sticky bands offset by)           |
| shell padding-x (`variant="content"`) | `var(--layout-boundary-inline)`                                                                                            |
| shell padding-x (`variant="site"`)    | `max(var(--layout-boundary-inline), calc((100% - var(--layout-measure-site-header)) / 2 + var(--layout-boundary-inline)))` |
| shell region gap                      | `var(--spacing-md)`                                                                                                        |
| start cluster (container) gap         | `var(--spacing-md)`                                                                                                        |
| start region gap                      | `var(--spacing-xs)`                                                                                                        |
| end region gap                        | `var(--spacing-sm)`                                                                                                        |
| brand logo height                     | `18px`                                                                                                                     |
| surface                               | `var(--bg-surface)`                                                                                                        |
| border (bottom)                       | `var(--border-default)`                                                                                                    |
| ring (focus on children)              | `var(--ring-color)`                                                                                                        |
| brand link focus ring offset          | `var(--bg-surface)`                                                                                                        |
| brand link corner                     | `var(--shape-control)`                                                                                                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Root renders as `<header role="banner">` with `aria-label` from `ariaLabel`.
- Keyboard map: none on the shell; interactive children supply Tab order.
- ARIA: landmark only on root. `AppHeader.Brand` with `href` is a native anchor named by `ariaLabel` (locale fallback `appHeader.home`), so the logo link always has an accessible name; without `href` it stays a non-interactive `div`.
- Keyboard (brand link): Tab reaches it, Enter follows it; the `focus-visible` ring uses `--ring-color`.
- Contrast ≥4.5:1 for text and icons in slotted content.
- `motion-reduce:*` on any animated slotted controls (owned by children).
- Touch target ≥40×40 px on slotted buttons (owned by children).

## Examples

- Default — the bar's anatomy: brand cluster, centre region, trailing actions.
- ContentZone — the default placement shown against a mock page, for the one claim the anatomy cannot show: the first region and the page heading on one vertical.
- SitePlacement — the `variant="site"` bar over a framed marketing column, its regions on the bar's own measure, one rung wider than the page frame.

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
