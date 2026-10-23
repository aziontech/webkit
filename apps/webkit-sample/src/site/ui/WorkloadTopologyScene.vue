<script setup>
  import WorkloadTopologyFlow from './WorkloadTopologyFlow.vue'
</script>

<template>
  <div class="@container hidden lg:block">
    <div
      class="mt-(--spacing-xl) flex animate-content-enter justify-center motion-reduce:animate-none [--content-enter-delay:120ms]"
    >
      <WorkloadTopologyFlow />
    </div>
  </div>
</template>
