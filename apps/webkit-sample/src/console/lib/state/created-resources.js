import { ref } from 'vue'

import { certificateRow } from '../data/certificates'
import { connectorRow } from '../data/connectors'
import { customPageRow } from '../data/custom-pages'
import { dataStreamRow } from '../data/data-streams'
import { firewallRow } from '../data/firewalls'
import { networkListRow } from '../data/network-lists'
import { bucketRow } from '../data/object-storage'
import { wafRuleRow } from '../data/waf-rules'

const STORAGE_KEY = 'webkit-sample:created-resources'

const load = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const created = ref(load())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(created.value))
  } catch {}
}

const CONNECTOR_TYPES = { http: 'http', storage: 'storage', live_ingest: 'live-ingest' }
const NETWORK_LIST_TYPES = { ip_cidr: 'ip-cidr', asn: 'asn', countries: 'countries' }
const CERTIFICATE_TYPES = {
  certificate: 'edge-certificate',
  trusted_ca_certificate: 'trusted-ca',
  csr: 'edge-certificate',
  crl: 'revocation-list'
}
const STREAM_ENDPOINTS = {
  standard: 'standard-http',
  s3: 's3',
  kafka: 'kafka',
  datadog: 'datadog',
  elasticsearch: 'elasticsearch',
  big_query: 'big-query',
  splunk: 'splunk',
  aws_kinesis_firehose: 'aws-kinesis-firehose',
  qradar: 'qradar',
  azure_monitor: 'azure-monitor',
  azure_blob_storage: 'azure-blob-storage'
}
const FIREWALL_MODULES = {
  moduleWaf: 'waf',
  moduleNetworkProtection: 'network-shield',
  moduleFunctions: 'functions'
}
const SENSITIVITY = ['lowest', 'low', 'medium', 'high', 'highest']

const text = (value) => String(value ?? '').trim()

const statusOf = (form) => (form.active === false ? 'Inactive' : 'Active')

const lineCount = (value) =>
  text(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean).length

const connectorAddress = (form) => {
  if (form.type === 'storage') return text(form.bucket)
  if (form.type === 'live_ingest') return text(form.liveIngestRegion)
  return text(form.address)
}

const wafThreats = (form) =>
  Object.keys(form)
    .filter((key) => key.startsWith('threat_') && form[key]?.active)
    .map((key) => key.slice('threat_'.length).replaceAll('_', '-'))

const wafSensitivity = (form) => {
  const levels = Object.keys(form)
    .filter((key) => key.startsWith('threat_') && form[key]?.active)
    .map((key) => SENSITIVITY.indexOf(form[key].value))
  const strongest = Math.max(-1, ...levels)
  const level = SENSITIVITY[strongest] ?? 'medium'
  return level.charAt(0).toUpperCase() + level.slice(1)
}

const BASE = {
  connectors: (form) => ({
    name: text(form.name),
    type: CONNECTOR_TYPES[form.type] ?? form.type,
    address: connectorAddress(form),
    status: statusOf(form)
  }),
  'custom-pages': (form) => ({
    name: text(form.name),
    statuses: form.code === 'default' ? ['Default'] : [Number(form.code)],
    connector: text(form.connector),
    status: statusOf(form)
  }),
  firewall: (form) => ({
    name: text(form.name),
    modules: ['ddos', ...Object.keys(FIREWALL_MODULES).filter((key) => form[key])].map(
      (key) => FIREWALL_MODULES[key] ?? key
    ),
    rules: 0,
    environment: 'Production',
    status: statusOf(form)
  }),
  'waf-rules': (form) => ({
    name: text(form.name),
    mode: 'Learning',
    threats: wafThreats(form),
    sensitivity: wafSensitivity(form),
    status: statusOf(form)
  }),
  certificates: (form) => ({
    name: text(form.name),
    type: CERTIFICATE_TYPES[form.type] ?? form.type,
    subject: '',
    issuer: '',
    expiresAt: null,
    status: statusOf(form)
  }),
  'network-lists': (form) => ({
    name: text(form.name),
    type: NETWORK_LIST_TYPES[form.type] ?? form.type,
    entries: lineCount(form.items),
    status: statusOf(form)
  }),
  'data-stream': (form) => ({
    name: text(form.name),
    source: 'http-events',
    endpoint: STREAM_ENDPOINTS[form.outputType] ?? form.outputType,
    sampling: 100,
    status: statusOf(form)
  }),
  'object-storage': (form) => ({
    name: text(form.name),
    access: form.workloadsAccess === 'restricted' ? 'Private' : 'Public',
    objects: 0,
    size: '0 B'
  })
}

const ROWS = {
  connectors: connectorRow,
  'custom-pages': customPageRow,
  firewall: firewallRow,
  'waf-rules': wafRuleRow,
  certificates: certificateRow,
  'network-lists': networkListRow,
  'data-stream': dataStreamRow,
  'object-storage': bucketRow
}

export const storesCreated = (resource) => Boolean(BASE[resource] && ROWS[resource])

const mintId = (resource, form) =>
  resource === 'object-storage' ? text(form.name) : `${resource}-${Date.now().toString(36)}`

const rowFor = (record) => {
  const base = BASE[record.resource]
  const toRow = ROWS[record.resource]
  if (!base || !toRow) return null
  return toRow({
    id: record.id,
    ...base(record.form),
    modifiedAt: new Date(record.createdAt)
  })
}

export const createdRowsFor = (resource) =>
  created.value
    .filter((record) => record.resource === resource)
    .map(rowFor)
    .filter(Boolean)

export const createdFormFor = (resource, id) =>
  created.value.find((record) => record.resource === resource && record.id === String(id))?.form ??
  null

export const addCreatedResource = (resource, form) => {
  const record = {
    id: mintId(resource, form),
    resource,
    form: { ...form },
    createdAt: new Date().toISOString()
  }
  created.value = [record, ...created.value]
  persist()
  return { id: record.id, row: rowFor(record) }
}

export const updateCreatedResource = (resource, id, form) => {
  const key = String(id)
  const index = created.value.findIndex(
    (record) => record.resource === resource && record.id === key
  )
  if (index === -1) return false
  const record = created.value[index]
  created.value = [
    ...created.value.slice(0, index),
    { ...record, form: { ...form } },
    ...created.value.slice(index + 1)
  ]
  persist()
  return true
}

export const removeCreatedResource = (resource, id) => {
  const key = String(id)
  const next = created.value.filter(
    (record) => !(record.resource === resource && record.id === key)
  )
  if (next.length === created.value.length) return false
  created.value = next
  persist()
  return true
}
