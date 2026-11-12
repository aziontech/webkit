<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <div class="[--banner-top-height:42%]">
    <Hero
      kind="screen"
      align="center"
      max-width="site"
      texture="dots"
      texture-size="small"
      texture-fade="bottom"
      bottom-height="22%"
    >
      <template #top>
        <div class="flex h-full items-start justify-center pt-(--spacing-xl)">
          <div
            class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-md) text-body-sm text-(--text-muted)"
          >
            Any asset — an SVG, a diagram, a video — framed by the top window
          </div>
        </div>
      </template>

      <Hero.Title
        centered
        eyebrow="Infrastructure"
        eyebrow-prefix="//"
        title="A global network built for fast applications"
        description="Run closer to users with low-latency delivery and stable routing."
      />

      <template #bottom>
        <div class="flex h-full items-end justify-center pb-(--spacing-xl)">
          <p class="m-0 text-body-sm text-(--text-muted)">
            The bottom window keeps its content reachable.
          </p>
        </div>
      </template>
    </Hero>
  </div>
</template>
