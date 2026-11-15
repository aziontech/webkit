<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram align="center">
    <FlowDiagram.Node>Start</FlowDiagram.Node>
    <FlowDiagram.Parallel>
      <FlowDiagram.Node>Branch A</FlowDiagram.Node>
      <FlowDiagram.Node>Branch B</FlowDiagram.Node>
      <FlowDiagram.Node>Branch C</FlowDiagram.Node>
    </FlowDiagram.Parallel>
    <FlowDiagram.Node>End</FlowDiagram.Node>
  </FlowDiagram>
</template>
