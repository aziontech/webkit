<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <CardGrid
    kind="gap"
    :columns="4"
    :mobile-columns="1"
  >
    <MediaTile
      title="AI workloads."
      description="Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users."
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaTile>
    <MediaTile
      title="Business-critical APIs."
      description="Ensure fast, resilient API responses under heavy traffic, keeping experiences smooth and consistent."
    >
      <template #media>
        <Illustration name="distributed-apis" />
      </template>
    </MediaTile>
    <MediaTile
      title="Server-side and partial pre-rendering."
      description="Render the page closer to the request, so the first view arrives without waiting on a round trip to origin."
    >
      <template #media>
        <Illustration name="modern-frontends" />
      </template>
    </MediaTile>
    <MediaTile
      title="Middleware."
      description="Run auth, redirects and rewrites on the way in, before the request reaches the application behind them."
    >
      <template #media>
        <Illustration name="runtime" />
      </template>
    </MediaTile>
  </CardGrid>
</template>
