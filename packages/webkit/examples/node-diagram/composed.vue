<script setup>
  import NodeDiagram from '@aziontech/webkit/node-diagram'
</script>

<template>
  <NodeDiagram
    align="center"
    aria-label="Build pipeline"
  >
    <NodeDiagram.Node>Commit</NodeDiagram.Node>
    <NodeDiagram.Node>Build</NodeDiagram.Node>
    <NodeDiagram.Group label="Checks">
      <NodeDiagram.Node>Unit tests</NodeDiagram.Node>
      <NodeDiagram.Node>Lint</NodeDiagram.Node>
    </NodeDiagram.Group>
    <NodeDiagram.Node class="min-w-(--size-56)">
      <NodeDiagram.Header
        icon="az az-upload"
        eyebrow="Deploy"
        status="Running"
        severity="info"
      />
      <NodeDiagram.Title href="#deploy">production</NodeDiagram.Title>
      <NodeDiagram.Description>Started 2 minutes ago</NodeDiagram.Description>
      <NodeDiagram.Footer>
        <NodeDiagram.Item label="Regions">38 of 120</NodeDiagram.Item>
      </NodeDiagram.Footer>
    </NodeDiagram.Node>
  </NodeDiagram>
</template>
