<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'

  const options = [
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' }
  ]
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <AgentQuestion
      title="Which environment should the new rule go to?"
      :options="options"
      model-value="staging"
      status="success"
    />
    <AgentQuestion
      title="Which environment should the cache purge run on?"
      :options="options"
      status="skipped"
    />
    <AgentQuestion
      type="confirm"
      title="Turn on Brotli compression for the new workload?"
      status="canceled"
    />
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      model-value="shop"
      status="error"
      error="Enter a full domain, such as shop.example.com."
      submit-label="Use this domain"
    />
  </div>
</template>
