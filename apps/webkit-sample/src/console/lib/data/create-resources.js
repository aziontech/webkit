// Create flows, per first-level resource — the FIELDS, taken from the Azion API.
//
// Every first-level module in the sidebar can create its own resource, and until now
// most of them could not: the module list's primary button raised a toast saying the
// demo stopped there. This file is the other half of those buttons — one descriptor per
// resource, rendered by ../components/CreateResource.vue as a focused create page.
//
// ── WHERE THE FIELDS COME FROM ──
//
// Not from taste, and not from the old console: from the v4 REST API's own request
// bodies (`aziontech/api-schemas`, `openapi.yaml`, `servers: https://api.azion.com/v4`).
// Each section below names its endpoint in `api`, and each field names the property it
// posts. That is the whole point of the file: a create page invents a shape the moment
// it is written by hand, and the shape it invents is the one the reader has to unlearn
// when they meet the real console. So every field here is a real property, every
// `required` is the API's `required`, every `maxLength`/`pattern` is the API's, and
// every default is the API's default.
//
// Three consequences worth stating, because each looks like an omission:
//
//   A PROPERTY WITH ONE POSSIBLE VALUE IS NOT A FIELD. `functions.runtime` is
//     `enum(azion_js)` and `stream.inputs[].type` is `enum(raw_logs)`. A select with one
//     option is a control that cannot be answered wrongly and therefore asks nothing —
//     it goes in the section's prose instead, where it informs without pretending to be
//     a decision.
//   A READ-ONLY PROPERTY IS NOT A FIELD. The certificates endpoint accepts 20-odd
//     properties and marks most of them `readOnly` (issuer, validity, status, csr,
//     authority, key_algorithm…): they are what the platform tells you AFTER it parses
//     the PEM you uploaded. Asking for them would be asking the reader to type the
//     answer to the question they came to ask.
//   A NESTED RESOURCE IS NOT A FIELD. A zone's DNSSEC is its own endpoint
//     (`/dns/zones/{id}/dnssec`), records are their own, WAF exceptions are their own.
//     Create makes the thing; the thing's children are created on it afterwards.
//
// ── WHY ONE DESCRIPTOR AND NOT TEN PAGES ──
//
// The four create flows that already existed (Application, Workload, Zone, SQL
// Database) are four hand-written pages, and they had already drifted: three ask for a
// name and validate it three ways, only two carry the `active` switch the API defaults,
// and only one enforces a `pattern` the API does state. Ten more hand-written pages
// would be ten more copies of that drift. So the SHAPE lives once, in
// ../components/CreateResource.vue (focused shell, section cards, submit-time
// validation, scope lock, sticky bar), and what changes per resource is the only thing
// that should: which fields the API takes.
//
// This is data describing a FORM, which is a different thing from a config array
// standing in for UI: every field renders through a real webkit `Field*` component, and
// a section that needs markup of its own gets a section in the page instead of a flag
// in here.
//
// ── FIELD KINDS ──
//
//   text      InputText via FieldText
//   number    InputNumber via a labelled row (ports, TTLs, sizes)
//   textarea  Textarea via FieldTextarea
//   code      the same, in the code face — a PEM block, a function body
//   list      the same, one value per line, posted as an array
//   select    Select via FieldSelect — for an enum with more than a handful of values
//   radio     FieldRadioBlock — for an enum whose options need a line of explanation
//   switch    FieldSwitchBlock — for a boolean
//   switch-select  a boolean that CARRIES a value: the switch decides whether the thing is
//     configured at all, and the select — shown only while it is on — decides how. Its model
//     is `{ active, value }`, and `options` is the select's list.
//
// `visible(form)` hides a field until the answer it depends on has been given, which is
// how one page can hold eleven Data Stream destinations without asking for all of them
// at once. A hidden field is never validated and never posted.

/** The three statuses every resource shares: the API's `active`, with its default. */
const activeField = (description) => ({
  id: 'active',
  kind: 'switch',
  api: 'active',
  label: 'Active',
  description,
  default: true
})

// ADVANCED IS A PROPERTY OF THE SECTION, not something the page infers. A section is
// `advanced` when every field in it is optional to the endpoint AND already carries the
// endpoint's own default AND is not what the reader came here to decide — all three.
// The last clause is why this cannot be a heuristic over `required`: a firewall's
// modules and a WAF set's thresholds are entirely optional too, and burying them would
// hide the point of the form. Advanced sections are merged into one collapsed band at
// the end of the page, so what is asked at rest is only what has to be answered.
const statusSection = (description) => ({
  id: 'status',
  title: 'Status',
  description: 'A resource can be created inactive and switched on once it is configured.',
  advanced: true,
  fields: [activeField(description)]
})

/**
 * The one name every resource takes. `max` and the sentence differ per endpoint, so both
 * are arguments; the label, the required-ness and the amber prompt do not.
 */
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

