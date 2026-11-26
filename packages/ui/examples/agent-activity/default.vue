<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'

  const steps = [
    { key: 'search', title: 'Searching the docs', status: 'success' },
    { key: 'settings', title: 'Reading the cache settings', status: 'success' },
    {
      key: 'read',
      title: 'Reading 3 files',
      status: 'running',
      description: 'cache-settings.md'
    },
    { key: 'write', title: 'Writing the answer', status: 'pending' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentActivity :steps="steps" />
  </div>
</template>
