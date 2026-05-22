<script setup lang="ts">
  import { computed, provide, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuPositioner } from './composables/use-navigation-menu-positioner.js'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'

  export type NavigationMenuPositionerSide = 'top' | 'bottom' | 'left' | 'right'
  export type NavigationMenuPositionerAlign = 'start' | 'center' | 'end'

  defineOptions({ name: 'NavigationMenuPositioner', inheritAttrs: false })

  interface Props {
    side?: NavigationMenuPositionerSide
    align?: NavigationMenuPositionerAlign
    sideOffset?: number
    alignOffset?: number
    arrowPadding?: number
    collisionPadding?: number
    sticky?: boolean
    disableAnchorTracking?: boolean
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    side: 'bottom',
    align: 'start',
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
  const root = useNavigationMenuRoot()
  const positionerRef = ref<HTMLElement | null>(null)
  const arrowRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__positioner'
  )

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

  const positionerClass = computed(() =>
    cn(
      navigationMenuTransitionClasses.positioner,
      'fixed z-50 max-h-[var(--available-height,100vh)] max-w-[min(var(--available-width,100vw),100vw)]',
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
    :is="as"
    ref="positionerRef"
    v-bind="attrs"
    :hidden="positionerHidden"
    :class="positionerClass"
    :style="positionerStyle"
    :data-testid="testId"
    role="presentation"
    :data-instant="root.instant.value ? '' : undefined"
    :data-side="resolvedSide"
    :data-align="resolvedAlign"
    @pointerenter="onPointerEnter"
  >
    <slot />
  </component>
</template>
