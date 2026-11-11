<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableExport',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Download filename; falls back to the table's `exportFilename`. */
      filename?: string
      /** Which rows to export. */
      scope?: 'page' | 'filtered' | 'all'
    }>(),
    {
      filename: '',
      scope: 'filtered'
    }
  )

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

  const onExport = (): void =>
    void ctx?.exportCsv({ filename: props.filename || undefined, scope: props.scope })
</script>

<template>
  <slot
    name="trigger"
    :export="onExport"
  >
    <IconButton
      v-bind="$attrs"
      :data-testid="testId"
      icon="pi pi-download"
      :ariaLabel="t('tableExport.label')"
      kind="outlined"
      size="medium"
      @click="onExport"
    />
  </slot>
</template>
