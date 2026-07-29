<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuSeparator',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__separator`
  )
</script>

<template>
  <div
    v-bind="attrs"
    role="separator"
    aria-hidden="true"
    :data-testid="testId"
    class="my-[var(--spacing-xxs)] border-t border-[var(--border-default)]"
  />
</template>
