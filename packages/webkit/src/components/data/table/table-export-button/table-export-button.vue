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
    /** Download filename; empty writes `export.csv`. */
    filename?: string
    /** Which rows to export. */
    scope?: TableExportButtonScope
    /**
     * Rows the `filtered` and `all` scopes write in place of the rows the table holds:
     * `useCollection().exportItems` writes every match, not only the page. A promise is awaited
     * before the `export` event and the download.
     */
    rows?: (scope: 'filtered' | 'all') => object[] | Promise<object[]>
  }

  const props = withDefaults(defineProps<TableExportButtonProps>(), {
    filename: '',
    scope: 'filtered',
    rows: undefined
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

  const rowsFor = (scope: TableExportButtonScope): Promise<object[] | undefined> =>
    Promise.resolve(props.rows && scope !== 'page' ? props.rows(scope) : undefined)
  const onExport = (event?: Event): void =>
    void rowsFor(props.scope).then((rows) =>
      ctx?.exportCsv(
        {
          filename: props.filename || undefined,
          scope: props.scope,
          rows: rows as Record<string, unknown>[] | undefined
        },
        event
      )
    )
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
