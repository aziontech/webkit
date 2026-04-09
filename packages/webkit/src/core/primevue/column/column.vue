<script setup>
import { useSlots } from 'vue'
import Column from 'primevue/column'

defineOptions({ name: 'Column' })

const slots = useSlots()

defineExpose({
  // Expose internal Column for DataTable compatibility
  $column: Column
})
</script>

<template>
  <Column>
    <template v-if="slots.body" #body="slotProps">
      <slot name="body" :data="slotProps.data" :field="slotProps.field" :index="slotProps.index" />
    </template>
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="slots.filter" #filter="slotProps">
      <slot name="filter" :field="slotProps.field" :filterModel="slotProps.filterModel" :filterCallback="slotProps.filterCallback" />
    </template>
    <template v-if="slots.editor" #editor="slotProps">
      <slot name="editor" :data="slotProps.data" :field="slotProps.field" :index="slotProps.index" />
    </template>
    <template v-if="slots.rowtoggler" #rowtoggler="slotProps">
      <slot name="rowtoggler" :data="slotProps.data" :index="slotProps.index" />
    </template>
  </Column>
</template>
