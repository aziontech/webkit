<script setup>
  import FlowDiagram from '@aziontech/ui/flow-diagram'
</script>

<template>
  <FlowDiagram
    align="center"
    aria-label="Build pipeline"
  >
    <FlowDiagram.Node>Commit</FlowDiagram.Node>
    <FlowDiagram.Node>Build</FlowDiagram.Node>
    <FlowDiagram.Group label="Checks">
      <FlowDiagram.Node>Unit tests</FlowDiagram.Node>
      <FlowDiagram.Node>Lint</FlowDiagram.Node>
    </FlowDiagram.Group>
    <FlowDiagram.Node class="min-w-(--size-56)">
      <FlowDiagram.Header
        icon="az az-upload"
        eyebrow="Deploy"
        status="Running"
        severity="info"
      />
      <FlowDiagram.Title href="#deploy">production</FlowDiagram.Title>
      <FlowDiagram.Description>Running on 3 of 5 locations</FlowDiagram.Description>
      <FlowDiagram.Footer>
        <FlowDiagram.Item label="Regions">38 of 120</FlowDiagram.Item>
      </FlowDiagram.Footer>
    </FlowDiagram.Node>
  </FlowDiagram>
</template>
