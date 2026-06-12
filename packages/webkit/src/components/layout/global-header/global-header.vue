<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { GlobalHeaderInjectionKey } from './injection-key'

  defineOptions({
    name: 'GlobalHeader',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the header landmark. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Global header'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-global-header'
  )

  provide(GlobalHeaderInjectionKey, {
    testId: testId.value
  })
</script>

<template>
  <header
    v-bind="$attrs"
    role="banner"
    :aria-label="ariaLabel"
    :data-testid="testId"
    class="flex h-14 w-full min-w-0 shrink-0 items-center gap-[var(--spacing-sm)] border-b border-[var(--border-muted)] bg-[var(--bg-surface)] pl-[var(--spacing-md)] pr-[var(--spacing-xxl)]"
  >
    <slot />
  </header>
</template>
