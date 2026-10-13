<script setup lang="ts">
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import Illustration from '@aziontech/webkit/illustration'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useTheme } from '@shared/lib/theme.js'
  import { computed, ref } from 'vue'

  defineOptions({ name: 'ProductIllustrations' })

  type ThemeValue = 'system' | 'dark' | 'light'

  type Product = { label: string; description: string; scene: string; isometric: boolean }
  type Group = { label: string; items: Product[] }

  const product = (label: string, description: string, scene?: string): Product => ({
    label,
    description,
    scene: scene ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    isometric: true
  })

  const concept = (label: string, description: string, scene: string): Product => ({
    label,
    description,
    scene,
    isometric: false
  })

  const groups: Group[] = [
    {
      label: 'Build',
      items: [
        product('Workloads', 'Put an application on a hostname, everywhere'),
        product('Applications', 'Deliver and configure web applications'),
        product('Functions', 'Run serverless code at the edge'),
        product('Cache', 'Speed up content delivery'),
        product('Application Accelerator', 'Optimize dynamic applications'),
        product('Image Processor', 'Resize and convert images on the fly'),
        product('AI Inference', 'Run AI models close to the user'),
        product('Orchestrator', 'Provision and manage edge nodes')
      ]
    },
    {
      label: 'Store',
      items: [
        product('SQL Database', 'A distributed SQL database'),
        product('Object Storage', 'Store and serve objects at the edge'),
        product('KV Store', 'Low-latency key-value store')
      ]
    },
    {
      label: 'Protect',
      items: [
        product('WAF', 'Web application firewall'),
        product('Firewall', 'Filter traffic before it reaches you'),
        product('DDoS Protection', 'Absorb volumetric attacks', 'ddos-mitigation'),
        product('Bot Manager', 'Detect and block malicious bots'),
        product('Network Shield', 'Control access by network'),
        product('Edge DNS', 'Distributed authoritative DNS'),
        product('Load Balancer', 'Global load balancing')
      ]
    },
    {
      label: 'Observe',
      items: [
        product('Data Stream', 'Real-time event streaming'),
        product('Real-Time Events', 'Query raw request logs'),
        product('Real-Time Metrics', 'Live platform metrics'),
        product('Edge Pulse', 'Real user experience monitoring')
      ]
    },
    { label: 'Platform', items: [product('Our Network', 'The global edge network')] }
  ]

  const concepts: Group[] = [
    {
      label: 'Infrastructure',
      items: [
        concept(
          'Regions',
          'Nodes grouped by region, traffic crossing between them',
          'infra-regions'
        ),
        concept('Rack', 'A rack of servers, one of them hot', 'infra-rack'),
        concept('Scaling', 'Capacity added node by node as load climbs', 'infra-scaling')
      ]
    },
    {
      label: 'Database',
      items: [
        concept('Query', 'A query against a table, one row matching', 'database-query'),
        concept('Replication', 'Two databases keeping each other in sync', 'database-replication'),
        concept('Sharding', 'One database split across three shards', 'database-sharding')
      ]
    },
    {
      label: 'Security',
      items: [
        concept('Keys', 'Three keys, one opens the lock', 'secure-keys'),
        concept('Certificate', 'A signed certificate with its seal', 'secure-certificate'),
        concept('Tokens', 'A chain of tokens, one revoked', 'secure-tokens'),
        concept('Rules', 'A rule set with one rule blocking', 'secure-rules')
      ]
    },
    {
      label: 'Observability',
      items: [
        concept('Traces', 'A request as a waterfall of spans', 'observe-traces'),
        concept('Logs', 'Filtered log lines with the error in view', 'observe-logs'),
        concept('Alerts', 'A metric crossing its threshold', 'observe-alerts')
      ]
    },
    {
      label: 'Metrics',
      items: [
        concept('Gauge', 'A gauge three quarters full', 'metrics-gauge'),
        concept('Percentiles', 'A latency histogram with p50, p95 and p99', 'metrics-percentiles'),
        concept('Sparklines', 'Four metrics at a glance, one of them moving', 'metrics-sparklines')
      ]
    },
    {
      label: 'Events',
      items: [
        concept('Timeline', 'Events on a timeline, one opened', 'events-timeline'),
        concept('Funnel', 'A funnel narrowing step by step', 'events-funnel')
      ]
    },
    {
      label: 'Functions',
      items: [
        concept('Invocations', 'Many requests through one function', 'functions-invocations'),
        concept('Pipeline', 'Functions chained, with a branch', 'functions-pipeline')
      ]
    },
    {
      label: 'Workloads',
      items: [
        concept('Rollout', 'A new version rolling out across nodes', 'workloads-rollout'),
        concept('Hostnames', 'One hostname fronting three deployments', 'workloads-hostnames')
      ]
    },
    {
      label: 'Network',
      items: [
        concept('Anycast', 'One address, every user served by the nearest edge', 'network-anycast'),
        concept(
          'Latency',
          'The long road to the origin against the short one to the edge',
          'network-latency'
        )
      ]
    },
    {
      label: 'AI',
      items: [
        concept('Vector search', 'A query and its nearest neighbours', 'ai-vector-search'),
        concept('Models', 'Model versions stacked, the live one on top', 'ai-models'),
        concept('Agents', 'An agent calling its tools in a loop', 'ai-agents')
      ]
    }
  ]

  const { theme } = useTheme()
  const themeValue = computed<ThemeValue>({
    get: () => (theme.value as ThemeValue | null) ?? 'system',
    set: (next) => {
      theme.value = next
    }
  })
  const onCards = ref(false)
  const isometric = ref(false)
  const sceneOf = (product: Product) =>
    isometric.value ? `${product.scene}-isometric` : product.scene
