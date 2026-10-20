import { createResource, createResourcePath } from '../../../lib/data/create-resources'

const HAND_WRITTEN = {
  workloads: { label: 'Create Workload', icon: 'ai ai-workloads', path: '/workloads/new' },
  applications: {
    label: 'Create Application',
    icon: 'ai ai-edge-application',
    path: '/applications/new'
  },
  'edge-dns': { label: 'Create Zone', icon: 'ai ai-edge-dns', path: '/edge-dns/new' },
  'sql-database': { label: 'Create Database', icon: 'ai ai-edge-sql', path: '/sql-database/new' }
}

const ORDER = [
  'workloads',
  'applications',
  'functions',
  'connectors',
  'custom-pages',
  'domains',
  'firewall',
  'waf-rules',
  'edge-dns',
  'certificates',
  'network-lists',
  'object-storage',
  'sql-database',
  'data-stream'
]

const objectNoun = (label) => {
  const noun = label.replace(/^Create /, '')
  return noun.charAt(0).toUpperCase() + noun.slice(1)
}

const row = (id) => {
  const own = HAND_WRITTEN[id]
  const spec = own ? null : createResource(id)
  const base = own ?? { label: spec.title, icon: spec.icon, path: createResourcePath(id) }

  return { value: id, object: objectNoun(base.label), ...base }
}

export const createMenu = ORDER.map(row)
