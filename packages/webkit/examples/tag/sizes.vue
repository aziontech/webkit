<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        variant="primary"
        size="medium"
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        rounded
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        icon="az az-box"
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        icon="az az-box"
        rounded
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        variant="primary"
        size="small"
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        rounded
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        icon="az az-box"
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        icon="az az-box"
        rounded
      />
    </div>
  </div>
</template>
