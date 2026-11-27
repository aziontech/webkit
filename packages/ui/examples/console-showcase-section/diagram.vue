<script setup>
  import ConsoleShowcaseSection from '@aziontech/ui/console-showcase-section'
  import Illustration from '@aziontech/ui/illustration'
</script>

<template>
  <ConsoleShowcaseSection
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
  </ConsoleShowcaseSection>
</template>
