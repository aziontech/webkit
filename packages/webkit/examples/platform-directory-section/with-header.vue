<script setup>
  import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    anchor="products"
    eyebrow="Platform"
    title="Everything you need to build and run applications"
    description="Build, store, secure and observe applications on one platform."
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
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
            href: '/products/kv-store'
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
            href: '/products/web-application-firewall'
          }
        ]
      },
      {
        title: 'Observe',
        items: [
          {
            icon: 'ai ai-real-time-metrics',
            title: 'Real-Time Metrics',
            description: 'Watch traffic and errors as they happen',
            href: '/products/real-time-metrics'
          }
        ]
      }
    ]"
  />
</template>
