<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId ?? 'content-item'}__description`
  )
</script>

<template>
  <p
    v-bind="$attrs"
    data-slot="item-description"
    :data-testid="testId"
    class="line-clamp-2 text-balance text-body-sm text-[var(--text-muted)]"
  >
    <slot />
  </p>
</template>
