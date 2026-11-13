<script setup lang="ts">
  import { computed, inject, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context'
  import { navigationMenuArrowClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuArrow', inheritAttrs: false })

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__arrow'
  )

  const positioner = inject(NAVIGATION_MENU_POSITIONER_KEY, null)
  const arrowEl = ref<HTMLElement | null>(null)

  const arrowClasses = computed(() =>
    cn(navigationMenuArrowClasses, attrs.class as string | undefined)
  )

  const arrowStyle = computed(() => positioner?.arrowStyles.value ?? {})

  watch(arrowEl, (element) => {
    positioner?.setArrowEl(element)
  })
</script>

<template>
  <div
    ref="arrowEl"
    :class="arrowClasses"
    :style="arrowStyle"
    aria-hidden="true"
    :data-testid="testId"
    :data-side="positioner?.resolvedSide.value"
    :data-align="positioner?.resolvedAlign.value"
  />
</template>
