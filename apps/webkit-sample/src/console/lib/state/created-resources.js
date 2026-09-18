// WHAT A CREATE PAGE LEAVES BEHIND.
//
// The ten generated create flows (../data/create-resources.js) used to store nothing. A
// reader filled in a firewall, pressed Save, read a success toast — and the firewall was
// in no list, in no picker, and on no page. Every surface downstream then had to pretend:
// the settings page seeded itself from the query string because there was no record to
// read, and the topology's bind slot offered five seeded firewalls and never the one just
// made. A create whose result cannot be found is a create that did not happen.
//
// So this is the store those pages write into: the answers the reader gave, kept for the
// session, layered over each module's seed.
//
// ── IT STORES THE FORM, NOT THE ROW ──
//
// One record, two readers, and they want different shapes: a list wants a ROW (with the
// derived columns its table renders), a settings page wants the FORM (the answers, field
// by field, so the controls open on them). Storing both would be storing the same fact
// twice and letting them drift, so the form is what is kept — it is what the reader
// actually said — and the row is DERIVED on read, through the module's own row builder
// (../data/firewalls.js → `firewallRow`, and its seven siblings). A created row and a
// seeded row are then built by the same function, so a list cannot tell them apart.
//
// The translation between the two is the only thing this file really owns, and it earns
// its place: a create page speaks the API's vocabulary (`ip_cidr`, `live_ingest`,
// `workloads_access`) and a list speaks its own (`ip-cidr`, `live-ingest`, `Private`).
// That seam has to live somewhere; it lives here, next to the store, rather than inside
// the descriptors (which are about the request body) or inside the fixtures (which are
// about the seed).
//
// ── WHAT A CREATE CANNOT KNOW STAYS EMPTY ──
//
// A certificate's subject, issuer and expiry are parsed OUT of the PEM by the platform —
// the descriptor says as much — so a certificate created here has none of them, and its
// cells are blank rather than filled with a plausible guess. Same discipline for the
// counts: a new firewall has 0 rules and a new bucket 0 objects, because it does.
//
// ── SESSION, NOT FOREVER ──
//
// `sessionStorage`, the same shape the Deployment settings store uses
// (../data/deployment-strategies.js): a created resource survives a reload of the tab, so
// a reader can follow a link out and come back to it, and a new tab starts from the seed
// the sample is meant to demonstrate.
import { ref } from 'vue'

import { certificateRow } from '../data/certificates'
import { connectorRow } from '../data/connectors'
import { customPageRow } from '../data/custom-pages'
import { dataStreamRow } from '../data/data-streams'
import { firewallRow } from '../data/firewalls'
import { networkListRow } from '../data/network-lists'
import { bucketRow } from '../data/object-storage'
import { wafRuleRow } from '../data/waf-rules'

const STORAGE_KEY = 'webkit-sample-created-resources'

