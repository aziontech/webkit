<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
  import { ref } from 'vue'

  const FRAMED = [
    'application-version',
    'cli-terminal-deploy',
    'cli-terminal-start',
    'workload-deploy-logs',
    'workload-deployments',
    'workload-domains',
    'workload-overview',
    'workload-rollout-rows',
    'workload-topology',
    'workload-topology-chain',
    'workload-topology-flow',
    'workloads-list'
  ]
  const FRAGMENTS = [
    'ai-inference-function',
    'ai-inference-model',
    'ai-inference-template',
    'application-accelerator-cookie',
    'application-accelerator-method',
    'application-accelerator-query-string',
    'application-cache',
    'application-function',
    'application-rule',
    'applications-create-method',
    'applications-device-group',
    'applications-rule-phases',
    'bot-manager-metrics',
    'bot-manager-rule',
    'bot-manager-traffic',
    'data-stream-connector',
    'data-stream-sampling',
    'data-stream-source',
    'ddos-firewall-modules',
    'ddos-http-events',
    'ddos-requests-metric',
    'edge-dns-dnssec',
    'edge-dns-nameserver',
    'edge-dns-record',
    'firewall-function',
    'firewall-modules',
    'firewall-rules-order',
    'function-code',
    'functions-start',
    'image-processor-events',
    'image-processor-module',
    'image-processor-rule',
    'kv-store-function',
    'kv-store-key',
    'kv-store-security-list',
    'load-balancer-address',
    'load-balancer-method',
    'load-balancer-origins',
    'network-shield-ip-list',
    'network-shield-lists',
    'network-shield-rule',
    'object-storage-access',
    'object-storage-browser',
    'object-storage-buckets',
    'real-time-events-filter',
    'real-time-events-log',
    'real-time-events-volume',
    'real-time-metrics-dashboard',
    'real-time-metrics-filter',
    'real-time-metrics-panel',
    'sql-database-query',
    'sql-database-row',
    'sql-database-table',
    'waf-allowed-rule',
    'waf-firewall-rule',
    'waf-threat',
    'workload-deploy',
    'workload-domain'
  ]
  const hovered = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
      <div
        v-for="name in FRAMED"
        :key="name"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <span class="text-label-sm text-(--text-muted)">{{ name }}</span>
        <div class="aspect-[1.9/1] w-full">
          <ProductWidget
            :name="name"
            fade="bottom"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="name in FRAGMENTS"
        :key="name"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <span class="text-label-sm text-(--text-muted)">{{ name }}</span>
        <div
          class="h-80 w-full min-w-0 overflow-x-visible overflow-y-clip rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]"
          @pointerenter="hovered = name"
          @pointerleave="hovered = ''"
        >
          <ProductWidget
            :name="name"
            :hover="hovered === name"
          />
        </div>
      </div>
    </div>
  </div>
</template>
