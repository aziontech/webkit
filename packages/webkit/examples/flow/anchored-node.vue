<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node>Load balancer</Flow.Node>
    <Flow.Node unstyled>
      <div
        class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-overlay)"
      >
        <Flow.Anchor side="end">
          <div class="flex h-10 items-center px-(--spacing-sm) text-label-md text-(--text-default)">
            my-worker
          </div>
        </Flow.Anchor>
        <Flow.Anchor side="start">
          <div
            class="m-(--spacing-2xs) mt-0 flex items-center gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-2xs) text-label-md text-(--text-default)"
          >
            Bindings <span class="text-(--text-muted)">2</span>
          </div>
        </Flow.Anchor>
      </div>
    </Flow.Node>
    <Flow.Parallel>
      <Flow.Node>DATABASE</Flow.Node>
      <Flow.Node>OTHER_SERVICE</Flow.Node>
    </Flow.Parallel>
  </Flow>
</template>
