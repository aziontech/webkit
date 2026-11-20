<script setup lang="ts">
  import { computed, inject, ref, useAttrs } from 'vue'

  import { useShortcuts } from '../../../../composables/use-shortcuts'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Input from '../../../input/input/input.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableSearch',
    inheritAttrs: false
  })

  export interface TableSearchProps {
    /** Placeholder text for the search input. Empty uses the locale catalog (`Search`). */
    placeholder?: string
    /** Accessible name of the search field. Empty uses the locale catalog (`Search the table`). */
    ariaLabel?: string
  }

  withDefaults(defineProps<TableSearchProps>(), {
    placeholder: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ tableSearch: en.tableSearch })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-search'
  )

  const globalFilter = computed<string>(() => {
    const instance = ctx?.table.value
    return instance ? ((instance.getState().globalFilter as string | undefined) ?? '') : ''
  })
  const setFilter = (value: string) => ctx?.table.value?.setGlobalFilter(value)

  const fieldEl = ref<InstanceType<typeof Input> | null>(null)

  useShortcuts({
    keys: '/',
    label: () => t('tableSearch.focusShortcut'),
    element: () => (fieldEl.value?.$el as HTMLElement | null | undefined) ?? null,
    handler: () => fieldEl.value?.focus()
  })

  if (!ctx) {
    console.warn('[webkit] TableSearch renders outside a Table and filters nothing.')
  }
</script>

<template>
  <Input
    ref="fieldEl"
    size="small"
    v-bind="$attrs"
    :data-testid="testId"
    class="flex-1"
    :model-value="globalFilter"
    :placeholder="placeholder || t('tableSearch.placeholder')"
    :aria-label="ariaLabel || t('tableSearch.label')"
    @update:model-value="setFilter"
  >
    <template #leading>
      <i
        class="az az-search text-button-md"
        aria-hidden="true"
      />
    </template>
  </Input>
</template>
