<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'

  const steps = [
    { key: 'search', title: 'Searching the docs', status: 'success' },
    {
      key: 'purge',
      title: 'Purging the cache of example.com',
      status: 'error',
      description: 'The purge quota for this hour is used up.'
    },
    { key: 'retry', title: 'Retrying the purge', status: 'running' },
    { key: 'deploy', title: 'Deploying the workload', status: 'canceled' },
    { key: 'notify', title: 'Notifying the team', status: 'skipped' },
    { key: 'report', title: 'Writing the report', status: 'pending' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentActivity
      :steps="steps"
      default-open
    />
  </div>
</template>
