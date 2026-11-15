<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import Input from '../../../inputs/input/input.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableSearch',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Placeholder text for the search input. Empty uses the locale catalog (`Search`). */
      placeholder?: string
      /** Accessible name of the search field. Empty uses the locale catalog (`Search the table`). */
      ariaLabel?: string
    }>(),
    {
      placeholder: '',
      ariaLabel: ''
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ tableSearch: en.tableSearch })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__search` : 'data-table__search')
  )

  const globalFilter = computed<string>(() => {
    const instance = ctx?.table.value
    return instance ? ((instance.getState().globalFilter as string | undefined) ?? '') : ''
  })
  const setFilter = (value: string) => ctx?.table.value?.setGlobalFilter(value)

  if (!ctx) {
    console.warn('[webkit] Table.Search renders outside a Table and filters nothing.')
  }
</script>

<template>
  <Input
    size="small"
    v-bind="$attrs"
    :data-testid="testId"
    class="flex-1"
    :model-value="globalFilter"
    :placeholder="placeholder || t('tableSearch.placeholder')"
    :aria-label="ariaLabel || t('tableSearch.label')"
    @update:model-value="setFilter"
  >
    <template #prefix>
      <i
        class="ai ai-search text-button-md"
        aria-hidden="true"
      />
    </template>
  </Input>
</template>
