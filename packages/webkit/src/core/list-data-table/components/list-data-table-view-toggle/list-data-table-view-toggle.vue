<script setup>
  import SelectButton from 'primevue/selectbutton'

  defineOptions({ name: 'DataTableViewToggle' })

  defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    modes: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <SelectButton
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :options="modes"
    optionLabel="label"
    optionValue="value"
    data-testid="data-table-view-toggle"
  />
</template>
