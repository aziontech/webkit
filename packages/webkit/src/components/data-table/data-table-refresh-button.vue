<template>
  <PrimeButton
    icon="pi pi-refresh"
    outlined
    :disabled="disabled"
    :loading="loading"
    v-tooltip.bottom="{ value: tooltipText, showDelay: 200 }"
    @click="emit('click', $event)"
    data-testid="data-table-refresh-button"
  />
</template>

<script setup>
  import PrimeButton from 'primevue/button'

  defineOptions({ name: 'DataTableRefreshButton' })

  defineProps({
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    tooltipText: {
      type: String,
      default: 'Refresh'
    }
  })

  const emit = defineEmits(['click'])
</script>
