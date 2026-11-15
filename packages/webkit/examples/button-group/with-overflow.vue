<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const pinned = ref(true)

  const items = computed(() => [
    { id: 'refresh', label: 'Refresh', icon: 'ai ai-refresh' },
    {
      id: 'pin',
      type: 'toggle',
      label: 'Pin to home',
      icon: 'ai ai-star',
      pressedIcon: 'ai ai-star-fill',
      pressed: pinned.value
    },
    { id: 'share', label: 'Share', icon: 'ai ai-share' },
    { id: 'duplicate', label: 'Duplicate', icon: 'ai ai-copy' },
    { id: 'archive', label: 'Archive', icon: 'ai ai-inbox', disabled: true },
    {
      id: 'export',
      type: 'menu',
      label: 'Export',
      icon: 'ai ai-file-export',
      options: [
        { id: 'export-csv', label: 'Export as CSV' },
        { id: 'export-json', label: 'Export as JSON' }
      ]
    }
  ])
</script>

<template>
  <ButtonGroup
    :items="items"
    :visible-count="3"
    kind="outlined"
    size="small"
    aria-label="Record actions"
    @toggle="({ pressed }) => (pinned = pressed)"
  />
</template>
