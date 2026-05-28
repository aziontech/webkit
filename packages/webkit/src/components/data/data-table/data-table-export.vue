<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../button/button.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableExport',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Export button label. */
      label?: string
      /** Disables the export button. */
      disabled?: boolean
      /** Shows loading state on the button. */
      loading?: boolean
    }>(),
    {
      label: 'Export',
      disabled: false,
      loading: false
    }
  )

  const emit = defineEmits<{
    export: []
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__export`
  )

  function handleClick(event: MouseEvent) {
    emit('click', event)
    emit('export')
    ctx.exportCSV()
  }
</script>

<template>
  <Button
    v-bind="attrs"
    :label="label"
    kind="outlined"
    size="small"
    :disabled="disabled"
    :loading="loading"
    :data-testid="testId"
    @click="handleClick"
  />
</template>
