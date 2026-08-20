<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'

  /**
   * The responsive grid a `DocCard` set sits in. `cols` is the widest column
   * count; the grid always collapses to one column on small screens so a docs
   * page stays readable on a phone.
   *
   * THE GROUP IS THE FRAME, NOT EACH CARD. The cards abut — no gutters — so the
   * set reads as one object the reader scans across rather than as three loose
   * tiles. That makes the frame belong here: `FrameBox` draws the perimeter and
   * the four corner registration marks once, around the whole grid.
   *
   * The internal rules are the GRID'S OWN GAPS. A 1px gap over a rule-coloured
   * background shows through as a hairline between cells, which is the same
   * technique the docs home band uses. Doing it this way rather than bordering
   * each cell is what makes it correct at every width for free: the column count
   * changes at two breakpoints, and any per-cell border list would have to know
   * which cells are on an edge — a thing CSS can answer and a prop cannot. It
   * also cannot double: there is exactly one gap between two cells, where two
   * abutting borders would paint 2px.
   *
   * Cells must therefore be OPAQUE (`bg-(--bg-canvas)`), so only the gaps show.
   *
   * ONE COLUMN ON A PHONE, unless the cells are tiny. A card is a glyph, a title
   * and a sentence, which needs the whole width — so `mobileCols` defaults to 1.
   * A set whose cells are a mark plus one word (a framework grid) is the case
   * where two-up says in half the height what a single file of sixteen says in a
   * screen and a half; that set opts in.
   */
  defineOptions({ name: 'DocCardGroup' })

  interface Props {
    /** Column count at the large breakpoint. */
    cols?: 1 | 2 | 3 | 4
    /** Column count on a phone. Two only pays when the cells are a mark plus a word. */
    mobileCols?: 1 | 2
  }

  withDefaults(defineProps<Props>(), { cols: 2, mobileCols: 1 })

  defineSlots<{
    /** The `DocCard` children. */
    default(): unknown
  }>()
</script>

<template>
  <FrameBox
    data-doc-block
    data-testid="doc-card-group"
    :data-cols="cols"
    class="w-full"
  >
    <div
      class="grid w-full gap-px bg-(--border-default) data-[mobile-cols=1]:grid-cols-1 data-[mobile-cols=2]:grid-cols-2 data-[cols=2]:sm:grid-cols-2 data-[cols=3]:sm:grid-cols-2 data-[cols=3]:lg:grid-cols-3 data-[cols=4]:sm:grid-cols-2 data-[cols=4]:lg:grid-cols-4"
      :data-cols="cols"
      :data-mobile-cols="mobileCols"
    >
      <slot />
    </div>
  </FrameBox>
</template>
