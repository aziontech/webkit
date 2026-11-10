<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2 lg:grid-cols-4">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="8.2"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Blocked threats"
      :value="48210"
      :delta="12.4"
      delta-label="vs previous 24 hours"
      inverse
    />
    <StatTile
      label="Cache hit ratio"
      :value="96.2"
      unit="%"
      :delta="0"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Edge locations"
      :value="120"
    />
  </div>
</template>
