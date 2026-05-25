<script setup lang="ts">
  import { computed, onMounted, onUnmounted, useAttrs, useSlots } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableColumn',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Row field key for this column. */
      field?: string
      /** Header label text. */
      header?: string
      /** Enables sort on this column. */
      sortable?: boolean
      /** Freezes column to left or right edge. */
      frozen?: boolean
      /** Frozen alignment side. */
      alignFrozen?: 'left' | 'right'
      /** Optional inline width/style. */
      style?: string
      /** Sort key when different from field. */
      sortField?: string
    }>(),
    {
      field: '',
      header: '',
      sortable: false,
      frozen: false,
      alignFrozen: 'left',
      style: '',
      sortField: ''
    }
  )

  defineSlots<{
    header(): unknown
    body(props: { data: Record<string, unknown>; index: number }): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const ctx = useDataTableContext()

  const columnField = computed(() => props.field || `col-${props.header}` || 'column')

  const registration = computed(() => ({
    field: columnField.value,
    header: props.header,
    sortField: props.sortField || props.field || columnField.value,
    sortable: props.sortable,
    frozen: props.frozen,
    alignFrozen: props.alignFrozen,
    style: props.style,
    hidden: false,
    bodySlot: slots['body'],
    headerSlot: slots['header']
  }))

  onMounted(() => {
    ctx.registerColumn(registration.value)
  })

  onUnmounted(() => {
    ctx.unregisterColumn(columnField.value)
  })
</script>

<template>
  <span
    v-bind="attrs"
    hidden
    aria-hidden="true"
  />
</template>
