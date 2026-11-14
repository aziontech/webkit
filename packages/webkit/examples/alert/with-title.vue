<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <Alert
    severity="danger"
    title="Deploy failed"
    label="The build step exited with code 1. Check the logs, fix the error and deploy again."
    action-label="View logs"
  />
</template>
