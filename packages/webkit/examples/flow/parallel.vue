<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Branch A</Flow.Node>
      <Flow.Node>Branch B</Flow.Node>
      <Flow.Node>Branch C</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow>
</template>
