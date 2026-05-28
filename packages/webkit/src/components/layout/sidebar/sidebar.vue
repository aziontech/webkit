<script setup lang="ts">
  import { computed, provide, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'
  import ScrollArea from '../scroll-area/scroll-area.vue'
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
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-sidebar')

  provide(SidebarInjectionKey, {
    testId: testId.value
  })

  const rootClasses = computed(() =>
    cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'border-r border-[var(--border-muted)] bg-[var(--bg-surface)]',
      attrs.class
    )
  )

  const navClasses =
    'flex h-full min-h-0 flex-1 flex-col [--menu-item-ring-offset:var(--bg-surface)]'

  const headerRegionClasses = 'w-full shrink-0 p-[var(--spacing-md)] pb-0'

  const footerRegionClasses = 'w-full shrink-0 px-[var(--spacing-md)] pb-[var(--spacing-md)]'

  const scrollClasses = computed(() =>
    cn(
      'flex min-h-0 flex-1 flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]',
      slots['header'] ? 'pt-0' : undefined
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
      :class="headerRegionClasses"
      :data-testid="`${testId}__header`"
    >
      <slot name="header" />
    </div>
    <nav
      :class="navClasses"
      :data-testid="`${testId}__nav`"
    >
      <ScrollArea
        :class="scrollClasses"
        :data-testid="`${testId}__scroll`"
      >
        <slot />
      </ScrollArea>
    </nav>
    <div
      v-if="$slots['footer']"
      :class="footerRegionClasses"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
