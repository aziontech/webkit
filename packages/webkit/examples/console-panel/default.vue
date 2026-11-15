<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import ProductWidget from '@aziontech/webkit/product-widget'

  const tabs = [
    { value: 'workloads-list', title: 'Workloads' },
    { value: 'workload-deployments', title: 'Deployments' },
    { value: 'workload-deploy-logs', title: 'Logs' }
  ]
</script>

<template>
  <ConsolePanel
    eyebrow="Console"
    title="One console for every workload"
    description="Deploy, observe and secure from the same place."
    :tabs="tabs"
    :crop="0.2"
  >
    <template #scene="{ tab }">
      <ProductWidget :name="tab ?? 'workloads-list'" />
    </template>
  </ConsolePanel>
</template>
