<script setup>
  import Message from '@aziontech/webkit/message'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Message
      severity="info"
      label="Your workload finished deploying in 42 seconds."
      action-label="Label"
    />
    <Message
      severity="success"
      label="The certificate was issued and is now serving traffic."
      action-label="Label"
    />
    <Message
      severity="warning"
      label="This edge function is close to its execution time limit."
      action-label="Label"
    />
    <Message
      severity="danger"
      label="The last deploy failed before reaching the edge."
      action-label="Label"
    />
  </div>
</template>
