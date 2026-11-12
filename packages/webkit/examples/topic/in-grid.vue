<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <CardGridRoot
    kind="divider"
    :columns="3"
  >
    <div class="relative bg-(--bg-canvas) p-(--spacing-xl)">
      <Topic
        icon="ai ai-edge-nodes"
        title="Consistent global speed"
        description="Serve content across hundreds of locations with median latency under 30 ms."
        href="/products/edge-application"
      />
    </div>
    <div class="relative bg-(--bg-canvas) p-(--spacing-xl)">
      <Topic
        icon="ai ai-load-balancer"
        title="Safer high-traffic launches"
        description="Scale from routine traffic to campaign spikes without cold starts."
        href="/products/load-balancer"
      />
    </div>
    <div class="relative bg-(--bg-canvas) p-(--spacing-xl)">
      <Topic
        icon="pi pi-code"
        title="Compatible with your framework"
        description="Deploy any modern framework or build tool, from Next.js to Astro."
        href="/products/build"
      />
    </div>
  </CardGridRoot>
</template>
