<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'

  /**
   * A list of `DocItem` rows — the "Related products" band at the foot of a
   * page, a set of concepts introduced side by side, a menu of what to read
   * next.
   *
   * IT IS THE OTHER HALF OF `DocCardGroup`, NOT A VARIANT OF IT. A card group is
   * a grid the reader scans across, and it works when the entries are peers with
   * short names. A list is what to reach for when each entry needs a sentence to
   * be understood: one column, so every description is read at the page's own
   * measure instead of squeezed into a cell.
   *
   * THE FRAME IS `FrameBox`, THE SAME ONE `DocCardGroup` DRAWS. A docs page's
   * blocks are framed, not carded: square rules and the four corner registration
   * marks, one perimeter around the whole set. So the two group shapes — the grid
   * a reader scans across and this file they read down — are the same object with
   * different insides, and a page that uses both does not look like two design
   * systems meeting. It also replaces the rounded `CardBox` surface this used to
   * draw, which was the one block on a docs page with a radius and a fill of its
   * own.
   *
   * THE FILL IS THE FRAME'S, LIKE A CARD GROUP'S CELLS. The block sits on
   * `--bg-surface`, one opaque fill behind the whole file of rows, so a page that
   * mixes the grid and the list puts both sets on the same plane above the canvas.
   * It is painted here, once, rather than per row: the rows are separated by
   * hairlines, not by gaps, so there is nothing between them for the canvas to
   * show through — and a translucent row hover then reads against the surface.
   *
   * Inside it is the webkit list, unchanged: an `ItemList` whose rows sit flush to
   * the frame's rules and are separated by their own bottom borders (`--border-
   * muted`, a step lighter than the frame's `--border-default`, so the perimeter
   * still reads as the outer edge). The rows inherit the list's `default` kind —
   * padded, no surface of their own — which is what keeps a second box from
   * appearing inside the frame. The `role="list"` landmark comes from `ItemList`;
   * the docs layer adds only the block rhythm that separates the frame from the
   * prose.
   */
  defineOptions({ name: 'DocItemGroup' })

  defineSlots<{
    /** The `DocItem` children. */
    default(): unknown
  }>()
</script>

<template>
  <FrameBox
    data-doc-block
    data-doc-chrome
    data-testid="doc-item-group"
    class="w-full bg-(--bg-surface)"
  >
    <ItemList>
      <slot />
    </ItemList>
  </FrameBox>
</template>
