<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__footer`
  )
</script>

<template>
  <footer
    v-bind="attrs"
    :data-testid="testId"
    class="flex items-center justify-end gap-[var(--spacing-xs)] border-t border-[var(--border-default)] py-[var(--spacing-sm)] px-[var(--spacing-md)]"
  >
    <slot />
  </footer>
</template>
