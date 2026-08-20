<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
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
   * It is the webkit in-card list, exactly as the design system specifies it: a
   * `CardBox` with `padded=false` holding an `ItemList`, so the card draws the
   * single box and full-width dividers rule between rows that sit flush to its
   * edges. The rows inherit the list's `default` kind — padded, no surface of
   * their own — which is what keeps a box from appearing inside the box. The
   * `role="list"` landmark comes from `ItemList`; the docs layer adds only the
   * block rhythm that separates the card from the prose above it.
   */
  defineOptions({ name: 'DocItemGroup' })

  defineSlots<{
    /** The `DocItem` children. */
    default(): unknown
  }>()
</script>

<template>
  <CardBox
    :padded="false"
    data-doc-block
    data-doc-chrome
    data-testid="doc-item-group"
    class="w-full"
  >
    <template #content>
      <ItemList>
        <slot />
      </ItemList>
    </template>
  </CardBox>
</template>
