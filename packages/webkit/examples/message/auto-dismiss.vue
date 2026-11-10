<script setup>
  import Message from '@aziontech/webkit/message'
</script>

<template>
  <Message
    severity="info"
    label="Your workload finished deploying in 42 seconds."
    :life="5000"
  />
</template>
