---
name: webkit-responsive-layout
description: A screen in a @aziontech/webkit app reorganizes across sizes — it does not just shrink. Use when building or reviewing any full view, page, or layout. Fixes the breakpoint prefixes, the canonical layouts (list-detail, supporting-pane, feed/grid), sidebar→drawer navigation, width discipline, and viewport/safe-area rules — all on theme tokens, never raw pixels.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-responsive-layout

## Purpose

A responsive screen is not a desktop screen made narrower. It **reorganizes**: a two-pane list-detail
collapses to one full-width pane, a persistent sidebar folds into a drawer, a three-up card feed
becomes a single column. This skill fixes how a `@aziontech/webkit` view reflows across sizes — the
breakpoint prefixes to reach for, the canonical layouts to reach _into_, and the width and viewport
discipline that keeps every screen legible from a phone to an ultrawide — all expressed in theme
tokens, never raw pixels.

## How to use

- `/webkit-responsive-layout` — apply these layout rules to any view you build in this conversation.
- `/webkit-responsive-layout <file>` — review the file's layout and report, per gap: the quoted line,
  what does not reflow (or the raw px / fixed height that will clip), and the concrete token-based fix.

## How to find the components

Never guess an import path. Resolve navigation and container components the same way every time:

- Ask the **webkit MCP** — `suggest_component` in plain words ("sidebar", "drawer", "off-canvas nav").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

The shipped navigation and container primitives (a persistent `sidebar`, an off-canvas `drawer`, a
`navigation-menu`, a `dialog`, a `panel`) all resolve this way — do not copy a path from another repo.

## Breakpoints — prefixes, never hand-rolled media queries

The theme ships Tailwind's breakpoints; drive every reflow with the prefix, never a bespoke
`@media (min-width: …)`.

| Prefix         | Applies from | Reorganize for                                                 |
| -------------- | ------------ | -------------------------------------------------------------- |
| (base)         | 0            | phone portrait — one column, everything stacked                |
| `sm:`          | ~640px       | large phone / small tablet                                     |
| `md:`          | ~768px       | tablet — a second column or pane can appear                    |
| `lg:`          | ~1024px      | laptop — list-detail goes side-by-side, sidebar persists       |
| `xl:` / `2xl:` | ~1280px+     | desktop / ultrawide — cap content width, add a supporting pane |

Design **base-first** (mobile is the unprefixed default) and reveal panes as the prefix widens.

## Canonical layouts

Three layouts cover almost every screen:

- **List-detail** — a list of items beside the selected item's detail. **Narrow:** the list is
  full-width and the detail is a separate route or a `drawer` / `dialog`. **Wide (`lg:`):** list and
  detail sit side by side, the detail the flexible pane.
- **Supporting pane** — primary content plus a secondary pane (filters, metadata, related items). The
  supporting pane sits **below** the main content on narrow and **beside** it (`lg:`) on wide.
- **Feed / grid** — a uniform grid of cards that changes **column count** by width: one column on
  phone, two on `md:`, three-plus on `xl:`.

## Navigation — sidebar persists wide, becomes a drawer narrow

A persistent `sidebar` is right on a laptop and wrong on a phone (it eats the viewport). The pattern:
render the `sidebar` from `lg:` up, and below `lg:` hide it and expose the same items through a
`drawer` (off-canvas) opened by a menu button. Both components are shipped — resolve them via the
MCP / catalog above. The drawer traps focus and restores it on close; you supply only the open state.

## Width discipline

- **Cap reading / content width** with `max-w-[var(--container-*)]` + `mx-auto` (e.g.
  `max-w-[var(--container-3xl)]`) — long lines of prose or a form are hard to read edge-to-edge.
- **Keep data-dense surfaces fluid** — a table or dashboard uses the width it is given; do not cap it.
- **Wide content scrolls inside its own container.** A table or code block wider than the viewport
  lives in an `overflow-x-auto` wrapper so _it_ scrolls sideways — the page body never does.

## Viewport & spacing

- Full-height regions use **`h-dvh` / `min-h-dvh`**, never `h-screen` (it ignores mobile browser
  chrome and clips).
- Fixed / sticky bars respect the safe area: pad with `env(safe-area-inset-*)` (e.g.
  `pb-[env(safe-area-inset-bottom)]`) so a bottom bar clears the home indicator.
