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
    class="relative border-b border-(--border-default) py-(--spacing-sm) px-(--spacing-md)"
  >
    <!--
      Min-height mirrors the absolute close button box (small IconButton,
      1.75rem) so a lone title top-aligns beside the close instead of centering
      in the header padding. No token holds that value; the bare utility is deliberate.
    -->
    <div
      class="flex min-h-7 flex-col gap-(--spacing-xxs) pr-(--spacing-xxl) [&>button]:absolute [&>button]:right-(--spacing-md) [&>button]:top-(--spacing-sm)"
    >
      <slot />
    </div>
  </header>
</template>
