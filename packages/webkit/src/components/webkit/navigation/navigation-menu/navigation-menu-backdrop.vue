<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'

  defineOptions({ name: 'NavigationMenuBackdrop', inheritAttrs: false })

  interface Props {
    as?: string | object
  }

  withDefaults(defineProps<Props>(), {
    as: 'div'
  })

  const attrs = useAttrs()
  const root = useNavigationMenuRoot()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__backdrop'
  )

  const backdropClass = computed(() =>
    cn(
      'fixed inset-0 z-40 bg-[var(--bg-mask)]',
      'transition-opacity duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      'data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:opacity-0',
      attrs.class as string | undefined
    )
  )

  const backdropHidden = computed(() => !root.menuPopupMounted.value)

  const backdropDataAttrs = computed(() => ({
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined,
    'data-state': root.menuOpen.value ? 'open' : 'closed'
  }))
</script>

<template>
  <component
    :is="as"
    v-bind="{ ...attrs, ...backdropDataAttrs }"
    :hidden="backdropHidden"
    :class="backdropClass"
    :data-testid="testId"
    aria-hidden="true"
    @click="root.close()"
  />
</template>
