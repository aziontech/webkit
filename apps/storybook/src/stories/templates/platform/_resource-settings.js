import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import MultiSelect from '@aziontech/webkit/multi-select'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Table from '@aziontech/webkit/table'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { card, compactRow, declare, fieldRow, pageHeading, saveBar, section, wideRow } from './_forms-markup'
import {
  APPLICATION_TABS,
  ENVIRONMENT_CRUMB,
  ENVIRONMENT_CRUMB_COMPONENTS,
  ENVIRONMENT_CRUMB_DECLARATIONS,
  ENVIRONMENT_CRUMB_PARTS,
  ENVIRONMENT_CRUMB_STATE,
  environmentCrumbState,
  FIREWALL_TABS,
  mergeScripts,
  pageScroll,
  pageTabs,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState,
  WORKLOAD_CRUMBS,
  WORKLOAD_TABS
} from './_shell-markup'

const webkitImport = (binding, subpath) => `import ${binding} from '@aziontech/webkit/${subpath}'`

const dotted = (name, root, parts) =>
  Object.fromEntries(parts.map((part) => [`${name}.${part}`, root[part]]))

export const SETTINGS_COMPONENTS = {
  ...SHELL_COMPONENTS,
  ...ENVIRONMENT_CRUMB_COMPONENTS,
  Button,
  CardBox,
  FieldRadioBlock,
  HelperText,
  Hint,
  InputText,
  Item,
  ...dotted('Item', Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Message,
  MultiSelect,
  ...dotted('MultiSelect', MultiSelect, ['Trigger', 'Content', 'Option']),
  Select,
  ...dotted('Select', Select, ['Trigger', 'Content', 'Group', 'Option']),
  Switch,
  TabView,
  ...dotted('TabView', TabView, ['List', 'Item']),
  Table,
  ...dotted('Table', Table, ['Header', 'Body', 'Row', 'HeadCell', 'Cell']),
  Tag,
  Textarea,
  Tooltip
}

const SAVE_LINES = (validate = '') => [
  'const save = () => {',
  ...(validate ? [`  if (!${validate}()) return`] : []),
  '  saving.value = true',
  '  setTimeout(() => {',
  '    baseline.value = JSON.stringify(form)',
  '    saving.value = false',
  '  }, 900)',
  '}',
  '',
  'const discard = () => Object.assign(form, JSON.parse(baseline.value))'
]

const savedForm = (record, { edits = {}, saving = false } = {}) => {
  const form = reactive({ ...structuredClone(record), ...structuredClone(edits) })
  const busy = ref(saving)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  return { form, saving: busy, baseline, dirty }
}

const APPLICATION_RECORD = {
  name: 'edgeflow-site',
  active: true,
  modules: {
    application_accelerator: true,
    cache: true,
    device_detection: false,
    functions: true,
    image_processor: false,
    load_balancer: false,
    web_socket_proxy: false
  }
}

const DEFAULT_MODULES = [
  {
    key: 'application_accelerator',
    title: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.'
  },
  { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
  {
    key: 'device_detection',
    title: 'Device Detection',
    description: 'Activate DeviceAtlas variables to configure responsive rules.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build ultra-low latency functions that run on Azion.'
  },
  {
    key: 'image_processor',
    title: 'Image Processor',
    description: 'Enable dynamic image editing options.'
  },
  {
    key: 'load_balancer',
    title: 'Load Balancer',
    description:
      'Balance traffic to your origins ensuring reliability and network congestion control.'
  }
]

const SUBSCRIPTION_MODULES = [
  {
    key: 'web_socket_proxy',
    title: 'WebSocket Proxy',
    description:
      'Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.'
  }
]

const CONTACT_SALES_LINK = `<a
  href="https://www.azion.com/en/contact-sales/"
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
>
  Contact sales
  <i class="pi pi-external-link shrink-0 text-body-sm leading-none" aria-hidden="true" />
</a>`

const APPLICATION_GENERAL = card([
  `<Item size="small">
  <Item.Content>
    <Item.Title>Name</Item.Title>
    <Item.Description>
      A unique and descriptive name to identify the application.
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
    <InputText v-model="form.name" size="large" :disabled="saving" class="w-full" aria-label="Name" />
  </Item.Actions>
</Item>`,
  `<Item size="small">
  <Item.Content>
    <Item.Title>Active</Item.Title>
    <Item.Description>
      When disabled, the application stops serving traffic.
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="form.active" aria-label="Active" :disabled="saving" />
  </Item.Actions>
</Item>`
])

const APPLICATION_MODULE_ROWS = card([
  `<Item v-for="mod in defaultModules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>{{ mod.description }}</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="form.modules[mod.key]" :aria-label="mod.title" :disabled="saving" />
  </Item.Actions>
</Item>`
])

const APPLICATION_SUBSCRIPTION_ROWS = card([
  `<Item v-for="mod in subscriptionModules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>
      {{ mod.description }}
${indent(CONTACT_SALES_LINK, 3)}
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Tooltip text="Contact sales to activate this module.">
      <Switch v-model="form.modules[mod.key]" disabled :aria-label="mod.title" />
    </Tooltip>
  </Item.Actions>
</Item>`
])

const APPLICATION_COLUMN = `<div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(pageHeading({ title: 'Settings', description: 'Core configuration for this application.' }))}

  <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0" :disabled="saving">
    <legend class="sr-only">Main settings</legend>

${indent(
  [
    section({
      title: 'General',
      hint: 'How this application is identified across the console, and whether it is serving traffic.',
      anchor: true,
      body: APPLICATION_GENERAL
    }),
    section({
      title: 'Modules',
      hint: 'The capabilities this application runs with, each of which can be toggled here.',
      anchor: true,
      body: APPLICATION_MODULE_ROWS
    }),
    section({
      title: 'Subscription modules',
      hint: 'Paid add-ons that are activated with sales, not from this page.',
      anchor: true,
      body: APPLICATION_SUBSCRIPTION_ROWS
    })
  ].join('\n\n'),
  2
)}
  </fieldset>
</div>`

const tabbedMain = (actions, panel) => `<main class="flex h-full flex-col">
${indent(pageTabs(actions))}

${indent(panel)}
</main>`

export const APPLICATION_SETTINGS = {
  active: 'applications',
  breadcrumb: [{ label: 'Applications', href: '/applications' }, { label: APPLICATION_RECORD.name }],
  tabs: APPLICATION_TABS,
  tab: 'main-settings',
  record: APPLICATION_RECORD,
  data: { defaultModules: DEFAULT_MODULES, subscriptionModules: SUBSCRIPTION_MODULES },
  parts: [
    ['CardBox', 'card-box'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Switch', 'switch']
  ],
  main: (bar) =>
    tabbedMain(
      '',
      `<div class="relative flex min-h-0 flex-1 flex-col">
  <section class="min-h-0 flex-1 overflow-auto">
    <div class="flex min-h-full flex-col">
      <form class="flex min-h-full flex-col" aria-label="Main settings" novalidate @submit.prevent="save">
${indent(APPLICATION_COLUMN, 4)}

${indent(
  saveBar({
    label: 'Application settings changed.',
    hint: 'Saving publishes them on the next deployment.',
    bound: true,
    ...bar
  }),
  4
)}
      </form>
    </div>
  </section>
</div>`
    )
}

const PORT_LABELS = {
  80: '80 (Default)',
  443: '443 (Default)'
}

const HTTP_PORT_OPTIONS = [80, 8008, 8080, 8880].map((value) => ({
  value,
  label: PORT_LABELS[value] ?? String(value)
}))

const HTTPS_PORT_OPTIONS = [443, 8443, 9440, 9441, 9442, 9443, 7777, 8888, 9553, 9653, 8035, 8090].map(
  (value) => ({ value, label: PORT_LABELS[value] ?? String(value) })
)

const HTTP3_PORT_OPTIONS = [443, 7777, 8035, 8090, 8443, 8888, 9440, 9441, 9442, 9443, 9553, 9653].map(
  (value) => ({ value, label: PORT_LABELS[value] ?? String(value) })
)

const TLS_VERSION_OPTIONS = [
  { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
  { value: 'tls_1_2', label: 'TLS v1.2' },
  { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
  { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
]

const CIPHER_SUITE_OPTIONS = [
  { value: 7, label: 'Modern v2025Q1' },
  { value: 6, label: 'Compatible v2025Q1' },
  { value: 5, label: 'Legacy v2025Q1' },
  { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
  { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
  { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
  { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
]

const MTLS_MODE_OPTIONS = [
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
      'Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can’t be validated. Check which certificate attempted the request in Firewall.'
  }
]

const TRUSTED_CA_OPTIONS = [
  { value: 'cert-8804', label: 'legacy origin CA' },
  { value: 'cert-8806', label: 'partner mTLS CA' }
]

const REVOCATION_LIST_OPTIONS = [{ value: 'cert-8807', label: 'partner revocation list' }]

const LINKED_ENVIRONMENTS = [
  {
    name: 'Production',
    policy: 'Single',
    settingsId: 's1',
    auto: true,
    options: [
      { value: 'azion-default', label: 'Azion Default' },
      { value: 's1', label: 'magalu-storefront' },
      { value: 's2', label: 'azion-storefront' }
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

const WORKLOAD_NAME = WORKLOAD_CRUMBS[WORKLOAD_CRUMBS.length - 1].label

const WORKLOAD_DOMAINS = [
  {
    id: 'generated',
    domain: 'w1020655.azion.run',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Azion (free)',
    generated: true
  },
  {
    id: 'd-7731',
    domain: 'www.edgeflow.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'edgeflow.com wildcard',
    generated: false
  }
]

const WORKLOAD_RECORD = {
  name: WORKLOAD_NAME,
  active: true,
  deploymentSettings: {},
  protocols: {
    httpPorts: [80],
    useHttps: true,
    httpsPorts: [443],
    useHttp3: false,
    http3Ports: [443],
    minimumTlsVersion: 'tls_1_3',
    cipherSuite: 7
  },
  mtls: { enabled: false, mode: 'enforce', certificate: '', crl: [] }
}

const DOMAIN_COLUMN = "{ flex: '2 1 0' }"
const ENVIRONMENT_COLUMN = "{ flex: '0 0 136px' }"
const POLICY_COLUMN = "{ flex: '0 0 104px' }"
const CERTIFICATE_COLUMN = "{ flex: '0 0 200px' }"

const ROW_ACTIONS = `<Dropdown v-if="!entry.generated" placement="bottom-end">
  <Dropdown.Trigger>
    <Tooltip text="Row actions">
      <IconButton
        icon="pi pi-ellipsis-h"
        kind="outlined"
        size="small"
        :disabled="saving"
        :aria-label="\`Actions for \${entry.domain}\`"
      />
    </Tooltip>
  </Dropdown.Trigger>
  <Dropdown.Group>
    <Dropdown.Option value="edit" label="Edit">
      <template #left><i class="pi pi-pencil" aria-hidden="true" /></template>
    </Dropdown.Option>
  </Dropdown.Group>
  <Dropdown.Group>
    <Dropdown.Option value="delete" label="Delete">
      <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
    </Dropdown.Option>
  </Dropdown.Group>
</Dropdown>`

const DOMAINS_TABLE = `<CardBox :padded="false">
  <template #content>
    <div class="flex min-w-0 flex-col">
      <Table :border="false">
        <Table.Header>
          <Table.Row>
            <Table.HeadCell principal :style="${DOMAIN_COLUMN}">Domain</Table.HeadCell>
            <Table.HeadCell :style="${ENVIRONMENT_COLUMN}">Environment</Table.HeadCell>
            <Table.HeadCell :style="${POLICY_COLUMN}">Policy</Table.HeadCell>
            <Table.HeadCell :style="${CERTIFICATE_COLUMN}">Certificate</Table.HeadCell>
            <Table.HeadCell kind="action" />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row v-for="entry in domains" :key="entry.id">
            <Table.Cell principal :style="${DOMAIN_COLUMN}">{{ entry.domain }}</Table.Cell>
            <Table.Cell :style="${ENVIRONMENT_COLUMN}">
              <Tag
                v-if="entry.environment"
                severity="secondary"
                size="medium"
                rounded
                icon="ai ai-layers"
                :label="entry.environment"
              />
            </Table.Cell>
            <Table.Cell :style="${POLICY_COLUMN}">
              <Tag v-if="entry.environment" severity="secondary" size="medium" rounded :label="entry.policy" />
            </Table.Cell>
            <Table.Cell :style="${CERTIFICATE_COLUMN}">
              <Tag severity="secondary" size="medium" rounded icon="pi pi-verified" :label="entry.certificate" />
            </Table.Cell>
            <Table.Cell kind="action">
${indent(ROW_ACTIONS, 7)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <div class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)">
        <span class="text-body-xs text-(--text-muted)">{{ domains.length }} {{ domains.length === 1 ? 'domain' : 'domains' }}</span>
        <Button type="button" label="Add Domain" kind="outlined" size="medium" icon="pi pi-plus" :disabled="saving" />
      </div>
    </div>
  </template>
</CardBox>`

const multiSelect = ({ model, placeholder, ariaLabel, options }) => `<MultiSelect
  v-model="${model}"
  size="large"
  class="w-full"
  placeholder="${placeholder}"
  :disabled="saving"
  :display-value="portsLabel"
>
  <MultiSelect.Trigger aria-label="${ariaLabel}" />
  <MultiSelect.Content>
    <MultiSelect.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`

const select = ({ model, ariaLabel, options, displayValue, placeholder = '' }) => `<Select
  v-model="${model}"
  size="large"
  class="w-full"${placeholder ? `\n  placeholder="${placeholder}"` : ''}
  :disabled="saving"
  :display-value="${displayValue}"
>
  <Select.Trigger class="w-full" aria-label="${ariaLabel}" />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const portsRow = ({ when, key, title, text, model, placeholder, ariaLabel, options, required }) =>
  fieldRow(title, text, multiSelect({ model, placeholder, ariaLabel, options }), {
    attrs: `${when ? ` v-if="${when}"` : ''}${key ? ` key="${key}"` : ''}`,
    messageWhen: `!${model}.length`,
    messageId: `${key || 'http-ports'}-message`,
    messageKind: "'required'",
    messageText: `'${required}'`
  })

const DEPLOYMENT_SETTINGS = `<div class="flex min-w-0 flex-col gap-(--spacing-md)">
  <Message severity="info" size="small" action-label="Manage Deployment Settings">
    Deployment Settings centralize the applications, firewalls and custom pages that
    environments share. Every environment a domain answers in is linked to one
    automatically, matching that environment’s deployment policy.
  </Message>

  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item v-for="environment in linkedEnvironments" :key="environment.name" size="small" class="items-start">
          <Item.Content>
            <Item.Title>{{ environment.name }}</Item.Title>
            <Item.Description>
              <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                <Tag severity="info" size="small" :label="environment.policy" />
                <Tag
                  v-if="environment.auto && !form.deploymentSettings[environment.name]"
                  severity="secondary"
                  size="small"
                  label="Linked automatically"
                />
                <span class="text-body-xs text-(--text-muted)">Only {{ environment.policy }} Deployment Settings can be linked to this environment.</span>
              </span>
            </Item.Description>
          </Item.Content>
          <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <Select
                :model-value="form.deploymentSettings[environment.name] ?? environment.settingsId"
                size="large"
                class="w-full"
                placeholder="Select a Deployment Setting"
                :disabled="saving"
                :display-value="settingName"
                @update:model-value="form.deploymentSettings[environment.name] = $event"
              >
                <Select.Trigger class="w-full" :aria-label="\`Deployment Settings for \${environment.name}\`" />
                <Select.Content>
                  <Select.Option v-for="option in environment.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</div>`

const PROTOCOL_SETTINGS = card([
  portsRow({
    title: 'HTTP Ports',
    text: 'The ports this workload answers plain HTTP on.',
    model: 'form.protocols.httpPorts',
    placeholder: 'Select an HTTP port',
    ariaLabel: 'HTTP Ports',
    options: 'httpPortOptions',
    required: 'Select at least one HTTP port.'
  }),
  compactRow(
    'HTTPS support',
    'Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication.',
    '<Switch :model-value="form.protocols.useHttps" aria-label="HTTPS support" :disabled="saving" @update:model-value="setHttps" />'
  ),
  portsRow({
    when: 'form.protocols.useHttps',
    key: 'https-ports',
    title: 'HTTPS Ports',
    text: 'The ports this workload answers TLS traffic on.',
    model: 'form.protocols.httpsPorts',
    placeholder: 'Select an HTTPS port',
    ariaLabel: 'HTTPS Ports',
    options: 'httpsPortOptions',
    required: 'Select at least one HTTPS port.'
  }),
  compactRow(
    'HTTP/3 support',
    'Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it.',
    '<Switch :model-value="form.protocols.useHttp3" aria-label="HTTP/3 support" :disabled="saving" @update:model-value="setHttp3" />'
  ),
  portsRow({
    when: 'form.protocols.useHttp3',
    key: 'http3-ports',
    title: 'HTTP/3 Ports',
    text: 'The ports QUIC is answered on.',
    model: 'form.protocols.http3Ports',
    placeholder: 'Select an HTTP/3 port',
    ariaLabel: 'HTTP/3 Ports',
    options: 'http3PortOptions',
    required: 'Select at least one HTTP/3 port.'
  }),
  fieldRow(
    'Minimum TLS version',
    'The oldest TLS version a client may negotiate with.',
    select({
      model: 'form.protocols.minimumTlsVersion',
      ariaLabel: 'Minimum TLS version',
      options: 'tlsVersionOptions',
      displayValue: 'tlsVersionLabel'
    }),
    { attrs: ' v-if="secure" key="tls-version"' }
  ),
  fieldRow(
    'Cipher suite',
    'The set of ciphers offered during the handshake.',
    select({
      model: 'form.protocols.cipherSuite',
      ariaLabel: 'Cipher suite',
      options: 'cipherSuiteOptions',
      displayValue: 'cipherSuiteLabel'
    }),
    { attrs: ' v-if="secure" key="cipher-suite"' }
  )
])

const MUTUAL_AUTH = card([
  `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>Mutual Authentication</Item.Title>
    <Item.Description>Require the client to present a certificate the workload can verify, as well as presenting its own.</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch
      v-model="form.mtls.enabled"
      aria-label="Mutual Authentication"
      :disabled="saving || !form.protocols.useHttps"
    />
  </Item.Actions>
</Item>`,
  wideRow(
    'Mode',
    'What happens when the client certificate cannot be validated against the Trusted CA.',
    `<div role="radiogroup" aria-label="Mutual Authentication mode" class="flex w-full flex-col gap-(--spacing-sm)">
  <FieldRadioBlock
    v-for="option in mtlsModeOptions"
    :key="option.value"
    v-model="form.mtls.mode"
    :value="option.value"
    name="mtls-mode"
    :input-id="\`mtls-mode-\${option.value}\`"
    :label="option.label"
    :description="option.description"
    :disabled="saving"
  />
</div>`,
    { attrs: ' v-if="armed" key="mtls-mode"' }
  ),
  fieldRow(
    'Trusted CA Certificate',
    'The authority a client certificate is verified against.',
    select({
      model: 'form.mtls.certificate',
      ariaLabel: 'Trusted CA Certificate',
      options: 'trustedCaOptions',
      displayValue: 'certificateName',
      placeholder: 'Select a Trusted CA certificate'
    }),
    {
      attrs: ' v-if="armed" key="mtls-certificate"',
      messageWhen: '!form.mtls.certificate',
      messageId: 'mtls-certificate-message',
      messageKind: "'required'",
      messageText: "'Mutual Authentication requires a Trusted CA certificate.'"
    }
  ),
  fieldRow(
    'Certificate Revocation List',
    'Revoked certificates are rejected during the handshake.',
    `<MultiSelect
  v-model="form.mtls.crl"
  size="large"
  class="w-full"
  placeholder="Select a revocation list"
  :disabled="saving"
  :display-value="crlLabel"
>
  <MultiSelect.Trigger aria-label="Certificate Revocation List" />
  <MultiSelect.Content>
    <MultiSelect.Option v-for="option in revocationListOptions" :key="option.value" :value="option.value">
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`,
    { attrs: ' v-if="armed" key="mtls-crl"' }
  )
])

const WORKLOAD_GENERAL = card([
  fieldRow(
    'Name',
    'A unique and descriptive name to identify the workload.',
    '<InputText v-model="form.name" size="large" class="w-full" aria-label="Name" :disabled="saving" />'
  ),
  compactRow(
    'Active',
    'When disabled, the workload stops answering and traffic to its domains is refused. Its deployments are kept.',
    '<Switch v-model="form.active" aria-label="Active" :disabled="saving" />'
  )
])

const WORKLOAD_DANGER = card([
  compactRow(
    'Delete this workload',
    'Once deleted, the workload and its deployments cannot be recovered.',
    '<Button type="button" label="Delete Workload" kind="danger" size="medium" icon="pi pi-trash" />'
  )
])

const WORKLOAD_COLUMN = `<div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(pageHeading({ title: 'Settings', description: 'Manage this workload’s configuration.' }))}

  <form class="mt-(--layout-section-gap) flex min-w-0 flex-col" aria-label="Workload settings" novalidate @submit.prevent="save">
    <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0" :disabled="saving">
      <legend class="sr-only">Workload settings</legend>

${indent(
  [
    section({
      title: 'General',
      hint: 'How this workload is identified across the console, and whether it answers at all.',
      anchor: true,
      body: WORKLOAD_GENERAL
    }),
    section({
      title: 'Domains',
      hint: 'The addresses this workload answers on, the environment each one answers in, and the certificate it is served with.',
      anchor: true,
      body: DOMAINS_TABLE
    }),
    section({
      title: 'Advanced Settings',
      hint: 'Deployment Settings, protocols and mutual authentication, which most workloads never change.',
      anchor: true,
      collapsible: true,
      open: 'advancedOpen',
      regionId: 'workload-advanced-settings',
      body: `<div class="flex min-w-0 flex-col">
${indent(
  [
    section({
      title: 'Deployment Settings',
      hint: 'Which shared configuration each of this workload’s environments publishes with, linked automatically by deployment policy.',
      anchor: true,
      body: DEPLOYMENT_SETTINGS
    }),
    section({
      title: 'Protocol Settings',
      hint: 'Which protocols and ports this workload answers on, and the TLS floor it accepts.',
      anchor: true,
      body: PROTOCOL_SETTINGS
    }),
    section({
      title: 'Mutual Authentication',
      hint: 'Require the client to present a certificate the workload can verify, as well as presenting its own.',
      anchor: true,
      body: MUTUAL_AUTH
    })
  ].join('\n\n')
)}
</div>`
    }),
    section({
      title: 'Danger Zone',
      hint: 'Actions that cannot be undone.',
      anchor: true,
      body: WORKLOAD_DANGER
    })
  ].join('\n\n'),
  3
)}
    </fieldset>
  </form>
</div>`

const DEPLOY_ACTION =
  '<Button label="Deploy" kind="outlined" size="medium" icon="pi pi-cloud-upload" />'

const WORKLOAD_SCRIPT_LINES = [
  '',
  'const secure = computed(() => form.protocols.useHttps || form.protocols.useHttp3)',
  'const armed = computed(() => form.protocols.useHttps && form.mtls.enabled)',
  '',
  'const optionLabel = (options) => (value) =>',
  "  options.find((option) => option.value === value)?.label ?? String(value ?? '')",
  '',
  'const portsLabel = (values) =>',
  "  values.map((value) => optionLabel([...httpPortOptions, ...httpsPortOptions])(value)).join(', ')",
  'const tlsVersionLabel = optionLabel(tlsVersionOptions)',
  'const cipherSuiteLabel = optionLabel(cipherSuiteOptions)',
  "const certificateName = (value) => (value ? optionLabel(trustedCaOptions)(value) : '')",
  "const crlLabel = (values) => values.map(optionLabel(revocationListOptions)).join(', ')",
  'const settingName = (value) =>',
  '  optionLabel(linkedEnvironments.flatMap((environment) => environment.options))(value)',
  '',
  'const setHttps = (value) => {',
  '  form.protocols.useHttps = value',
  '  if (!value) form.protocols.useHttp3 = false',
  '}',
  '',
  'const setHttp3 = (value) => {',
  '  form.protocols.useHttp3 = value',
  '  if (value) form.protocols.useHttps = true',
  '}'
]

const optionLabel = (options) => (value) =>
  options.find((option) => option.value === value)?.label ?? String(value ?? '')

const workloadState = (form) => ({
  secure: computed(() => form.protocols.useHttps || form.protocols.useHttp3),
  armed: computed(() => form.protocols.useHttps && form.mtls.enabled),
  portsLabel: (values) =>
    values.map((value) => optionLabel([...HTTP_PORT_OPTIONS, ...HTTPS_PORT_OPTIONS])(value)).join(', '),
  tlsVersionLabel: optionLabel(TLS_VERSION_OPTIONS),
  cipherSuiteLabel: optionLabel(CIPHER_SUITE_OPTIONS),
  certificateName: (value) => (value ? optionLabel(TRUSTED_CA_OPTIONS)(value) : ''),
  crlLabel: (values) => values.map(optionLabel(REVOCATION_LIST_OPTIONS)).join(', '),
  settingName: (value) =>
    optionLabel(LINKED_ENVIRONMENTS.flatMap((environment) => environment.options))(value),
  setHttps: (value) => {
    form.protocols.useHttps = value
    if (!value) form.protocols.useHttp3 = false
  },
  setHttp3: (value) => {
    form.protocols.useHttp3 = value
    if (value) form.protocols.useHttps = true
  }
})

export const WORKLOAD_SETTINGS = {
  active: 'workloads',
  crumb: true,
  tabs: WORKLOAD_TABS,
  tab: 'settings',
  record: WORKLOAD_RECORD,
  data: {
    domains: WORKLOAD_DOMAINS,
    linkedEnvironments: LINKED_ENVIRONMENTS,
    httpPortOptions: HTTP_PORT_OPTIONS,
    httpsPortOptions: HTTPS_PORT_OPTIONS,
    http3PortOptions: HTTP3_PORT_OPTIONS,
    tlsVersionOptions: TLS_VERSION_OPTIONS,
    cipherSuiteOptions: CIPHER_SUITE_OPTIONS,
    mtlsModeOptions: MTLS_MODE_OPTIONS,
    trustedCaOptions: TRUSTED_CA_OPTIONS,
    revocationListOptions: REVOCATION_LIST_OPTIONS
  },
  refs: { advancedOpen: false },
  parts: [
    ['CardBox', 'card-box'],
    ['FieldRadioBlock', 'field-radio-block'],
    ['HelperText', 'helper-text'],
    ['Hint', 'hint'],
    ['Item', 'item'],
    ['Message', 'message'],
    ['MultiSelect', 'multi-select'],
    ['Switch', 'switch'],
    ['Table', 'table']
  ],
  lines: WORKLOAD_SCRIPT_LINES,
  extra: workloadState,
  main: (bar) => `<main class="flex h-full flex-col">
${indent(pageTabs(DEPLOY_ACTION))}

  <section class="min-h-0 flex-1 overflow-auto">
    <div>
${indent(WORKLOAD_COLUMN, 3)}
    </div>
  </section>
</main>

${saveBar({ bound: true, ...bar })}`
}

const FIREWALL_MODULE_FIELDS = [
  {
    key: 'ddos',
    title: 'DDoS Protection',
    description: 'Absorbs volumetric attacks at the network layer.',
    locked: true
  },
  {
    key: 'waf',
    title: 'WAF',
    description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
  },
  {
    key: 'network-shield',
    title: 'Network Shield',
    description: 'Blocks traffic by country, ASN or IP range using network lists.'
  },
  {
    key: 'bot-manager',
    title: 'Bot Manager',
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Runs functions inside the firewall, before the request reaches the application.'
  }
]

const FIREWALL_RECORD = {
  name: 'edgeflow-production',
  active: true,
  debugRules: false,
  modules: {
    ddos: true,
    waf: true,
    'network-shield': true,
    'bot-manager': true,
    functions: false
  }
}

const FIREWALL_MODULE_ROWS = compactRow(
  '{{ field.title }}',
  '{{ field.description }}',
  `<Tooltip v-if="field.locked" text="DDoS Protection is always on, on every firewall.">
  <span class="flex">
    <Switch :model-value="true" :aria-label="field.title" disabled />
  </span>
</Tooltip>
<Switch v-else v-model="form.modules[field.key]" :aria-label="field.title" />`,
  { attrs: ' v-for="field in moduleFields" :key="field.key"' }
)

const FIREWALL_HELP = 'https://www.azion.com/en/documentation/products/secure/edge-firewall/'

const firewallPanel = (bar) => `<div class="flex min-w-0 flex-1 flex-col">
  <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col pb-0">
${indent(
  pageHeading({
    title: 'Settings',
    description: 'Core configuration for this firewall.',
    documentation: FIREWALL_HELP
  }),
  2
)}

    <section class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)">
${indent(
  [
    section({
      title: 'General',
      body: card([
        fieldRow(
          'Name',
          'Give a unique and descriptive name to identify this firewall.',
          '<InputText v-model="form.name" size="large" class="w-full" aria-label="Name" autocomplete="off" />'
        ),
        compactRow(
          'Application',
          'The application this firewall runs in front of.',
          '<span class="text-body-md text-(--text-default)">edgeflow-site</span>'
        )
      ])
    }),
    section({
      title: 'Modules',
      hint: 'A module is what makes a rule act: WAF is what a Set WAF Rule Set behavior applies, Functions is what Run Function runs.',
      body: card([FIREWALL_MODULE_ROWS])
    }),
    section({
      title: 'Debug Rules',
      hint: 'Query the logged executions with Data Stream, Real-Time Events, or the Real-Time Events GraphQL API.',
      body: card([
        compactRow(
          'Active',
          'Logs which rules ran for a request, under the Straceback field in Data Stream and Real-Time Events.',
          '<Switch v-model="form.debugRules" aria-label="Debug Rules" />'
        )
      ])
    }),
    section({
      title: 'Status',
      body: card([
        compactRow(
          'Active',
          'An inactive firewall stops evaluating rules.',
          '<Switch v-model="form.active" aria-label="Active" />'
        )
      ])
    })
  ].join('\n\n'),
  3
)}
    </section>
  </div>

${indent(saveBar({ bound: true, ...bar }))}
</div>`

export const FIREWALL_SETTINGS = {
  active: 'firewall',
  breadcrumb: [{ label: 'Firewall', href: '/firewall' }, { label: FIREWALL_RECORD.name }],
  tabs: FIREWALL_TABS,
  tab: 'main-settings',
  record: FIREWALL_RECORD,
  data: { moduleFields: FIREWALL_MODULE_FIELDS },
  parts: [
    ['CardBox', 'card-box'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Switch', 'switch']
  ],
  main: (bar) =>
    tabbedMain(
      '',
      `<section class="min-h-0 flex-1 overflow-auto">
  <div class="flex min-h-full flex-col">
${indent(firewallPanel(bar), 2)}
  </div>
</section>`
    )
}

const NETWORK_LIST_TYPES = [
  {
    value: 'asn',
    label: 'ASN',
    description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
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

const NETWORK_LIST_RECORD = {
  name: 'office-ranges',
  type: 'ip_cidr',
  items: '185.241.208.232\n194.26.192.64\n171.25.193.25 #comment'
}

const specMessage = (id) => ({
  messageWhen: `errors.${id}`,
  messageId: `network-lists-${id}-message`,
  messageKind: `errors.${id}.kind`,
  messageText: `errors.${id}.message`
})

const specState = (id) => `:required="errors.${id}?.kind === 'required'"
:invalid="errors.${id}?.kind === 'invalid'"
:aria-describedby="errors.${id} ? 'network-lists-${id}-message' : undefined"`

const listRow = ({ when, key, label, placeholder, helper }) =>
  wideRow(
    label,
    helper,
    `<Textarea
  v-model="form.items"
  class="w-full"
  :rows="5"
  aria-label="${label}"
  placeholder="${placeholder}"
${indent(specState('items'))}
  :disabled="saving"
  @update:model-value="clear('items')"
/>`,
    { attrs: ` ${when} key="${key}"`, ...specMessage('items') }
  )

const NETWORK_LIST_FIELDS = {
  general: fieldRow(
    'Name',
    'Give a unique and descriptive name to identify the network list.',
    `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  placeholder="office-ranges"
  autocomplete="off"
${indent(specState('name'))}
  :disabled="saving"
  @update:model-value="clear('name')"
/>`,
    { attrs: ' key="name"', ...specMessage('name') }
  ),
  type: wideRow(
    'Type',
    '',
    `<fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
  <legend class="sr-only">Type</legend>
  <FieldRadioBlock
    v-for="option in typeOptions"
    :key="option.value"
    v-model="form.type"
    :value="option.value"
    name="network-lists-type"
    :label="option.label"
    :description="option.description"
    :disabled="saving"
  />
</fieldset>`,
    { attrs: ' key="type"' }
  ),
  items: [
    listRow({
      when: `v-if="form.type === 'asn'"`,
      key: 'items-asn',
      label: 'List',
      placeholder: '13335&#10;53331',
      helper:
        'One ASN per line, such as 13335. Public ASNs run from 1 to 64511, private ones from 64512 to 65535. Duplicate entries are removed.'
    }),
    listRow({
      when: `v-else-if="form.type === 'ip_cidr'"`,
      key: 'items-ip-cidr',
      label: 'List',
      placeholder: '185.241.208.232&#10;194.26.192.64&#10;171.25.193.25 #comment',
      helper:
        'One address or range per line. Add a comment after #, and a date with --LT. Duplicate entries are removed.'
    }),
    listRow({
      when: 'v-else',
      key: 'items-countries',
      label: 'Countries',
      placeholder: 'BR&#10;US',
      helper: 'One or more countries, one two-letter ISO 3166-1 code per line, such as BR.'
    })
  ]
}

const specCard = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
      <TransitionGroup enter-active-class="animate-content-enter motion-reduce:animate-none">
${indent(rows.join('\n'), 4)}
      </TransitionGroup>
    </Item.List>
  </template>
</CardBox>`

const NETWORK_LIST_COLUMN = `<div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
${indent(
  pageHeading({
    title: 'Settings',
    description:
      'Group networks once and reference them from firewall rules, instead of restating a range per rule.'
  })
)}

  <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0" :disabled="saving">
    <legend class="sr-only">network list settings</legend>

${indent(
  [
    section({
      title: 'General',
      hint: 'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in Firewall rules.',
      anchor: true,
      body: specCard([NETWORK_LIST_FIELDS.general])
    }),
    section({
      title: 'List settings',
      hint: 'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.',
      anchor: true,
      body: specCard([NETWORK_LIST_FIELDS.type, ...NETWORK_LIST_FIELDS.items])
    })
  ].join('\n\n'),
  2
)}
  </fieldset>
</div>`

const LIST_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/
const COUNTRY_PATTERN = /^[^\S\n]*[A-Za-z]{2}[^\S\n]*(\n[^\S\n]*[A-Za-z]{2}[^\S\n]*)*$/
const LIST_HINT = 'Remove the empty lines. Every line holds one entry.'
const COUNTRY_HINT = 'Enter one two-letter country code per line. Example: BR.'

const NETWORK_LIST_LINES = [
  '',
  'const errors = reactive({})',
  '',
  `const LIST_PATTERN = ${LIST_PATTERN}`,
  `const COUNTRY_PATTERN = ${COUNTRY_PATTERN}`,
  '',
  'const clear = (id) => {',
  '  if (errors[id]) delete errors[id]',
  '}',
  '',
  'const validate = () => {',
  '  Object.keys(errors).forEach((key) => delete errors[key])',
  '  const name = form.name.trim()',
  '  const items = form.items.trim()',
  "  if (!name) errors.name = { kind: 'required', message: 'This field is required.' }",
  '  else if (name.length > 250)',
  "    errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }",
  "  if (!items) errors.items = { kind: 'required', message: 'This field is required.' }",
  "  else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))",
  `    errors.items = { kind: 'invalid', message: '${COUNTRY_HINT}' }`,
  "  else if (form.type !== 'countries' && !LIST_PATTERN.test(items))",
  `    errors.items = { kind: 'invalid', message: '${LIST_HINT}' }`,
  '  return Object.keys(errors).length === 0',
  '}'
]

const networkListState = (form) => {
  const errors = reactive({})
  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }
  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    const name = form.name.trim()
    const items = form.items.trim()
    if (!name) errors.name = { kind: 'required', message: 'This field is required.' }
    else if (name.length > 250)
      errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }
    if (!items) errors.items = { kind: 'required', message: 'This field is required.' }
    else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))
      errors.items = { kind: 'invalid', message: COUNTRY_HINT }
    else if (form.type !== 'countries' && !LIST_PATTERN.test(items))
      errors.items = { kind: 'invalid', message: LIST_HINT }
    return Object.keys(errors).length === 0
  }
  return { errors, clear, validate }
}

export const NETWORK_LIST_SETTINGS = {
  active: 'network-lists',
  breadcrumb: [
    { label: 'Network Lists', href: '/network-lists' },
    { label: NETWORK_LIST_RECORD.name }
  ],
  record: NETWORK_LIST_RECORD,
  data: { typeOptions: NETWORK_LIST_TYPES },
  parts: [
    ['CardBox', 'card-box'],
    ['FieldRadioBlock', 'field-radio-block'],
    ['HelperText', 'helper-text'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Textarea', 'textarea']
  ],
  vue: ['reactive'],
  lines: NETWORK_LIST_LINES,
  validate: 'validate',
  extra: networkListState,
  main: (bar) => `<form class="flex min-h-full min-w-0 flex-col" aria-label="network list settings" novalidate @submit.prevent="save">
${indent(NETWORK_LIST_COLUMN)}

${indent(saveBar({ bound: true, ...bar }))}
</form>`
}

export const resourceTemplate = (resource, bar = {}) =>
  shell({
    withBreadcrumb: !resource.crumb,
    crumb: resource.crumb ? ENVIRONMENT_CRUMB : '',
    main: pageScroll(resource.main(bar))
  })

const editLiteral = (record, edits) =>
  Object.keys(edits).length
    ? `reactive({ ...structuredClone(record), ${Object.entries(edits)
        .map(([key, value]) => `${key}: ${JSON.stringify(value).replaceAll('"', "'")}`)
        .join(', ')} })`
    : 'reactive(structuredClone(record))'

export const resourceScript = (resource, { edits = {}, saving = false } = {}) => {
  const data = Object.entries(resource.data)
  const refs = Object.entries(resource.refs ?? {})
  return mergeScripts(
    scriptLines({
      parts: [
        'Breadcrumb',
        ...(resource.tabs ? ['TabView'] : []),
        ...(resource.crumb ? ENVIRONMENT_CRUMB_PARTS : [])
      ],
      active: resource.active,
      declarations: resource.crumb
        ? [...ENVIRONMENT_CRUMB_DECLARATIONS, ...(resource.tabs ? ['', declare('tabs', resource.tabs)] : [])]
        : [
            '',
            declare('breadcrumb', resource.breadcrumb),
            ...(resource.tabs ? ['', declare('tabs', resource.tabs)] : [])
          ],
      state: [
        ...(resource.crumb ? ['', ...ENVIRONMENT_CRUMB_STATE] : []),
        ...(resource.tabs ? [`const activeTab = ref('${resource.tab}')`] : []),
        ...refs.map(([name, value]) => `const ${name} = ref(${value})`)
      ]
    }),
    [
      ...resource.parts.map(([binding, subpath]) => webkitImport(binding, subpath)),
      `import { ${['computed', 'reactive', 'ref', ...(resource.vue ?? [])].filter((name, index, all) => all.indexOf(name) === index).sort().join(', ')} } from 'vue'`,
      '',
      ...data.flatMap(([name, value]) => [declare(name, value), '']),
      declare('record', resource.record),
      '',
      `const form = ${editLiteral(resource.record, edits)}`,
      `const saving = ref(${saving})`,
      'const baseline = ref(JSON.stringify(record))',
      'const dirty = computed(() => JSON.stringify(form) !== baseline.value)',
      ...(resource.lines ?? []),
      '',
      ...SAVE_LINES(resource.validate)
    ]
  )
}

export const resourceSetup = (resource, options = {}) => () => {
  const { form, saving, baseline, dirty } = savedForm(resource.record, options)
  const extra = resource.extra ? resource.extra(form) : {}
  const save = () => {
    if (resource.validate && !extra[resource.validate]()) return
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }
  const discard = () => Object.assign(form, JSON.parse(baseline.value))
  return {
    ...shellState(resource.active),
    ...(resource.crumb ? environmentCrumbState() : { breadcrumb: resource.breadcrumb }),
    ...(resource.tabs ? { tabs: resource.tabs, activeTab: ref(resource.tab) } : {}),
    ...resource.data,
    ...Object.fromEntries(
      Object.entries(resource.refs ?? {}).map(([name, value]) => [name, ref(value)])
    ),
    form,
    saving,
    dirty,
    save,
    discard,
    ...extra
  }
}
