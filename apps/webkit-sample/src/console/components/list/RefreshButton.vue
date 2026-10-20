<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  interface Props {
    size?: string
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    size: 'medium',
    loading: false
  })

  const emit = defineEmits<{
    refresh: []
  }>()
</script>

<template>
  <Tooltip
    text="Refresh"
    class="shrink-0"
  >
    <IconButton
      icon="pi pi-refresh"
      kind="outlined"
      :size="size"
      :loading="loading"
      ariaLabel="Refresh"
      data-testid="refresh-button"
      @click="(event) => emit('refresh', event)"
    />
  </Tooltip>
</template>
