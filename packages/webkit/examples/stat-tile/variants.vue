<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="12.4"
    />
    <StatTile
      kind="sans"
      label="Requests"
      :value="48.2"
      unit="M"
    />
  </div>
</template>
