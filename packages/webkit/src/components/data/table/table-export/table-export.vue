<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

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
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__export` : 'data-table__export')
  )

  // Context-aware: the root serializes the visible/ordered columns + filtered
  // rows and downloads (or emits `export` for a consumer to handle server-side).
  const onExport = (): void =>
    ctx?.exportCsv({ filename: props.filename || undefined, scope: props.scope })
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
      ariaLabel="Export CSV"
      kind="outlined"
      size="medium"
      @click="onExport"
    />
  </slot>
</template>
