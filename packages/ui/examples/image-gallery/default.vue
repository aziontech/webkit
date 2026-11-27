<script setup lang="ts">
  import aiGateway from '@aziontech/ui/assets/ai-gateway.svg'
  import branches from '@aziontech/ui/assets/branches.svg'
  import ddosProtection from '@aziontech/ui/assets/ddos-protection.svg'
  import usageChart from '@aziontech/ui/assets/usage-chart.svg'
  import ImageGallery from '@aziontech/ui/image-gallery'

  const items = [
    { key: 'gateway', src: aiGateway, alt: 'AI gateway illustration' },
    { key: 'ddos', src: ddosProtection, alt: 'DDoS protection illustration' },
    { key: 'usage', src: usageChart, alt: 'Usage chart illustration' },
    { key: 'branches', src: branches, alt: 'Branches illustration' }
  ]
</script>

<template>
  <ImageGallery
    class="max-w-(--container-md)"
    :items="items"
  />
</template>
