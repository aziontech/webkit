import type { DiagramName } from '../../components/marketing/diagram/diagram.vue'
import type { DiagramSpec } from '../../components/marketing/diagram/types'

export type DiagramLoader = () => Promise<{ default: DiagramSpec }>

export const diagrams: Record<DiagramName, DiagramLoader> = {
  'ai-gateway': () => import('./ai-gateway'),
  'ai-gateway-latency-routing': () => import('./ai-gateway-latency-routing'),
  'ai-gateway-model-routing': () => import('./ai-gateway-model-routing'),
  'ai-gateway-provider-failover': () => import('./ai-gateway-provider-failover'),
  'ai-gateway-response-cache': () => import('./ai-gateway-response-cache'),
  'ai-inference': () => import('./ai-inference'),
  'application-accelerator': () => import('./application-accelerator'),
  applications: () => import('./applications'),
  'bot-manager': () => import('./bot-manager'),
  cache: () => import('./cache'),
  'data-stream': () => import('./data-stream'),
  'ddos-protection': () => import('./ddos-protection'),
  'edge-dns': () => import('./edge-dns'),
  firewall: () => import('./firewall'),
  functions: () => import('./functions'),
  'image-processor': () => import('./image-processor'),
  'kv-store': () => import('./kv-store'),
  'load-balancer': () => import('./load-balancer'),
  'network-shield': () => import('./network-shield'),
  'object-storage': () => import('./object-storage'),
  'real-time-events': () => import('./real-time-events'),
  'real-time-metrics': () => import('./real-time-metrics'),
  'sql-database': () => import('./sql-database'),
  'web-application-firewall': () => import('./web-application-firewall'),
  workloads: () => import('./workloads'),
  'workloads-gradual-rollout': () => import('./workloads-gradual-rollout'),
  'workloads-isolate-per-request': () => import('./workloads-isolate-per-request'),
  'workloads-security': () => import('./workloads-security')
}

export const resolveDiagram = (name: string): DiagramLoader | null =>
  Object.hasOwn(diagrams, name) ? diagrams[name as DiagramName] : null
