<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
</script>

<template>
  <MediaSplitBand
    anchor="topology"
    eyebrow="Workloads"
    title="Read the whole request path on one screen"
    description="The domains, the application and the firewall a workload serves, drawn as one chain you can follow from left to right."
    orientation="vertical"
    texture="dots"
    :linked="false"
    :scene="{ component: 'ProductWidget', props: { name: 'workload-topology' } }"
    :primary-action="{ label: 'Docs', href: '/docs/workloads' }"
  />
</template>
