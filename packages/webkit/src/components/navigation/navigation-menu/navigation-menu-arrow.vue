<script setup lang="ts">
  import { computed, inject, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { NavigationMenuPositionerInjectionKey } from './injection-key'

  defineOptions({ name: 'NavigationMenuArrow', inheritAttrs: false })

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-navigation-menu__arrow'
  )

  const positioner = inject(NavigationMenuPositionerInjectionKey, null)
  const arrowEl = ref<HTMLElement | null>(null)

  const ROOT_CLASS =
    'absolute size-3 rotate-45 rtl:-scale-x-100 border border-solid border-(--border-default) bg-(--bg-surface-raised) ' +
    'data-[side=bottom]:-top-1.5 data-[side=bottom]:border-b-0 data-[side=bottom]:border-e-0 ' +
    'data-[side=top]:-bottom-1.5 data-[side=top]:border-s-0 data-[side=top]:border-t-0'

  const arrowStyle = computed(() => positioner?.arrowStyles.value ?? {})

  watch(arrowEl, (element) => {
    positioner?.setArrowEl(element)
  })
</script>

<template>
  <div
    ref="arrowEl"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :style="arrowStyle"
    aria-hidden="true"
    :data-testid="testId"
    :data-side="positioner?.resolvedSide.value"
    :data-align="positioner?.resolvedAlign.value"
  />
</template>
