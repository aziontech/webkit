<script setup>
  import ContentColumns from '@aziontech/webkit/content-columns'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <ContentColumns
      eyebrow="Where it runs"
      title="Two places your code can live."
      :columns="2"
      :items="[
        {
          title: 'At the edge',
          description: 'Code runs in the location that answered the request.'
        },
        {
          title: 'At the origin',
          description: 'Code runs where your data is, reached only when the edge cannot answer.'
        }
      ]"
    />
    <ContentColumns
      eyebrow="What you get"
      title="Three properties every deployment inherits."
      :columns="3"
      :items="[
        { title: 'Distributed', description: 'Each deployment is live in every location at once.' },
        {
          title: 'Isolated',
          description: 'Each request runs in its own sandbox, with no shared state.'
        },
        {
          title: 'Observable',
          description: 'Each request is logged with its latency, status and location.'
        }
      ]"
    />
  </div>
</template>
