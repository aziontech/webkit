<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import CopyButton from '../../../action/copy-button/copy-button.vue'

  defineOptions({
    name: 'TableCellId',
    inheritAttrs: false
  })

  export interface TableCellIdProps {
    /** The identifier shown and copied. */
    value?: string | number
    /** What the identifier belongs to, for the copy button's name (`Copy workload ID`). */
    resource?: string
  }

  const props = withDefaults(defineProps<TableCellIdProps>(), {
    value: '',
    resource: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellId: en.tableCellId })
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-cell-id'
  )

  const text = computed<string>(() =>
    props.value === null || props.value === undefined ? '' : String(props.value)
  )
  const copyLabel = computed<string>(() =>
    props.resource
      ? t('tableCellId.copyResource', { resource: props.resource })
      : t('tableCellId.copy')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <span
      dir="ltr"
      class="min-w-0 flex-1 truncate text-start tabular-nums"
      >{{ text }}</span
    >
    <CopyButton
      v-if="text"
      variant="outline"
      :value="text"
      :aria-label="copyLabel"
      :data-testid="`${testId}__copy`"
      class="ms-auto shrink-0"
      size="small"
    />
  </div>
</template>
