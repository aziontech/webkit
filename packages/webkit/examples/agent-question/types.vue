<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'
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
    />
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      description="I could not find a domain in the repository settings."
      placeholder="shop.example.com"
    />
    <AgentQuestion
      type="confirm"
      title="Keep the old cache rules after the migration?"
      description="They stop matching any request once the new rules are live."
      submit-label="Keep them"
      decline-label="Remove them"
    />
  </div>
</template>
