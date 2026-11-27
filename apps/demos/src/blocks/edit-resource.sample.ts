import type { TableColumn } from '@aziontech/ui/data-table'

import type { EditResourceProject } from './edit-resource.vue'
import type { PolicyModuleField, PolicySettingsRecord } from './edit-resource-policy-groups.vue'

export const sampleProject: EditResourceProject = {
  name: 'web-app',
  active: true,
  modules: {
    compression: true,
    caching: true,
    device_detection: false,
    custom_code: true,
    image_optimization: false,
    load_balancing: false,
    web_socket_proxy: false
  }
}

export const sampleProjectTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'variables', label: 'Variables' },
  { value: 'caching', label: 'Caching' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'rules', label: 'Rules' },
  { value: 'main-settings', label: 'Settings' }
]

export const sampleProjectModules = [
  {
    key: 'compression',
    title: 'Compression',
    description: 'Compress responses with gzip and Brotli before they are sent.'
  },
  { key: 'caching', title: 'Caching', description: 'Customize advanced cache settings.' },
  {
    key: 'device_detection',
    title: 'Device Detection',
    description: 'Expose device variables to build responsive rules.'
  },
  {
    key: 'custom_code',
    title: 'Custom Code',
    description: 'Run your own code on each request, close to the user.'
  },
  {
    key: 'image_optimization',
    title: 'Image Optimization',
    description: 'Resize and convert images on the fly.'
  },
  {
    key: 'load_balancing',
    title: 'Load Balancing',
    description:
      'Balance traffic across your upstreams for reliability and network congestion control.'
  }
]

export const sampleSubscriptionModules = [
  {
    key: 'web_socket_proxy',
    title: 'WebSocket Proxy',
    description:
      'Enhance real-time data exchange between your project and its backends using the WebSocket protocol.'
  }
]

export const sampleProjectDraft: Partial<EditResourceProject> = {
  modules: { ...sampleProject.modules, device_detection: true }
}

export const sampleStaleProject: EditResourceProject = {
  ...sampleProject,
  modules: { ...sampleProject.modules, image_optimization: true }
}

export const samplePolicyTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'rules', label: 'Rules' },
  { value: 'main-settings', label: 'Settings' }
]

export const samplePolicyModules: PolicyModuleField[] = [
  {
    key: 'ddos',
    title: 'DDoS Protection',
    description: 'Absorbs volumetric attacks at the network layer.',
    locked: true
  },
  {
    key: 'request-inspection',
    title: 'Request Inspection',
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'ip-blocking',
    title: 'IP Blocking',
    description: 'Blocks traffic by country, ASN or IP range using access lists.'
  },
  {
    key: 'bot-protection',
    title: 'Bot Protection',
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'custom-code',
    title: 'Custom Code',
    description: 'Runs your own code inside the policy, before the request is served.'
  }
]

export const samplePolicy: PolicySettingsRecord = {
  name: 'production-policy',
  active: true,
  debugRules: false,
  modules: ['ddos', 'request-inspection', 'ip-blocking', 'bot-protection']
}

export const sampleCacheBrowserBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]

export const sampleCacheEdgeBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]

export const sampleCacheTopologies = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'south-america', label: 'South America' },
  { value: 'north-america', label: 'North America' }
]

export const sampleCacheVaryBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]

export const sampleCacheMethods = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]

export const sampleCacheSetting = {
  name: 'static-assets',
  browserBehavior: 'override',
  browserMaxAge: 604800,
  edgeBehavior: 'override',
  edgeMaxAge: 2592000,
  staleCache: true,
  largeFileCache: false,
  largeFileOffset: 1024,
  tieredCache: true,
  tieredTopology: 'nearest-region',
  varyByMethod: [] as string[],
  queryStringBehavior: 'allowlist',
  queryStringFields: 'v, lang',
  cookieBehavior: 'ignore',
  cookieNames: ''
}

const port = (value: number, label = String(value)) => ({ value, label })

export const sampleHttpPorts = [port(80, '80 (default)'), port(8008), port(8080), port(8880)]

export const sampleHttpsPorts = [port(443, '443 (default)'), port(8443), port(9440), port(9443)]

export const sampleHttp3Ports = [port(443, '443 (default)'), port(8443), port(9443)]

