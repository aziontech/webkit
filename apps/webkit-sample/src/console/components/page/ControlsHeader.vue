<script setup>
  // The CONTROLS HEADER — the row a first-level list page opens with, in place of a
  // PageHeading:
  //
  //     [ search · filter selects … | Documentation  + New Thing ]
  //     [ table                                                  ]
  //
  // A first-level page is already named by the header breadcrumb, so an <h1>
  // repeating that name buys nothing and costs the first row of the table above the
  // fold. What the page opens with instead is what the user came to do: narrow the
  // list, or add to it. Narrowing reads left (where the eye starts), the page's own
  // actions sit right (where a control belongs), and the table follows.
  //
  // The controls live OUT of the table, not in its `#toolbar`: they belong to the
  // PAGE — the create button beside them acts on the module, not on the table — and
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
</script>

<template>
  <header class="flex items-center gap-[var(--layout-group-gap)]">
    <div class="flex min-w-0 grow items-center gap-[var(--layout-group-gap)]">
      <slot />
    </div>
    <!-- Not rendered at all without the slot, so a page with no actions keeps the
         filters on one full-width row. -->
    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-[var(--layout-group-gap)]"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
