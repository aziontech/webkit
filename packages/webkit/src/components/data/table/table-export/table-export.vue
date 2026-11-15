<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { type TableExportScope, TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableExport',
    inheritAttrs: false
  })

  export interface TableExportProps {
    /** Download filename; falls back to the table's `exportFilename`. */
    filename?: string
    /** Which rows to export. */
    scope?: TableExportScope
  }

  const props = withDefaults(defineProps<TableExportProps>(), {
    filename: '',
    scope: 'filtered'
  })

  defineSlots<{
    /** Replace the default download control; receives the `export` action. */
    trigger(props: { export: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableExport: en.tableExport })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__export` : 'data-table__export')
  )

  const onExport = (event?: Event): void =>
    void ctx?.exportCsv({ filename: props.filename || undefined, scope: props.scope }, event)
</script>

<template>
  <slot
    name="trigger"
    :export="onExport"
  >
    <Tooltip :content="t('tableExport.label')">
      <IconButton
        v-bind="$attrs"
        :data-testid="testId"
        icon="ai ai-download"
        :ariaLabel="t('tableExport.label')"
        kind="outlined"
        size="medium"
        @click="onExport"
      />
    </Tooltip>
  </slot>
</template>
