<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram align="center">
    <FlowDiagram.Node>Load balancer</FlowDiagram.Node>
    <FlowDiagram.Node unstyled>
      <div
        class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-overlay)"
      >
        <FlowDiagram.Anchor side="end">
          <div class="flex h-10 items-center px-(--spacing-sm) text-label-md text-(--text-default)">
            my-worker
          </div>
        </FlowDiagram.Anchor>
        <FlowDiagram.Anchor side="start">
          <div
            class="m-(--spacing-2xs) mt-0 flex items-center gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-2xs) text-label-md text-(--text-default)"
          >
            Bindings <span class="text-(--text-muted)">2</span>
          </div>
        </FlowDiagram.Anchor>
      </div>
    </FlowDiagram.Node>
    <FlowDiagram.Parallel>
      <FlowDiagram.Node>DATABASE</FlowDiagram.Node>
      <FlowDiagram.Node>OTHER_SERVICE</FlowDiagram.Node>
    </FlowDiagram.Parallel>
  </FlowDiagram>
</template>
