<script setup>
  // The CONTROLS HEADER — the row between a list page's PAGE HEADING and its table:
  //
  //     [ Module name                                     + New Thing ]  PageHeading
  //     [ what the module is, in one line                             ]
  //     [ ⚟ Filter  search ................    ↻   ⭳   ▤ ]  this row
  //     [ the applied chips (../list/FilterChips.vue), when any       ]
  //     [ table                                                       ]
  //
  // TWO GROUPS, AND THE SPLIT IS WHAT EACH CONTROL ACTS ON. The default slot holds the
  // NARROWING — what the user does to change WHICH ROWS they see: the Filter button
  // then the search field. The `actions` slot holds what acts on the LISTING ITSELF —
  // fetch it again (../list/RefreshButton.vue), take it away as a file
  // (../list/ExportButton.vue), choose which columns it shows
  // (../list/ColumnsButton.vue) — plus any bulk operation over the rows a filter
  // selected. It is skipped entirely when nothing is passed.
  //
  // FILTER LEADS, THE THREE GLYPHS TRAIL. Narrowing goes coarse-then-fine left to
  // right — pick a field and its values, then search inside what is left — so Filter
  // is the first thing on the row and the field grows into everything after it. The
  // three listing actions are glyphs at the far end, in one cluster: they are the same
  // three on every list, so a reader learns their corner once. Columns used to sit
  // glued to the search field's right edge, which split the icon buttons 1 + 2 across
  // the group gap and made the trio read as two unrelated things.
  //
  // The page's own action does NOT live here: it belongs to the page, so it sits in the
  // PageHeading above, where its place never depends on how the list is filtered or on
  // whether the list has rows at all.
  //
  // The controls live OUT of the table, not in its `#toolbar`: they belong to the
  // PAGE — the filters narrow the module's records, not one table's view of them — and
  // hoisting them keeps the card a frame around data only. It also means the search
  // field is a plain InputText bound to the table's `v-model:globalFilter`, since
  // `Table.Search` is context-aware and only works inside `<Table>`.
  //
  // The two groups are separated by the GROUP gap (`--layout-group-gap`) — they are
  // one band, not two sections — while the fields inside a group sit at
  // `--spacing-xs`, the same tight rhythm the table toolbar used. This row and the
  // table under it are ONE band: they sit in a band element that stacks them at the
  // group step (see src/styles/layout.css). That tight
  // inner gap is what makes the search field and any icon button beside it read as
  // one control, not as two.
  //
  // The filters group `grow`s and wraps, so a narrow viewport wraps the fields onto
  // a second line instead of squeezing the actions; the actions group is `shrink-0`
  // so a button label never ellipsizes.
  //
  // EVERYTHING ON THIS ROW IS `medium` (32px) — the search field, the Filter button,
  // any listing-level action beside them. The page's own action, one row up in the
  // PageHeading, is the only `large` (40px) control on the page. That difference IS
  // the hierarchy: what the page is for reads first, and what narrows the list reads
  // second. When both rows were 40px they competed, and the create action stopped
  // being the biggest thing on screen. The pair on this row still has to agree with
  // itself, though — a 32px control beside a 40px one leaves a 4px break top and
  // bottom — so a row is demoted or promoted whole, never one control at a time.
</script>

<template>
  <header class="flex items-center gap-(--layout-group-gap)">
    <!-- INSIDE a group the controls sit at `--spacing-xs` (8px), not at the group gap:
         Filter and the search field are ONE control cluster, and reading them as one is
         what the tight step buys. At the group gap (16px) they read as two separate
         things that happen to share a row, and the field gave up 16px of its own width
         to say so. The GROUP gap stays on the <header> below, between this cluster and
         the listing actions — that boundary is a real one. -->
    <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
      <slot />
    </div>
    <!-- Not rendered at all without the slot, so a page with no actions keeps the
         filters on one full-width row. -->
    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-(--spacing-xs)"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
