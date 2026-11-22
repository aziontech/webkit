<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'

  export interface LastUsedTagProps {
    /** What the tag says. */
    label: string
  }

  defineProps<LastUsedTagProps>()
</script>

<template>
  <div class="absolute end-(--spacing-sm) top-0 -translate-y-1/2">
    <Tag
      :label="label"
      severity="info"
      size="small"
    />
  </div>
</template>
