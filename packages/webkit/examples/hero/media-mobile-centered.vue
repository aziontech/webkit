<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <Hero max-width="site">
    <Hero.Title
      mobile-centered
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
      description="Run closer to users with low-latency delivery and stable routing."
    />

    <template #media>
      <div
        class="flex aspect-video w-full items-center justify-center text-center border border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-muted)"
      >
        Any asset — a screenshot, a diagram, a signup form
      </div>
    </template>
  </Hero>
</template>
