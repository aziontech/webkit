<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      model-value="shop.example.com"
      status="running"
    />
  </div>
</template>
