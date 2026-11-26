<script setup>
  import StatTile from '@aziontech/ui/stat-tile'
  import StatTileGroup from '@aziontech/ui/stat-tile-group'
</script>

<template>
  <StatTileGroup aria-label="Usage">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="12.4"
    />
    <StatTile
      label="Requests / second"
      :value="1240"
      unit="/s"
      :delta="3.8"
    />
    <StatTile
      label="Bandwidth saving"
      :value="588"
      unit="GB"
      :delta="6.2"
    />
    <StatTile
      label="Data offload"
      :value="70"
      unit="%"
      :delta="-1.5"
    />
  </StatTileGroup>
</template>
