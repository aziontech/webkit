<script setup lang="ts">
  import { computed, provide, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuPositioner } from './composables/use-navigation-menu-positioner.js'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'
  import { navigationMenuPositionerLayoutClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuPositioner', inheritAttrs: false })

  export type NavigationMenuSide = 'top' | 'right' | 'bottom' | 'left'
  export type NavigationMenuAlign = 'start' | 'center' | 'end'
  /** Collision padding: one number for both axes, or an inset per axis. */
  export type NavigationMenuCollisionPadding = number | { x: number; y: number }

  interface Props {
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
    /** Disables tracking the active trigger as anchor. */
    disableAnchorTracking?: boolean
    /** Polymorphic positioner element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    alignOffset: 0,
    arrowPadding: 8,
    collisionPadding: 8,
    sticky: false,
    disableAnchorTracking: false,
    as: 'div'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__positioner'
  )

  const root = useNavigationMenuRoot()
  const positionerRef = ref<HTMLElement | null>(null)
  const arrowRef = ref<HTMLElement | null>(null)

  const anchorRef = computed(() =>
    props.disableAnchorTracking ? null : root.activeTriggerEl.value
  )

  const positionerOptions = computed(() => ({
    side: props.side,
    align: props.align,
    sideOffset: props.sideOffset,
    alignOffset: props.alignOffset,
    arrowPadding: props.arrowPadding,
    collisionPadding: props.collisionPadding
  }))

  const {
    floatingStyles,
    resolvedSide,
    resolvedAlign,
    availableWidth,
    availableHeight,
    arrowStyles,
    placed,
    popupOrigin,
    resetPlacement
  } = useNavigationMenuPositioner(
    anchorRef,
    positionerRef,
    arrowRef,
    positionerOptions,
    root.popupSize
  )

  watch(
    () => root.menuPopupMounted.value,
    (mounted) => {
      if (!mounted) {
        resetPlacement()
      }
    }
  )

  provide(NAVIGATION_MENU_POSITIONER_KEY, {
    arrowRef,
    arrowStyles,
    resolvedSide,
    resolvedAlign
  })

  const positionerClasses = computed(() =>
    cn(
      navigationMenuTransitionClasses.positioner,
      navigationMenuPositionerLayoutClasses,
      attrs.class as string | undefined
    )
  )

  const positionerHidden = computed(() => !root.menuPopupMounted.value)

  // The popup reads these caps (`max-w` / `max-h`); the viewport scrolls only while
  // `data-constrained` is set, so an unconstrained morph never flashes a scrollbar.
  const constrained = computed(
    () => availableWidth.value !== null || availableHeight.value !== null
  )

  const positionerStyle = computed(() => ({
    ...floatingStyles.value,
    '--popup-origin': popupOrigin.value,
    '--available-width': availableWidth.value === null ? '100vw' : `${availableWidth.value}px`,
    '--available-height': availableHeight.value === null ? '100vh' : `${availableHeight.value}px`,
    ...(root.menuOpen.value ? {} : { pointerEvents: 'none' })
  }))

  watch(
    positionerRef,
    (target) => {
      root.positionerEl.value = resolveHostElement(target)
    },
    { immediate: true }
  )

  const onPointerEnter = () => {
    root.cancelTimers()
  }
</script>

<template>
  <component
    :is="props.as"
    ref="positionerRef"
    :hidden="positionerHidden"
    :class="positionerClasses"
    :style="positionerStyle"
    role="presentation"
    :data-testid="testId"
    :data-instant="root.instant.value ? '' : undefined"
    :data-starting-style="
      !placed || root.popupTransitionStatus.value === 'starting' ? '' : undefined
    "
    :data-side="resolvedSide"
    :data-align="resolvedAlign"
    :data-constrained="constrained ? '' : undefined"
    @pointerenter="onPointerEnter"
  >
    <slot />
  </component>
</template>
