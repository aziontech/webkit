<script setup>
  import Container from '@aziontech/webkit/container'
  import FeatureScrollSection from '@aziontech/webkit/feature-scroll-section'
  import Spacer from '@aziontech/webkit/spacer'

  const items = [
    {
      title: 'Every workload on one list',
      description:
        'See each workload with its domain, status and last deployment, so what is live is never a question.',
      illustration: 'real-time-metrics-status-codes',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/products/workloads/',
        trailing: true
      }
    },
    {
      title: 'Read the deployment topology',
      description:
        'The domains, the application and the firewall a workload serves, drawn as one chain.',
      illustration: 'implement-api-gateway-security',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/products/workloads/',
        trailing: true
      }
    },
    {
      title: 'Domains and TLS, handled',
      description:
        'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
      illustration: 'improve-application-performance-and-reliability',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/products/workloads/',
        trailing: true
      }
    },
    {
      title: 'Ship a version in seconds',
      description:
        'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
      illustration: 'fastest-path-to-live-website',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/products/workloads/',
        trailing: true
      }
    },
    {
      title: 'Gradual rollouts and instant rollback',
      description:
        'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
      illustration: 'branches',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/products/workloads/',
        trailing: true
      }
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <FeatureScrollSection
      eyebrow="Workloads"
      title="Everything a workload does, one screen at a time"
      description="Scroll through what a workload does: the list, the topology, the domains, the deploy and the rollout."
      :items="items"
    />

    <Spacer hatch />
  </Container>
</template>
