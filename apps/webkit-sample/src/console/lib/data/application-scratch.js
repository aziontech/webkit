import { BUCKETS } from './object-storage'

const INGEST_REGIONS = [
  { value: 'br-east-1', label: 'br-east-1, South America' },
  { value: 'us-east-1', label: 'us-east-1, North America' }
]

const text = (name, label, placeholder, extra = {}) => ({
  kind: 'text',
  name,
  label,
  placeholder,
  ...extra
})

const select = (name, label, options, extra = {}) => ({
  kind: 'select',
  name,
  label,
  options,
  ...extra
})

const IMAGE_EXTENSIONS = 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff'

export const CACHE_POLICY_TEMPLATES = [
  {
    value: 'images',
    label: 'Image caching',
    description:
      'Caches images for a long TTL and ignores the query string, so one object serves every variation of the same file.',
    fields: [
      text('extensions', 'Extension matches', IMAGE_EXTENSIONS, {
        required: true,
        default: IMAGE_EXTENSIONS,
        description:
          'Comma-separated. The policy applies to requests whose path ends in one of them.'
      })
    ]
  },
  {
    value: 'files-optimization',
    label: 'File optimization',
    description:
      'Caches static assets and compresses them on the way out. The template carries the TTLs and the cache key.',
    fields: []
  }
]

const seededValues = (fields) =>
  Object.fromEntries(
    fields
      .filter((field) => field.default !== undefined)
      .map((field) => [field.name, field.default])
  )

export const enabledCachePolicies = (config) =>
  CACHE_POLICY_TEMPLATES.filter((template) => config.cache.policies[template.value]?.enabled)

export const CONNECTOR_TYPE_FIELDS = {
  http: [
    text('address', 'Origin address', 'origin.example.com', {
      required: true,
      description: 'The host the application fetches from. No scheme.'
    }),
    text('path', 'Path', '/', {
      description: 'Prefixed to the request path before it reaches the origin.'
    }),
    text('uriPrefix', 'Apply when $uri starts with', '/api', {
      description: 'Leave it empty to send every request to this connector.'
    })
  ],
  storage: [
    select(
      'bucket',
      'Bucket',
      BUCKETS.map((bucket) => ({ value: bucket.name, label: bucket.name })),
      { required: true, description: 'An Object Storage bucket in this workspace.' }
    ),
    text('prefix', 'Prefix', 'assets/', {
      description: 'The folder inside the bucket the connector reads from.'
    })
  ],
  'live-ingest': [
    select('region', 'Region', INGEST_REGIONS, {
      required: true,
      description: 'Where the stream is ingested. Select the one closest to the broadcaster.'
    })
  ]
}

export const connectorTypeFields = (type) => CONNECTOR_TYPE_FIELDS[type] ?? []

const ADDRESS_FIELD = { http: 'address', storage: 'bucket', 'live-ingest': 'region' }

export const defaultScratchConfig = () => ({
  cache: {
    policies: Object.fromEntries(
      CACHE_POLICY_TEMPLATES.map((template) => [
        template.value,
        { enabled: false, values: seededValues(template.fields) }
      ])
    )
  },
  connector: { enabled: false, type: 'http', values: {} }
})

export const resetScratchOption = (part, fields = []) => {
  Object.keys(part.values).forEach((key) => delete part.values[key])
  Object.assign(part.values, seededValues(fields))
}

export const scratchFields = (config) => [
  ...enabledCachePolicies(config).flatMap((template) =>
    template.fields.map((field) => ({
      field,
      part: config.cache.policies[template.value],
      key: `cache.${template.value}.${field.name}`
    }))
  ),
  ...(config.connector.enabled ? connectorTypeFields(config.connector.type) : []).map((field) => ({
    field,
    part: config.connector,
    key: `connector.${field.name}`
  }))
]

export const validateScratch = (config, errors) => {
  let valid = true
  scratchFields(config).forEach(({ field, part, key }) => {
    if (!field.required) return
    if (String(part.values[field.name] ?? '').trim()) return
    errors[key] = 'This field is required.'
    valid = false
  })
  return valid
}

export const clearScratchErrors = (errors, prefix) => {
  Object.keys(errors).forEach((key) => {
    if (key.startsWith(prefix)) delete errors[key]
  })
}

export const scratchCachePolicies = (config, applicationName) =>
  enabledCachePolicies(config).map((template) => {
    const { values } = config.cache.policies[template.value]
    const answers = template.fields
      .map((field) => [field.label, String(values[field.name] ?? '').trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
    return {
      name: `${applicationName}-${template.value}`,
      template: template.label,
      detail: answers.join(' · ') || template.label
    }
  })

export const scratchConnector = (config, applicationName, typeLabel) => {
  if (!config.connector.enabled) return null
  const address = String(config.connector.values[ADDRESS_FIELD[config.connector.type]] ?? '').trim()
  return {
    name: `${applicationName}-${config.connector.type}`,
    kind: typeLabel,
    address
  }
}
