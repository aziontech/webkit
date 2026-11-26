<script setup>
  import ConsoleMockup from '@aziontech/webkit/console-mockup'
  import ConsoleShowcaseSection from '@aziontech/webkit/console-showcase-section'

  const tabs = [
    { value: 'workloads-list', title: 'Workloads' },
    { value: 'workload-deployments', title: 'Deployments' },
    { value: 'workload-deploy-logs', title: 'Logs' }
  ]
</script>

<template>
  <ConsoleShowcaseSection
    eyebrow="Console"
    title="One console for every workload"
    description="Deploy, observe and secure from the same place."
    :tabs="tabs"
    :crop="0.2"
  >
    <template #scene="{ tab }">
      <ConsoleMockup :name="tab ?? 'workloads-list'" />
    </template>
  </ConsoleShowcaseSection>
</template>
