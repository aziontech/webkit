<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableToolbar',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Shows divider between toolbar lines. */
      showDivider?: boolean
    }>(),
    {
      showDivider: true
    }
  )

  defineSlots<{
    'first-line'(): unknown
    'second-line'(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__toolbar`
  )
</script>

<template>
  <div
    v-bind="attrs"
    class="flex w-full flex-col gap-[var(--spacing-3)]"
    :data-testid="testId"
  >
    <div
      class="px-[var(--spacing-3)]"
      :data-testid="`${testId}__first-line`"
    >
      <slot name="first-line" />
    </div>
    <hr
      v-if="showDivider"
      class="border-0 border-t border-[var(--border-default)]"
      :data-testid="`${testId}__divider`"
    />
    <div
      class="px-[var(--spacing-3)]"
      :data-testid="`${testId}__second-line`"
    >
      <slot name="second-line" />
    </div>
  </div>
</template>
