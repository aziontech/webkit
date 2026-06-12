<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__title`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-title"
    :data-testid="testId"
    class="flex w-fit items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
  >
    <slot />
  </div>
</template>
