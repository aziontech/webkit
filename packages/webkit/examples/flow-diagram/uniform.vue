<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram uniform>
    <FlowDiagram.Node>You</FlowDiagram.Node>
    <FlowDiagram.Node>
      <span class="flex flex-col">
        <span>Azion</span>
        <span class="text-body-xs text-(--text-muted)">IAD</span>
      </span>
    </FlowDiagram.Node>
    <FlowDiagram.Node>Application</FlowDiagram.Node>
  </FlowDiagram>
</template>
