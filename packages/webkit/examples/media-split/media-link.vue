<script setup>
  import Button from '@aziontech/webkit/button'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
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
          kind="outlined"
          size="small"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          href="/site/docs"
        />
      </template>
    </MediaSplit>
  </div>
</template>
