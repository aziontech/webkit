<script setup>
  import ButtonGroup from '@aziontech/ui/button-group'
  import { computed, ref } from 'vue'

  const pinned = ref(true)

  const items = computed(() => [
    { id: 'refresh', label: 'Refresh', icon: 'az az-refresh' },
    {
      id: 'pin',
      type: 'toggle',
      label: 'Pin to home',
      icon: 'az az-star',
      pressedIcon: 'az az-star-fill',
      pressed: pinned.value
    },
    { id: 'share', label: 'Share', icon: 'az az-share' },
    { id: 'duplicate', label: 'Duplicate', icon: 'az az-copy' },
    { id: 'archive', label: 'Archive', icon: 'az az-inbox', disabled: true },
    {
      id: 'export',
      type: 'menu',
      label: 'Export',
      icon: 'az az-file-export',
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
    variant="outline"
    size="small"
    aria-label="Record actions"
    @toggle="(event, { pressed }) => (pinned = pressed)"
  />
</template>
