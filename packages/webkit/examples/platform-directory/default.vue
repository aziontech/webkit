<script setup>
  import PlatformDirectory from '@aziontech/webkit/platform-directory'
</script>

<template>
  <PlatformDirectory
    title="Everything you need to build and run applications"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'ai ai-edge-ai',
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
            icon: 'ai ai-edge-kv',
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
            icon: 'ai ai-waf-rules',
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
            icon: 'ai ai-real-time-metrics',
            title: 'Real-Time Metrics',
            description: 'Watch traffic, errors and latency as they happen',
            href: 'https://www.azion.com/en/products/real-time-metrics/'
          }
        ]
      }
    ]"
  />
</template>
