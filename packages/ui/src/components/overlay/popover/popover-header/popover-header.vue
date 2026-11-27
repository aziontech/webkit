<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePopoverContext } from '../composables/use-popover-context'

  defineOptions({
    name: 'PopoverHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  usePopoverContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'popover-header')
</script>

<template>
  <header
    v-bind="attrs"
    role="none"
    :data-testid="testId"
    class="relative border-b border-(--border-default) py-(--spacing-sm) px-(--spacing-md)"
  >
    <div
      class="flex min-h-7 flex-col gap-(--spacing-2xs) pe-(--spacing-2xl) [&>button]:absolute [&>button]:end-(--spacing-md) [&>button]:top-(--spacing-sm)"
    >
      <slot />
    </div>
  </header>
</template>
