<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__title`
  )

  onMounted(() => {
    ctx.registerTitle()
  })

  onBeforeUnmount(() => {
    ctx.unregisterTitle()
  })
</script>

<template>
  <h2
    v-bind="attrs"
    :id="ctx.titleId"
    :data-testid="testId"
    class="text-body-sm text-[var(--text-default)]"
  >
    <slot />
  </h2>
</template>
