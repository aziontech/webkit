// The connectors the sample is seeded with — the Build → Connectors module.
//
// A CONNECTOR is where an application fetches from when the edge does not already
// hold the answer: an HTTP origin, a storage bucket, or a live-ingest endpoint. The
// TYPE is what the row is really about — it decides what the address means and what
// the connector can be bound to — so it leads the columns and is the first field.
//
// `modifiedAt` is the real instant; `lastModified` is derived from it by one
// formatter rather than hand-written per row.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** Connector type → the label and glyph every surface reads. */
export const CONNECTOR_TYPES = {
  http: { label: 'HTTP', icon: 'ai ai-edge-connectors' },
  storage: { label: 'Edge Storage', icon: 'ai ai-edge-storage' },
  'live-ingest': { label: 'Live Ingest', icon: 'ai ai-real-time-events' }
}

/** `{ label, icon }` for a connector type, with a safe fallback. */
export const connectorMeta = (type) =>
  CONNECTOR_TYPES[type] ?? { label: type, icon: 'ai ai-edge-connectors' }

/** The type list a filter field offers, in the order the product presents them. */
export const connectorTypeOptions = Object.entries(CONNECTOR_TYPES).map(([value, meta]) => ({
  value,
  label: meta.label
}))

/** The seeded connectors, in list order. */
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
].map((connector, index) => {
  const person = authorAt(index)
  return {
    ...connector,
    typeLabel: connectorMeta(connector.type).label,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(connector.modifiedAt)
  }
})

/** A seeded connector by id, or `undefined`. */
export const connectorById = (id) => CONNECTORS.find((connector) => connector.id === String(id))
