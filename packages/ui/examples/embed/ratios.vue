<script setup>
  import Embed from '@aziontech/ui/embed'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <Embed
      src="https://example.com"
      title="A placeholder document in a 16:9 frame"
      ratio="video"
    />
    <Embed
      src="https://example.com"
      title="A placeholder document in a square frame"
      ratio="square"
    />
    <Embed
      src="https://example.com"
      title="A placeholder document in a 21:9 frame"
      ratio="wide"
    />
  </div>
</template>
