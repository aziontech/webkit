<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const items = [
    { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'pi pi-github' },
    { id: 'waf', label: 'Protect my site with a WAF', icon: 'pi pi-shield' },
    { id: 'cache', label: 'Explain why my cache hit ratio dropped', icon: 'pi pi-chart-line' },
    { id: 'domain', label: 'Point my domain to a workload', icon: 'pi pi-globe' }
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
