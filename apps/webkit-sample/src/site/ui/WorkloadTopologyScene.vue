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
          title: 'edge-rules',
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
  <div class="hidden lg:block">
    <div
      class="mt-(--spacing-xl) flex animate-content-enter justify-center motion-reduce:animate-none [--content-enter-delay:120ms]"
    >
      <Flow
        align="center"
        class="w-full max-w-(--container-3xl) shrink-0 [&>div]:w-full"
      >
        <Flow.Parallel
          v-for="level in LEVELS"
          :key="level.key"
          align="start"
          class="min-w-[15rem] flex-1"
        >
          <FlowCard
            v-for="node in level.nodes"
            :key="node.key"
            v-bind="cardProps(node)"
          />
        </Flow.Parallel>
      </Flow>
    </div>
  </div>
</template>
