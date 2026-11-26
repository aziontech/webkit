<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const speed = ref('standard')
  const view = ref('list')

  const speeds = [
    { label: 'Standard', value: 'standard' },
    { label: 'Fast', value: 'fast', icon: 'az az-bolt' }
  ]
  const views = [
    { label: 'List', value: 'list', icon: 'az az-list' },
    { label: 'Grid', value: 'grid', icon: 'az az-layout-grid' }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <ToggleGroup
      v-model="speed"
      :options="speeds"
      size="medium"
      aria-label="Response speed"
    />
    <ToggleGroup
      v-model="view"
      :options="views"
      size="medium"
      aria-label="View"
      :show-labels="false"
    />
  </div>
</template>
