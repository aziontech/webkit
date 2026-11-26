<script setup>
  import Tree from '@aziontech/webkit/tree'
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      :items="[]"
      empty-title="No objects yet"
      empty-description="Objects added to this bucket appear here."
      aria-label="Bucket objects"
    />
  </div>
</template>
