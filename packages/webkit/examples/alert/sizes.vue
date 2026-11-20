<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      size="small"
      label="A small note."
    />
    <Alert
      severity="info"
      size="medium"
      label="A medium note."
    />
  </div>
</template>
