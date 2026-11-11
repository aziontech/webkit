<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const pinned = ref(true)

  const items = computed(() => [
    { id: 'refresh', label: 'Refresh', icon: 'pi pi-refresh' },
    {
      id: 'pin',
      type: 'toggle',
      label: 'Pin to home',
      icon: 'pi pi-star',
      pressedIcon: 'pi pi-star-fill',
      pressed: pinned.value
    },
    { id: 'share', label: 'Share', icon: 'pi pi-share-alt' },
    { id: 'duplicate', label: 'Duplicate', icon: 'pi pi-clone' },
    { id: 'archive', label: 'Archive', icon: 'pi pi-inbox', disabled: true },
    {
      id: 'export',
      type: 'menu',
      label: 'Export',
      icon: 'pi pi-file-export',
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
