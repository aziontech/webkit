<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCommandMenuContext } from '../injection-key'

  defineOptions({
    name: 'CommandMenuList',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__list`
  )
</script>

<template>
  <div
    v-bind="attrs"
    :id="ctx.listId"
    role="listbox"
    :data-testid="testId"
    class="max-h-[24rem] overflow-y-auto p-[var(--spacing-xxs)]"
  >
    <slot />
  </div>
</template>
