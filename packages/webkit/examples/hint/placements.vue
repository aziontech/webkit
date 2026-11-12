<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <div class="flex items-center gap-(--spacing-lg)">
    <Hint
      text="Anchored above the glyph."
      placement="top"
    />
    <Hint
      text="Anchored to the right of the glyph."
      placement="right"
    />
    <Hint
      text="Anchored below the glyph."
      placement="bottom"
    />
    <Hint
      text="Anchored to the left of the glyph."
      placement="left"
    />
  </div>
</template>
