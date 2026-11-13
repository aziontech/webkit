<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context'

  defineOptions({ name: 'NavigationMenuBackdrop', inheritAttrs: false })

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__backdrop'
  )

  const root = useNavigationMenuRoot()

  const ROOT_CLASS =
    'fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--bg-canvas)_20%,transparent)] ' +
    'transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:opacity-0'

  const backdropHidden = computed(() => !root.menuPopupMounted.value)

  const backdropDataAttrs = computed(() => ({
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined
  }))
</script>

<template>
  <div
    :hidden="backdropHidden"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
    v-bind="backdropDataAttrs"
    aria-hidden="true"
    @click="root.close()"
  />
</template>
