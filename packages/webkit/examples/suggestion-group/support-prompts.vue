<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const items = [
    { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'az az-github' },
    { id: 'waf', label: 'Protect my site with a WAF', icon: 'az az-shield' },
    { id: 'cache', label: 'Explain why my cache hit ratio dropped', icon: 'az az-chart-line' }
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
