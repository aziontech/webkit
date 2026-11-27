<script setup>
  import Button from '@aziontech/ui/button'
  import Illustration from '@aziontech/ui/illustration'
  import MediaSplit from '@aziontech/ui/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <MediaSplit
      eyebrow="Deployment"
      title="The media is inert."
      description="Without mediaHref the picture is a picture: the cell has no link, no affordance and nothing to reach by keyboard."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      eyebrow="Deployment"
      title="The band is the link."
      description="With mediaHref a click anywhere on the band follows it. Hover the band and the chevron fades in while the action lights up; Tab reaches the media cell's own link."
      media-href="/site/docs"
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
      <template #actions>
        <Button
          label="Read the guide"
          variant="outline"
          icon="az az-chevron-right"
          icon-position="trailing"
          animated
          href="/site/docs"
        />
      </template>
    </MediaSplit>
  </div>
</template>
