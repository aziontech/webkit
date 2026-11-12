<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node unstyled>
      <div class="size-4 rounded-full bg-(--border-default)" />
    </Flow.Node>
    <Flow.Node>my-worker</Flow.Node>
    <Flow.Node unstyled>
      <div
        class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xl) text-label-md text-(--text-default)"
      >
        Taller node
      </div>
    </Flow.Node>
  </Flow>
</template>
