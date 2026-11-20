<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <div class="flex items-center gap-(--spacing-lg)">
    <Hint
      content="Anchored above the glyph."
      side="top"
    />
    <Hint
      content="Anchored to the right of the glyph."
      side="end"
    />
    <Hint
      content="Anchored below the glyph."
      side="bottom"
    />
    <Hint
      content="Anchored to the left of the glyph."
      side="start"
    />
  </div>
</template>
