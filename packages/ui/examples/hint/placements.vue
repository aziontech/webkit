<script setup>
  import Hint from '@aziontech/ui/hint'
</script>

<template>
  <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-2xl)">
    <Hint
      content="Opens above the glyph."
      side="top"
    />
    <Hint
      content="Opens on the end side of the glyph."
      side="end"
    />
    <Hint
      content="Opens below the glyph."
      side="bottom"
    />
    <Hint
      content="Opens on the start side of the glyph."
      side="start"
    />
  </div>
</template>
