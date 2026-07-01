<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__description`
  )

  onMounted(() => {
    ctx.registerDescription()
  })

  onBeforeUnmount(() => {
    ctx.unregisterDescription()
  })
</script>

<template>
  <p
    v-bind="attrs"
    :id="ctx.descriptionId"
    :data-testid="testId"
    class="text-body-xs text-[var(--text-muted)]"
  >
    <slot />
  </p>
</template>
