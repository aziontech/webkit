import { createdRowsFor } from '../state/created-resources'
import { environmentNameOptions } from './environments'
import { BUCKETS } from './object-storage'

const activeField = (description) => ({
  id: 'active',
  kind: 'switch',
  api: 'active',
  label: 'Active',
  description,
  default: true
})

const statusSection = (description) => ({
  id: 'status',
  title: 'Status',
  description: 'A resource can be created inactive and switched on once it is configured.',
  advanced: true,
  fields: [activeField(description)]
})

const nameField = ({ max, placeholder, helper, pattern, patternHint, min }) => ({
  id: 'name',
  kind: 'text',
  api: 'name',
  label: 'Name',
  required: true,
  maxLength: max,
  minLength: min,
  pattern,
  patternHint,
  placeholder,
  helper
})

const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/
const DOMAIN_HINT = 'Enter a valid domain name. Example: mydomain.com.'

export const CERTIFICATE_OPTIONS = [
  { value: 'lets_encrypt', label: "Let's Encrypt (issued and renewed by Azion)" },
  { value: 'azion_san', label: 'Azion (SAN)' },
  { value: 'own', label: 'A certificate from Certificate Manager' }
]

export const TLS_VERSION_OPTIONS = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]

const WAF_THREATS = [
  ['sql_injection', 'SQL injection'],
  ['remote_file_inclusion', 'Remote file inclusion'],
  ['directory_traversal', 'Directory traversal'],
  ['cross_site_scripting', 'Cross-site scripting'],
  ['evading_tricks', 'Evading tricks'],
  ['file_upload', 'File upload'],
  ['unwanted_access', 'Unwanted access'],
  ['identified_attack', 'Identified attack']
]

const SENSITIVITY_OPTIONS = [
  { value: 'highest', label: 'Highest' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'lowest', label: 'Lowest' }
]

const CUSTOM_PAGE_CODES = [
  'default',
  '400',
  '401',
  '403',
  '404',
  '405',
  '406',
  '408',
  '409',
  '410',
  '411',
  '414',
  '415',
  '416',
  '426',
  '429',
  '431',
  '500',
  '501',
  '502',
  '503',
  '504',
  '505'
]

const SAMPLE_CONNECTORS = [
  { value: 'origin-http', label: 'origin-http' },
  { value: 'assets-bucket', label: 'assets-bucket' }
]

const pageConnectorOptions = () => [
  ...createdRowsFor('connectors')
    .filter((connector) => connector.type !== 'live_ingest')
    .map((connector) => ({ value: connector.name, label: connector.name })),
  ...SAMPLE_CONNECTORS
]

export const FUNCTION_STARTER = `async function handleRequest(request) {
  return new Response('Hello from the edge', { status: 200 })
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`

export const FUNCTION_ARGS = `{}`

const WORKLOAD_NAME_PATTERN = /^[\x20-\x21\x23-\x7E]+$/

const AZION_SUBDOMAIN_PATTERN = /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/

const DOMAIN_CERTIFICATE_OPTIONS = [
  { value: 'azion_san', label: 'Azion SAN certificate' },
  { value: 'lets_encrypt', label: "New Let's Encrypt certificate, DNS challenge" },
  { value: 'lets_encrypt_http', label: "New Let's Encrypt certificate, HTTP challenge" },
  { value: 'cert-8801', label: 'edgeflow.com wildcard' },
  { value: 'cert-8802', label: 'azion.design' },
  { value: 'cert-8803', label: 'api.edgeflow.com' },
  { value: 'cert-8805', label: 'staging wildcard' }
]

const SAMPLE_DEPLOYMENT_SETTINGS = [
  { value: 'azion-default', label: 'Azion Default' },
  { value: 's1', label: 'magalu-storefront' },
  { value: 's2', label: 'azion-storefront' }
]

const WORKLOAD_HTTP_PORTS = ['80', '8008', '8080', '8880']

const WORKLOAD_HTTPS_PORTS = [
  '443',
  '8443',
  '9440',
  '9441',
  '9442',
  '9443',
  '7777',
  '8888',
  '9553',
  '9653',
  '8035',
  '8090'
]

const WORKLOAD_HTTP3_PORTS = [
  '443',
  '7777',
  '8035',
  '8090',
  '8443',
  '8888',
  '9440',
  '9441',
  '9442',
  '9443',
  '9553',
  '9653'
]

const portListPattern = (ports) =>
  new RegExp(`^(${ports.join('|')})(\\s*\\n\\s*(${ports.join('|')}))*$`)

const portListHint = (ports) => `One port per line, from: ${ports.join(', ')}.`

