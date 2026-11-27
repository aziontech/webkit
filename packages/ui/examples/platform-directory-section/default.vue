<script setup>
  import PlatformDirectorySection from '@aziontech/ui/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    title="Everything you need to build and run applications"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'az az-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'az az-ai-inference',
            title: 'AI Inference',
            description: 'Run models close to the user',
            href: 'https://www.azion.com/en/products/ai-inference/'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'az az-kv-store',
            title: 'KV Store',
            description: 'Store key-value data with low latency',
            href: 'https://www.azion.com/en/products/kv-store/'
          }
        ]
      },
      {
        title: 'Secure',
        items: [
          {
            icon: 'az az-waf',
            title: 'WAF',
            description: 'Block common attacks close to traffic',
            href: 'https://www.azion.com/en/products/web-application-firewall/'
          }
        ]
      },
      {
        title: 'Observe',
        items: [
          {
            icon: 'az az-real-time-metrics',
            title: 'Real-Time Metrics',
            description: 'Watch traffic, errors and latency as they happen',
            href: 'https://www.azion.com/en/products/real-time-metrics/'
          }
        ]
      }
    ]"
  />
</template>
