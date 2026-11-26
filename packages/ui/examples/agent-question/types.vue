<script setup>
  import AgentQuestion from '@aziontech/ui/agent-question'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <AgentQuestion
      title="Which plan should Acme Inc. move to?"
      :options="[
        { value: 'pro', label: 'Pro' },
        { value: 'business', label: 'Business' },
        { value: 'enterprise', label: 'Enterprise' }
      ]"
      submit-label="Change plan"
    />
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      description="I could not find a domain in the repository settings."
      placeholder="shop.example.com"
      submit-label="Use this domain"
    />
    <AgentQuestion
      type="confirm"
      title="Turn on Brotli compression for the new workload?"
      description="Text responses get smaller; older clients still receive gzip."
      submit-label="Turn it on"
      decline-label="Leave it off"
    />
  </div>
</template>
