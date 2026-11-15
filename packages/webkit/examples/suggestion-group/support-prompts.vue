<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const items = [
    { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'ai ai-github' },
    { id: 'waf', label: 'Protect my site with a WAF', icon: 'ai ai-shield' },
    { id: 'cache', label: 'Explain why my cache hit ratio dropped', icon: 'ai ai-chart-line' },
    { id: 'domain', label: 'Point my domain to a workload', icon: 'ai ai-globe' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-sm)">
    <SuggestionGroup
      :items="items"
      orientation="vertical"
    />
  </div>
</template>
