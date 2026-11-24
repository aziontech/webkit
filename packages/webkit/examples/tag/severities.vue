<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Neutral"
      severity="neutral"
    />
    <Tag
      label="Primary"
      variant="primary"
    />
    <Tag
      label="Accent"
      variant="accent"
    />
    <Tag
      label="Success"
      severity="success"
    />
    <Tag
      label="Warning"
      severity="warning"
    />
    <Tag
      label="Danger"
      severity="danger"
    />
    <Tag
      label="Info"
      severity="info"
    />
    <Tag
      label="Contrast"
      variant="contrast"
    />
    <Tag
      label="Highlight"
      variant="highlight"
    />
  </div>
</template>
