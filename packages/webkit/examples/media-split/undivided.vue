<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaSplit
      fill="surface"
      eyebrow="Deployment"
      title="With the seam."
      description="The default: a one-pixel gap over a rule fill, so the two cells read as two."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      fill="surface"
      :divided="false"
      eyebrow="Deployment"
      title="Without it."
      description="The grid closes the gap and the halves meet on their own fill, so the band reads as one plate with a picture in it."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
  </div>
</template>
