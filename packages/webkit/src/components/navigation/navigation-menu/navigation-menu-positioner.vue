<script setup lang="ts">
  import { computed, provide, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuPositioner } from './composables/use-navigation-menu-positioner.js'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'
  import { navigationMenuPositionerLayoutClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuPositioner', inheritAttrs: false })

  export type NavigationMenuSide = 'top' | 'right' | 'bottom' | 'left'
  export type NavigationMenuAlign = 'start' | 'center' | 'end'

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
    /** Collision padding (px). */
    collisionPadding?: number
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

  const { floatingStyles, resolvedSide, resolvedAlign, arrowStyles } = useNavigationMenuPositioner(
    anchorRef,
    positionerRef,
    arrowRef,
    positionerOptions
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

  const positionerStyle = computed(() => ({
    ...floatingStyles.value,
    '--transform-origin': 'var(--transform-origin, center)',
    '--available-width': '100vw',
    '--available-height': '100vh',
    '--positioner-width': 'auto',
    '--positioner-height': 'auto',
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
    :data-side="resolvedSide"
    :data-align="resolvedAlign"
    @pointerenter="onPointerEnter"
  >
    <slot />
  </component>
</template>