</script>

<template>
  <main
    data-testid="shared-product-illustrations"
    class="flex h-dvh w-full flex-col gap-(--spacing-xl) overflow-y-auto overscroll-contain bg-(--bg-canvas) px-(--spacing-lg) py-(--spacing-xl) text-(--text-default)"
  >
    <header class="flex flex-wrap items-end justify-between gap-(--spacing-md)">
      <div class="flex flex-col gap-(--spacing-xxs)">
        <h1 class="text-heading-md">Product illustrations</h1>
        <p class="text-body-sm text-(--text-muted)">
          One scene per product in the asset library's language, shipped as a registry illustration.
          Each also exists as an isometric line figure.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-(--spacing-lg)">
        <FieldSwitch
          v-model="isometric"
          label="Isometric"
          description="The line-figure version of each scene."
        />
        <FieldSwitch
          v-model="onCards"
          label="On cards"
          description="Plate takes the surface color."
        />
        <ThemeSwitcher
          v-model:value="themeValue"
          aria-label="Theme"
        />
      </div>
    </header>

    <section
      v-for="group in [...groups, ...concepts]"
      :key="group.label"
      class="flex flex-col gap-(--spacing-md)"
    >
      <h2 class="text-heading-sm">{{ group.label }}</h2>
      <div class="grid gap-(--spacing-lg) sm:grid-cols-2 xl:grid-cols-3">
        <figure
          v-for="item in group.items"
          :key="item.scene"
          :data-on-card="onCards || null"
          class="flex flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-transparent data-[on-card]:border-(--border-default) data-[on-card]:bg-(--bg-surface) data-[on-card]:p-(--spacing-md) data-[on-card]:[--illustration-ground:var(--bg-surface)]"
        >
          <Illustration
            :name="sceneOf(item)"
            :aria-label="item.description"
          />
          <figcaption class="flex items-baseline justify-between gap-(--spacing-sm)">
            <span class="text-label-sm">{{ item.label }}</span>
            <span class="text-body-code-sm text-(--text-muted)">{{ sceneOf(item) }}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>
