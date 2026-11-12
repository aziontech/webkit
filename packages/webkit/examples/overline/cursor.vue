<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Overline
      show-cursor
      prefix="//"
      >OVERLINE TEXT</Overline
    >
    <Overline show-cursor>NO PREFIX</Overline>
  </div>
</template>
