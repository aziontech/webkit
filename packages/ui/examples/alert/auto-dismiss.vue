<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <Alert
    severity="info"
    label="Your workload finished deploying in 42 seconds."
    :life="5000"
  />
</template>
