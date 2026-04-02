<script setup>
import Column from 'primevue/column'

defineOptions({ name: 'Column' })

const props = defineProps({
  field: {
    type: String,
    default: undefined
  },
  header: {
    type: String,
    default: undefined
  },
  sortable: {
    type: Boolean,
    default: false
  },
  headerClass: {
    type: String,
    default: undefined
  },
  bodyClass: {
    type: String,
    default: undefined
  },
  footerClass: {
    type: String,
    default: undefined
  },
  sortableDisabled: {
    type: Boolean,
    default: false
  },
  filterField: {
    type: String,
    default: undefined
  },
  filterMatchMode: {
    type: String,
    default: undefined
  },
  filterPlaceholder: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  },
  pt: {
    type: Object,
    default: undefined
  }
})
</script>

<template>
  <Column v-bind="props">
    <template v-if="$slots.body" #body="slotProps">
      <slot name="body" :data="slotProps.data" :field="slotProps.field" :index="slotProps.index" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.filter" #filter="slotProps">
      <slot name="filter" :field="slotProps.field" :filterModel="slotProps.filterModel" :filterCallback="slotProps.filterCallback" />
    </template>
    <template v-if="$slots.editor" #editor="slotProps">
      <slot name="editor" :data="slotProps.data" :field="slotProps.field" :index="slotProps.index" />
    </template>
    <template v-if="$slots.rowtoggler" #rowtoggler="slotProps">
      <slot name="rowtoggler" :data="slotProps.data" :index="slotProps.index" />
    </template>
  </Column>
</template>
