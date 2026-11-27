<script setup>
  import Illustration from '@aziontech/ui/illustration'
  import MediaSplit from '@aziontech/ui/media-split'
</script>

<template>
  <MediaSplit
    eyebrow="Deployment"
    title="Go from repository to running application in three steps."
    description="Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it."
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
</template>
