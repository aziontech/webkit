<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__content`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-content"
    :data-testid="testId"
    class="flex flex-1 flex-col gap-[var(--spacing-1)] [&+[data-slot=item-content]]:flex-none"
  >
    <slot />
  </div>
</template>
