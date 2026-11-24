import type { Component } from 'vue'

import type { ConsoleMockupName } from './console-mockup.vue'
import type { ConsoleMockupShellVariant } from './parts/console-mockup-shell.vue'
import ConsoleMockupPlate from './parts/widget-plate.vue'

export interface ConsoleMockupPlating {
  /** How the fragment is plated when the host leaves variant unset. */
  variant: ConsoleMockupShellVariant
  /** Module label on the console bar of the window a framed fragment is drawn in. */
  title: string
}

const consoleMockupPlates = {
  'ai-inference-function': { variant: 'bare', title: 'AI Inference' },
  'ai-inference-model': { variant: 'bare', title: 'AI Inference' },
  'ai-inference-template': { variant: 'bare', title: 'AI Inference' },
  'application-accelerator-cookie': { variant: 'bare', title: 'Application Accelerator' },
  'application-accelerator-method': { variant: 'bare', title: 'Application Accelerator' },
  'application-accelerator-query-string': { variant: 'bare', title: 'Application Accelerator' },
  'application-cache': { variant: 'window', title: 'Applications' },
  'application-function': { variant: 'bare', title: 'Applications' },
  'application-rule': { variant: 'window', title: 'Applications' },
  'applications-create-method': { variant: 'bare', title: 'Applications' },
  'applications-device-group': { variant: 'window', title: 'Applications' },
  'applications-rule-phases': { variant: 'bare', title: 'Applications' },
  'bot-manager-metrics': { variant: 'bare', title: 'Bot Manager' },
  'bot-manager-rule': { variant: 'window', title: 'Bot Manager' },
  'bot-manager-traffic': { variant: 'bare', title: 'Bot Manager' },
  'data-stream-connector': { variant: 'window', title: 'Data Stream' },
  'data-stream-sampling': { variant: 'window', title: 'Data Stream' },
  'data-stream-source': { variant: 'window', title: 'Data Stream' },
  'ddos-firewall-modules': { variant: 'bare', title: 'DDoS Protection' },
  'ddos-http-events': { variant: 'bare', title: 'DDoS Protection' },
  'ddos-requests-metric': { variant: 'bare', title: 'DDoS Protection' },
  'edge-dns-dnssec': { variant: 'window', title: 'Edge DNS' },
  'edge-dns-nameserver': { variant: 'window', title: 'Edge DNS' },
  'edge-dns-record': { variant: 'window', title: 'Edge DNS' },
  'firewall-function': { variant: 'window', title: 'Firewall' },
  'firewall-modules': { variant: 'bare', title: 'Firewall' },
  'firewall-rules-order': { variant: 'window', title: 'Firewall' },
  'image-processor-events': { variant: 'window', title: 'Image Processor' },
  'image-processor-module': { variant: 'bare', title: 'Image Processor' },
  'image-processor-rule': { variant: 'window', title: 'Image Processor' },
  'kv-store-function': { variant: 'bare', title: 'KV Store' },
  'kv-store-key': { variant: 'window', title: 'KV Store' },
  'kv-store-security-list': { variant: 'bare', title: 'KV Store' },
  'load-balancer-address': { variant: 'bare', title: 'Load Balancer' },
  'load-balancer-method': { variant: 'window', title: 'Load Balancer' },
  'load-balancer-origins': { variant: 'bare', title: 'Load Balancer' },
  'network-shield-ip-list': { variant: 'window', title: 'Network Shield' },
  'network-shield-lists': { variant: 'bare', title: 'Network Shield' },
  'network-shield-rule': { variant: 'window', title: 'Network Shield' },
  'object-storage-access': { variant: 'window', title: 'Object Storage' },
  'object-storage-browser': { variant: 'bare', title: 'Object Storage' },
  'object-storage-buckets': { variant: 'bare', title: 'Object Storage' },
  'real-time-events-filter': { variant: 'window', title: 'Real-Time Events' },
  'real-time-events-log': { variant: 'window', title: 'Real-Time Events' },
  'real-time-events-volume': { variant: 'window', title: 'Real-Time Events' },
  'real-time-metrics-dashboard': { variant: 'window', title: 'Real-Time Metrics' },
  'real-time-metrics-filter': { variant: 'bare', title: 'Real-Time Metrics' },
  'real-time-metrics-panel': { variant: 'bare', title: 'Real-Time Metrics' },
  'sql-database-query': { variant: 'bare', title: 'SQL Database' },
  'sql-database-row': { variant: 'bare', title: 'SQL Database' },
  'sql-database-table': { variant: 'bare', title: 'SQL Database' },
  'waf-allowed-rule': { variant: 'window', title: 'WAF' },
  'waf-firewall-rule': { variant: 'window', title: 'WAF' },
  'waf-threat': { variant: 'bare', title: 'WAF' },
  'workload-deploy': { variant: 'bare', title: 'Workloads' },
  'workload-domain': { variant: 'bare', title: 'Workloads' }
} satisfies Partial<Record<ConsoleMockupName, ConsoleMockupPlating>>

const plates: {
  ConsoleMockupPlate: Component
  consoleMockupPlates: typeof consoleMockupPlates
} = { ConsoleMockupPlate, consoleMockupPlates }

export default plates
