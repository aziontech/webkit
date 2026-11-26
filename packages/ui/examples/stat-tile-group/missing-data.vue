<script setup>
  import StatTile from '@aziontech/ui/stat-tile'
  import StatTileGroup from '@aziontech/ui/stat-tile-group'
</script>

<template>
  <StatTileGroup aria-label="Last 24 hours">
    <StatTile
      label="Transactions"
      :value="15300"
      :trend="[2, 9, 4, 4, 5, 6, 7, 7, 12, 5, 10, 5, 8, 9, 4, 6, 5, 5, 4, 6, 6, 6, 1, 4]"
    />
    <StatTile
      label="Blocked"
      :value="7200"
      :trend="[1, 9, 4, 6, 5, 5, 4, 6, 11, 5, 11, 4, 7, 6, 3, 5, 3, 6, 3, 6, 7, 5, 1, 4]"
    />
    <StatTile
      label="Cautioned"
      :value="0"
    />
    <StatTile
      label="Threats"
      :value="null"
    />
    <StatTile
      label="Users"
      :value="1"
      error="The request timed out."
    />
  </StatTileGroup>
</template>
