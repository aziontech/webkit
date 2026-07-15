<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__header`
  )
</script>

<template>
  <header
    v-bind="attrs"
    :data-testid="testId"
    class="relative border-b border-[var(--border-default)] py-[var(--spacing-sm)] px-[var(--spacing-md)]"
  >
    <!--
      min-h matches the absolute close button (IconButton small = 1.75rem): with no
      description the lone title line top-aligns within a row at least as tall as the
      close, instead of centering in the header's symmetric padding.
    -->
    <div
      class="flex min-h-[1.75rem] flex-col gap-[var(--spacing-xxs)] pr-[var(--spacing-xxl)] [&>button]:absolute [&>button]:right-[var(--spacing-md)] [&>button]:top-[var(--spacing-sm)]"
    >
      <slot />
    </div>
  </header>
</template>
