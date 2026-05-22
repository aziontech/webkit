<script setup lang="ts">
  import { computed, inject, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context.js'

  defineOptions({ name: 'NavigationMenuArrow', inheritAttrs: false })

  interface Props {
    as?: string | object
  }

  withDefaults(defineProps<Props>(), {
    as: 'div'
  })

  const attrs = useAttrs()
  const positioner = inject(NAVIGATION_MENU_POSITIONER_KEY, null)
  const arrowEl = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__arrow'
  )

  const arrowClass = computed(() =>
    cn(
      'absolute size-3 rotate-45 border border-[var(--border-default)] bg-[var(--bg-surface)]',
      'data-[side=bottom]:-top-1.5 data-[side=bottom]:border-b-0 data-[side=bottom]:border-r-0',
      'data-[side=top]:-bottom-1.5 data-[side=top]:border-l-0 data-[side=top]:border-t-0',
      attrs.class as string | undefined
    )
  )

  const arrowStyle = computed(() => positioner?.arrowStyles?.value ?? {})

  watch(arrowEl, (element) => {
    if (positioner?.arrowRef) {
      positioner.arrowRef.value = element
    }
  })
</script>

<template>
  <component
    :is="as"
    ref="arrowEl"
    v-bind="attrs"
    :class="arrowClass"
    :style="arrowStyle"
    :data-testid="testId"
    aria-hidden="true"
    :data-side="positioner?.resolvedSide?.value"
    :data-align="positioner?.resolvedAlign?.value"
  />
</template>
