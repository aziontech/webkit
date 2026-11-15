<script setup>
  import CopyCommand from '@aziontech/webkit/copy-command'
</script>

<template>
  <CopyCommand
    :shell="false"
    value="Deploy this repository to Azion and give me the URL"
  />
</template>
