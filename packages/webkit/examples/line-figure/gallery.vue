<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'

  const names = [
    'azion-404',
    'build-terminal',
    'secure-shield',
    'infra-workloads',
    'ai-versioning',
    'store-replicas',
    'observe-stream',
    'platform-edge',
    'cache-ttl',
    'lb-rotor',
    'ddos-flood',
    'bot-lineup',
    'dns-lookup',
    'metrics-gauge',
    'image-variants',
    'orchestrator-scale',
    'functions-invoke',
    'applications-rules',
    'object-storage-bucket',
    'deployments-release',
    'variables-keys',
    'connectors-link',
    'custom-pages-status',
    'certificates-chain',
    'network-lists-gate'
  ]
</script>

<template>
  <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0 md:grid-cols-4">
    <li
      v-for="name in names"
      :key="name"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <LineFigure :name="name" />
      <span class="text-label-code-sm text-(--text-muted)">{{ name }}</span>
    </li>
  </ul>
</template>
