<script setup lang="ts">
  import type { ButtonGroupItem } from '@aziontech/webkit/button-group'
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { ref } from 'vue'

  const surface = ref<string>('Editor')
  const items: ButtonGroupItem[] = [
    { id: 'copy', label: 'Copy code', icon: 'pi pi-copy' },
    { id: 'wrap', type: 'toggle', label: 'Wrap lines', icon: 'pi pi-arrows-h', pressed: false }
  ]
</script>

<template>
  <ButtonGroup
    :items="items"
    aria-label="Editor actions"
  />
  <ButtonGroup
    :items="items"
    :aria-label="`${surface} actions`"
  />
  <span id="toolbar-name">Record actions</span>
  <ButtonGroup
    :items="items"
    aria-labelledby="toolbar-name"
  />
  <!-- @vue-expect-error the accessible name is a string -->
  <ButtonGroup
    :items="items"
    :ariaLabel="3"
  />
</template>
