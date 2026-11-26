<script setup>
  import Tag from '@aziontech/ui/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Primary"
      variant="primary"
      icon="az az-tag"
    />
    <Tag
      label="Neutral"
      severity="neutral"
      icon="az az-box"
    />
    <Tag
      label="Accent"
      variant="accent"
      icon="az az-sparkles"
    />
    <Tag
      label="Success"
      severity="success"
      icon="az az-circle-check"
    />
    <Tag
      label="Warning"
      severity="warning"
      icon="az az-triangle-alert"
    />
    <Tag
      label="Danger"
      severity="danger"
      icon="az az-circle-x"
    />
    <Tag
      label="Info"
      severity="info"
      icon="az az-info"
    />
    <Tag
      label="Contrast"
      variant="contrast"
      icon="az az-star"
    />
  </div>
</template>
