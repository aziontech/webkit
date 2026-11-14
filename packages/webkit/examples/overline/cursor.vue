<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Overline
      cursor
      prefix="//"
      >OVERLINE TEXT</Overline
    >
    <Overline cursor>NO PREFIX</Overline>
  </div>
</template>
