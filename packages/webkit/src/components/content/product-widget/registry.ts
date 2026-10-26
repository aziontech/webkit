import type { Component } from 'vue'

import type { ProductWidgetName } from './product-widget.vue'

export type ProductWidgetLoader = () => Promise<{ default: Component }>

export const productWidgetScreens = {
  'application-version': () => import('./widgets/application-version-widget.vue'),
  'cli-terminal-deploy': () => import('./widgets/cli-terminal-deploy-widget.vue'),
  'cli-terminal-start': () => import('./widgets/cli-terminal-start-widget.vue'),
  'workload-deploy-logs': () => import('./widgets/workload-deploy-logs-widget.vue'),
  'workload-deployments': () => import('./widgets/workload-deployments-widget.vue'),
  'workload-domains': () => import('./widgets/workload-domains-widget.vue'),
  'workload-overview': () => import('./widgets/workload-overview-widget.vue'),
  'workload-rollout-rows': () => import('./widgets/workload-rollout-rows-widget.vue'),
  'workload-topology-chain': () => import('./widgets/workload-topology-chain-widget.vue'),
  'workload-topology': () => import('./widgets/workload-topology-widget.vue'),
  'workload-topology-flow': () => import('./widgets/workload-topology-flow-widget.vue'),
  'workloads-list': () => import('./widgets/workloads-list-widget.vue')
} satisfies Partial<Record<ProductWidgetName, ProductWidgetLoader>>

export const productWidgetFragments = {
  'ai-inference-function': () => import('./widgets/ai-inference-function-fragment.vue'),
  'ai-inference-model': () => import('./widgets/ai-inference-model-fragment.vue'),
  'ai-inference-template': () => import('./widgets/ai-inference-template-fragment.vue'),
  'application-accelerator-cookie': () =>
    import('./widgets/application-accelerator-cookie-fragment.vue'),
  'application-accelerator-method': () =>
    import('./widgets/application-accelerator-method-fragment.vue'),
  'application-accelerator-query-string': () =>
    import('./widgets/application-accelerator-query-string-fragment.vue'),
  'application-cache': () => import('./widgets/application-cache-fragment.vue'),
  'application-function': () => import('./widgets/application-function-fragment.vue'),
  'application-rule': () => import('./widgets/application-rule-fragment.vue'),
  'applications-create-method': () => import('./widgets/applications-create-method-fragment.vue'),
  'applications-device-group': () => import('./widgets/applications-device-group-fragment.vue'),
  'applications-rule-phases': () => import('./widgets/applications-rule-phases-fragment.vue'),
  'bot-manager-metrics': () => import('./widgets/bot-manager-metrics-fragment.vue'),
  'bot-manager-rule': () => import('./widgets/bot-manager-rule-fragment.vue'),
  'bot-manager-traffic': () => import('./widgets/bot-manager-traffic-fragment.vue'),
  'data-stream-connector': () => import('./widgets/data-stream-connector-fragment.vue'),
  'data-stream-sampling': () => import('./widgets/data-stream-sampling-fragment.vue'),
  'data-stream-source': () => import('./widgets/data-stream-source-fragment.vue'),
  'ddos-firewall-modules': () => import('./widgets/ddos-firewall-modules-fragment.vue'),
  'ddos-http-events': () => import('./widgets/ddos-http-events-fragment.vue'),
  'ddos-requests-metric': () => import('./widgets/ddos-requests-metric-fragment.vue'),
  'edge-dns-dnssec': () => import('./widgets/edge-dns-dnssec-fragment.vue'),
  'edge-dns-nameserver': () => import('./widgets/edge-dns-nameserver-fragment.vue'),
  'edge-dns-record': () => import('./widgets/edge-dns-record-fragment.vue'),
  'firewall-function': () => import('./widgets/firewall-function-fragment.vue'),
  'firewall-modules': () => import('./widgets/firewall-modules-fragment.vue'),
  'firewall-rules-order': () => import('./widgets/firewall-rules-order-fragment.vue'),
  'function-code': () => import('./widgets/function-code-fragment.vue'),
  'functions-start': () => import('./widgets/functions-start-widget.vue'),
  'image-processor-events': () => import('./widgets/image-processor-events-fragment.vue'),
  'image-processor-module': () => import('./widgets/image-processor-module-fragment.vue'),
  'image-processor-rule': () => import('./widgets/image-processor-rule-fragment.vue'),
  'kv-store-function': () => import('./widgets/kv-store-function-fragment.vue'),
  'kv-store-key': () => import('./widgets/kv-store-key-fragment.vue'),
  'kv-store-security-list': () => import('./widgets/kv-store-security-list-fragment.vue'),
  'load-balancer-address': () => import('./widgets/load-balancer-address-fragment.vue'),
  'load-balancer-method': () => import('./widgets/load-balancer-method-fragment.vue'),
  'load-balancer-origins': () => import('./widgets/load-balancer-origins-fragment.vue'),
  'network-shield-ip-list': () => import('./widgets/network-shield-ip-list-fragment.vue'),
  'network-shield-lists': () => import('./widgets/network-shield-lists-fragment.vue'),
  'network-shield-rule': () => import('./widgets/network-shield-rule-fragment.vue'),
  'object-storage-access': () => import('./widgets/object-storage-access-fragment.vue'),
  'object-storage-browser': () => import('./widgets/object-storage-browser-fragment.vue'),
  'object-storage-buckets': () => import('./widgets/object-storage-buckets-fragment.vue'),
  'real-time-events-filter': () => import('./widgets/real-time-events-filter-fragment.vue'),
  'real-time-events-log': () => import('./widgets/real-time-events-log-fragment.vue'),
  'real-time-events-volume': () => import('./widgets/real-time-events-volume-fragment.vue'),
  'real-time-metrics-dashboard': () => import('./widgets/real-time-metrics-dashboard-fragment.vue'),
  'real-time-metrics-filter': () => import('./widgets/real-time-metrics-filter-fragment.vue'),
  'real-time-metrics-panel': () => import('./widgets/real-time-metrics-panel-fragment.vue'),
  'sql-database-query': () => import('./widgets/sql-database-query-fragment.vue'),
  'sql-database-row': () => import('./widgets/sql-database-row-fragment.vue'),
  'sql-database-table': () => import('./widgets/sql-database-table-fragment.vue'),
  'waf-allowed-rule': () => import('./widgets/waf-allowed-rule-fragment.vue'),
  'waf-firewall-rule': () => import('./widgets/waf-firewall-rule-fragment.vue'),
  'waf-threat': () => import('./widgets/waf-threat-fragment.vue'),
  'workload-deploy': () => import('./widgets/workload-deploy-fragment.vue'),
  'workload-domain': () => import('./widgets/workload-domain-fragment.vue')
} satisfies Partial<Record<ProductWidgetName, ProductWidgetLoader>>

export const productWidgets: Record<ProductWidgetName, ProductWidgetLoader> = {
  ...productWidgetScreens,
  ...productWidgetFragments
}

export const resolveProductWidget = (name: string): ProductWidgetLoader | null =>
  Object.hasOwn(productWidgets, name) ? productWidgets[name as ProductWidgetName] : null
