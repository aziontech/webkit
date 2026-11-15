<script setup>
  import ConsoleMockup from '@aziontech/webkit/console-mockup'
  import ConsoleShowcase from '@aziontech/webkit/console-showcase'

  const tabs = [
    { value: 'workloads-list', title: 'Workloads' },
    { value: 'workload-deployments', title: 'Deployments' },
    { value: 'workload-deploy-logs', title: 'Logs' }
  ]
</script>

<template>
  <ConsoleShowcase
    eyebrow="Console"
    title="One console for every workload"
    description="Deploy, observe and secure from the same place."
    :tabs="tabs"
    :crop="0.2"
  >
    <template #scene="{ tab }">
      <ConsoleMockup :name="tab ?? 'workloads-list'" />
    </template>
  </ConsoleShowcase>
</template>
