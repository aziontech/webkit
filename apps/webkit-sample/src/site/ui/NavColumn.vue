<script setup>
  /**
   * NavColumn — one column of product links (Figma: Azion.com › Column,
   * node 8492:14393).
   *
   * An overline heading over a rule, then the column's NavItems spaced by `lg`.
   * Header and list carry the same `lg` inset, so the heading and every row title
   * start on ONE content column.
   *
   * The column paints its own canvas rather than drawing its own border: dropped
   * into a `CardGrid variant="divider"`, the grid's 1px gaps are the hairlines, so
   * four adjacent columns produce three rules instead of six. Width is the grid's
   * business too — the Figma frame's fixed 320 is what one cell of the four-column
   * grid already measures at the container's max width.
   */
  import Overline from '@aziontech/webkit/overline'

  defineProps({
    // The column's overline heading.
    title: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <div class="flex min-w-0 flex-col bg-[var(--bg-canvas)]">
    <div class="flex items-center border-b border-[var(--border-default)] p-[var(--spacing-lg)]">
      <!-- `-ml-1` cancels the 4px `pl-1` Overline carries of its own; without it the
           heading sits 4px right of everything beneath it. -->
      <Overline class="-ml-1">{{ title }}</Overline>
    </div>

    <div class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]">
      <slot />
    </div>
  </div>
</template>
