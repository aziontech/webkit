<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { type TableExportButtonScope, TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableExportButton',
    inheritAttrs: false
  })

  export interface TableExportButtonProps {
    /** Download filename; falls back to the table's `exportFilename`. */
    filename?: string
    /** Which rows to export. */
    scope?: TableExportButtonScope
  }

  const props = withDefaults(defineProps<TableExportButtonProps>(), {
    filename: '',
    scope: 'filtered'
  })

  defineSlots<{
    /** Replace the default download control; receives the `export` action. */
    trigger(props: { export: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableExportButton: en.tableExportButton })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-export-button'
  )

  const onExport = (event?: Event): void =>
    void ctx?.exportCsv({ filename: props.filename || undefined, scope: props.scope }, event)
</script>

<template>
  <slot
    name="trigger"
    :export="onExport"
  >
    <Tooltip :content="t('tableExportButton.label')">
      <IconButton
        v-bind="$attrs"
        :data-testid="testId"
        icon="az az-download"
        :ariaLabel="t('tableExportButton.label')"
        variant="outline"
        size="medium"
        @click="onExport"
      />
    </Tooltip>
  </slot>
</template>