export const sampleTlsVersions = [
  { value: 'tls_1_3', label: 'TLS 1.3 (default)' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_1', label: 'TLS 1.1 (deprecated)' }
]

export const sampleCipherSuites = [
  { value: 'modern-2025', label: 'Modern 2025' },
  { value: 'compatible-2025', label: 'Compatible 2025' },
  { value: 'legacy-2025', label: 'Legacy 2025' }
]

export const sampleMtlsModes = [
  {
    value: 'enforce',
    label: 'Enforce',
    description:
      'Stops the TLS handshake when the client certificate cannot be verified against the trusted CA.'
  },
  {
    value: 'permissive',
    label: 'Permissive',
    description:
      'Tries to verify the client certificate but lets the handshake finish either way. The firewall sees which certificate was presented.'
  }
]

export const sampleTrustedCas = [
  { value: 'partners-ca', label: 'partners-ca', expires: 'Expires Mar 2027' },
  { value: 'devices-ca', label: 'devices-ca', expires: 'Expires Aug 2026' }
]

export const sampleRevocationLists = [
  { value: 'partners-crl', label: 'partners-crl' },
  { value: 'devices-crl', label: 'devices-crl' }
]

export const sampleProtocolSettings = {
  httpPorts: [80],
  useHttps: true,
  httpsPorts: [443],
  useHttp3: false,
  http3Ports: [443],
  minimumTls: 'tls_1_3',
  cipherSuite: 'modern-2025',
  mtls: false,
  mtlsMode: 'enforce',
  trustedCa: '',
  crl: [] as string[]
}

export const sampleDeployableTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'deployments', label: 'Deployments' },
  { value: 'settings', label: 'Settings' }
]

export const sampleDeployableEnvironments = [
  { name: 'Production', policy: 'Single' },
  { name: 'Preview', policy: 'Versioned' }
]

/** One domain the resource answers on. */
export interface DeployableDomainRow {
  /** The domain id. */
  id: string
  /** The host name. */
  domain: string
  /** The environment the domain answers in. */
  environment: string
  /** The deployment policy of that environment. */
  policy: string
  /** The certificate the domain is served with. */
  certificate: string
  /** The platform generated the domain; it cannot be edited or deleted. */
  generated: boolean
}

export const sampleDeployableDomains: DeployableDomainRow[] = [
  {
    id: 'generated',
    domain: 'resource-01.azion.app',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Platform (free)',
    generated: true
  },
  {
    id: 'd-7731',
    domain: 'www.example.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'example.com wildcard',
    generated: false
  }
]