- Compose with **`grid` / `flex` + `gap-[var(--spacing-*)]`**, not per-element margins — gap reflows
  cleanly when the axis flips at a breakpoint.
- Keep **at least one flexible pane** per layout; avoid fixed heights that clip content — let the
  content region grow and scroll.

## A responsive view — grid that reflows, detail that stacks

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import CardBox from '@aziontech/webkit/card-box'
  import Panel from '@aziontech/webkit/panel'

  type Item = { id: string; name: string }
  const items = ref<Item[]>([])
  const selected = ref<Item | null>(null)
</script>

<template>
  <!-- List-detail: stacks below lg, side-by-side from lg up; the row fills the viewport height -->
  <div class="flex flex-col lg:flex-row gap-[var(--spacing-md)] min-h-dvh">
    <!-- List pane: full width narrow, a fixed rail wide, always scrollable -->
    <section
      class="w-full lg:w-[var(--container-xs)] lg:shrink-0 overflow-y-auto"
      aria-label="Items"
    >
      <!-- Feed grid: 1 col on phone, 2 from md, back to 1 in the narrow lg rail -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-[var(--spacing-sm)]">
        <CardBox
          v-for="item in items"
          :key="item.id"
          role="button"
          @click="selected = item"
        >
          {{ item.name }}
        </CardBox>
      </div>
    </section>

    <!-- Detail: the flexible pane; content capped for legibility, wide data scrolls in place -->
    <Panel class="flex-1 min-w-0">
      <div class="mx-auto max-w-[var(--container-3xl)]">
        <p v-if="selected">{{ selected.name }}</p>
        <p v-else>Select an item.</p>
      </div>
    </Panel>
  </div>
</template>
```

`grid-cols-1 md:grid-cols-2 lg:grid-cols-1` is the point: the column count is **context-driven** —
two-up as a full-width feed on a tablet, one-up once the same list becomes a narrow rail beside the
detail on a laptop. The layout reorganizes; it does not merely scale.

## Hard rules

- Every full view **reorganizes** at ≥1 breakpoint (list-detail / supporting-pane / grid) — a view
  that only shrinks is not responsive.
- Reflow with `sm:` / `md:` / `lg:` / `xl:` / `2xl:` prefixes; never a hand-written `@media` or pixel
  query.
- Widths on the `--container-*` scale, gaps and spacing on the `--spacing-*` scale — **no raw px / rem**
  in layout classes.
- Persistent `sidebar` from `lg:` up; below `lg:` it is a `drawer` — both from the MCP / catalog, never
  re-implemented by hand.
- Cap prose and forms with `max-w-[var(--container-*)]`; keep tables and dashboards fluid; wide content
  scrolls in its own `overflow-x-auto` container — the page body never scrolls sideways.
- `h-dvh` (not `h-screen`); fixed / sticky elements respect `env(safe-area-inset-*)`; compose with
  `grid` / `flex` + `gap`, not per-element margins.
- At least one flexible pane per layout; no fixed heights that clip content.

## Review output

For `/webkit-responsive-layout <file>`, list gaps grouped by view. Each:

```
✗ Dashboard.vue:12  grid grid-cols-3 with no responsive prefix
  reflow: does not collapse — three columns crush on a phone.
  fix: grid-cols-1 md:grid-cols-2 xl:grid-cols-3, gap-[var(--spacing-sm)].
```

End with: `layout reflows` or `N gaps — fix before ship`.

This skill is enforced largely by **review**; the runtime check is the ui-verify skill, which
screenshots the view at 2–3 widths (phone / tablet / desktop) and confirms it reorganizes rather than
clips, overflows sideways, or leaves a pane empty.

## Definition of Done

- [ ] Every full view reorganizes at ≥1 breakpoint (not just scaled down); designed base-first.
- [ ] `sidebar` persists from `lg:`, becomes a `drawer` below — both resolved via the MCP / catalog.
- [ ] Widths on `--container-*`, gaps and spacing on `--spacing-*`; zero raw px / rem in layout classes;
      `h-dvh`, not `h-screen`.
- [ ] Content capped for legibility, data-dense surfaces fluid, wide content scrolls in its own
      container — the page body never scrolls sideways.
- [ ] Verified at 2–3 widths (via the ui-verify skill): reflows cleanly, nothing clipped or empty.
