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
   * The internal rules are the GRID'S OWN GAPS, painted BY THE CELLS. The grid
   * keeps its 1px gaps and every cell draws a 1px ring just outside its box, so
   * two neighbours' rings land in the same shared gap and read as one hairline —
   * it cannot double the way two abutting borders would paint 2px. It is still
   * correct at every width for free: the column count changes at two
   * breakpoints, and no per-cell border list has to know which cells sit on an
   * edge — a thing CSS can answer and a prop cannot.
   *
   * Painting from the cells rather than as a rule-coloured background BEHIND the
   * grid is what lets an incomplete last row exist. A background shows through
   * every track no cell occupies, as one or two rule-coloured holes, which is
   * what forced a consumer to span its last card across the remainder. A ring
   * paints only where a cell is, so the remainder is simply empty and every card
   * stays one column wide.
   *
   * Cells carry their own OPAQUE SURFACE fill (`bg-(--bg-surface)`), so the set
   * reads as one panel lifted off the page canvas rather than as holes cut in it,
   * and a hover state has a fill of its own to swap out instead of compositing
   * with whatever happens to sit behind the grid.
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
      class="grid w-full gap-px [&>*]:ring-1 [&>*]:ring-(--border-default) data-[mobile-cols=1]:grid-cols-1 data-[mobile-cols=2]:grid-cols-2 data-[cols=2]:sm:grid-cols-2 data-[cols=3]:sm:grid-cols-2 data-[cols=3]:lg:grid-cols-3 data-[cols=4]:sm:grid-cols-2 data-[cols=4]:lg:grid-cols-4"
      :data-cols="cols"
      :data-mobile-cols="mobileCols"
    >
      <slot />
    </div>
  </FrameBox>
</template>
