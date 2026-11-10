<script setup>
  import Message from '@aziontech/webkit/message'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Message
      severity="info"
      size="small"
      label="A small note."
    />
    <Message
      severity="info"
      size="medium"
      label="A medium note."
    />
  </div>
</template>
