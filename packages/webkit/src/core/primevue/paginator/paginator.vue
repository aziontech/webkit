<script setup>
  import Paginator from 'primevue/paginator'

  defineOptions({ name: 'Paginator' })

  const props = defineProps({
    totalRecords: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => []
    },
    template: {
      type: String,
      default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
    },
    currentPageReportTemplate: {
      type: String,
      default: '({currentPage} of {totalPages})'
    },
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:first', 'update:rows', 'page'])
</script>

<template>
  <Paginator
    :totalRecords="props.totalRecords"
    :rows="props.rows"
    :first="props.first"
    :pageLinkSize="props.pageLinkSize"
    :rowsPerPageOptions="props.rowsPerPageOptions"
    :template="props.template"
    :currentPageReportTemplate="props.currentPageReportTemplate"
    :class="props.class"
    @update:first="emit('update:first', $event)"
    @update:rows="emit('update:rows', $event)"
    @page="emit('page', $event)"
  >
    <template
      v-if="$slots.start"
      #start
    >
      <slot name="start" />
    </template>
    <template
      v-if="$slots.end"
      #end
    >
      <slot name="end" />
    </template>
  </Paginator>
</template>
