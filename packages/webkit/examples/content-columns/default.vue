<script setup>
  import ContentColumns from '@aziontech/webkit/content-columns'
</script>

<template>
  <ContentColumns
    eyebrow="How it works"
    title="Every request is handled at the edge."
    description="One platform runs the routing, the code and the cache in the same place, so a request never leaves the network to be answered."
    :columns="3"
    :items="[
      { title: 'Routed', description: 'The request lands at the location closest to the user.' },
      {
        title: 'Executed',
        description: 'Your code runs at that same location, with no region to warm up.'
      },
      { title: 'Cached', description: 'The response is held there, ready for the next request.' }
    ]"
  />
</template>
