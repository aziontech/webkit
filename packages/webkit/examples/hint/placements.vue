<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <div class="flex items-center gap-(--spacing-lg)">
    <Hint
      content="Anchored above the glyph."
      placement="top"
    />
    <Hint
      content="Anchored to the right of the glyph."
      placement="right"
    />
    <Hint
      content="Anchored below the glyph."
      placement="bottom"
    />
    <Hint
      content="Anchored to the left of the glyph."
      placement="left"
    />
  </div>
</template>
