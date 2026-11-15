<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram align="center">
    <FlowDiagram.Parallel>
      <FlowDiagram.Node>HTTP Trigger</FlowDiagram.Node>
      <FlowDiagram.Node>Cron Trigger</FlowDiagram.Node>
    </FlowDiagram.Parallel>
    <FlowDiagram.Node>Process Request</FlowDiagram.Node>
    <FlowDiagram.Parallel>
      <FlowDiagram.Node>Log Analytics</FlowDiagram.Node>
      <FlowDiagram.Node>Update Cache</FlowDiagram.Node>
      <FlowDiagram.Node>Send Notification</FlowDiagram.Node>
    </FlowDiagram.Parallel>
    <FlowDiagram.Node>Complete</FlowDiagram.Node>
  </FlowDiagram>
</template>
