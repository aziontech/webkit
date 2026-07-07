<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import InputText from '../../../inputs/input-text/input-text.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableSearch',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Placeholder text for the search input. */
      placeholder?: string
    }>(),
    {
      placeholder: 'Search'
    }
  )

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__search` : 'data-table__search')
  )

  // Context-aware: reads and drives the table's global filter directly — no
  // wiring needed by the consumer.
  const globalFilter = computed<string>(() => {
    const instance = ctx?.table.value
    return instance ? ((instance.getState().globalFilter as string | undefined) ?? '') : ''
  })
  const setFilter = (value: string) => ctx?.table.value?.setGlobalFilter(value)
</script>

<template>
  <InputText
    v-bind="$attrs"
    :data-testid="testId"
    class="flex-1"
    size="small"
    :model-value="globalFilter"
    :placeholder="placeholder"
    @update:model-value="setFilter"
  >
    <template #iconLeft>
      <i
        class="pi pi-search text-button-md"
        aria-hidden="true"
      />
    </template>
  </InputText>
</template>
