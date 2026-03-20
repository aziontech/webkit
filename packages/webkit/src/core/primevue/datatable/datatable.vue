<script setup>
import DataTable from 'primevue/datatable'

defineOptions({ name: 'DataTable' })

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  dataKey: {
    type: String,
    default: undefined
  },
  rows: {
    type: Number,
    default: 0
  },
  first: {
    type: Number,
    default: 0
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  paginator: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: false
  },
  sortField: {
    type: String,
    default: undefined
  },
  sortOrder: {
    type: Number,
    default: undefined
  },
  defaultSortOrder: {
    type: Number,
    default: 1
  },
  multiSortMeta: {
    type: Array,
    default: undefined
  },
  sortMode: {
    type: String,
    default: 'single',
    validator: (val) => ['single', 'multiple'].includes(val)
  },
  removableSort: {
    type: Boolean,
    default: false
  },
  filters: {
    type: Object,
    default: undefined
  },
  filterDisplay: {
    type: String,
    default: undefined,
    validator: (val) => ['row', 'menu'].includes(val)
  },
  globalFilterFields: {
    type: Array,
    default: undefined
  },
  selection: {
    type: [Array, Object],
    default: undefined
  },
  selectionMode: {
    type: String,
    default: undefined,
    validator: (val) => ['single', 'multiple', 'checkbox'].includes(val)
  },
  compareSelectionBy: {
    type: String,
    default: 'equals'
  },
  metaKeySelection: {
    type: Boolean,
    default: true
  },
  contextMenu: {
    type: Boolean,
    default: false
  },
  contextMenuSelection: {
    type: Object,
    default: undefined
  },
  rowHover: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:first', 'update:rows', 'update:sortField', 'update:sortOrder', 'update:multiSortMeta', 'update:selection', 'update:contextMenuSelection', 'update:filters', 'page', 'sort', 'filter', 'row-select', 'row-unselect', 'row-select-all', 'row-unselect-all', 'row-click', 'row-dblclick', 'row-contextmenu', 'row-expand', 'row-collapse', 'column-resize-end', 'column-reorder', 'row-reorder'])
</script>

<template>
  <DataTable
    v-bind="props"
    @update:first="emit('update:first', $event)"
    @update:rows="emit('update:rows', $event)"
    @update:sortField="emit('update:sortField', $event)"
    @update:sortOrder="emit('update:sortOrder', $event)"
    @update:multiSortMeta="emit('update:multiSortMeta', $event)"
    @update:selection="emit('update:selection', $event)"
    @update:contextMenuSelection="emit('update:contextMenuSelection', $event)"
    @update:filters="emit('update:filters', $event)"
    @page="emit('page', $event)"
    @sort="emit('sort', $event)"
    @filter="emit('filter', $event)"
    @row-select="emit('row-select', $event)"
    @row-unselect="emit('row-unselect', $event)"
    @row-select-all="emit('row-select-all', $event)"
    @row-unselect-all="emit('row-unselect-all', $event)"
    @row-click="emit('row-click', $event)"
    @row-dblclick="emit('row-dblclick', $event)"
    @row-contextmenu="emit('row-contextmenu', $event)"
    @row-expand="emit('row-expand', $event)"
    @row-collapse="emit('row-collapse', $event)"
    @column-resize-end="emit('column-resize-end', $event)"
    @column-reorder="emit('column-reorder', $event)"
    @row-reorder="emit('row-reorder', $event)"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.paginatorstart" #paginatorstart>
      <slot name="paginatorstart" />
    </template>
    <template v-if="$slots.paginatorend" #paginatorend>
      <slot name="paginatorend" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
    <template v-if="$slots.groupheader" #groupheader="slotProps">
      <slot name="groupheader" :data="slotProps.data" :index="slotProps.index" />
    </template>
    <template v-if="$slots.groupfooter" #groupfooter="slotProps">
      <slot name="groupfooter" :data="slotProps.data" :index="slotProps.index" />
    </template>
    <template v-if="$slots.expansion" #expansion="slotProps">
      <slot name="expansion" :data="slotProps.data" :index="slotProps.index" />
    </template>
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
    <slot />
  </DataTable>
</template>
