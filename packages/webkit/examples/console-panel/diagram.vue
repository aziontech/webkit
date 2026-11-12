<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <ConsolePanel
    kind="diagram"
    title="Requests take the shortest path"
    :actions="[{ label: 'See the network', href: '/network', trailing: true }]"
  >
    <template #scene>
      <Illustration
        name="global-network"
        aria-label="Requests routed to the nearest location"
        class="max-w-(--container-lg)"
      />
    </template>
  </ConsolePanel>
</template>
