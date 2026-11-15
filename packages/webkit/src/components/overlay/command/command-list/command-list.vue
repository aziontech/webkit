<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandList',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'command-list')
</script>

<template>
  <div
    v-bind="attrs"
    :id="ctx.listId"
    :role="ctx.hasVisibleItems.value ? 'listbox' : undefined"
    :data-testid="testId"
    :data-ranked="ctx.ranking.value || undefined"
    class="data-[ranked]:flex data-[ranked]:flex-col max-h-[24rem] overflow-y-auto px-(--spacing-2xs) py-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
