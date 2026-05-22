<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core'
  import { computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'

  defineOptions({ name: 'NavigationMenuPopup', inheritAttrs: false })

  interface Props {
    /** Polymorphic popup element (`nav` by default). */
    as?: string | object
  }

  withDefaults(defineProps<Props>(), {
    as: 'nav'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const root = useNavigationMenuRoot()
  const popupHostRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__popup'
  )

  const popupClass = computed(() =>
    cn(
      navigationMenuTransitionClasses.popup,
      'relative max-h-[var(--available-height,100vh)] overflow-hidden',
      'rounded-[var(--shape-elements)] border border-[var(--border-default)]',
      'bg-[var(--bg-surface)] shadow-lg',
      attrs.class as string | undefined
    )
  )

  const popupHidden = computed(() => !root.menuPopupMounted.value)

  const popupDataAttrs = computed(() => ({
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined,
    'data-state': root.menuOpen.value ? 'open' : 'closed'
  }))

  const mergedAttrs = computed(() => ({
    ...attrs,
    ...popupDataAttrs.value
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

  onClickOutside(popupHostRef, (event) => {
    if (!root.menuOpen.value) {
      return
    }

    root.setValue(null, createChangeEventDetails('outside-press', event, undefined))
  })

  const onPointerEnter = () => {
    root.cancelTimers()
  }

  const onPointerLeave = (event) => {
    root.scheduleClose(createChangeEventDetails('trigger-hover', event, undefined))
  }
</script>

<template>
  <component
    :is="as"
    ref="popupHostRef"
    v-bind="mergedAttrs"
    :hidden="popupHidden"
    :class="popupClass"
    :style="popupStyle"
    :data-testid="testId"
    role="navigation"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <slot />
  </component>
</template>
