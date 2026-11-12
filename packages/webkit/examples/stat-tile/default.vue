<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <StatTile
    label="Blocked threats"
    :value="48210"
    :delta="12.4"
    delta-label="vs previous 24 hours"
    inverse
    :trend="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]"
  />
</template>
