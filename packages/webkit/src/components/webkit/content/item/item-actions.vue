<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemActions',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__actions`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-actions"
    :data-testid="testId"
    class="flex items-center gap-[var(--spacing-2)]"
  >
    <slot />
  </div>
</template>
