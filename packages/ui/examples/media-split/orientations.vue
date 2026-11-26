<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <MediaSplit
      orientation="horizontal"
      eyebrow="Deployment"
      title="Horizontal: two cells from lg up."
      description="The band proper. It stacks below lg and splits above it, so a full-width page reads as a column of alternating halves."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <div class="max-w-(--container-lg)">
      <MediaSplit
        orientation="vertical"
        variant="media-start"
        eyebrow="Deployment"
        title="Vertical: stacked at every width."
        description="The shape a band takes in a column too narrow to carry two halves. variant picks which cell is on top — media-start leads with the picture."
      >
        <template #media>
          <Illustration name="quick-start-with-templates" />
        </template>
      </MediaSplit>
    </div>
  </div>
</template>
