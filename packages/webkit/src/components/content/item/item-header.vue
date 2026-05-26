<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__header`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-header"
    :data-testid="testId"
    class="flex basis-full items-center justify-between gap-[var(--spacing-2)]"
  >
    <slot />
  </div>
</template>
