import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const CONNECTOR_TYPES = {
  http: {
    label: 'HTTP',
    icon: 'ai ai-edge-connectors',
    description: 'An origin server, reached by host name.'
  },
  storage: {
    label: 'Object Storage',
    icon: 'ai ai-edge-storage',
    description: 'A bucket in this workspace, read by name and prefix.'
  },
  'live-ingest': {
    label: 'Live Ingest',
    icon: 'ai ai-real-time-events',
    description: 'An Azion region a live stream is ingested from.'
  }
}

export const connectorMeta = (type) =>
  CONNECTOR_TYPES[type] ?? { label: type, icon: 'ai ai-edge-connectors', description: '' }

export const connectorTypeOptions = Object.entries(CONNECTOR_TYPES).map(([value, meta]) => ({
  value,
  label: meta.label,
  description: meta.description
}))

export const CONNECTORS = [
  {
    id: '7710021',
    name: 'api-primary',
    type: 'http',
    address: 'api.edgeflow.com',
    status: 'Active',
    modifiedAt: daysAgo(4)
  },
  {
    id: '7710022',
    name: 'assets-bucket',
    type: 'storage',
    address: 'azion-assets-prod',
    status: 'Active',
    modifiedAt: daysAgo(9)
  },
  {
    id: '7710023',
    name: 'api-failover',
    type: 'http',
    address: 'api-eu.edgeflow.com',
    status: 'Inactive',
    modifiedAt: daysAgo(38)
  },
  {
    id: '7710024',
    name: 'uploads',
    type: 'storage',
    address: 'user-uploads',
    status: 'Active',
    modifiedAt: daysAgo(16)
  },
  {
    id: '7710025',
    name: 'live-events',
    type: 'live-ingest',
    address: 'ingest.edgeflow.com',
    status: 'Active',
    modifiedAt: daysAgo(1)
  },
  {
    id: '7710026',
    name: 'legacy-wordpress',
    type: 'http',
    address: 'legacy.edgeflow.com',
    status: 'Inactive',
    modifiedAt: daysAgo(120)
  },
  {
    id: '7710027',
    name: 'storybook-static',
    type: 'storage',
    address: 'webkit-storybook-dev',
    status: 'Active',
    modifiedAt: daysAgo(27)
  }
].map(connectorRow)

export function connectorRow(connector, index = 0) {
  const person = authorAt(index)
  return {
    ...connector,
    typeLabel: connectorMeta(connector.type).label,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(connector.modifiedAt)
  }
}

export const connectorById = (id) => CONNECTORS.find((connector) => connector.id === String(id))
