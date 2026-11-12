<script setup>
  import Button from '@aziontech/webkit/button'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { ref } from 'vue'

  const value = ref(48210)
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
    <StatTile
      label="Blocked threats"
      :value="value"
    />
    <Button
      kind="secondary"
      size="medium"
      label="Refresh"
      @click="value += 4210"
    />
  </div>
</template>