const WORKLOAD_TLS_VERSION_OPTIONS = [
  { value: 'tls_1_3', label: 'TLS 1.3' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_1', label: 'TLS 1.1, deprecated' },
  { value: 'tls_1_0', label: 'TLS 1.0, deprecated' }
]

const WORKLOAD_CIPHER_SUITE_OPTIONS = [
  { value: '7', label: 'Modern v2025Q1' },
  { value: '6', label: 'Compatible v2025Q1' },
  { value: '5', label: 'Legacy v2025Q1' },
  { value: '4', label: 'Modern v2022Q1, migration to TLS 1.3' },
  { value: '3', label: 'Modern v2022Q1, TLS 1.2' },
  { value: '2', label: 'Compatible v2018Q1, TLS 1.2' },
  { value: '1', label: 'Legacy v2018Q1, TLS 1.2' },
  { value: '8', label: 'Legacy v2017Q1, all ciphers' }
]

const SAMPLE_TRUSTED_CA_CERTIFICATES = [
  { value: 'cert-8804', label: 'legacy origin CA' },
  { value: 'cert-8806', label: 'partner mTLS CA' }
]

const SAMPLE_REVOCATION_LISTS = [{ value: 'cert-8807', label: 'partner revocation list' }]

const CSR_KEY_ALGORITHM_OPTIONS = [
  { value: 'BIT_RSA_2048', label: '2048-bit RSA' },
  { value: 'BIT_RSA_4096', label: '4096-bit RSA' },
  { value: 'ECC_384', label: '384-bit prime field curve' }
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CUSTOM_PAGE_CODE_REASONS = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  426: 'Upgrade Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
}

const CUSTOM_PAGE_CODE_OPTIONS = CUSTOM_PAGE_CODES.map((code) => ({
  value: code,
  label: code === 'default' ? 'Default' : `${code} ${CUSTOM_PAGE_CODE_REASONS[code]}`
}))

const CUSTOM_PAGE_URI_PATTERN = /^\/[/a-zA-Z0-9\-_.~@:]*$/

const STREAM_DATA_SOURCE_OPTIONS = [
  {
    value: 'workloads',
    label: 'Applications',
    description: 'One record per request your applications answered.'
  },
  {
    value: 'functions_console',
    label: 'Functions',
    description: 'Console output and errors from your functions.'
  },
  {
    value: 'activity_history',
    label: 'Activity History',
    description: 'Changes made to the account, by whom and when.'
  },
  {
    value: 'waf',
    label: 'WAF events',
    description: 'Requests the WAF evaluated, with the threat it matched.'
  }
]

const STREAM_TEMPLATE_OPTIONS = [
  {
    value: 'azion-applications',
    label: 'Applications event collector',
    description: 'Azion template with the request variables of Applications logs.'
  },
  {
    value: 'azion-functions',
    label: 'Functions event collector',
    description: 'Azion template with the variables of Functions logs.'
  },
  {
    value: 'azion-waf',
    label: 'WAF event collector',
    description: 'Azion template with the variables of WAF events.'
  },
  {
    value: 'azion-activity-history',
    label: 'Activity History collector',
    description: 'Azion template with the variables of Activity History.'
  },
  {
    value: 'custom',
    label: 'Custom template',
    description: 'Write your own data set. It is saved as a template you can reuse.'
  }
]

const STREAM_OUTPUT_OPTIONS = [
  {
    value: 'standard',
    label: 'Standard HTTP/HTTPS POST',
    description: 'Post batches of records to any URL.'
  },
  { value: 'kafka', label: 'Apache Kafka', description: 'Publish records to a Kafka topic.' },
  {
    value: 's3',
    label: 'S3',
    description: 'Write objects to Amazon S3 or any provider that speaks the S3 protocol.'
  },
  {
    value: 'big_query',
    label: 'Google BigQuery',
    description: 'Insert rows into a BigQuery table.'
  },
  {
    value: 'elasticsearch',
    label: 'Elasticsearch',
    description: 'Index records in Elasticsearch.'
  },
  {
    value: 'splunk',
    label: 'Splunk',
    description: 'Send records to a Splunk HTTP Event Collector.'
  },
  {
    value: 'aws_kinesis_firehose',
    label: 'AWS Kinesis Data Firehose',
    description: 'Deliver records to a Firehose delivery stream.'
  },
  { value: 'datadog', label: 'Datadog', description: 'Send records to Datadog Logs.' },
  { value: 'qradar', label: 'IBM QRadar', description: 'Send records to a QRadar listener.' },
  {
    value: 'azure_monitor',
    label: 'Azure Monitor',
    description: 'Write records to a Log Analytics workspace.'
  },
  {
    value: 'azure_blob_storage',
    label: 'Azure Blob Storage',
    description: 'Write objects to a Blob Storage container.'
  }
]

const STREAM_MIN_PAYLOAD_BYTES = 1000000
const STREAM_MAX_PAYLOAD_BYTES = 2147483647
const STREAM_URL_PATTERN = /^https?:\/\/[^\s/$.?#].\S*$/
const STREAM_JSON_OBJECT_PATTERN = /^\{[\s\S]*\}$/

const WAF_THREAT_GUIDANCE = {
  sql_injection: 'Detects SQL queries inserted through the input data a client sends.',
  remote_file_inclusion:
    'Detects attempts to include a remote file, usually through a script on the web server.',
  directory_traversal:
    'Blocks file names that try to reach a parent directory through unsanitized input.',
  cross_site_scripting: 'Blocks client-side scripts injected into the pages visitors see.',
  evading_tricks: 'Blocks encoding tricks used to slip past protection.',
  file_upload: 'Detects attempts to upload files.',
  unwanted_access:
    'Detects access to vulnerable or administrative pages, and security scanning bots and tools.',
  identified_attack: 'Blocks known attacks against applications and servers.'
}

export const createResources = [
  {
    id: 'domains',
    label: 'Domains',
    unit: 'domain',
    icon: 'ai ai-domains',
    title: 'Create Domain',
    listPath: '/home',
    listLabel: 'Overview',
    api: 'POST /workspace/workloads',
    guidance:
      'Add a domain you own, or a free azion.run address, and connect it to an environment. Azion answers on it and serves its certificate.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'The workload that answers on the domain. Once it is saved, an azion.run address is generated from its name.',
        fields: [
          nameField({
            placeholder: 'my-workload',
            helper: 'Give a unique and descriptive name to identify the workload.',
            pattern: WORKLOAD_NAME_PATTERN,
            patternHint:
              'Use letters, numbers and standard symbols, with no accents or double quotes.'
          })
        ]
      },
      {
        id: 'domain',
        title: 'Domain',
        description:
          'The domain and the environment it connects to. It serves whatever release is live there, so new deployments reach it without editing the domain again.',
        fields: [
          {
            id: 'domainType',
            kind: 'radio',
            api: 'bindings[].domains[]',
            label: 'Domain type',
            default: 'own',
            options: [
              {
                value: 'own',
                label: 'Your own domain',
                description: 'Point your DNS at this workload.'
              },
              {
                value: 'azion',
                label: 'Free Azion domain',
                description: 'An azion.run subdomain. Each environment holds one.'
              }
            ]
          },
          {
            id: 'domain',
            kind: 'text',
            api: 'bindings[].domains[]',
            label: 'Domain',
            required: true,
            maxLength: 253,
            pattern: DOMAIN_PATTERN,
            patternHint: DOMAIN_HINT,
            placeholder: 'example.com',
            helper: 'Add the domain exactly as it resolves, without a scheme or a path.',
            visible: (form) => form.domainType === 'own'
          },
          {
            id: 'azionSubdomain',
            kind: 'text',
            api: 'bindings[].domains[]',
            label: 'Azion domain',
            required: true,
            maxLength: 63,
            pattern: AZION_SUBDOMAIN_PATTERN,
            patternHint: 'Use letters, numbers and hyphens, not starting or ending with a hyphen.',
            placeholder: 'my-workload',
            helper: 'The address becomes this name followed by .azion.run.',
            visible: (form) => form.domainType === 'azion'
          },
          {
            id: 'environment',
            kind: 'select',
            api: 'bindings[].environment_id',
            label: 'Environment',
            required: true,
            get options() {
              return environmentNameOptions.value
            },
            default: 'Production',
            helper:
              'The environment the domain connects to. Its deployment policy decides which Deployment Settings publish to it.'
          },
          {
            id: 'certificate',
            kind: 'select',
            api: 'bindings[].certificate',
            label: 'Digital certificate',
            required: true,
            options: DOMAIN_CERTIFICATE_OPTIONS,
            default: 'azion_san',
            helper:
              "Served on HTTPS. A new Let's Encrypt certificate is issued once DNS points at Azion.",
            visible: (form) => form.useHttps === true
          }
        ]
      },
      {
        id: 'deployment',
        title: 'Deployment Settings',
        description:
          'Every environment a domain uses links to Deployment Settings that match its deployment policy. Select another one when the automatic link is not the one you want.',
        advanced: true,
        fields: [
          {
            id: 'deploymentSettings',
            kind: 'select',
            api: 'bindings[].deployment_id',
            label: 'Deployment Settings',
            required: true,
            options: SAMPLE_DEPLOYMENT_SETTINGS,
            default: 'azion-default',
            helper:
              'Deployment Settings hold the applications, firewall policies and custom pages an environment shares.'
          }
        ]
      },
      {
        id: 'protocols',
        title: 'Protocol settings',
        description: 'How clients reach the workload: ports, HTTPS, TLS and HTTP/3.',
        advanced: true,
        fields: [
          {
            id: 'httpPorts',
            kind: 'list',
            api: 'protocols.http.http_ports',
            label: 'HTTP ports',
            required: true,
            default: '80',
            pattern: portListPattern(WORKLOAD_HTTP_PORTS),
            patternHint: portListHint(WORKLOAD_HTTP_PORTS),
            helper: 'One port per line. 80 is the default.'
          },
          {
            id: 'useHttps',
            kind: 'switch',
            api: 'tls',
            label: 'HTTPS support',
            description: 'Serve HTTPS as well as HTTP, on the HTTPS ports you choose.',
            default: true
          },
          {
            id: 'httpsPorts',
            kind: 'list',
            api: 'protocols.http.https_ports',
            label: 'HTTPS ports',
            required: true,
            default: '443',
            pattern: portListPattern(WORKLOAD_HTTPS_PORTS),
            patternHint: portListHint(WORKLOAD_HTTPS_PORTS),
            helper: 'One port per line. 443 is the default.',
            parent: 'useHttps',
            visible: (form) => form.useHttps === true
          },
          {
            id: 'minimumTlsVersion',
            kind: 'select',
            api: 'tls.minimum_version',
            label: 'Minimum TLS version',
            required: true,
            options: WORKLOAD_TLS_VERSION_OPTIONS,
            default: 'tls_1_3',
            helper: 'Clients negotiating below this version are refused.',
            parent: 'useHttps',
            visible: (form) => form.useHttps === true
          },
          {
            id: 'cipherSuite',
            kind: 'select',
            api: 'tls.ciphers',
            label: 'Cipher suite',
            options: WORKLOAD_CIPHER_SUITE_OPTIONS,
            default: '7',
            helper:
              'The cipher suite the workload supports. The documentation lists the ciphers in each suite.',
            parent: 'useHttps',
            visible: (form) => form.useHttps === true
          },
          {
            id: 'useHttp3',
            kind: 'switch',
            api: 'protocols.http.versions',
            label: 'HTTP/3 support',
            description: 'Serve HTTP/3 over QUIC. It runs on top of HTTPS.',
            default: true,
            parent: 'useHttps',
            visible: (form) => form.useHttps === true
          },
          {
            id: 'quicPorts',
            kind: 'list',
            api: 'protocols.http.quic_ports',
            label: 'HTTP/3 ports',
            required: true,
            default: '443',
            pattern: portListPattern(WORKLOAD_HTTP3_PORTS),
            patternHint: portListHint(WORKLOAD_HTTP3_PORTS),
            helper: 'One port per line. 443 is the default.',
            parent: 'useHttp3',
            level: 2,
            visible: (form) => form.useHttps === true && form.useHttp3 === true
          }
        ]
      },
      {
        id: 'mtls',
        title: 'Mutual authentication',
        description:
          'Require the client and the server to present a certificate to each other. Available with HTTPS support.',
        advanced: true,
        visible: (form) => form.useHttps === true,
        fields: [
          {
            id: 'mtlsEnabled',
            kind: 'switch',
            api: 'mtls.enabled',
            label: 'Mutual authentication',
            description:
              'Clients must present a certificate that a Trusted CA certificate validates.',
            default: false
          },
          {
            id: 'mtlsVerification',
            kind: 'radio',
            api: 'mtls.config.verification',
            label: 'Verification mode',
            default: 'enforce',
            options: [
              {
                value: 'enforce',
                label: 'Enforce',
                description:
                  "Blocks the client certificate during the TLS handshake when the Trusted CA can't validate it."
              },
              {
                value: 'permissive',
                label: 'Permissive',
                description:
                  "Tries to verify the client certificate, but allows the handshake when the Trusted CA can't validate it. Firewall shows which certificate made the request."
              }
            ],
            parent: 'mtlsEnabled',
            visible: (form) => form.useHttps === true && form.mtlsEnabled === true
          },
          {
            id: 'mtlsCertificate',
            kind: 'select',
            api: 'mtls.config.certificate',
            label: 'Trusted CA certificate',
            required: true,
            placeholder: 'Select a Trusted CA certificate',
            options: SAMPLE_TRUSTED_CA_CERTIFICATES,
            helper: 'Mutual authentication validates every client certificate against it.',
            parent: 'mtlsEnabled',
            visible: (form) => form.useHttps === true && form.mtlsEnabled === true
          },
          {
            id: 'mtlsCrl',
            kind: 'select',
            api: 'mtls.config.crl[]',
            label: 'Certificate revocation list',
            placeholder: 'Select a revocation list',
            options: SAMPLE_REVOCATION_LISTS,
            helper: 'Client certificates on this list are rejected during mutual authentication.',
            parent: 'mtlsEnabled',
            visible: (form) => form.useHttps === true && form.mtlsEnabled === true
          }
        ]
      },
      statusSection('The domain answers as soon as DNS resolves to Azion.')
    ]
  },

  {
    id: 'functions',
    label: 'Functions',
    unit: 'function',
    icon: 'ai ai-edge-functions',
    title: 'Create Function',
    listPath: '/functions',
    listLabel: 'Functions',
    api: 'POST /workspace/functions',
    guidance:
      'Write code that runs at the edge, close to your users. Functions run on the Azion JavaScript runtime.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'A function is the code itself. It runs once instanced on an application or a firewall.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'my-function',
            helper: 'Give a unique and descriptive name to identify your function.'
          })
        ]
      },
      {
        id: 'environment',
        title: 'Execution environment',
        description:
          'Where the function runs. This cannot be changed after creation, because the two environments expose different request objects.',
        fields: [
          {
            id: 'executionEnvironment',
            kind: 'radio',
            api: 'execution_environment',
            default: 'application',
            options: [
              {
                value: 'application',
                label: 'Application',
                description: 'Runs on requests an application serves, after routing.'
              },
              {
                value: 'firewall',
                label: 'Firewall',
                description:
                  'Runs inside Firewall, before the request reaches an application, where a request can still be refused.'
              }
            ]
          }
        ]
      },
      {
        id: 'code',
        title: 'Code',
        description: 'The function body. Up to 20 MB.',
        fields: [
          {
            id: 'code',
            kind: 'code',
            api: 'code',
            label: 'Code',
            required: true,
            default: FUNCTION_STARTER,
            helper: 'The starter answers every request. Replace it with your own handler.'
          }
        ]
      },
      {
        id: 'arguments',
        title: 'Arguments',
        description:
          'Default arguments, as JSON. Every instance of this function starts from them and can override them with its own.',
        fields: [
          {
            id: 'args',
            kind: 'code',
            api: 'default_args',
            label: 'Arguments',
            default: FUNCTION_ARGS,
            helper: 'A JSON object. `{}` posts no default arguments.'
          }
        ]
      },
      statusSection('An inactive function keeps its code and stops running.')
    ]
  },

  {
    id: 'connectors',
    label: 'Connectors',
    unit: 'connector',
    icon: 'ai ai-edge-connectors',
    title: 'Create Connector',
    listPath: '/connectors',
    listLabel: 'Connectors',
    api: 'POST /workspace/connectors',
    guidance:
      'Connect your origins to Azion: an origin server, an Object Storage bucket, or a live ingest region.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'What the connector reaches, and how it is identified.',
        fields: [
          nameField({
            max: 255,
            placeholder: 'my-connector',
            helper: 'Give a unique and descriptive name to identify the connector.'
          }),
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            label: 'Type',
            default: 'http',
            options: [
              {
                value: 'http',
                label: 'HTTP',
                description: 'Connect to an external origin over HTTP or HTTPS.'
              },
              {
                value: 'storage',
                label: 'Object Storage',
                description: 'Read from an Object Storage bucket with low latency.'
              },
              {
                value: 'live_ingest',
                label: 'Live Ingest',
                description: 'Ingest live streams into your workloads in real time.'
              }
            ]
          }
        ]
      },
      {
        id: 'load-balancer',
        title: 'Load balancer',
        description: 'How the connector distributes traffic and manages connections with origins.',
        within: 'general',
        visible: (form) => form.type === 'http',
        fields: [
          {
            id: 'loadBalancerEnabled',
            kind: 'switch',
            api: 'attributes.modules.load_balancer.enabled',
            label: 'Load balancer',
            description:
              'Distribute traffic across multiple addresses. Turning it on lets the connector hold up to 15 addresses.',
            default: false
          },
          {
            id: 'loadBalancerMethod',
            kind: 'select',
            api: 'attributes.modules.load_balancer.config.method',
            label: 'Method',
            helper: 'How traffic is distributed across the addresses.',
            parent: 'loadBalancerEnabled',
            default: 'round_robin',
            options: [
              { value: 'round_robin', label: 'Round robin' },
              { value: 'least_conn', label: 'Least connections' },
              { value: 'ip_hash', label: 'IP hash' }
            ],
            visible: (form) => form.loadBalancerEnabled === true
          },
          {
            id: 'loadBalancerMaxRetries',
            kind: 'number',
            api: 'attributes.modules.load_balancer.config.max_retries',
            label: 'Max retries',
            helper: 'Retry attempts for a failed connection, from 0 to 20. Use 0 for no retries.',
            parent: 'loadBalancerEnabled',
            default: 3,
            min: 0,
            max: 20,
            visible: (form) => form.loadBalancerEnabled === true
          },
          {
            id: 'loadBalancerConnectionTimeout',
            kind: 'number',
            api: 'attributes.modules.load_balancer.config.connection_timeout',
            label: 'Connection timeout',
            helper: 'Seconds to wait for a connection with the origin, from 1 to 300.',
            parent: 'loadBalancerEnabled',
            default: 30,
            min: 1,
            max: 300,
            visible: (form) => form.loadBalancerEnabled === true
          },
          {
            id: 'loadBalancerReadWriteTimeout',
            kind: 'number',
            api: 'attributes.modules.load_balancer.config.read_write_timeout',
            label: 'Read/write timeout',
            helper:
              'Seconds to wait for data to be read from or written to the origin, from 1 to 600.',
            parent: 'loadBalancerEnabled',
            default: 60,
            min: 1,
            max: 600,
            visible: (form) => form.loadBalancerEnabled === true
          }
        ]
      },
      {
        id: 'origin-shield',
        title: 'Origin shield',
        description: 'Protect the origin by centralizing requests through a shield location.',
        within: 'general',
        visible: (form) => form.type === 'http',
        fields: [
          {
            id: 'originShieldEnabled',
            kind: 'switch',
            api: 'attributes.modules.origin_shield.enabled',
            label: 'Origin shield',
            description:
              'Requests reach the origin through a single shield location. Turning it on unlocks HMAC authentication.',
            default: false
          },
          {
            id: 'originIpAclEnabled',
            kind: 'switch',
            api: 'attributes.modules.origin_shield.config.origin_ip_acl.enabled',
            label: 'Origin IP ACL',
            description: 'The origin only accepts requests from the addresses Azion publishes.',
            parent: 'originShieldEnabled',
            default: true,
            visible: (form) => form.originShieldEnabled === true
          },
          {
            id: 'hmacEnabled',
            kind: 'switch',
            api: 'attributes.modules.origin_shield.config.hmac.enabled',
            label: 'HMAC authentication',
            description:
              'Sign every request to the origin with an access key to deliver private content.',
            parent: 'originShieldEnabled',
            default: true,
            visible: (form) => form.originShieldEnabled === true
          },
          {
            id: 'hmacType',
            kind: 'text',
            api: 'attributes.modules.origin_shield.config.hmac.config.type',
            label: 'Signature',
            helper: 'Fixed to aws4_hmac_sha256, compatible with S3 object storage.',
            parent: 'hmacEnabled',
            level: 2,
            readonly: true,
            default: 'aws4_hmac_sha256',
            visible: (form) => form.originShieldEnabled === true && form.hmacEnabled === true
          },
          {
            id: 'hmacRegion',
            kind: 'text',
            api: 'attributes.modules.origin_shield.config.hmac.config.attributes.region',
            label: 'Region',
            required: true,
            placeholder: 'us-east-1',
            helper: 'Region of the object storage provider.',
            parent: 'hmacEnabled',
            level: 2,
            visible: (form) => form.originShieldEnabled === true && form.hmacEnabled === true
          },
          {
            id: 'hmacService',
            kind: 'text',
            api: 'attributes.modules.origin_shield.config.hmac.config.attributes.service',
            label: 'Service',
            required: true,
            placeholder: 's3',
            helper: 'Service name of the object storage provider.',
            parent: 'hmacEnabled',
            level: 2,
            visible: (form) => form.originShieldEnabled === true && form.hmacEnabled === true
          },
          {
            id: 'hmacAccessKey',
            kind: 'secret',
            api: 'attributes.modules.origin_shield.config.hmac.config.attributes.access_key',
            label: 'Access key',
            required: true,
            helper: 'Access key issued by the object storage provider.',
            parent: 'hmacEnabled',
            level: 2,
            visible: (form) => form.originShieldEnabled === true && form.hmacEnabled === true
          },
          {
            id: 'hmacSecretKey',
            kind: 'secret',
            api: 'attributes.modules.origin_shield.config.hmac.config.attributes.secret_key',
            label: 'Secret key',
            required: true,
            helper: 'Secret key issued by the object storage provider. It is never shown again.',
            parent: 'hmacEnabled',
            level: 2,
            visible: (form) => form.originShieldEnabled === true && form.hmacEnabled === true
          }
        ]
      },
      {
        id: 'origin',
        title: 'Origin',
        description: 'Where the connector fetches content from.',
        fields: [
          {
            id: 'address',
            kind: 'text',
            api: 'attributes.addresses[].address',
            label: 'Address',
            required: true,
            maxLength: 255,
            placeholder: 'example.com',
            helper: 'An IPv4 or IPv6 address, or a CNAME to resolve.',
            visible: (form) => form.type === 'http'
          },
          {
            id: 'httpPort',
            kind: 'number',
            api: 'attributes.addresses[].http_port',
            label: 'HTTP port',
            helper: 'Plain port used to reach the origin, such as 80.',
            default: 80,
            min: 1,
            max: 65535,
            visible: (form) => form.type === 'http'
          },
          {
            id: 'httpsPort',
            kind: 'number',
            api: 'attributes.addresses[].https_port',
            label: 'HTTPS port',
            helper: 'Encrypted port used to reach the origin, such as 443.',
            default: 443,
            min: 1,
            max: 65535,
            visible: (form) => form.type === 'http'
          },
          {
            id: 'serverRole',
            kind: 'select',
            api: 'attributes.addresses[].server_role',
            label: 'Server role',
            helper: 'The role of this address in load balancing.',
            default: 'primary',
            options: [
              { value: 'primary', label: 'Primary' },
              { value: 'backup', label: 'Backup' }
            ],
            visible: (form) => form.type === 'http' && form.loadBalancerEnabled === true
          },
          {
            id: 'weight',
            kind: 'number',
            api: 'attributes.addresses[].weight',
            label: 'Weight',
            helper: 'A higher weight sends more traffic to this address, from 1 to 100.',
            default: 1,
            min: 1,
            max: 100,
            visible: (form) => form.type === 'http' && form.loadBalancerEnabled === true
          },
          {
            id: 'addressActive',
            kind: 'switch',
            api: 'attributes.addresses[].active',
            label: 'Address active',
            description: 'An inactive address stays configured but receives no traffic.',
            default: true,
            visible: (form) => form.type === 'http' && form.loadBalancerEnabled === true
          },
          {
            id: 'bucket',
            kind: 'select',
            api: 'attributes.connection_options.bucket',
            label: 'Bucket',
            required: true,
            placeholder: 'Select a bucket',
            helper: 'The Object Storage bucket the connector reads from.',
            options: BUCKETS.map((bucket) => ({ value: bucket.name, label: bucket.name })),
            visible: (form) => form.type === 'storage'
          },
          {
            id: 'prefix',
            kind: 'text',
            api: 'attributes.connection_options.prefix',
            label: 'Prefix',
            default: '/',
            maxLength: 255,
            placeholder: 'images/',
            helper: 'Filters the objects read from the bucket, such as images/ or logs/.',
            visible: (form) => form.type === 'storage'
          },
          {
            id: 'liveIngestRegion',
            kind: 'select',
            api: 'attributes.connection_options.region',
            label: 'Region',
            required: true,
            default: 'us-east-1',
            helper: 'Where the live stream is ingested. Pick the region closest to the source.',
            options: ['us-east-1', 'us-east-2', 'br-east-1', 'br-east-2', 'br-east-3'].map(
              (region) => ({ value: region, label: region })
            ),
            visible: (form) => form.type === 'live_ingest'
          }
        ]
      },
      {
        id: 'connection',
        title: 'Connection options',
        description: 'Settings related to origin servers and hosts.',
        advanced: true,
        visible: (form) => form.type === 'http',
        fields: [
          {
            id: 'host',
            kind: 'text',
            api: 'attributes.connection_options.host',
            label: 'Host',
            maxLength: 255,
            default: '${host}',
            placeholder: 'example.com',
            helper:
              'Domain or IP address of the origin server. The default forwards the host the client asked for.'
          },
          {
            id: 'path',
            kind: 'text',
            api: 'attributes.connection_options.path',
            label: 'Path',
            maxLength: 255,
            placeholder: '/api/v1/resource',
            pattern: /^\//,
            patternHint: 'Path must start with a forward slash.',
            helper: 'Path to the resource on the origin server. Use / for the root path.'
          },
          {
            id: 'realIpHeader',
            kind: 'text',
            api: 'attributes.connection_options.real_ip_header',
            label: 'Real IP header',
            maxLength: 255,
            default: 'X-Real-IP',
            helper: "Header that carries the client's real IP address."
          },
          {
            id: 'realPortHeader',
            kind: 'text',
            api: 'attributes.connection_options.real_port_header',
            label: 'Real port header',
            maxLength: 255,
            default: 'X-Real-PORT',
            helper: "Header that carries the client's real port."
          },
          {
            id: 'followingRedirect',
            kind: 'switch',
            api: 'attributes.connection_options.following_redirect',
            label: 'Follow redirects',
            description: 'Automatically follow HTTP redirects from the origin server.',
            default: false
          },
          {
            id: 'dnsResolution',
            kind: 'select',
            api: 'attributes.connection_options.dns_resolution',
            label: 'DNS resolution policy',
            helper: 'How DNS resolution is handled for this connection.',
            default: 'both',
            options: [
              { value: 'both', label: 'IPv4 and IPv6' },
              { value: 'force_ipv4', label: 'Force IPv4' }
            ]
          },
          {
            id: 'transportPolicy',
            kind: 'select',
            api: 'attributes.connection_options.transport_policy',
            label: 'Transport protocol policy',
            helper: 'The transport protocol used for the connection.',
            default: 'preserve',
            options: [
              { value: 'preserve', label: 'Preserve' },
              { value: 'force_https', label: 'Force HTTPS' },
              { value: 'force_http', label: 'Force HTTP' }
            ]
          }
        ]
      },
      statusSection('An inactive connector is kept but never reached.')
    ]
  },

  {
    id: 'custom-pages',
    label: 'Custom Pages',
    unit: 'custom page',
    icon: 'ai ai-custom-pages',
    title: 'Create Custom Page',
    listPath: '/custom-pages',
    listLabel: 'Custom Pages',
    api: 'POST /workspace/custom_pages',
    guidance:
      'Serve your own page when the edge answers an error, so a failure still looks like your product.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'Custom pages handle errors and set the cache TTL by the HTTP status code a connector returns.',
        fields: [
          nameField({
            max: 255,
            placeholder: 'storefront-errors',
            helper: 'Give a unique and descriptive name to identify the custom page.'
          })
        ]
      },
      {
        id: 'page',
        title: 'Page',
        description:
          'The first page in the set: the status code it answers and where its content comes from. Add one page per status code, up to 23, from the settings once the set exists.',
        fields: [
          {
            id: 'code',
            kind: 'select',
            api: 'pages[].code',
            label: 'Page code',
            required: true,
            default: 'default',
            options: CUSTOM_PAGE_CODE_OPTIONS,
            helper:
              'The status code this page answers. Default answers every status without a page of its own.'
          },
          {
            id: 'pageType',
            kind: 'text',
            api: 'pages[].page.type',
            label: 'Type',
            readonly: true,
            default: 'page_connector',
            helper:
              'Fixed to page_connector: the page is fetched from a connector. Azion keeps its own pages for 404 and Default until you replace them.'
          },
          {
            id: 'connector',
            kind: 'select',
            api: 'pages[].page.attributes.connector',
            label: 'Connector',
            required: true,
            placeholder: 'Select a connector',
            get options() {
              return pageConnectorOptions()
            },
            helper: 'Where the page content is fetched from. Live Ingest connectors are not listed.'
          },
          {
            id: 'uri',
            kind: 'text',
            api: 'pages[].page.attributes.uri',
            label: 'Page path',
            placeholder: '/path/error_page.html',
            pattern: CUSTOM_PAGE_URI_PATTERN,
            patternHint:
              'Start with a forward slash, and use only letters, numbers and the characters / - _ . ~ @ :',
            helper: 'Path of the page on the connector. Leave empty to request the connector root.'
          }
        ]
      },
      {
        id: 'response',
        title: 'Response',
        description: 'What the client receives when this page is served.',
        advanced: true,
        fields: [
          {
            id: 'customStatusCode',
            kind: 'number',
            api: 'pages[].page.attributes.custom_status_code',
            label: 'Custom status code',
            default: null,
            min: 100,
            max: 599,
            helper:
              'Replaces the status code sent to the client, from 100 to 599. Leave empty to keep the original.'
          },
          {
            id: 'ttl',
            kind: 'number',
            api: 'pages[].page.attributes.ttl',
            label: 'Response TTL',
            default: 0,
            min: 0,
            max: 31536000,
            helper: 'Seconds the page stays cached, from 0 to 31536000. One year is the maximum.'
          }
        ]
      },
      statusSection('An inactive set is kept but never served.')
    ]
  },

  {
    id: 'firewall',
    label: 'Firewall',
    unit: 'firewall',
    icon: 'ai ai-edge-firewall',
    title: 'Create Firewall',
    listPath: '/firewall',
    listLabel: 'Firewall',
    api: 'POST /workspace/firewalls',
    guidance:
      'Put protection in front of a workload: rules that run before the request reaches an application.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'A firewall holds the security logic that protects your servers and applications.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'storefront-firewall',
            helper: 'Give a unique and descriptive name to identify the firewall.'
          })
        ]
      },
      {
        id: 'modules',
        title: 'Modules',
        description:
          'Modules extend what the firewall can do. Some require a subscription, and a rule cannot use a module that is off.',
        within: 'general',
        fields: [
          {
            id: 'moduleDdosProtection',
            kind: 'switch',
            api: 'modules.ddos_protection.enabled',
            label: 'Unmetered DDoS protection',
            description:
              'Mitigates large and complex DDoS attacks at the network, transport, presentation and application layers. Always on in every account.',
            readonly: true,
            default: true
          },
          {
            id: 'moduleFunctions',
            kind: 'switch',
            api: 'modules.functions.enabled',
            label: 'Functions',
            description: 'Run low-latency functions as a firewall rule behavior.',
            default: true
          },
          {
            id: 'moduleNetworkProtection',
            kind: 'switch',
            api: 'modules.network_protection.enabled',
            label: 'Network protection',
            description:
              'Build a programmable security perimeter for inbound and outbound traffic from network lists.',
            default: true
          },
          {
            id: 'moduleWaf',
            kind: 'switch',
            api: 'modules.waf.enabled',
            label: 'WAF',
            description: 'Protect applications against threats and attacks with WAF rule sets.',
            default: false
          }
        ]
      },
      {
        id: 'debug',
        title: 'Debug rules',
        description:
          'Log the rules the Rules Engine runs. Query them in Data Stream, Real-Time Events or the Real-Time Events GraphQL API.',
        advanced: true,
        fields: [
          {
            id: 'debug',
            kind: 'switch',
            api: 'debug',
            label: 'Debug rules',
            description:
              'Executed rules appear in the stacktrace field of Data Stream and Real-Time Events, and in the stacktrace variable in GraphQL.',
            default: false
          }
        ]
      },
      statusSection('An inactive firewall stops evaluating rules.')
    ]
  },

  {
    id: 'waf-rules',
    label: 'WAF Rules',
    unit: 'rule set',
    icon: 'ai ai-waf-rules',
    title: 'Create WAF Rule Set',
    listPath: '/waf-rules',
    listLabel: 'WAF Rules',
    api: 'POST /workspace/wafs',
    guidance:
      'Score requests against known attack families and choose how hard each one is judged.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'A rule set protects servers and applications against threat families. To run it, add it as a behavior in a firewall rule.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'storefront-waf',
            helper: 'Give a unique and descriptive name to identify the rule set.'
          })
        ]
      },
      {
        id: 'thresholds',
        title: 'Threats',
        description:
          'Choose the threat types the rule set blocks and the sensitivity of each. Higher sensitivity catches more attacks and more false positives. Only the threats that are on are sent.',
        fields: WAF_THREATS.map(([value, label]) => ({
          id: `threat_${value}`,
          kind: 'switch-select',
          api: `engine_settings.attributes.thresholds[] { threat: ${value}, sensitivity }`,
          label,
          description: WAF_THREAT_GUIDANCE[value],
          valueLabel: 'Sensitivity',
          options: SENSITIVITY_OPTIONS,
          default: { active: true, value: 'medium' }
        }))
      }
    ]
  },

  {
    id: 'certificates',
    label: 'Certificate Manager',
    unit: 'certificate',
    icon: 'ai ai-digital-certificates',
    title: 'Create Certificate',
    listPath: '/certificates',
    listLabel: 'Certificate Manager',
    api: 'POST /workspace/tls/certificates',
    guidance:
      "Import a certificate you already hold, or request one from a certificate authority. For a Let's Encrypt certificate, add the domain to a workload instead.",
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'What the certificate is for, and how it is identified in this workspace.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'my-server-certificate',
            helper: 'Give a unique and descriptive name to identify the certificate.'
          }),
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            label: 'Type',
            default: 'certificate',
            options: [
              {
                value: 'certificate',
                label: 'Import a server certificate',
                description: 'Upload a TLS X.509 certificate and its private key in PEM format.'
              },
              {
                value: 'csr',
                label: 'Generate a certificate signing request',
                description:
                  'Create a CSR to purchase a TLS certificate from a certificate authority.'
              },
              {
                value: 'trusted_ca_certificate',
                label: 'Trusted CA certificate',
                description:
                  'Verifies client certificates when a workload requires mutual authentication.'
              },
              {
                value: 'crl',
                label: 'Certificate revocation list',
                description: 'Rejects revoked client certificates during mutual authentication.'
              }
            ]
          }
        ]
      },
      {
        id: 'pem',
        title: 'Certificate',
        description: 'Paste the PEM-encoded content. Intermediate certificates are accepted.',
        visible: (form) => form.type !== 'csr',
        fields: [
          {
            id: 'certificate',
            kind: 'code',
            api: 'certificate',
            label: 'Certificate',
            placeholder: '-----BEGIN CERTIFICATE-----',
            helper: 'The TLS X.509 certificate. Intermediate certificates are accepted.',
            visible: (form) => form.type === 'certificate'
          },
          {
            id: 'privateKey',
            kind: 'code',
            api: 'private_key',
            label: 'Private key',
            placeholder: '-----BEGIN PRIVATE KEY-----',
            helper: 'Never leaves the platform once stored, and cannot be read back.',
            visible: (form) => form.type === 'certificate'
          },
          {
            id: 'trustedCertificate',
            kind: 'code',
            api: 'certificate',
            label: 'Trusted CA certificate',
            required: true,
            placeholder: '-----BEGIN CERTIFICATE-----',
            helper: 'The public certificate of the CA that signs your client certificates.',
            visible: (form) => form.type === 'trusted_ca_certificate'
          },
          {
            id: 'crl',
            kind: 'code',
            api: 'crl',
            label: 'Certificate revocation list',
            required: true,
            placeholder: '-----BEGIN X509 CRL-----',
            helper: 'The PEM-encoded list of revoked certificates.',
            visible: (form) => form.type === 'crl'
          }
        ]
      },
      {
        id: 'csr',
        title: 'Request a certificate',
        description:
          'Generate a CSR and submit it to a certificate authority, which issues the certificate.',
        visible: (form) => form.type === 'csr',
        fields: [
          {
            id: 'common',
            kind: 'text',
            api: 'common_name',
            label: 'Subject name',
            required: true,
            placeholder: 'example.com',
            helper: 'The domain the certificate is issued for.'
          },
          {
            id: 'country',
            kind: 'text',
            api: 'country',
            label: 'Country or region',
            required: true,
            minLength: 2,
            maxLength: 2,
            placeholder: 'BR',
            helper: 'The two-letter country code.'
          },
          {
            id: 'state',
            kind: 'text',
            api: 'state',
            label: 'State or province',
            required: true,
            placeholder: 'São Paulo'
          },
          {
            id: 'city',
            kind: 'text',
            api: 'locality',
            label: 'City or locality',
            required: true,
            placeholder: 'São Paulo'
          },
          {
            id: 'organization',
            kind: 'text',
            api: 'organization',
            label: 'Organization',
            required: true,
            placeholder: 'Company Name S.A.'
          },
          {
            id: 'organizationUnit',
            kind: 'text',
            api: 'organization_unity',
            label: 'Organization unit',
            required: true,
            placeholder: 'IT Department'
          },
          {
            id: 'email',
            kind: 'text',
            api: 'email',
            label: 'Email',
            required: true,
            pattern: EMAIL_PATTERN,
            patternHint: 'Enter a valid email address. Example: name@example.com.',
            placeholder: 'example@email.com'
          },
          {
            id: 'keyAlgorithm',
            kind: 'select',
            api: 'private_key_type',
            label: 'Key algorithm',
            required: true,
            options: CSR_KEY_ALGORITHM_OPTIONS,
            default: 'BIT_RSA_2048'
          },
          {
            id: 'subjectAlternativeNames',
            kind: 'list',
            api: 'alternative_names',
            label: 'Subject alternative names',
            placeholder: 'www.example.com',
            helper: 'One name per line. Duplicate entries are removed.'
          }
        ]
      },
      statusSection('An inactive certificate is kept but never served.')
    ]
  },

  {
    id: 'network-lists',
    label: 'Network Lists',
    unit: 'network list',
    icon: 'ai ai-network-lists',
    title: 'Create Network List',
    listPath: '/network-lists',
    listLabel: 'Network Lists',
    api: 'POST /workspace/network_lists',
    guidance:
      'Group networks once and reference them from firewall rules, instead of restating a range per rule.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in Firewall rules.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'office-ranges',
            helper: 'Give a unique and descriptive name to identify the network list.'
          })
        ]
      },
      {
        id: 'settings',
        title: 'List settings',
        description:
          'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.',
        fields: [
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            label: 'Type',
            default: 'asn',
            options: [
              {
                value: 'asn',
                label: 'ASN',
                description:
                  'Identify networks by Autonomous System Number. Suited to grouping traffic.'
              },
              {
                value: 'ip_cidr',
                label: 'IP/CIDR',
                description:
                  'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
              },
              {
                value: 'countries',
                label: 'Countries',
                description: 'Group traffic by country, for location-based rules.'
              }
            ]
          },
          {
            id: 'items',
            kind: 'list',
            api: 'items',
            label: 'List',
            required: true,
            placeholder: '13335\n53331',
            helper:
              'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.',
            pattern: /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/,
            patternHint: 'Remove the empty lines. Every line holds one entry.',
            visible: (form) => form.type === 'asn'
          },
          {
            id: 'items',
            kind: 'list',
            api: 'items',
            label: 'List',
            required: true,
            placeholder: '185.241.208.232\n194.26.192.64\n171.25.193.25 #comment',
            helper:
              'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.',
            pattern: /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/,
            patternHint: 'Remove the empty lines. Every line holds one entry.',
            visible: (form) => form.type === 'ip_cidr'
          },
          {
            id: 'items',
            kind: 'list',
            api: 'items',
            label: 'Countries',
            required: true,
            placeholder: 'BR\nUS',
            helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as BR.',
            pattern: /^[^\S\n]*[A-Za-z]{2}[^\S\n]*(\n[^\S\n]*[A-Za-z]{2}[^\S\n]*)*$/,
            patternHint: 'Enter one two-letter country code per line. Example: BR.',
            visible: (form) => form.type === 'countries'
          }
        ]
      }
    ]
  },

  {
    id: 'data-stream',
    label: 'Data Stream',
    unit: 'stream',
    icon: 'ai ai-data-stream',
    title: 'Create Data Stream',
    listPath: '/data-stream',
    listLabel: 'Data Stream',
    api: 'POST /workspace/stream/streams',
    guidance:
      'Feed your data platforms with logs from your applications, as they happen. One stream, one destination.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'How the stream is identified.',
        fields: [
          nameField({
            placeholder: 'my-data-stream',
            helper: 'Give a unique and descriptive name to identify the data stream.'
          })
        ]
      },
      {
        id: 'source',
        title: 'Source',
        description: 'Which logs the stream collects, and from which workloads.',
        fields: [
          {
            id: 'dataSource',
            kind: 'select',
            api: 'inputs[raw_logs].attributes.data_source',
            label: 'Data source',
            required: true,
            default: 'workloads',
            helper: 'The product the records are collected from.',
            options: STREAM_DATA_SOURCE_OPTIONS
          },
          {
            id: 'workloadScope',
            kind: 'radio',
            api: 'transform[filter_workloads]',
            label: 'Workloads',
            required: true,
            default: 'all',
            options: [
              {
                value: 'all',
                label: 'All current and future workloads',
                description:
                  'Collect from every workload, including the ones created later. Unlocks sampling.'
              },
              {
                value: 'filtered',
                label: 'Selected workloads',
                description: 'Collect only from the workloads you list.'
              }
            ]
          },
          {
            id: 'workloads',
            kind: 'list',
            api: 'transform[filter_workloads].attributes.workloads',
            label: 'Selected workloads',
            required: true,
            placeholder: 'my-workload',
            helper: 'One workload per line. Only their records are sent to the destination.',
            visible: (form) => form.workloadScope === 'filtered'
          }
        ]
      },
      {
        id: 'sampling',
        title: 'Sampling',
        description: 'Collect a share of the records instead of all of them.',
        within: 'source',
        visible: (form) => form.workloadScope === 'all',
        fields: [
          {
            id: 'hasSampling',
            kind: 'switch',
            api: 'transform[sampling]',
            label: 'Sampling',
            description:
              'Collect a percentage of the records to save resources. Saving a stream with sampling on turns off every other data stream in the account.',
            default: true
          },
          {
            id: 'samplingPercentage',
            kind: 'number',
            api: 'transform[sampling].attributes.rate',
            label: 'Sampling rate',
            required: true,
            helper:
              'Percentage of records collected, from 0 to 100. The rate is statistical, and when streams differ the lowest one applies.',
            parent: 'hasSampling',
            default: 100,
            min: 0,
            max: 100,
            visible: (form) => form.workloadScope === 'all' && form.hasSampling === true
          }
        ]
      },
      {
        id: 'render-template',
        title: 'Template',
        description: 'The structure of each record sent to the destination.',
        fields: [
          {
            id: 'template',
            kind: 'select',
            api: 'transform[render_template].attributes.template',
            label: 'Template',
            required: true,
            default: 'azion-applications',
            placeholder: 'Select a template',
            helper:
              'An Azion template is a preset of variables for one source. A custom template lets you choose the variables.',
            options: STREAM_TEMPLATE_OPTIONS
          },
          {
            id: 'customTemplateName',
            kind: 'text',
            api: 'templates.name',
            label: 'Template name',
            required: true,
            placeholder: 'my-custom-template',
            helper: 'Give a unique and descriptive name to identify the custom template.',
            visible: (form) => form.template === 'custom'
          },
          {
            id: 'dataSet',
            kind: 'code',
            api: 'templates.data_set',
            label: 'Data set',
            required: true,
            placeholder: '{ "host": "$host", "status": "$status" }',
            pattern: STREAM_JSON_OBJECT_PATTERN,
            patternHint: 'Write the data set as a JSON object.',
            helper: 'The variables sent to the destination, in JSON format.',
            visible: (form) => form.template === 'custom'
          }
        ]
      },
      {
        id: 'destination',
        title: 'Destination',
        description:
          'The platform the records are sent to. Every value comes from that platform, and credentials cannot be read back.',
        fields: [
          {
            id: 'outputType',
            kind: 'select',
            api: 'outputs[].type',
            label: 'Connector',
            required: true,
            default: 'standard',
            helper: 'Each platform asks for different values.',
            options: STREAM_OUTPUT_OPTIONS
          },
          {
            id: 'endpointUrl',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'URL',
            required: true,
            placeholder: 'https://app.domain.com/',
            pattern: STREAM_URL_PATTERN,
            patternHint: 'Enter a valid URL. Example: https://app.domain.com/.',
            helper: 'The URL that receives the records.',
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 'payloadFormat',
            kind: 'text',
            api: 'outputs[].attributes.payload_format',
            label: 'Payload format',
            required: true,
            default: '$dataset',
            placeholder: '$dataset',
            helper:
              'The format each payload is sent in. $dataset is replaced by the records, already joined by the log line separator.',
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 'lineSeparator',
            kind: 'text',
            api: 'outputs[].attributes.log_line_separator',
            label: 'Log line separator',
            required: true,
            default: '\\n',
            placeholder: '\\n',
            helper:
              'Written at the end of each record. The \\n escape sequence puts one record per line, in NDJSON format.',
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 'headers',
            kind: 'list',
            api: 'outputs[].attributes.headers',
            label: 'Custom headers',
            required: true,
            placeholder: 'header-name:value',
            pattern: /^[^:\n]+:[^\n]*\S[^\n]*(\n[^:\n]+:[^\n]*\S[^\n]*){0,4}$/,
            patternHint: 'Write up to 5 headers, one per line, in the Key:Value format.',
            helper: 'Sent with every request. One per line, up to 5, in the Key:Value format.',
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 'bootstrapServers',
            kind: 'textarea',
            api: 'outputs[].attributes.bootstrap_servers',
            label: 'Bootstrap servers',
            required: true,
            maxLength: 150,
            placeholder: 'host1:port1,host2:port2',
            pattern: /^[^\s,]+(,[^\s,]+)*$/,
            patternHint: 'Separate the servers with a comma and no space.',
            helper: 'The hosts and ports of the Kafka cluster, separated by a comma and no space.',
            visible: (form) => form.outputType === 'kafka'
          },
          {
            id: 'kafkaTopic',
            kind: 'text',
            api: 'outputs[].attributes.kafka_topic',
            label: 'Kafka topic',
            required: true,
            maxLength: 150,
            placeholder: 'analytics.fct.pageviews.0',
            helper: 'Name of the topic in the Kafka cluster.',
            visible: (form) => form.outputType === 'kafka'
          },
          {
            id: 'useTls',
            kind: 'switch',
            api: 'outputs[].attributes.use_tls',
            label: 'Transport Layer Security',
            description:
              'Send encrypted data. The receiving connector must use a trusted CA certificate.',
            default: false,
            visible: (form) => form.outputType === 'kafka'
          },
          {
            id: 's3HostUrl',
            kind: 'text',
            api: 'outputs[].attributes.host_url',
            label: 'URL',
            required: true,
            maxLength: 200,
            placeholder: 'https://myownhost.s3.us-east-1.myprovider.com',
            helper:
              'The URL that receives the records. Any provider that speaks the S3 protocol works.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 's3BucketName',
            kind: 'text',
            api: 'outputs[].attributes.bucket_name',
            label: 'Bucket name',
            required: true,
            maxLength: 150,
            placeholder: 'mys3bucket',
            helper: 'The bucket the objects are written to.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 's3Region',
            kind: 'text',
            api: 'outputs[].attributes.region',
            label: 'Region',
            required: true,
            maxLength: 50,
            placeholder: 'us-east-1',
            helper: 'The region the bucket is hosted in.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 's3AccessKey',
            kind: 'secret',
            api: 'outputs[].attributes.access_key',
            label: 'Access key',
            required: true,
            maxLength: 150,
            placeholder: 'ORIA5ZEH9MW4NL5OITY4',
            helper: 'Public key to access the bucket.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 's3SecretKey',
            kind: 'secret',
            api: 'outputs[].attributes.secret_key',
            label: 'Secret key',
            required: true,
            maxLength: 150,
            helper: 'Secret key to access the bucket. It is never shown again.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 's3ContentType',
            kind: 'radio',
            api: 'outputs[].attributes.content_type',
            label: 'Content type',
            required: true,
            options: [
              { value: 'plain/text', label: 'plain/text' },
              { value: 'application/gzip', label: 'application/gzip' }
            ],
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'bigQueryProjectId',
            kind: 'text',
            api: 'outputs[].attributes.project_id',
            label: 'Project ID',
            required: true,
            placeholder: 'mycustomGBQproject01',
            helper: 'ID of the project in Google Cloud.',
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'bigQueryDatasetId',
            kind: 'text',
            api: 'outputs[].attributes.dataset_id',
            label: 'Dataset ID',
            required: true,
            placeholder: 'myGBQdataset',
            helper: 'Name of the dataset in Google BigQuery. It is case sensitive.',
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'bigQueryTableId',
            kind: 'text',
            api: 'outputs[].attributes.table_id',
            label: 'Table ID',
            required: true,
            placeholder: 'mypageviewtable01',
            helper: 'Name of the table in Google BigQuery.',
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'bigQueryServiceAccountKey',
            kind: 'code',
            api: 'outputs[].attributes.service_account_key',
            label: 'Service account key',
            required: true,
            placeholder: '{ "type": "service_account", "project_id": "mycustomGBQproject01" }',
            pattern: STREAM_JSON_OBJECT_PATTERN,
            patternHint: 'Paste the whole JSON key file.',
            helper: 'The JSON key file Google Cloud issues to authenticate with its services.',
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'elasticsearchUrl',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'URL',
            required: true,
            placeholder: 'https://elasticsearch-domain.com/myindex',
            helper: 'The address plus the Elasticsearch index that receives the records.',
            visible: (form) => form.outputType === 'elasticsearch'
          },
          {
            id: 'elasticsearchApiKey',
            kind: 'secret',
            api: 'outputs[].attributes.api_key',
            label: 'Encoded API key',
            required: true,
            placeholder: 'VnVhQ2ZHY0JDZGJrUW0tZTVhT3g6dWkybHAyYXhUTm1zeWFrdzl0dk5udw==',
            helper: 'The Base64 value generated when the API key was created in Elasticsearch.',
            visible: (form) => form.outputType === 'elasticsearch'
          },
          {
            id: 'splunkUrl',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'URL',
            required: true,
            placeholder: 'https://inputs.splunk-client.splunkcloud.com:8088/services/collector',
            helper:
              'The URL that receives the records. To point at another index, add it at the end of the URL.',
            visible: (form) => form.outputType === 'splunk'
          },
          {
            id: 'splunkApiKey',
            kind: 'secret',
            api: 'outputs[].attributes.api_key',
            label: 'API key',
            required: true,
            placeholder: 'crfe25d2-23j8-48gf-a9ks-6b75w3ska674',
            helper: 'The HTTP Event Collector token issued when Splunk was installed.',
            visible: (form) => form.outputType === 'splunk'
          },
          {
            id: 'firehoseStreamName',
            kind: 'text',
            api: 'outputs[].attributes.stream_name',
            label: 'Stream name',
            required: true,
            placeholder: 'MyKDFConnector',
            helper: 'Name of the delivery stream.',
            visible: (form) => form.outputType === 'aws_kinesis_firehose'
          },
          {
            id: 'firehoseRegion',
            kind: 'text',
            api: 'outputs[].attributes.region',
            label: 'Region',
            required: true,
            placeholder: 'us-east-1',
            helper: 'The region the Amazon Kinesis instance runs in.',
            visible: (form) => form.outputType === 'aws_kinesis_firehose'
          },
          {
            id: 'firehoseAccessKey',
            kind: 'secret',
            api: 'outputs[].attributes.access_key',
            label: 'Access key',
            required: true,
            placeholder: 'ORIA5ZEH9MW4NL5OITY4',
            helper: 'Public key AWS issues to access Data Firehose.',
            visible: (form) => form.outputType === 'aws_kinesis_firehose'
          },
          {
            id: 'firehoseSecretKey',
            kind: 'secret',
            api: 'outputs[].attributes.secret_key',
            label: 'Secret key',
            required: true,
            helper: 'Secret key AWS issues to access Data Firehose. It is never shown again.',
            visible: (form) => form.outputType === 'aws_kinesis_firehose'
          },
          {
            id: 'datadogUrl',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'URL',
            required: true,
            placeholder: 'https://http-intake.logs.datadoghq.com/v1/input',
            helper: 'The URL or URI of the Datadog endpoint.',
            visible: (form) => form.outputType === 'datadog'
          },
          {
            id: 'datadogApiKey',
            kind: 'secret',
            api: 'outputs[].attributes.api_key',
            label: 'API key',
            required: true,
            placeholder: 'ij9076f1ujik17a81f938yhru5g713422',
            helper: 'The API key generated in the Datadog dashboard.',
            visible: (form) => form.outputType === 'datadog'
          },
          {
            id: 'qradarUrl',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'URL',
            required: true,
            placeholder: 'http://137.15.824.10:14440',
            helper: 'The URL that receives the records.',
            visible: (form) => form.outputType === 'qradar'
          },
          {
            id: 'azureMonitorLogType',
            kind: 'text',
            api: 'outputs[].attributes.log_type',
            label: 'Log type',
            required: true,
            maxLength: 100,
            placeholder: 'AzureMonitorTest',
            pattern: /^[A-Za-z0-9_]+$/,
            patternHint: 'Use only letters, numbers, and underscores.',
            helper: 'Record type of the submitted data. Letters, numbers, and underscores only.',
            visible: (form) => form.outputType === 'azure_monitor'
          },
          {
            id: 'azureMonitorSharedKey',
            kind: 'secret',
            api: 'outputs[].attributes.shared_key',
            label: 'Shared key',
            required: true,
            placeholder: 'OiA9AdGr4As5Iujg5FAHsTWfawxOD4',
            helper: 'Shared key of the workspace.',
            visible: (form) => form.outputType === 'azure_monitor'
          },
          {
            id: 'azureMonitorWorkspaceId',
            kind: 'text',
            api: 'outputs[].attributes.workspace_id',
            label: 'Workspace ID',
            required: true,
            placeholder: 'kik73154-0426-464c-aij3-eg6d24u87c50',
            helper: 'ID of the Log Analytics workspace.',
            visible: (form) => form.outputType === 'azure_monitor'
          },
          {
            id: 'blobStorageAccount',
            kind: 'text',
            api: 'outputs[].attributes.storage_account',
            label: 'Storage account',
            required: true,
            placeholder: 'mystorageaccount',
            helper: 'Name of the storage account.',
            visible: (form) => form.outputType === 'azure_blob_storage'
          },
          {
            id: 'blobContainerName',
            kind: 'text',
            api: 'outputs[].attributes.container_name',
            label: 'Container name',
            required: true,
            placeholder: 'mycontainer',
            helper: 'Name of the container.',
            visible: (form) => form.outputType === 'azure_blob_storage'
          },
          {
            id: 'blobSasToken',
            kind: 'secret',
            api: 'outputs[].attributes.blob_sas_token',
            label: 'Blob SAS token',
            required: true,
            placeholder:
              'sp=oiuwdl&st=2022-04-14T18:05:08Z&se=2026-03-02T02:05:08Z&sv=2020-08-04&sr=c&sig=YUi0',
            helper: 'Token generated by Blob Storage, with create, read, write, and list access.',
            visible: (form) => form.outputType === 'azure_blob_storage'
          }
        ]
      },
      {
        id: 'destination-options',
        title: 'Destination options',
        description: 'Optional settings of the destination.',
        advanced: true,
        visible: (form) => ['standard', 's3', 'azure_monitor'].includes(form.outputType),
        fields: [
          {
            id: 'maxSize',
            kind: 'number',
            api: 'outputs[].attributes.max_size',
            label: 'Payload max size',
            helper: 'Maximum size of each payload in bytes, from 1000000.',
            default: STREAM_MIN_PAYLOAD_BYTES,
            min: STREAM_MIN_PAYLOAD_BYTES,
            max: STREAM_MAX_PAYLOAD_BYTES,
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 's3ObjectKeyPrefix',
            kind: 'text',
            api: 'outputs[].attributes.object_key_prefix',
            label: 'Object key prefix',
            maxLength: 150,
            placeholder: 'user/logs/',
            helper:
              'Starts the name of each object, followed by the send time as YYYY/MM/DD/hh/mm/ and a UUID. Example: user/logs/2024/10/12/06/24/37d66e78-c308-4006-9d4d-1c013ed89276.',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'azureMonitorTimeGeneratedField',
            kind: 'text',
            api: 'outputs[].attributes.time_generated_field',
            label: 'Time generated field',
            placeholder: 'myCustomTimeField',
            helper:
              'The field that sets when a record becomes available after collection. Leave it empty to use the ingestion time.',
            visible: (form) => form.outputType === 'azure_monitor'
          }
        ]
      },
      statusSection('An inactive stream stops sending records and keeps its configuration.')
    ]
  },

  {
    id: 'object-storage',
    label: 'Object Storage',
    unit: 'bucket',
    icon: 'ai ai-edge-storage',
    title: 'Create Bucket',
    listPath: '/object-storage',
    listLabel: 'Object Storage',
    api: 'POST /workspace/storage/buckets',
    guidance: 'Store and serve static objects from the edge, addressed by key.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description:
          'The bucket name is part of the object URL, so it cannot be changed after creation.',
        fields: [
          nameField({
            min: 6,
            max: 63,
            placeholder: 'my-bucket',
            helper:
              'Give a unique and descriptive name to identify the bucket. Between 6 and 63 characters.',
            pattern: /^[A-Za-z0-9_-]+$/,
            patternHint: 'Use only letters, numbers, hyphens and underscores, with no spaces.'
          })
        ]
      },
      {
        id: 'access',
        title: 'Settings',
        description: 'Define how the workloads of this workspace reach the bucket.',
        fields: [
          {
            id: 'workloadsAccess',
            kind: 'radio',
            api: 'workloads_access',
            label: 'Workloads access',
            helper: 'The access level workloads have to the objects in this bucket.',
            required: true,
            default: 'read_only',
            options: [
              {
                value: 'read_write',
                label: 'Read and write',
                description:
                  'Workloads can serve objects and write new ones, such as uploads from a function.'
              },
              {
                value: 'read_only',
                label: 'Read only',
                description: 'Workloads can serve objects and cannot change them.'
              },
              {
                value: 'restricted',
                label: 'Restricted',
                description: 'No workload reaches the bucket. Access is through the API only.'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const createResource = (id) => createResources.find((resource) => resource.id === id)

export const createResourcePath = (id) => `/${id}/new`

export const resourceSettingsPath = (id, recordId) => `/${id}/${recordId}/settings`

const SIDEBAR_KEYS = { certificates: 'certificate-manager', domains: 'overview' }

export const resourceSidebarKey = (id) => SIDEBAR_KEYS[id] ?? id

export const resourceFields = (resource) =>
  resource.sections.flatMap((section) => section.fields.map((field) => ({ ...field, section })))

export const createFormSeed = (resource) => {
  const seed = {}
  for (const field of resourceFields(resource)) {
    if (field.default !== undefined) {
      seed[field.id] =
        field.default !== null && typeof field.default === 'object'
          ? { ...field.default }
          : field.default
      continue
    }
    if (field.kind === 'switch') seed[field.id] = false
    else if (field.kind === 'switch-select')
      seed[field.id] = { active: false, value: field.options?.[0]?.value ?? '' }
    else if (field.kind === 'number') seed[field.id] = field.min ?? 0
    else seed[field.id] = ''
  }
  return seed
}

export const isVisible = (node, form) => (node.visible ? node.visible(form) === true : true)
