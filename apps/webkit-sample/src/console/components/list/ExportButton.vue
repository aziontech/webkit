<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  interface Props {
    table?: Record<string, unknown>
    filename?: string
    size?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    table: null,
    filename: '',
    size: 'medium'
  })

  const exportCsv = () => props.table?.exportCsv({ filename: props.filename || undefined })

  const ready = computed(() => Boolean(props.table))
</script>

<template>
  <Tooltip
    text="Download CSV"
    class="shrink-0"
  >
    <IconButton
      icon="pi pi-download"
      kind="outlined"
      :size="size"
      :disabled="!ready"
      ariaLabel="Download CSV"
      data-testid="export-button"
      @click="exportCsv"
    />
  </Tooltip>
</template>
