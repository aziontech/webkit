<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      label="Your workload finished deploying in 42 seconds."
      action-label="Label"
    />
    <Alert
      severity="success"
      label="The certificate was issued and is now serving traffic."
      action-label="Label"
    />
    <Alert
      severity="warning"
      label="This edge function is close to its execution time limit."
      action-label="Label"
    />
    <Alert
      severity="danger"
      label="The last deploy failed before reaching the edge."
      action-label="Label"
    />
  </div>
</template>
