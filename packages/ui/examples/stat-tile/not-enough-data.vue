<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <StatTile
    label="Cautioned requests"
    :value="3"
    :trend="[null, null, null, null, null, null, null, null, null, null, null, 3]"
  />
</template>
