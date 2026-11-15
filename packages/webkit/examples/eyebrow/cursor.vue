<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Eyebrow
      cursor
      prefix="//"
      >OVERLINE TEXT</Eyebrow
    >
    <Eyebrow cursor>NO PREFIX</Eyebrow>
  </div>
</template>
