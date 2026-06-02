<script setup>
  import IconButton from '../../../../components/actions/icon-button/icon-button.vue'

  defineProps({
    label: {
      type: String,
      default: ''
    },
    tooltipText: {
      type: String,
      default: 'Export to CSV'
    },
    buttonClass: {
      type: [String, Object, Array],
      default: 'max-sm:w-full ml-auto'
    },
    testId: {
      type: String,
      default: 'export_button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['export', 'click'])

  const handleExport = (event) => {
    emit('export', event)
  }
</script>

<template>
  <IconButton
    v-tooltip.bottom="{ value: tooltipText, showDelay: 200 }"
    kind="outlined"
    icon="pi pi-download"
    size="medium"
    :class="buttonClass"
    :data-testid="testId"
    :disabled="disabled"
    :loading="loading"
    @click="handleExport"
  />
</template>
