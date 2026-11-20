<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
  import { resolveHostElement } from '../lib/host-element'

  defineOptions({ name: 'NavigationMenuViewportFrame', inheritAttrs: false })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-viewport-frame'
  )

  const root = useNavigationMenuContext()
  const viewportTargetEl = ref<HTMLElement | null>(null)

  const ROOT_CLASS =
    'relative h-full w-full overflow-hidden group-data-[constrained]/positioner:overflow-y-auto'

  watch(
    viewportTargetEl,
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
      ref="viewportTargetEl"
      class="relative h-full w-[var(--navigation-menu-viewport-width,100%)]"
      :data-testid="`${testId}__target`"
    >
      <slot />
    </div>
  </div>
</template>
