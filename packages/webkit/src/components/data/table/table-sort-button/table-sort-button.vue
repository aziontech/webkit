<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { TableInjectionKey, type TableSortDirection } from '../injection-key'

  export type { TableSortDirection }

  defineOptions({
    name: 'TableSortButton',
    inheritAttrs: false
  })

  export interface TableSortButtonProps {
    /** Current sort direction shown by the glyph. */
    sortDirection?: TableSortDirection
  }
  const props = withDefaults(defineProps<TableSortButtonProps>(), {
    sortDirection: 'none'
  })

  const emit = defineEmits<{
    sort: [direction: 'ascending' | 'descending']
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableSortButton: en.tableSortButton })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__sort-button` : 'data-table__sort-button')
  )

  const icon = computed<string>(() => {
    if (props.sortDirection === 'ascending') return 'ai ai-arrow-up-wide-narrow'
    if (props.sortDirection === 'descending') return 'ai ai-arrow-down-wide-narrow'
    return 'ai ai-sort'
  })

  const ariaLabel = computed<string>(() => {
    if (props.sortDirection === 'ascending') return t('tableSortButton.ascending')
    if (props.sortDirection === 'descending') return t('tableSortButton.descending')
    return t('tableSortButton.unsorted')
  })

  const onClick = () => {
    emit('sort', props.sortDirection === 'ascending' ? 'descending' : 'ascending')
  }
</script>

<template>
  <IconButton
    v-bind="{ ...$attrs, ariaLabel }"
    :icon="icon"
    variant="ghost"
    size="small"
    :data-testid="testId"
    :data-sort="sortDirection"
    @click="onClick"
  />
</template>
