<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuContext } from './composables/use-navigation-menu-context'
  import { resolveHostElement } from './lib/host-element'

  defineOptions({ name: 'NavigationMenuViewport', inheritAttrs: false })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-navigation-menu__viewport'
  )

  const root = useNavigationMenuContext()
  const viewportTargetRef = ref<HTMLElement | null>(null)

  const ROOT_CLASS =
    'relative h-full w-full overflow-hidden group-data-[constrained]/positioner:overflow-y-auto'

  watch(
    viewportTargetRef,
    (target) => {
      root.setViewportTargetEl(resolveHostElement(target))
    },
    { immediate: true }
  )
</script>

<template>
  <div
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <div
      ref="viewportTargetRef"
      class="relative h-full w-[var(--navigation-menu-viewport-width,100%)]"
      :data-testid="`${testId}__target`"
    >
      <slot />
    </div>
  </div>
</template>
