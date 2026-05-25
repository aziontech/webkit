<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'Sidebar',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the navigation landmark. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Sidebar'
  })

  defineSlots<{
    default(): unknown
    header(): unknown
    footer(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-sidebar')

  provide(SidebarInjectionKey, {
    testId: testId.value
  })

  const rootClasses = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col gap-spacing-elements-md',
      'border-r border-[var(--border-muted)] bg-[var(--bg-surface)] p-spacing-elements-md',
      attrs.class
    )
  )
</script>

<template>
  <aside
    :class="rootClasses"
    :aria-label="ariaLabel"
    :data-testid="testId"
  >
    <div
      v-if="$slots['header']"
      class="w-full shrink-0"
      :data-testid="`${testId}__header`"
    >
      <slot name="header" />
    </div>
    <nav
      class="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      :data-testid="`${testId}__nav`"
    >
      <slot />
    </nav>
    <div
      v-if="$slots['footer']"
      class="w-full shrink-0"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
