<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      label="Your workload finished deploying in 42 seconds."
      action-label="View workload"
    />
    <Alert
      severity="success"
      label="The certificate was issued and is now serving traffic."
      action-label="View certificate"
    />
    <Alert
      severity="warning"
      label="This function is close to its execution time limit."
      action-label="View limits"
    />
    <Alert
      severity="danger"
      label="The last deploy failed before reaching the edge."
      action-label="View logs"
    />
  </div>
</template>
