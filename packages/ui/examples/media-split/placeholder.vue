<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <MediaSplit
    eyebrow="Deployment"
    title="Go from repository to running application in three steps."
    description="Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it."
  >
    <template #media>
      <Illustration />
    </template>
  </MediaSplit>
</template>
