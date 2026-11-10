<script setup>
  import Button from '@aziontech/webkit/button'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaSplit
      eyebrow="Deployment"
      title="One action closes the band."
      description="A band that ends on a single next step carries one small secondary button, floored under the copy so consecutive bands line up on it."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
      <template #actions>
        <Button
          label="Read the guide"
          kind="secondary"
          size="small"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          href="/site/docs"
        />
      </template>
    </MediaSplit>
    <MediaSplit
      kind="media-start"
      eyebrow="Deployment"
      title="Two actions keep the same weight order."
      description="When a band offers a second route, it goes beside the first as an outlined button — same size, lower fill, so the band still has one obvious next step."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
      <template #actions>
        <Button
          label="Read the guide"
          kind="secondary"
          size="small"
          href="/site/docs"
        />
        <Button
          label="See GitHub"
          kind="outlined"
          size="small"
          icon="pi pi-github"
          href="https://github.com/aziontech"
          target="_blank"
        />
      </template>
    </MediaSplit>
  </div>
</template>
