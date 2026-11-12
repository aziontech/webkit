<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <div class="bg-(--bg-canvas) py-(--spacing-xl)">
    <Ticker
      aria-label="Why teams choose Azion"
      :items="[
        { icon: 'ai ai-edge-application', label: 'Distributed to 100+ locations automatically' },
        { icon: 'ai ai-edge-firewall', label: 'Stop attacks before they reach your origin' },
        { icon: 'ai ai-edge-functions', label: 'No regions to pick, no servers to manage' },
        { icon: 'ai ai-edge-sql', label: 'Usage-based pricing with no hidden fees' }
      ]"
    />
  </div>
</template>
