<script setup>
  import FeatureScrollSection from '@aziontech/ui/feature-scroll-section'
</script>

<template>
  <FeatureScrollSection
    eyebrow="Workloads"
    title="Everything a workload does, one screen at a time"
    description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
    :items="[
      {
        title: 'Every workload on one list',
        description:
          'See each workload with its domain, status and last deployment, so what is live is never a question.',
        scene: { component: 'ConsoleMockup', props: { name: 'workloads-list', width: 600 } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/platform/workloads/',
          trailing: true
        }
      },
      {
        title: 'Read the deployment topology',
        description:
          'The domains, the application and the firewall a workload serves, drawn as one chain.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-topology', width: 600 } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/platform/workloads/',
          trailing: true
        }
      },
      {
        title: 'Domains and TLS, handled',
        description:
          'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-domains', width: 600 } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/platform/workloads/',
          trailing: true
        }
      },
      {
        title: 'Ship a version in seconds',
        description:
          'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-deploy' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/platform/workloads/',
          trailing: true
        }
      },
      {
        title: 'Gradual rollouts and instant rollback',
        description:
          'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-rollout-rows', width: 600 } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/platform/workloads/',
          trailing: true
        }
      }
    ]"
  />
</template>
