export interface TopologyNode {
  key: string
  eyebrow: string
  icon: string
  title: string
  label: string
  indicator?: boolean
}

export interface TopologyColumn {
  key: string
  order: number
  nodes: TopologyNode[]
}

export type TopologySide = 'start' | 'end'

export interface TopologyEdge {
  from: string
  to: string
}

export type TopologyLayout = 'chain' | 'compact'

export interface TopologyArrangement {
  key: TopologyLayout
  columns: TopologyColumn[]
  edges: TopologyEdge[]
}

export interface TopologyDrawing {
  viewBox: string
  paths: string[]
}

const DOMAINS: TopologyNode[] = [
  {
    key: 'domain-shop',
    eyebrow: 'Domain',
    icon: 'az az-domains',
    title: 'shop.example.com',
    label: 'Public'
  },
  {
    key: 'domain-www',
    eyebrow: 'Domain',
    icon: 'az az-domains',
    title: 'www.example.com',
    label: 'Public'
  },
  {
    key: 'domain-generated',
    eyebrow: 'Domain',
    icon: 'az az-domains',
    title: 'storefront.azion.app',
    label: 'Public'
  }
]

const WORKLOAD: TopologyNode = {
  key: 'workload',
  eyebrow: 'Workload',
  icon: 'az az-workloads',
  title: 'storefront-prod',
  label: 'Live',
  indicator: true
}

const APPLICATION: TopologyNode = {
  key: 'application',
  eyebrow: 'Application',
  icon: 'az az-applications',
  title: 'storefront',
  label: 'Active'
}

const FIREWALL: TopologyNode = {
  key: 'firewall',
  eyebrow: 'Firewall',
  icon: 'az az-firewall',
  title: 'edge-rules',
  label: 'Active'
}

const DOMAIN_GROUP: TopologyNode = {
  key: 'domains',
  eyebrow: 'Domains',
  icon: 'az az-domains',
  title: '',
  label: ''
}

const BINDING_EDGES: TopologyEdge[] = [
  { from: WORKLOAD.key, to: APPLICATION.key },
  { from: WORKLOAD.key, to: FIREWALL.key }
]

export const WORKLOAD_TOPOLOGY_ARRANGEMENTS: TopologyArrangement[] = [
  {
    key: 'chain',
    columns: [
      { key: 'domains', order: 0, nodes: DOMAINS },
      { key: 'workload', order: 1, nodes: [WORKLOAD] },
      { key: 'bindings', order: 2, nodes: [APPLICATION, FIREWALL] }
    ],
    edges: [...DOMAINS.map((domain) => ({ from: domain.key, to: WORKLOAD.key })), ...BINDING_EDGES]
  },
  {
    key: 'compact',
    columns: [
      { key: 'domains', order: 0, nodes: [DOMAIN_GROUP] },
      { key: 'workload', order: 1, nodes: [WORKLOAD] },
      { key: 'bindings', order: 2, nodes: [APPLICATION, FIREWALL] }
    ],
    edges: [{ from: DOMAIN_GROUP.key, to: WORKLOAD.key }, ...BINDING_EDGES]
  }
]
