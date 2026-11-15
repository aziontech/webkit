<script setup lang="ts">
  import NavigationMenuArrow from './parts/navigation-menu-arrow.vue'
  import NavigationMenuBackdrop from './parts/navigation-menu-backdrop.vue'
  import NavigationMenuPopup, {
    type NavigationMenuPopupVariant
  } from './parts/navigation-menu-popup.vue'
  import NavigationMenuPortal from './parts/navigation-menu-portal.vue'
  import NavigationMenuPositioner, {
    type NavigationMenuAlign,
    type NavigationMenuCollisionPadding,
    type NavigationMenuSide
  } from './parts/navigation-menu-positioner.vue'
  import NavigationMenuViewportFrame from './parts/navigation-menu-viewport-frame.vue'

  defineOptions({ name: 'NavigationMenuViewport', inheritAttrs: false })

  export interface NavigationMenuViewportProps {
    /** Preferred placement relative to the active trigger. */
    side?: NavigationMenuSide
    /** Alignment along the anchor edge. */
    align?: NavigationMenuAlign
    /** Offset from the anchor on the side axis (px). */
    sideOffset?: number
    /** Offset along the alignment axis (px). */
    alignOffset?: number
    /** Padding reserved for the arrow (px). */
    arrowPadding?: number
    /** Distance kept from the boundary edges (px); an object insets each axis on its own. */
    collisionPadding?: NavigationMenuCollisionPadding
    /** Sticky positioning while scrolling. */
    sticky?: boolean
    /** Tracks the active trigger as the anchor; false keeps the popup where it first opened. */
    trackAnchor?: boolean
    /** Surface treatment of the popup. */
    variant?: NavigationMenuPopupVariant
    /** Shows an arrow that points at the active trigger. */
    arrow?: boolean
    /** Dims the page behind the open popup; a click on it closes the menu. */
    backdrop?: boolean
    /** Teleport container element or selector. */
    container?: object | string
    /** Keeps the popup mounted while it is closed. */
    keepMounted?: boolean
  }

  const props = withDefaults(defineProps<NavigationMenuViewportProps>(), {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    alignOffset: 0,
    arrowPadding: 8,
    collisionPadding: 8,
    sticky: false,
    trackAnchor: true,
    variant: 'default',
    arrow: false,
    backdrop: false,
    container: undefined,
    keepMounted: true
  })
</script>

<template>
  <NavigationMenuPortal
    :container="props.container"
    :keep-mounted="props.keepMounted"
  >
    <NavigationMenuBackdrop v-if="props.backdrop" />
    <NavigationMenuPositioner
      :side="props.side"
      :align="props.align"
      :side-offset="props.sideOffset"
      :align-offset="props.alignOffset"
      :arrow-padding="props.arrowPadding"
      :collision-padding="props.collisionPadding"
      :sticky="props.sticky"
      :track-anchor="props.trackAnchor"
    >
      <NavigationMenuPopup
        v-bind="$attrs"
        :variant="props.variant"
      >
        <NavigationMenuArrow v-if="props.arrow" />
        <NavigationMenuViewportFrame />
      </NavigationMenuPopup>
    </NavigationMenuPositioner>
  </NavigationMenuPortal>
</template>
