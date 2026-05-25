<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemSeparator',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__separator`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="separator"
    data-slot="item-separator"
    :data-testid="testId"
    class="my-0 h-px w-full shrink-0 bg-[var(--border-muted)]"
  />
</template>
