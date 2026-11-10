<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Parallel>
      <Flow.Node>HTTP Trigger</Flow.Node>
      <Flow.Node>Cron Trigger</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Process Request</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Log Analytics</Flow.Node>
      <Flow.Node>Update Cache</Flow.Node>
      <Flow.Node>Send Notification</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Complete</Flow.Node>
  </Flow>
</template>
