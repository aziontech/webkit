<script setup>
  import CardGridRoot from '@aziontech/ui/card-grid-root'
  import FeatureItem from '@aziontech/ui/feature-item'
</script>

<template>
  <CardGridRoot
    variant="divider"
    :columns="3"
  >
    <div class="bg-(--bg-canvas) p-(--spacing-xl)">
      <FeatureItem
        icon="az az-edge-nodes"
        title="Consistent global speed"
        description="Serve content across hundreds of locations with median latency under 30 ms."
        href="/products/edge-application"
      />
    </div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl)">
      <FeatureItem
        icon="az az-load-balancer"
        title="Safer high-traffic launches"
        description="Scale from routine traffic to campaign spikes without cold starts."
        href="/products/load-balancer"
      />
    </div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl)">
      <FeatureItem
        icon="az az-code"
        title="Compatible with your framework"
        description="Deploy any modern framework or build tool, from Next.js to Astro."
        href="/products/build"
      />
    </div>
  </CardGridRoot>
</template>
