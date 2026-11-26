<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <Module
    :padded="false"
    title="Edge-to-edge body"
  >
    <div class="p-(--spacing-xl) text-body-md text-(--text-muted)">
      The body owns its own padding, so the grid inside it meets the frame with no gutter.
    </div>
  </Module>
</template>