// A domain, as the API spells it: `(?=^.{4,253}$)` plus labels of at most 63 characters.
// Kept as one source so the domain field and the DNS zone field cannot disagree.
const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/
const DOMAIN_HINT = 'Enter a valid domain name. Example: mydomain.com.'

// The certificate offer, as the console presents it: a managed certificate the platform
// issues, or one the account already holds. `null` is the API's "no certificate", which
// is only valid while the workload answers on its own Azion hostname.
//
// EXPORTED because `tls` is a property of the WORKLOAD, not of one domain. The workload
// create page asks for it once (../components/CreateWorkload.vue) and this file's Domains
// descriptor asks for it from the other direction; two literals would let a workload and
// the domain pointed at it offer different certificates for the same connection.
export const CERTIFICATE_OPTIONS = [
  { value: 'lets_encrypt', label: "Let's Encrypt (issued and renewed by Azion)" },
  { value: 'azion_san', label: 'Azion (SAN)' },
  { value: 'own', label: 'A certificate from Certificate Manager' }
]

// TLS minimum version — `workloads.tls.minimum_version`. Exported for the same reason as
// the certificate list above: one workload-level answer, asked from two surfaces.
export const TLS_VERSION_OPTIONS = [
  { value: 'tls_1_0', label: 'TLS 1.0' },
  { value: 'tls_1_1', label: 'TLS 1.1' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_3', label: 'TLS 1.3' }
]

// The eight threat families the WAF scores, and the five sensitivities each takes
// (`ThresholdRequest.threat` / `SensitivityEnum`). Ordered as the API lists them.
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

// Every HTTP status a Custom Page can answer for (`PageCodeEnum`), plus `default` — the
// one that catches everything not listed.
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

// The sample's existing resources, offered where a create flow has to point at one. A
// real console reads these from the API; the prototype holds the same three names the
// rest of the sample uses so a created resource can be pointed at something real.
const SAMPLE_WORKLOADS = [
  { value: 'my-workload', label: 'my-workload' },
  { value: 'storefront', label: 'storefront' },
  { value: 'api-gateway', label: 'api-gateway' }
]

// The environments a DOMAIN can answer in. Two, not the three ../lib/deployments.js
// filters by: Preview is where a deployment lands before it is promoted, addressed by
// the preview hostname the platform mints per deployment — a name the reader owns is
// never bound to it. Production and Stage are the two a domain is pointed at, and they
// are the same two the Add Domain drawer offers from the workload side
// (../components/ui/AddDomainDrawer.vue), so the two surfaces cannot disagree.
export const ENVIRONMENT_OPTIONS = [
  { value: 'Production', label: 'Production' },
  { value: 'Stage', label: 'Stage' }
]

// INFRASTRUCTURE_OPTIONS lived here and is gone. The workload create page asked which
// network map a workload was minted on; the versioned create flow does not carry that
// field at all — the environment a domain answers on decides where it is served, and
// that is asked on the domain (ENVIRONMENT_OPTIONS above). Nothing reads it now, so it
// is not kept around as a descriptor a future page could pick up by accident.

const SAMPLE_CONNECTORS = [
  { value: 'origin-http', label: 'origin-http' },
  { value: 'assets-bucket', label: 'assets-bucket' }
]

// A first function that runs as written: the reader's first act on this page should be
// pressing Save, not authoring JavaScript in a textarea. The console prefills the same
// way, and the API's only constraint on `code` is that it is not empty.
//
// Exported because Functions is the one resource whose create page is NOT the generic
// renderer (see ../components/CreateFunction.vue): the editor there opens on this exact
// body, so the starter stays one string rather than two that drift.
export const FUNCTION_STARTER = `async function handleRequest(request) {
  return new Response('Hello from the edge', { status: 200 })
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`

// The args editor opens on the endpoint's own default — an empty object, which posts no
// default arguments. Same seed the console starts from.
export const FUNCTION_ARGS = `{}`

/**
 * The resources, in the order the sidebar lists them. `id` is the route param
 * (`/create/:resource`), `unit` is the singular noun used in sentences, `listPath` is
 * where Cancel returns and what the breadcrumb links back to, and `api` names the
 * endpoint whose request body the sections mirror.
 */
export const createResources = [
  // ── DOMAINS ──
  //
  // There is no standalone domain endpoint in v4: a domain is an entry in a Workload's
  // `domains[]` array, and the TLS settings that serve it belong to the same Workload
  // (`POST /workspace/workloads`). This page is the reason Overview can offer "Add a
  // domain" as one of the three first moves an empty account can make
  // (../home-first-use.js), so it asks the domain's own questions and stops there.
  //
  // WHICH IS WHY THE WORKLOAD IS NOT REQUIRED. It reads like the endpoint's parent and
  // therefore like a required field, but a domain and the workload that serves it are
  // bound in two directions, and the OTHER direction is the one that already exists in
  // the console: a workload adds its domains from its own Domains section
  // (../components/ui/AddDomainDrawer.vue). Making it required here would mean a reader
  // who registers a name before deciding what serves it has to invent an answer, and an
  // invented binding is worse than an absent one — it points live traffic somewhere.
  // So the binding a domain owns by itself is its ENVIRONMENT, which it always has, and
  // the workload is offered to whoever already knows it.
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
      'Point a domain you own at a workload. Azion answers on it, issues the certificate and keeps it renewed.',
    sections: [
      {
        id: 'domain',
        title: 'Domain',
        description: 'The name your users type. One domain per entry.',
        fields: [
          {
            id: 'domain',
            kind: 'text',
            api: 'domains[]',
            label: 'Domain',
            required: true,
            maxLength: 253,
            pattern: DOMAIN_PATTERN,
            patternHint: DOMAIN_HINT,
            placeholder: 'www.mydomain.com',
            helper: 'Add the domain exactly as it resolves, without a scheme or a path.'
          },
          {
            id: 'allowAzionDomain',
            kind: 'switch',
            api: 'workload_domain_allow_access',
            label: 'Keep the Azion domain answering',
            description:
              'The workload also stays reachable on its own azion.run hostname, which is what you test against before DNS moves.',
            default: true
          }
        ]
      },
      {
        id: 'binding',
        title: 'Binding',
        description:
          "What the domain answers for. The environment is the domain's own binding; the workload that serves it can be attached here or from the workload itself.",
        fields: [
          {
            id: 'environment',
            kind: 'select',
            api: 'environment',
            label: 'Environment',
            required: true,
            options: ENVIRONMENT_OPTIONS,
            default: 'Production',
            helper:
              'Production is the live name your users type. Stage answers the same workload with the same certificate, for the rehearsal.'
          },
          {
            id: 'workload',
            kind: 'select',
            api: 'workload_id',
            label: 'Workload',
            placeholder: 'Select a workload',
            options: SAMPLE_WORKLOADS,
            helper:
              'Optional. A workload binds its own domains from its Domains section, so a domain can be registered first and pointed at a workload later.'
          }
        ]
      },
      {
        id: 'tls',
        title: 'TLS',
        description:
          'How the domain is served over HTTPS. A managed certificate is issued and renewed for you.',
        fields: [
          {
            id: 'certificate',
            kind: 'select',
            api: 'tls.certificate',
            label: 'Digital certificate',
            required: true,
            options: CERTIFICATE_OPTIONS,
            default: 'lets_encrypt',
            helper: 'Validation runs over HTTP once DNS points at Azion.'
          },
          {
            id: 'minimumTlsVersion',
            kind: 'select',
            api: 'tls.minimum_version',
            label: 'Minimum TLS version',
            options: TLS_VERSION_OPTIONS,
            default: 'tls_1_2',
            helper: 'Clients negotiating below this version are refused.'
          }
        ]
      },
      statusSection('The domain answers as soon as DNS resolves to Azion.')
    ]
  },

  // ── FUNCTIONS ──
  //
  // The one resource whose create page is NOT the generic renderer: the resource is the
  // code, so it creates in an editor (../components/CreateFunction.vue). This descriptor
  // stays the field list of record — the page reads its starter and posts its properties.
  //
  // The body is `POST v4/workspace/functions`, exactly as the console's own adapter
  // builds it: `{ name, code, runtime, execution_environment, default_args, azion_form,
  // active }`.
  //
  //   `runtime` is `enum(azion_js)` — one value, so it is not a decision. The console
  //     still SHOWS it, as a locked field reading "JavaScript", and the create page does
  //     the same: it informs without pretending to be a question. Posted as `azion_js`.
  //   `azion_form` is the Form Builder's JSON Schema — the console's second way of
  //     writing `default_args` (a schema renders a form, the form writes the args). It is
  //     not a field of its own and the sample does not build it; the args are written as
  //     JSON, which is what the endpoint receives either way.
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

  // ── CONNECTORS ──
  //
  // The request body is a `oneOf` over the connector types, so the fields below the type
  // are the HTTP variant's — the one an account reaches for first. `visible` keeps the
  // storage and live-ingest cases from being asked for at the same time.
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
      'Tell the edge where your content comes from — an origin server, a bucket, or a live ingest endpoint.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'What the connector reaches, and how it is identified.',
        fields: [
          nameField({
            max: 255,
            placeholder: 'origin-http',
            helper: 'Give a unique and descriptive name to identify your connector.'
          }),
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            default: 'http',
            options: [
              {
                value: 'http',
                label: 'HTTP',
                description: 'An origin the edge fetches over HTTP or HTTPS.'
              },
              {
                value: 'storage',
                label: 'Storage',
                description: 'An Object Storage bucket in this workspace.'
              },
              {
                value: 'live_ingest',
                label: 'Live ingest',
                description: 'A live stream ingest endpoint.'
              }
            ]
          }
        ]
      },
      {
        id: 'address',
        title: 'Address',
        description: 'Where requests are sent. Ports apply per scheme.',
        fields: [
          {
            id: 'address',
            kind: 'text',
            api: 'attributes.addresses[].address',
            label: 'Address',
            required: true,
            maxLength: 255,
            placeholder: 'origin.mydomain.com',
            helper: 'An IPv4 or IPv6 address, or a CNAME the edge resolves.',
            visible: (form) => form.type === 'http'
          },
          {
            id: 'httpPort',
            kind: 'number',
            api: 'attributes.addresses[].http_port',
            label: 'HTTP port',
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
            default: 443,
            min: 1,
            max: 65535,
            visible: (form) => form.type === 'http'
          },
          {
            id: 'bucket',
            kind: 'text',
            api: 'attributes.bucket',
            label: 'Bucket',
            required: true,
            maxLength: 63,
            placeholder: 'my-bucket',
            helper: 'The bucket the connector reads from.',
            visible: (form) => form.type === 'storage'
          },
          {
            id: 'ingestEndpoint',
            kind: 'text',
            api: 'attributes.endpoint',
            label: 'Ingest endpoint',
            required: true,
            maxLength: 255,
            placeholder: 'ingest.mydomain.com/live',
            visible: (form) => form.type === 'live_ingest'
          }
        ]
      },
      {
        id: 'connection',
        title: 'Connection options',
        description: 'How the edge talks to the address above.',
        advanced: true,
        visible: (form) => form.type === 'http',
        fields: [
          {
            id: 'transportPolicy',
            kind: 'select',
            api: 'attributes.connection_options.transport_policy',
            label: 'Transport policy',
            default: 'preserve',
            options: [
              { value: 'preserve', label: "Preserve the request's scheme" },
              { value: 'force_https', label: 'Force HTTPS' },
              { value: 'force_http', label: 'Force HTTP' }
            ]
          },
          {
            id: 'dnsResolution',
            kind: 'select',
            api: 'attributes.connection_options.dns_resolution',
            label: 'DNS resolution',
            default: 'both',
            options: [
              { value: 'both', label: 'IPv4 and IPv6' },
              { value: 'force_ipv4', label: 'IPv4 only' }
            ]
          },
          {
            id: 'host',
            kind: 'text',
            api: 'attributes.connection_options.host',
            label: 'Host header',
            maxLength: 255,
            default: '${host}',
            helper: 'Sent to the origin. The default forwards the host the client asked for.'
          },
          {
            id: 'pathPrefix',
            kind: 'text',
            api: 'attributes.connection_options.path_prefix',
            label: 'Path prefix',
            maxLength: 255,
            placeholder: '/v1',
            helper: 'Prepended to every request path.'
          },
          {
            id: 'followingRedirect',
            kind: 'switch',
            api: 'attributes.connection_options.following_redirect',
            label: 'Follow redirects',
            description: 'The edge follows a redirect from the origin instead of passing it on.',
            default: false
          }
        ]
      },
      {
        id: 'load-balancer',
        title: 'Load balancer',
        description:
          'Spread requests across the addresses of this connector. Off until a second address exists.',
        advanced: true,
        visible: (form) => form.type === 'http',
        fields: [
          {
            id: 'loadBalancerEnabled',
            kind: 'switch',
            api: 'attributes.modules.load_balancer.enabled',
            label: 'Enable load balancing',
            description: 'Requests are distributed across the connector addresses.',
            default: false
          },
          {
            id: 'loadBalancerMethod',
            kind: 'select',
            api: 'attributes.modules.load_balancer.config.method',
            label: 'Method',
            default: 'round_robin',
            options: [
              { value: 'round_robin', label: 'Round robin' },
              { value: 'least_conn', label: 'Least connections' },
              { value: 'ip_hash', label: 'IP hash' }
            ],
            visible: (form) => form.loadBalancerEnabled === true
          }
        ]
      },
      statusSection('An inactive connector is kept but never reached.')
    ]
  },

  // ── CUSTOM PAGES ──
  //
  // The API takes an array of pages, each binding one status code to a connector and a
  // URI. Create asks for the FIRST one; the rest are added on the page once it exists,
  // which is the same "create the thing, then its children" split as DNS records.
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
        description: 'A custom page set groups the responses one workload serves.',
        fields: [
          nameField({
            max: 255,
            placeholder: 'storefront-errors',
            helper: 'Give a unique and descriptive name to identify this set.'
          })
        ]
      },
      {
        id: 'page',
        title: 'Page',
        description:
          'The first response in the set. Add the rest once the set exists, one page per status code.',
        fields: [
          {
            id: 'code',
            kind: 'select',
            api: 'pages[].code',
            label: 'Status code',
            required: true,
            default: 'default',
            options: CUSTOM_PAGE_CODES.map((code) => ({
              value: code,
              label: code === 'default' ? 'Default (any status not listed)' : code
            })),
            helper: 'Default answers every status you have not given a page of its own.'
          },
          {
            id: 'connector',
            kind: 'select',
            api: 'pages[].page.attributes.connector',
            label: 'Connector',
            required: true,
            placeholder: 'Select a connector',
            options: SAMPLE_CONNECTORS,
            helper: 'Where the page content is fetched from.'
          },
          {
            id: 'uri',
            kind: 'text',
            api: 'pages[].page.attributes.uri',
            label: 'Page URI',
            maxLength: 250,
            placeholder: '/404.html',
            helper: 'Path of the page on the connector.'
          },
          {
            id: 'ttl',
            kind: 'number',
            api: 'pages[].page.attributes.ttl',
            label: 'TTL',
            default: 0,
            min: 0,
            helper: 'Seconds the page is cached at the edge.'
          }
        ]
      },
      statusSection('An inactive set is kept but never served.')
    ]
  },

  // ── FIREWALL ──
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
        description: 'A firewall holds the rules a workload is protected by.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'storefront-firewall',
            helper: 'Give a unique and descriptive name to identify your firewall.'
          })
        ]
      },
      {
        id: 'modules',
        title: 'Modules',
        description:
          'What this firewall can do. A module can be switched on later, but a rule cannot be written before its module is enabled.',
        fields: [
          {
            id: 'moduleFunctions',
            kind: 'switch',
            api: 'modules.functions.enabled',
            label: 'Functions',
            description: 'Run edge functions as a firewall rule behaviour.',
            default: true
          },
          {
            id: 'moduleNetworkProtection',
            kind: 'switch',
            api: 'modules.network_protection.enabled',
            label: 'Network protection',
            description: 'Match traffic against network lists: IP ranges, ASNs and countries.',
            default: true
          },
          {
            id: 'moduleWaf',
            kind: 'switch',
            api: 'modules.waf.enabled',
            label: 'WAF',
            description: 'Score requests against the Web Application Firewall rule sets.',
            default: true
          }
        ]
      },
      {
        id: 'debug',
        title: 'Debug rules',
        description:
          'Writes the matched rule of every request to Data Stream, so a rule can be traced end to end.',
        advanced: true,
        fields: [
          {
            id: 'debug',
            kind: 'switch',
            api: 'debug',
            label: 'Debug rules',
            description: 'Adds the matched rule id to the request log.',
            default: false
          }
        ]
      },
      statusSection('An inactive firewall stops evaluating rules.')
    ]
  },

  // ── WAF RULES ──
  //
  // The engine is `score`, version `2021-Q3` — both single-valued enums today, so
  // neither is a field. What the reader actually configures is the API's `thresholds[]`
  // array, and that array is a LIST OF THE FAMILIES BEING SCORED: a family with no entry
  // in it is not inspected at all, and an entry carries the sensitivity it is judged at.
  // So the row is two decisions in that order — whether this family is scored, and then
  // how hard — which is exactly the `switch-select` shape. A sensitivity on a family the
  // set does not inspect would be an answer to a question the API never asked.
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
          'A rule set is scored by the 2021-Q3 engine. Attach it to a firewall to put it in the path of traffic.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'storefront-waf',
            helper: 'Give a unique and descriptive name to identify your rule set.'
          })
        ]
      },
      {
        id: 'thresholds',
        title: 'Threats',
        description:
          'One decision per family: whether the set inspects for it, and how hard it is judged. Higher sensitivity catches more and produces more false positives. Start at medium and tune from the events.',
        fields: WAF_THREATS.map(([value, label]) => ({
          id: `threat_${value}`,
          kind: 'switch-select',
          api: `engine_settings.attributes.thresholds[] { threat: ${value}, sensitivity }`,
          label,
          valueLabel: 'Sensitivity',
          options: SENSITIVITY_OPTIONS,
          default: { active: true, value: 'medium' }
        }))
      },
      statusSection('An inactive rule set stops scoring, and the firewalls using it stop matching.')
    ]
  },

  // ── CERTIFICATE MANAGER ──
  //
  // Almost every property on this endpoint is `readOnly` — issuer, subject names,
  // validity, status, CSR, authority, key algorithm are all parsed OUT of the PEM. So
  // the form is the four writable ones, and the page says as much.
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
      'Upload a certificate you already hold. Azion reads the issuer, subject names and validity from the PEM.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'How the certificate is identified in this workspace.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'mydomain.com wildcard',
            helper: 'Give a unique and descriptive name to identify your certificate.'
          }),
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            default: 'certificate',
            options: [
              {
                value: 'certificate',
                label: 'Server certificate',
                description: 'Served to clients on the domains it covers.'
              },
              {
                value: 'trusted_ca_certificate',
                label: 'Trusted CA certificate',
                description:
                  'Used to verify client certificates when a workload requires mutual TLS.'
              }
            ]
          }
        ]
      },
      {
        id: 'pem',
        title: 'Certificate',
        description:
          'PEM format. Include the full chain, leaf first. A missing intermediate is the usual cause of a handshake that works in one client and fails in another.',
        fields: [
          {
            id: 'certificate',
            kind: 'code',
            api: 'certificate',
            label: 'Certificate',
            required: true,
            placeholder: '-----BEGIN CERTIFICATE-----',
            helper: 'The leaf certificate followed by every intermediate.'
          },
          {
            id: 'privateKey',
            kind: 'code',
            api: 'private_key',
            label: 'Private key',
            required: true,
            placeholder: '-----BEGIN PRIVATE KEY-----',
            helper: 'Never leaves the platform once stored, and cannot be read back.',
            visible: (form) => form.type === 'certificate'
          }
        ]
      },
      statusSection('An inactive certificate is kept but never served.')
    ]
  },

  // ── NETWORK LISTS ──
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
          'A list holds one kind of entry. The type cannot be changed after creation, because the entries are validated against it.',
        fields: [
          nameField({
            max: 250,
            placeholder: 'office-ranges',
            helper: 'Give a unique and descriptive name to identify your list.'
          }),
          {
            id: 'type',
            kind: 'radio',
            api: 'type',
            default: 'ip_cidr',
            options: [
              {
                value: 'ip_cidr',
                label: 'IP / CIDR',
                description: 'IPv4 or IPv6 addresses and ranges.'
              },
              {
                value: 'asn',
                label: 'ASN',
                description: 'Autonomous system numbers.'
              },
              {
                value: 'countries',
                label: 'Countries',
                description: 'ISO 3166-1 alpha-2 country codes.'
              }
            ]
          }
        ]
      },
      {
        id: 'items',
        title: 'Entries',
        description: 'One per line. Paste a list and it is split for you.',
        fields: [
          {
            id: 'items',
            kind: 'list',
            api: 'items',
            label: 'Entries',
            required: true,
            placeholder: '192.168.0.0/24',
            helper: 'One entry per line, in the format the type above expects.'
          }
        ]
      },
      statusSection('An inactive list stops matching in every rule that references it.')
    ]
  },

  // ── DATA STREAM ──
  //
  // The endpoint is `inputs` → `transform` → `outputs`. `inputs[].type` is
  // `enum(raw_logs)` and the transform is optional, so what the reader is really
  // choosing is the DESTINATION — and each of the eleven destinations takes its own
  // attributes. They live here as one section whose fields are guarded by `visible`, so
  // the page asks for exactly the endpoint chosen and nothing else.
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
      'Ship raw edge logs to your own platform, as they happen. One stream, one destination.',
    sections: [
      {
        id: 'general',
        title: 'General',
        description: 'The source is raw logs: one record per request the edge answered.',
        fields: [
          nameField({
            max: 100,
            placeholder: 'edge-logs-to-s3',
            helper: 'Give a unique and descriptive name to identify your stream.'
          })
        ]
      },
      {
        id: 'destination',
        title: 'Destination',
        description:
          'Where the records go. Credentials are stored encrypted and cannot be read back.',
        fields: [
          {
            id: 'outputType',
            kind: 'select',
            api: 'outputs[].type',
            label: 'Endpoint type',
            required: true,
            default: 'standard',
            options: [
              { value: 'standard', label: 'Standard HTTP POST' },
              { value: 's3', label: 'Amazon S3' },
              { value: 'kafka', label: 'Apache Kafka' },
              { value: 'big_query', label: 'Google BigQuery' },
              { value: 'elasticsearch', label: 'Elasticsearch' },
              { value: 'splunk', label: 'Splunk' },
              { value: 'aws_kinesis_firehose', label: 'AWS Kinesis Data Firehose' },
              { value: 'datadog', label: 'Datadog' },
              { value: 'qradar', label: 'IBM QRadar' },
              { value: 'azure_monitor', label: 'Azure Monitor' },
              { value: 'azure_blob_storage', label: 'Azure Blob Storage' }
            ]
          },
          // standard | elasticsearch | splunk | datadog | qradar — all URL-first.
          {
            id: 'url',
            kind: 'text',
            api: 'outputs[].attributes.url',
            label: 'Endpoint URL',
            required: true,
            placeholder: 'https://logs.mydomain.com/ingest',
            visible: (form) =>
              ['standard', 'elasticsearch', 'splunk', 'datadog', 'qradar'].includes(form.outputType)
          },
          {
            id: 'apiKey',
            kind: 'text',
            api: 'outputs[].attributes.api_key',
            label: 'API key',
            required: true,
            maxLength: 255,
            visible: (form) => ['elasticsearch', 'splunk', 'datadog'].includes(form.outputType)
          },
          {
            id: 'logLineSeparator',
            kind: 'text',
            api: 'outputs[].attributes.log_line_separator',
            label: 'Log line separator',
            maxLength: 100,
            placeholder: '\\n',
            helper: 'Written between records in one payload.',
            visible: (form) => form.outputType === 'standard'
          },
          {
            id: 'payloadFormat',
            kind: 'text',
            api: 'outputs[].attributes.payload_format',
            label: 'Payload format',
            maxLength: 250,
            placeholder: '$dataset',
            helper: 'The envelope each batch is wrapped in.',
            visible: (form) => form.outputType === 'standard'
          },
          // s3 | aws_kinesis_firehose
          {
            id: 'accessKey',
            kind: 'text',
            api: 'outputs[].attributes.access_key',
            label: 'Access key',
            required: true,
            maxLength: 150,
            visible: (form) => ['s3', 'aws_kinesis_firehose'].includes(form.outputType)
          },
          {
            id: 'secretKey',
            kind: 'text',
            api: 'outputs[].attributes.secret_key',
            label: 'Secret key',
            required: true,
            maxLength: 150,
            visible: (form) => ['s3', 'aws_kinesis_firehose'].includes(form.outputType)
          },
          {
            id: 'region',
            kind: 'text',
            api: 'outputs[].attributes.region',
            label: 'Region',
            required: true,
            maxLength: 50,
            placeholder: 'us-east-1',
            visible: (form) => ['s3', 'aws_kinesis_firehose'].includes(form.outputType)
          },
          {
            id: 'bucketName',
            kind: 'text',
            api: 'outputs[].attributes.bucket_name',
            label: 'Bucket name',
            required: true,
            maxLength: 150,
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'hostUrl',
            kind: 'text',
            api: 'outputs[].attributes.host_url',
            label: 'Host URL',
            required: true,
            maxLength: 200,
            placeholder: 'https://s3.us-east-1.amazonaws.com',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'objectKeyPrefix',
            kind: 'text',
            api: 'outputs[].attributes.object_key_prefix',
            label: 'Object key prefix',
            maxLength: 150,
            placeholder: 'edge-logs/',
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'contentType',
            kind: 'select',
            api: 'outputs[].attributes.content_type',
            label: 'Content type',
            required: true,
            default: 'plain/text',
            options: [
              { value: 'plain/text', label: 'plain/text' },
              { value: 'application/gzip', label: 'application/gzip' }
            ],
            visible: (form) => form.outputType === 's3'
          },
          {
            id: 'streamName',
            kind: 'text',
            api: 'outputs[].attributes.stream_name',
            label: 'Stream name',
            required: true,
            maxLength: 64,
            visible: (form) => form.outputType === 'aws_kinesis_firehose'
          },
          // kafka
          {
            id: 'bootstrapServers',
            kind: 'text',
            api: 'outputs[].attributes.bootstrap_servers',
            label: 'Bootstrap servers',
            required: true,
            maxLength: 150,
            placeholder: 'kafka-1:9092,kafka-2:9092',
            visible: (form) => form.outputType === 'kafka'
          },
          {
            id: 'kafkaTopic',
            kind: 'text',
            api: 'outputs[].attributes.kafka_topic',
            label: 'Topic',
            required: true,
            maxLength: 150,
            visible: (form) => form.outputType === 'kafka'
          },
          {
            id: 'useTls',
            kind: 'switch',
            api: 'outputs[].attributes.use_tls',
            label: 'Use TLS',
            description: 'Connect to the brokers over TLS.',
            default: true,
            visible: (form) => form.outputType === 'kafka'
          },
          // big_query
          {
            id: 'projectId',
            kind: 'text',
            api: 'outputs[].attributes.project_id',
            label: 'Project ID',
            required: true,
            maxLength: 100,
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'datasetId',
            kind: 'text',
            api: 'outputs[].attributes.dataset_id',
            label: 'Dataset ID',
            required: true,
            maxLength: 1024,
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'tableId',
            kind: 'text',
            api: 'outputs[].attributes.table_id',
            label: 'Table ID',
            required: true,
            maxLength: 1024,
            visible: (form) => form.outputType === 'big_query'
          },
          {
            id: 'serviceAccountKey',
            kind: 'code',
            api: 'outputs[].attributes.service_account_key',
            label: 'Service account key',
            required: true,
            placeholder: '{ "type": "service_account", … }',
            helper: 'The JSON key of a service account with write access to the table.',
            visible: (form) => form.outputType === 'big_query'
          },
          // azure_monitor
          {
            id: 'workspaceId',
            kind: 'text',
            api: 'outputs[].attributes.workspace_id',
            label: 'Workspace ID',
            required: true,
            maxLength: 150,
            visible: (form) => form.outputType === 'azure_monitor'
          },
          {
            id: 'sharedKey',
            kind: 'text',
            api: 'outputs[].attributes.shared_key',
            label: 'Shared key',
            required: true,
            maxLength: 150,
            visible: (form) => form.outputType === 'azure_monitor'
          },
          {
            id: 'logType',
            kind: 'text',
            api: 'outputs[].attributes.log_type',
            label: 'Log type',
            required: true,
            maxLength: 100,
            visible: (form) => form.outputType === 'azure_monitor'
          },
          // azure_blob_storage
          {
            id: 'storageAccount',
            kind: 'text',
            api: 'outputs[].attributes.storage_account',
            label: 'Storage account',
            required: true,
            maxLength: 100,
            visible: (form) => form.outputType === 'azure_blob_storage'
          },
          {
            id: 'containerName',
            kind: 'text',
            api: 'outputs[].attributes.container_name',
            label: 'Container name',
            required: true,
            maxLength: 150,
            visible: (form) => form.outputType === 'azure_blob_storage'
          },
          {
            id: 'blobSasToken',
            kind: 'text',
            api: 'outputs[].attributes.blob_sas_token',
            label: 'Blob SAS token',
            required: true,
            maxLength: 250,
            visible: (form) => form.outputType === 'azure_blob_storage'
          }
        ]
      },
      statusSection('An inactive stream stops shipping records and keeps its configuration.')
    ]
  },

  // ── OBJECT STORAGE ──
  //
  // Two properties, both required, and the second one is the whole decision: what the
  // workloads of this workspace may do with the bucket.
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
            placeholder: 'my-assets',
            helper: 'Between 6 and 63 characters. Lowercase letters, numbers and hyphens.',
            pattern: /^[a-z0-9][a-z0-9-]{4,61}[a-z0-9]$/,
            patternHint:
              'Use lowercase letters, numbers and hyphens, starting and ending with a letter or number.'
          })
        ]
      },
      {
        id: 'access',
        title: 'Workloads access',
        description: 'What the workloads of this workspace may do with the objects in the bucket.',
        fields: [
          {
            id: 'workloadsAccess',
            kind: 'radio',
            api: 'workloads_access',
            required: true,
            default: 'read_only',
            options: [
              {
                value: 'read_only',
                label: 'Read only',
                description: 'Workloads can serve objects and cannot change them.'
              },
              {
                value: 'read_write',
                label: 'Read and write',
                description:
                  'Workloads can serve objects and write new ones, such as uploads from a function.'
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

/** Lookup by route param. */
export const createResource = (id) => createResources.find((resource) => resource.id === id)

/**
 * The route a resource's create page lives at. `<module>/new` is the convention the four
 * hand-written create flows already follow (/workloads/new, /applications/new,
 * /edge-dns/new, /sql-database/new), so the ten new ones read the same — and a reader who
 * knows one create URL can guess the rest.
 */
export const createResourcePath = (id) => `/${id}/new`

/**
 * Where a resource's SETTINGS page lives — the editing twin of the create page, rendered by
 * ../components/ResourceSettings.vue from these same descriptors. `/<module>/<id>/settings`,
 * so it is linkable and reloadable like every other page in the console.
 */
export const resourceSettingsPath = (id, recordId) => `/${id}/${recordId}/settings`

// The sidebar entry a resource's pages highlight. It is the resource id everywhere except
// the two places the sidebar names the module differently — kept here, next to the rest of
// a resource's navigation facts, so no page has to carry its own copy of the exception.
const SIDEBAR_KEYS = { certificates: 'certificate-manager', domains: 'overview' }

/** @param {string} id A `createResources` id. */
export const resourceSidebarKey = (id) => SIDEBAR_KEYS[id] ?? id

/**
 * Every field of a resource, flattened. Sections are a layout fact; validation and the
 * payload both want the fields.
 */
export const resourceFields = (resource) =>
  resource.sections.flatMap((section) => section.fields.map((field) => ({ ...field, section })))

/**
 * The form's opening value, from the API defaults. A field with no `default` opens at the
 * empty value of its kind — `''` for text so the control never renders the string
 * "undefined", `false` for a switch, and the low bound for a number, because InputNumber
 * is numeric all the way down (a cleared field falls back to `min`) and has no empty
 * state to seed. That is also why every numeric field here carries a real default: a
 * nullable number would have nowhere to put the null.
 */
export const createFormSeed = (resource) => {
  const seed = {}
  for (const field of resourceFields(resource)) {
    if (field.default !== undefined) {
      // A COMPOUND default is copied, never handed over. These descriptors are module
      // constants, so seeding a form with the `{ active, value }` literal itself would let
      // the first edit write into the spec that every later page seeds from — the form
      // would open on the previous reader's answers.
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

/**
 * Whether a field (or a section) is being asked for right now. A `visible` guard that
 * hides a field also excuses it from validation — a required Kafka topic is not missing
 * on a stream that ships to S3.
 */
export const isVisible = (node, form) => (node.visible ? node.visible(form) === true : true)
