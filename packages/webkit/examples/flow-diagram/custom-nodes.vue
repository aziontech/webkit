<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram align="center">
    <FlowDiagram.Node unstyled>
      <span class="block size-4 rounded-full bg-(--border-default)" />
    </FlowDiagram.Node>
    <FlowDiagram.Node>my-worker</FlowDiagram.Node>
    <FlowDiagram.Node unstyled>
      <div
        class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xl) text-label-md text-(--text-default)"
      >
        Taller node
      </div>
    </FlowDiagram.Node>
  </FlowDiagram>
</template>
