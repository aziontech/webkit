<script setup>
  import Flow from '@aziontech/webkit/flow'
  import FlowCard from '@shared/ui/flow/FlowCard.vue'

  const LEVELS = [
    {
      key: 'domains',
      nodes: [
        {
          key: 'domain-shop',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'shop.example.com',
          label: 'Public',
          severity: 'info'
        },
        {
          key: 'domain-api',
          eyebrow: 'Domain',
          icon: 'ai ai-domains',
          title: 'api.example.com',
          label: 'Public',
          severity: 'info'
        }
      ]
    },
    {
      key: 'workload',
      nodes: [
        {
          key: 'workload',
          eyebrow: 'Workload',
          icon: 'ai ai-workloads',
          title: 'shop-prod',
          label: 'Live',
          severity: 'success'
        }
      ]
    },
    {
      key: 'bindings',
      nodes: [
        {
          key: 'application',
          eyebrow: 'Application',
          icon: 'ai ai-edge-application',
          title: 'storefront',
          label: 'Active',
          severity: 'success'
        },
        {
          key: 'firewall',
          eyebrow: 'Firewall',
          icon: 'ai ai-edge-firewall',
          title: 'shop-rules',
          label: 'Active',
          severity: 'success'
        }
      ]
    }
  ]

  const HERO_GLOW = [
    'border-(--primary)',
    "before:pointer-events-none before:absolute before:inset-0 before:content-['']",
    'before:rounded-[inherit]',
    'before:shadow-[-22px_0_44px_-16px_var(--accent),22px_0_44px_-16px_var(--primary),0_0_20px_-8px_var(--primary)]'
  ].join(' ')

  const cardProps = (node) => ({
    eyebrow: node.eyebrow,
    icon: node.icon,
    title: node.title,
    label: node.label,
    severity: node.severity || 'secondary',
    terminal: Boolean(node.terminal),
    class: ['w-full', node.key === 'workload' ? HERO_GLOW : '']
  })
</script>

<template>
  <Flow
    align="center"
    class="w-[40rem] shrink-0 @4xl:w-(--container-3xl) [&>div]:w-full"
  >
    <Flow.Parallel
      v-for="level in LEVELS"
      :key="level.key"
      align="start"
      class="min-w-0 flex-1 @4xl:min-w-[15rem]"
    >
      <FlowCard
        v-for="node in level.nodes"
        :key="node.key"
        v-bind="cardProps(node)"
      />
    </Flow.Parallel>
  </Flow>
</template>
