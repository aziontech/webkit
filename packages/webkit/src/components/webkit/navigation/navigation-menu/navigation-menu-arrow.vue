<script setup lang="ts">
  import { computed, type ComputedRef, inject, type Ref, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { NAVIGATION_MENU_POSITIONER_KEY } from './composables/use-navigation-menu-positioner-context.js'
  import { navigationMenuArrowClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuArrow', inheritAttrs: false })

  interface Props {
    /** Polymorphic arrow element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'div'
  })

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__arrow'
  )

  interface NavigationMenuPositionerContext {
    arrowStyles: ComputedRef<Record<string, string>>
    arrowRef: Ref<HTMLElement | null>
    resolvedSide: ComputedRef<string>
    resolvedAlign: ComputedRef<string>
  }

  const positioner = inject(
    NAVIGATION_MENU_POSITIONER_KEY,
    null
  ) as NavigationMenuPositionerContext | null
  const arrowEl = ref<HTMLElement | null>(null)

  const arrowClasses = computed(() =>
    cn(navigationMenuArrowClasses, attrs.class as string | undefined)
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
    :is="props.as"
    ref="arrowEl"
    :class="arrowClasses"
    :style="arrowStyle"
    aria-hidden="true"
    :data-testid="testId"
    :data-side="positioner?.resolvedSide?.value"
    :data-align="positioner?.resolvedAlign?.value"
  />
</template>
