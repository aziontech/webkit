<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePopoverContext } from '../composables/use-popover-context'

  defineOptions({
    name: 'PopoverFooter',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  usePopoverContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'popover-footer')
</script>

<template>
  <footer
    v-bind="attrs"
    :data-testid="testId"
    class="flex items-center justify-end gap-(--spacing-xs) border-t border-(--border-default) py-(--spacing-sm) px-(--spacing-md)"
  >
    <slot />
  </footer>
</template>
