<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <SectionModule
    :padded="false"
    title="Edge-to-edge body"
  >
    <div
      class="border-t border-(--border-default) p-(--spacing-xl) text-body-md text-(--text-muted)"
    >
      The body owns its own padding, so the grid inside it meets the frame with no gutter.
    </div>
  </SectionModule>
</template>