const load = () => {
  try {
    const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Newest first, which is the order a list wants them in.
const created = ref(load())

const persist = () => {
  try {
    globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(created.value))
  } catch {
    // A full or unavailable sessionStorage must not break the create flow.
  }
}

// ── The API vocabulary → the list vocabulary ────────────────────────────────

const CONNECTOR_TYPES = { http: 'http', storage: 'storage', live_ingest: 'live-ingest' }
const NETWORK_LIST_TYPES = { ip_cidr: 'ip-cidr', asn: 'asn', countries: 'countries' }
const CERTIFICATE_TYPES = { certificate: 'edge-certificate', trusted_ca_certificate: 'trusted-ca' }
// The endpoints the Data Stream module lists. A type it does not name falls through as
// itself — `streamEndpointLabel` already prints an unknown id rather than blanking it.
const STREAM_ENDPOINTS = {
  standard: 'standard-http',
  s3: 's3',
  kafka: 'kafka',
  datadog: 'datadog',
  elasticsearch: 'elasticsearch'
}
// The firewall's three switches, under the module ids the list column reads.
const FIREWALL_MODULES = {
  moduleWaf: 'waf',
  moduleNetworkProtection: 'network-shield',
  moduleFunctions: 'functions'
}
// Sensitivity, weakest to strongest — a rule set's own posture is the strongest family it
// inspects for, the way `wafThreatConfig` reads it back the other way round.
const SENSITIVITY = ['lowest', 'low', 'medium', 'high', 'highest']

const text = (value) => String(value ?? '').trim()

// Every resource carries the same `active` switch, and every list spells it the same way.
const statusOf = (form) => (form.active === false ? 'Inactive' : 'Active')

// A `list` field is a textarea, one entry per line (../../components/form/SpecFieldRow.vue).
const lineCount = (value) =>
  text(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean).length

const connectorAddress = (form) => {
  if (form.type === 'storage') return text(form.bucket)
  if (form.type === 'live_ingest') return text(form.ingestEndpoint)
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

// The base record each module's row builder expects — the seed's own shape, minus the id
// and the timestamp, which every resource gets the same way.
const BASE = {
  connectors: (form) => ({
    name: text(form.name),
    type: CONNECTOR_TYPES[form.type] ?? form.type,
    address: connectorAddress(form),
    status: statusOf(form)
  }),
  'custom-pages': (form) => ({
    name: text(form.name),
    // "Default answers every status you have not given a page of its own" — so the cell
    // says that, rather than showing an empty list of codes.
    statuses: form.code === 'default' ? ['Default'] : [Number(form.code)],
    connector: text(form.connector),
    status: statusOf(form)
  }),
  firewall: (form) => ({
    name: text(form.name),
    // DDoS Protection is on every firewall and is not a switch anywhere on the platform
    // (../data/firewalls.js § FIREWALL_MODULE_FIELDS), so it leads whatever was chosen.
    modules: ['ddos', ...Object.keys(FIREWALL_MODULES).filter((key) => form[key])].map(
      (key) => FIREWALL_MODULES[key] ?? key
    ),
    rules: 0,
    // The endpoint takes no environment; the column is the console's own framing, and a
    // firewall created without being told otherwise belongs to the live one.
    environment: 'Production',
    status: statusOf(form)
  }),
  'waf-rules': (form) => ({
    name: text(form.name),
    // The endpoint takes no mode, so the platform picks — and a rule set that has never
    // scored a request cannot responsibly block one. It starts by learning, which is also
    // what the create page's own guidance tells the reader to do.
    mode: 'Learning',
    threats: wafThreats(form),
    sensitivity: wafSensitivity(form),
    status: statusOf(form)
  }),
  certificates: (form) => ({
    name: text(form.name),
    type: CERTIFICATE_TYPES[form.type] ?? form.type,
    // Parsed out of the PEM by the platform, so this prototype has none of them. Blank,
    // never guessed — see the header.
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
    // One source, fixed by the endpoint: "the source is raw logs, one record per request
    // the edge answered" (../data/create-resources.js § DATA STREAM).
    source: 'http-events',
    endpoint: STREAM_ENDPOINTS[form.outputType] ?? form.outputType,
    sampling: 100,
    status: statusOf(form)
  }),
  'object-storage': (form) => ({
    name: text(form.name),
    // `restricted` is "no workload reaches the bucket"; the other two let workloads serve
    // objects. The list has two words for that, and these are them.
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

/** Whether this resource's create page stores what it makes. */
export const storesCreated = (resource) => Boolean(BASE[resource] && ROWS[resource])

// A bucket IS its name — that is what `/object-storage/:bucket` resolves and what the
// seeded rows use as their id. Everything else gets the prototype's own opaque id.
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

/**
 * The rows this session created for one module, newest first, ready to sit on top of the
 * module's seed.
 *
 * @param {string} resource A `createResources` id.
 * @returns {object[]}
 */
export const createdRowsFor = (resource) =>
  created.value
    .filter((record) => record.resource === resource)
    .map(rowFor)
    .filter(Boolean)

/**
 * The answers a created record was made with — what its settings page opens on. `null`
 * for a seeded record, which has no form and falls back to the API defaults.
 *
 * @param {string} resource
 * @param {string} id
 * @returns {object | null}
 */
export const createdFormFor = (resource, id) =>
  created.value.find((record) => record.resource === resource && record.id === String(id))?.form ??
  null

/**
 * Store what a create page just made.
 *
 * @param {string} resource A `createResources` id.
 * @param {object} form The flat answers, keyed by field id.
 * @returns {{ id: string, row: object | null }} The id the record now has, and its row.
 */
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

/**
 * Write an edit back — what the generated settings page saves. A seeded record is not in
 * this store and is left alone.
 *
 * @param {string} resource
 * @param {string} id
 * @param {object} form
 * @returns {boolean} Whether a record was updated.
 */
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

/**
 * Drop one. Called by a module list's own delete so a created row stays deleted — its
 * local copy of the list would otherwise be repopulated from here on the next mount.
 *
 * @param {string} resource
 * @param {string} id
 * @returns {boolean} Whether a record was removed.
 */
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
