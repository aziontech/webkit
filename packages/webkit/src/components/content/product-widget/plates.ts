import type { ShellMockupKind } from '../shell-mockup/shell-mockup.vue'
import type { ProductWidgetName } from './product-widget.vue'

export { default as ProductWidgetPlate } from './parts/widget-plate.vue'

export interface ProductWidgetPlating {
  /** How the fragment is plated when the host leaves kind unset. */
  kind: ShellMockupKind
  /** Module label on the console bar of the window a framed fragment is drawn in. */
  title: string
}

export const productWidgetPlates = {
  'ai-inference-function': { kind: 'bare', title: 'AI Inference' },
  'ai-inference-model': { kind: 'bare', title: 'AI Inference' },
  'ai-inference-template': { kind: 'bare', title: 'AI Inference' },
  'application-accelerator-cookie': { kind: 'bare', title: 'Application Accelerator' },
  'application-accelerator-method': { kind: 'bare', title: 'Application Accelerator' },
  'application-accelerator-query-string': { kind: 'bare', title: 'Application Accelerator' },
  'application-cache': { kind: 'window', title: 'Applications' },
  'application-function': { kind: 'bare', title: 'Applications' },
  'application-rule': { kind: 'window', title: 'Applications' },
  'applications-create-method': { kind: 'bare', title: 'Applications' },
  'applications-device-group': { kind: 'window', title: 'Applications' },
  'applications-rule-phases': { kind: 'bare', title: 'Applications' },
  'bot-manager-metrics': { kind: 'bare', title: 'Bot Manager' },
  'bot-manager-rule': { kind: 'window', title: 'Bot Manager' },
  'bot-manager-traffic': { kind: 'bare', title: 'Bot Manager' },
  'data-stream-connector': { kind: 'window', title: 'Data Stream' },
  'data-stream-sampling': { kind: 'window', title: 'Data Stream' },
  'data-stream-source': { kind: 'window', title: 'Data Stream' },
  'ddos-firewall-modules': { kind: 'bare', title: 'DDoS Protection' },
  'ddos-http-events': { kind: 'bare', title: 'DDoS Protection' },
  'ddos-requests-metric': { kind: 'bare', title: 'DDoS Protection' },
  'edge-dns-dnssec': { kind: 'window', title: 'Edge DNS' },
  'edge-dns-nameserver': { kind: 'window', title: 'Edge DNS' },
  'edge-dns-record': { kind: 'window', title: 'Edge DNS' },
  'firewall-function': { kind: 'window', title: 'Firewall' },
  'firewall-modules': { kind: 'bare', title: 'Firewall' },
  'firewall-rules-order': { kind: 'window', title: 'Firewall' },
  'image-processor-events': { kind: 'window', title: 'Image Processor' },
  'image-processor-module': { kind: 'bare', title: 'Image Processor' },
  'image-processor-rule': { kind: 'window', title: 'Image Processor' },
  'kv-store-function': { kind: 'bare', title: 'KV Store' },
  'kv-store-key': { kind: 'window', title: 'KV Store' },
  'kv-store-security-list': { kind: 'bare', title: 'KV Store' },
  'load-balancer-address': { kind: 'bare', title: 'Load Balancer' },
  'load-balancer-method': { kind: 'window', title: 'Load Balancer' },
  'load-balancer-origins': { kind: 'bare', title: 'Load Balancer' },
  'network-shield-ip-list': { kind: 'window', title: 'Network Shield' },
  'network-shield-lists': { kind: 'bare', title: 'Network Shield' },
  'network-shield-rule': { kind: 'window', title: 'Network Shield' },
  'object-storage-access': { kind: 'window', title: 'Object Storage' },
  'object-storage-browser': { kind: 'bare', title: 'Object Storage' },
  'object-storage-buckets': { kind: 'bare', title: 'Object Storage' },
  'real-time-events-filter': { kind: 'window', title: 'Real-Time Events' },
  'real-time-events-log': { kind: 'window', title: 'Real-Time Events' },
  'real-time-events-volume': { kind: 'window', title: 'Real-Time Events' },
  'real-time-metrics-dashboard': { kind: 'window', title: 'Real-Time Metrics' },
  'real-time-metrics-filter': { kind: 'bare', title: 'Real-Time Metrics' },
  'real-time-metrics-panel': { kind: 'bare', title: 'Real-Time Metrics' },
  'sql-database-query': { kind: 'bare', title: 'SQL Database' },
  'sql-database-row': { kind: 'bare', title: 'SQL Database' },
  'sql-database-table': { kind: 'bare', title: 'SQL Database' },
  'waf-allowed-rule': { kind: 'window', title: 'WAF' },
  'waf-firewall-rule': { kind: 'window', title: 'WAF' },
  'waf-threat': { kind: 'bare', title: 'WAF' },
  'workload-deploy': { kind: 'bare', title: 'Workloads' },
  'workload-domain': { kind: 'bare', title: 'Workloads' }
} satisfies Partial<Record<ProductWidgetName, ProductWidgetPlating>>
