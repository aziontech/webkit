<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core'
  import { computed, type Ref, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'
  import { navigationMenuPopupSurfaceClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuPopup', inheritAttrs: false })

  interface Props {
    /** Polymorphic popup element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'nav'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__popup'
  )

  const root = useNavigationMenuRoot()
  const popupHostRef = ref<HTMLElement | null>(null)

  const popupClasses = computed(() =>
    cn(
      navigationMenuTransitionClasses.popup,
      navigationMenuPopupSurfaceClasses,
      attrs.class as string | undefined
    )
  )

  const popupHidden = computed(() => !root.menuPopupMounted.value)

  const popupDataAttrs = computed(() => ({
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined
  }))

  const popupStyle = computed(() => ({
    '--popup-width': 'auto',
    '--popup-height': 'auto',
    '--transform-origin': 'var(--transform-origin, center)',
    ...(root.menuOpen.value ? {} : { pointerEvents: 'none' })
  }))

  watch(
    popupHostRef,
    (target) => {
      root.popupEl.value = resolveHostElement(target)
    },
    { immediate: true }
  )

  onClickOutside(popupHostRef as Ref<HTMLElement | null | undefined>, (event) => {
    if (!root.menuOpen.value) {
      return
    }

    root.setValue(null, createChangeEventDetails('outside-press', event, undefined))
  })

  const onPointerEnter = () => {
    root.cancelTimers()
  }

  const onPointerLeave = (event: globalThis.PointerEvent) => {
    root.scheduleClose(createChangeEventDetails('trigger-hover', event, undefined))
  }
</script>

<template>
  <component
    :is="props.as"
    ref="popupHostRef"
    :hidden="popupHidden"
    :class="popupClasses"
    :style="popupStyle"
    :data-testid="testId"
    v-bind="popupDataAttrs"
    role="navigation"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <slot />
  </component>
</template>
