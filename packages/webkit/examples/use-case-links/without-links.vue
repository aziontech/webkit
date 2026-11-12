<script setup>
  import UseCaseLinks from '@aziontech/webkit/use-case-links'
</script>

<template>
  <UseCaseLinks
    eyebrow="Use Cases"
    title="What teams keep in KV Store"
    :items="[
      {
        icon: 'pi pi-lock',
        title: 'Session management and authentication',
        description:
          'Store user sessions, authentication tokens, and login states close to users for fast authentication.'
      },
      {
        icon: 'pi pi-sliders-h',
        title: 'Feature flags and configuration',
        description:
          'Synchronize feature flags and application configuration globally with low latency.'
      },
      {
        icon: 'pi pi-gauge',
        title: 'API rate limiting and quotas',
        description:
          'Implement sliding window rate limits, token quotas, and access rules with fast lookups.'
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Global counters and analytics',
        description:
          'Count pageviews, inventory levels, and API usage in real time with distributed counters.'
      },
      {
        icon: 'pi pi-ban',
        title: 'Bad actor tracking and security lists',
        description:
          'Store IP addresses and threat signatures to block attackers in real time.'
      },
      {
        icon: 'pi pi-shopping-cart',
        title: 'Carts and personalization',
        description: 'Keep carts and user preferences one fast read away from every visitor.'
      }
    ]"
  />
</template>