export const sampleDeployableDomainColumns: TableColumn[] = [
  { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment' },
  { accessorKey: 'policy', header: 'Policy' },
  { accessorKey: 'certificate', header: 'Certificate' },
  { id: 'actions', type: 'action', hideable: false }
]

export const sampleLinkedEnvironments = [
  {
    name: 'Production',
    policy: 'Single',
    settingsId: 's1',
    auto: true,
    options: [
      { value: 'default', label: 'Default' },
      { value: 's1', label: 'storefront-production' },
      { value: 's2', label: 'storefront-legacy' }
    ]
  },
  {
    name: 'Preview',
    policy: 'Versioned',
    settingsId: 's5',
    auto: true,
    options: [
      { value: 's5', label: 'analytics-canary' },
      { value: 's10', label: 'blog-platform-stage' }
    ]
  }
]

export const sampleDeployableHttpPorts = [
  { value: 80, label: '80 (Default)' },
  { value: 8008, label: '8008' },
  { value: 8080, label: '8080' },
  { value: 8880, label: '8880' }
]

export const sampleDeployableHttpsPorts = [
  { value: 443, label: '443 (Default)' },
  { value: 8443, label: '8443' },
  { value: 9440, label: '9440' },
  { value: 9441, label: '9441' },
  { value: 9442, label: '9442' },
  { value: 9443, label: '9443' },
  { value: 7777, label: '7777' },
  { value: 8888, label: '8888' },
  { value: 9553, label: '9553' },
  { value: 9653, label: '9653' },
  { value: 8035, label: '8035' },
  { value: 8090, label: '8090' }
]

export const sampleDeployableHttp3Ports = [
  { value: 443, label: '443 (Default)' },
  { value: 7777, label: '7777' },
  { value: 8035, label: '8035' },
  { value: 8090, label: '8090' },
  { value: 8443, label: '8443' },
  { value: 8888, label: '8888' },
  { value: 9440, label: '9440' },
  { value: 9441, label: '9441' },
  { value: 9442, label: '9442' },
  { value: 9443, label: '9443' },
  { value: 9553, label: '9553' },
  { value: 9653, label: '9653' }
]

export const sampleDeployableTlsVersions = [
  { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
  { value: 'tls_1_2', label: 'TLS v1.2' },
  { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
  { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
]

export const sampleDeployableCipherSuites = [
  { value: 7, label: 'Modern v2025Q1' },
  { value: 6, label: 'Compatible v2025Q1' },
  { value: 5, label: 'Legacy v2025Q1' },
  { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
  { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
  { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
  { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
]

export const sampleDeployableMtlsModes = [
  {
    value: 'enforce',
    label: 'Enforce',
    description:
      'Blocks the client certificate during the TLS handshake when the Trusted CA can’t be validated.'
  },
  {
    value: 'permissive',
    label: 'Permissive',
    description:
      'Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can’t be validated. Check which certificate attempted the request in the request logs.'
  }
]

export const sampleDeployableTrustedCas = [
  { value: 'cert-8804', label: 'legacy origin CA' },
  { value: 'cert-8806', label: 'partner mTLS CA' }
]

export const sampleDeployableRevocationLists = [
  { value: 'cert-8807', label: 'partner revocation list' }
]

export const sampleDeployableResource = {
  name: 'resource-01',
  active: true,
  deploymentSettings: {} as Record<string, string>,
  protocols: {
    httpPorts: [80],
    useHttps: true,
    httpsPorts: [443],
    useHttp3: false,
    http3Ports: [443],
    minimumTlsVersion: 'tls_1_3',
    cipherSuite: 7
  },
  mtls: { enabled: false, mode: 'enforce', certificate: '', crl: [] as string[] }
}

export const sampleDataStreamSources = [
  { value: 'applications', label: 'Applications' },
  { value: 'functions', label: 'Functions' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'activity', label: 'Activity history' }
]

export const sampleDataStreamScopes = [
  {
    value: 'all',
    label: 'All current and future workloads',
    description: 'Collect from every workload, including the ones created later. Unlocks sampling.'
  },
  {
    value: 'filtered',
    label: 'Selected workloads',
    description: 'Collect only from the workloads you list.'
  }
]

export const sampleDataStreamPresets: Record<
  string,
  { label: string; dataSet: Record<string, string> }
> = {
  'http-requests': {
    label: 'HTTP requests',
    dataSet: {
      time: '$time',
      host: '$host',
      request_method: '$request_method',
      request_uri: '$request_uri',
      status: '$status',
      bytes_sent: '$bytes_sent',
      request_time: '$request_time',
      upstream_cache_status: '$upstream_cache_status',
      remote_addr: '$remote_addr',
      geoip_country: '$geoip_country'
    }
  },
  'function-runs': {
    label: 'Function runs',
    dataSet: {
      time: '$time',
      function_id: '$function_id',
      function_name: '$function_name',
      duration_ms: '$duration_ms',
      status: '$status',
      log_level: '$log_level',
      message: '$message'
    }
  },
  'firewall-events': {
    label: 'Firewall events',
    dataSet: {
      time: '$time',
      host: '$host',
      rule_id: '$rule_id',
      rule_action: '$rule_action',
      threat_family: '$threat_family',
      remote_addr: '$remote_addr',
      request_uri: '$request_uri'
    }
  }
}

export const sampleDataStreamTemplates = [
  ...Object.entries(sampleDataStreamPresets).map(([value, template]) => ({
    value,
    label: template.label
  })),
  { value: 'custom', label: 'Custom template' }
]

export const sampleDataStreamConnectors = [
  { value: 'standard', label: 'Standard HTTP/HTTPS POST' },
  { value: 'kafka', label: 'Apache Kafka' },
  { value: 's3', label: 'S3-compatible storage' },
  { value: 'analytics', label: 'Log analytics service' }
]

export const sampleDataStream = {
  name: 'http-to-collector',
  active: true,
  source: 'applications',
  scope: 'all',
  workloads: '',
  sampling: true,
  samplingRate: 25,
  template: 'custom',
  templateName: 'http-compact',
  dataSet: JSON.stringify(
    {
      time: '$time',
      host: '$host',
      status: '$status',
      request_uri: '$request_uri',
      request_time: '$request_time',
      upstream_cache_status: '$upstream_cache_status'
    },
    null,
    2
  ),
  connector: 'standard',
  url: 'https://collector.example.com/ingest',
  payloadFormat: '$dataset',
  lineSeparator: '\\n',
  headers: [
    { name: 'X-Stream-Source', value: 'acme-edge' },
    { name: 'Authorization', value: 'Bearer example-token' }
  ],
  bootstrapServers: '',
  topic: '',
  bucket: '',
  region: '',
  accessKey: '',
  secretKey: '',
  analyticsUrl: '',
  apiKey: ''
}
