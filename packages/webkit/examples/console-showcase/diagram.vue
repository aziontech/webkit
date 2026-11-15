<script setup>
  import ConsoleShowcase from '@aziontech/webkit/console-showcase'
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <ConsoleShowcase
    variant="diagram"
    title="Requests take the shortest path"
    :primary-action="{ label: 'See the network', href: '/network', trailing: true }"
  >
    <template #scene>
      <Illustration
        name="global-network"
        aria-label="Requests routed to the nearest location"
        class="max-w-(--container-lg)"
      />
    </template>
  </ConsoleShowcase>
</template>
