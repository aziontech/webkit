<script setup>
  import Marquee from '@aziontech/webkit/marquee'
</script>

<template>
  <div class="bg-(--bg-canvas) py-(--spacing-xl)">
    <Marquee
      aria-label="Why teams choose Azion"
      :items="[
        { icon: 'az az-applications', label: 'Distributed to 100+ locations automatically' },
        { icon: 'az az-firewall', label: 'Stop attacks before they reach your origin' },
        { icon: 'az az-functions', label: 'No regions to pick, no servers to manage' },
        { icon: 'az az-sql-database', label: 'Usage-based pricing with no hidden fees' }
      ]"
    />
  </div>
</template>
