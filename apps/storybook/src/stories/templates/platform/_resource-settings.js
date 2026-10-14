import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Hint from '@aziontech/webkit/hint'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import {
  band,
  card,
  collapsibleBand,
  compactRow,
  declare,
  fieldRow,
  saveBar,
  settingsColumn
} from './_forms-markup'
import {
  APPLICATION_TABS,
  FIREWALL_TABS,
  mergeScripts,
  pageScroll,
  scriptLines,
  settingsTab,
  shell,
  SHELL_COMPONENTS,
  shellState,
  WORKLOAD_TABS
} from './_shell-markup'

const webkitImport = (binding, subpath) => `import ${binding} from '@aziontech/webkit/${subpath}'`

export const SETTINGS_COMPONENTS = {
  ...SHELL_COMPONENTS,
  Button,
  CardBox,
  Hint,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Link,
  Switch,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Tag,
  Tooltip
}

const APPLICATION_FORM = {
  name: 'acme-storefront',
  active: true,
  modules: {
    applicationAccelerator: true,
    cache: true,
    deviceDetection: false,
    functions: true,
    imageProcessor: false,
    loadBalancer: false,
    webSocketProxy: false
  }
}

const APPLICATION_MODULES = [
  {
    key: 'applicationAccelerator',
    title: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.'
  },
  { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
  {
    key: 'deviceDetection',
    title: 'Device Detection',
    description: 'Activate DeviceAtlas variables to configure responsive rules.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build ultra-low latency functions that run on Azion.'
  },
  {
    key: 'imageProcessor',
    title: 'Image Processor',
    description: 'Enable dynamic image editing options.'
  },
  {
    key: 'loadBalancer',
    title: 'Load Balancer',
    description:
      'Balance traffic to your origins ensuring reliability and network congestion control.'
  }
]

const APPLICATION_MODULE_ROWS = `<Item v-for="mod in modules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>{{ mod.description }}</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Switch v-model="form.modules[mod.key]" :aria-label="mod.title" />
  </Item.Actions>
</Item>`

const SUBSCRIPTION_ROW = `<Item size="small">
  <Item.Content>
    <Item.Title>WebSocket Proxy</Item.Title>
    <Item.Description>
      Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.
      <Link label="Contact sales" size="small" href="https://www.azion.com/en/contact-sales/" target="_blank" />
    </Item.Description>
  </Item.Content>
  <Item.Actions>
    <Tooltip text="Contact sales to activate this module.">
      <Switch v-model="form.modules.webSocketProxy" disabled aria-label="WebSocket Proxy" />
    </Tooltip>
  </Item.Actions>
</Item>`

const WORKLOAD_FORM = {
  name: 'edgeflow-storefront',
  active: true,
  useHttps: true,
  useHttp3: false
}

const WORKLOAD_DOMAINS = [
  { domain: 'www.edgeflow.com', environment: 'Production', certificate: "Let's Encrypt" },
  { domain: 'staging.edgeflow.com', environment: 'Staging', certificate: 'Azion (SAN)' },
  {
    domain: 'edgeflow-storefront.map.azionedge.net',
    environment: 'Production',
    certificate: 'Azion (SAN)'
  }
]

const WORKLOAD_DOMAIN_ROWS = `<Item v-for="entry in domains" :key="entry.domain" size="small">
  <Item.Content>
    <Item.Title>{{ entry.domain }}</Item.Title>
    <Item.Description>{{ entry.certificate }}</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Tag :label="entry.environment" severity="secondary" size="small" />
  </Item.Actions>
</Item>`

const WORKLOAD_DOMAINS_BAND = `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-heading-xxs text-(--text-default)">Domains</h2>
    <Hint text="The addresses this workload answers on, the environment each one answers in, and the certificate it is served with." />
  </div>
${indent(card([WORKLOAD_DOMAIN_ROWS]))}
  <div class="flex">
    <Button type="button" label="Add Domain" icon="pi pi-plus" kind="outlined" size="medium" />
  </div>
</section>`

const FIREWALL_FORM = {
  name: 'edgeflow-production',
  modules: {
    ddos: true,
    waf: true,
    networkShield: true,
    botManager: true,
    functions: false
  },
  debugRules: false,
  active: true
}

const FIREWALL_MODULES = [
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
    key: 'networkShield',
    title: 'Network Shield',
    description: 'Blocks traffic by country, ASN or IP range using network lists.'
  },
  {
    key: 'botManager',
    title: 'Bot Manager',
    description: 'Scores automated traffic and challenges the requests that fail.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Runs functions inside the firewall, before the request reaches the application.'
  }
]

const FIREWALL_MODULE_ROWS = `<Item v-for="mod in modules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>{{ mod.description }}</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Tooltip v-if="mod.locked" text="DDoS Protection is always on, on every firewall.">
      <span class="flex">
        <Switch :model-value="true" disabled :aria-label="mod.title" />
      </span>
    </Tooltip>
    <Switch v-else v-model="form.modules[mod.key]" :aria-label="mod.title" />
  </Item.Actions>
</Item>`

export const APPLICATION_SETTINGS = {
  active: 'applications',
  breadcrumb: [{ label: 'Applications', href: '/applications' }, { label: APPLICATION_FORM.name }],
  tabs: APPLICATION_TABS,
  tab: 'main-settings',
  label: 'Application settings',
  parts: [
    ['CardBox', 'card-box'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Link', 'link'],
    ['Switch', 'switch'],
    ['Tooltip', 'tooltip']
  ],
  data: { form: APPLICATION_FORM, modules: APPLICATION_MODULES },
  refs: {},
  bar: {
    label: 'Application settings changed.',
    hint: 'Saving publishes them on the next deployment.'
  },
  column: settingsColumn({
    title: 'Settings',
    description: 'Core configuration for this application.',
    legend: 'Application settings',
    bands: [
      band(
        'General',
        'How this application is identified across the console, and whether it is serving traffic.',
        [
          fieldRow(
            'Name',
            'A unique and descriptive name to identify the application.',
            '<InputText v-model="form.name" size="large" aria-label="Name" />'
          ),
          compactRow(
            'Active',
            'When disabled, the application stops serving traffic.',
            '<Switch v-model="form.active" aria-label="Active" />'
          )
        ]
      ),
      band(
        'Modules',
        'The capabilities this application runs with. Every default module can be toggled here, including Cache.',
        [APPLICATION_MODULE_ROWS]
      ),
      band(
        'Subscription modules',
        'Paid add-ons. They cannot be switched on from this page — activating one starts with a conversation with sales.',
        [SUBSCRIPTION_ROW]
      )
    ]
  })
}

export const WORKLOAD_SETTINGS = {
  active: 'workloads',
  breadcrumb: [{ label: 'Workloads', href: '/workloads' }, { label: WORKLOAD_FORM.name }],
  tabs: WORKLOAD_TABS,
  tab: 'settings',
  label: 'Workload settings',
  parts: [
    ['Button', 'button'],
    ['CardBox', 'card-box'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Switch', 'switch'],
    ['Tag', 'tag']
  ],
  data: { form: WORKLOAD_FORM, domains: WORKLOAD_DOMAINS },
  refs: { advancedOpen: false },
  bar: { label: 'You have unsaved changes.' },
  column: settingsColumn({
    title: 'Settings',
    description: "Manage this workload's configuration.",
    legend: 'Workload settings',
    bands: [
      band(
        'General',
        'How this workload is identified across the console, and whether it answers at all.',
        [
          fieldRow(
            'Name',
            'A unique and descriptive name to identify the workload.',
            '<InputText v-model="form.name" size="large" aria-label="Name" />'
          ),
          compactRow(
            'Active',
            'When disabled, the workload stops answering and traffic to its domains is refused. Its deployments are kept.',
            '<Switch v-model="form.active" aria-label="Active" />'
          )
        ]
      ),
      WORKLOAD_DOMAINS_BAND,
      collapsibleBand({
        id: 'workload-advanced-settings',
        title: 'Advanced Settings',
        hint: 'Deployment Settings, protocols and mutual authentication, which most workloads never change.',
        open: 'advancedOpen',
        content: card([
          compactRow(
            'HTTPS support',
            'Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication.',
            '<Switch v-model="form.useHttps" aria-label="HTTPS support" />'
          ),
          compactRow(
            'HTTP/3 support',
            'Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it.',
            '<Switch v-model="form.useHttp3" aria-label="HTTP/3 support" />'
          )
        ])
      }),
      band('Danger Zone', 'Actions that cannot be undone.', [
        compactRow(
          'Delete this workload',
          'Once deleted, the workload and its deployments cannot be recovered.',
          '<Button type="button" label="Delete Workload" kind="danger" size="medium" icon="pi pi-trash" />'
        )
      ])
    ]
  })
}

export const FIREWALL_SETTINGS = {
  active: 'firewall',
  breadcrumb: [{ label: 'Firewall', href: '/firewall' }, { label: FIREWALL_FORM.name }],
  tabs: FIREWALL_TABS,
  tab: 'main-settings',
  label: 'Firewall settings',
  parts: [
    ['CardBox', 'card-box'],
    ['Hint', 'hint'],
    ['InputText', 'input-text'],
    ['Item', 'item'],
    ['Switch', 'switch'],
    ['Tooltip', 'tooltip']
  ],
  data: { form: FIREWALL_FORM, modules: FIREWALL_MODULES },
  refs: {},
  bar: { label: 'You have unsaved changes.' },
  column: settingsColumn({
    title: 'Settings',
    description: 'Core configuration for this firewall.',
    legend: 'Firewall settings',
    bands: [
      band('General', '', [
        fieldRow(
          'Name',
          'Give a unique and descriptive name to identify this firewall.',
          '<InputText v-model="form.name" size="large" aria-label="Name" />'
        ),
        compactRow(
          'Application',
          'The application this firewall runs in front of.',
          '<span class="text-body-md text-(--text-default)">edgeflow-site</span>'
        )
      ]),
      band(
        'Modules',
        'A module is what makes a rule act: WAF is what a Set WAF Rule Set behavior applies, Functions is what Run Function runs.',
        [FIREWALL_MODULE_ROWS]
      ),
      band(
        'Debug Rules',
        'Query the logged executions with Data Stream, Real-Time Events, or the Real-Time Events GraphQL API.',
        [
          compactRow(
            'Active',
            'Logs which rules ran for a request, under the Straceback field in Data Stream and Real-Time Events.',
            '<Switch v-model="form.debugRules" aria-label="Debug Rules" />'
          )
        ]
      ),
      band('Status', '', [
        compactRow(
          'Active',
          'An inactive firewall stops evaluating rules.',
          '<Switch v-model="form.active" aria-label="Active" />'
        )
      ])
    ]
  })
}

export const resourceTemplate = (resource, bar) =>
  shell({
    withBreadcrumb: true,
    main: pageScroll(
      settingsTab({
        ariaLabel: resource.label,
        column: resource.column,
        bar: saveBar({ ...resource.bar, ...bar })
      })
    )
  })

export const resourceScript = (resource) => {
  const [form, ...rest] = Object.entries(resource.data)
  const refs = Object.entries(resource.refs)
  return mergeScripts(
    scriptLines({
      parts: ['Breadcrumb', 'TabView'],
      active: resource.active,
      declarations: [
        '',
        declare('breadcrumb', resource.breadcrumb),
        declare('tabs', resource.tabs)
      ],
      state: [
        `const activeTab = ref('${resource.tab}')`,
        ...refs.map(([name, value]) => `const ${name} = ref(${value})`)
      ]
    }),
    [
      ...resource.parts.map(([binding, subpath]) => webkitImport(binding, subpath)),
      "import { reactive } from 'vue'",
      '',
      declare(form[0], form[1], 'reactive'),
      ...rest.map(([name, value]) => declare(name, value))
    ]
  )
}

export const resourceSetup = (resource) => () => {
  const [form, ...rest] = Object.entries(resource.data)
  return {
    ...shellState(resource.active),
    breadcrumb: resource.breadcrumb,
    tabs: resource.tabs,
    activeTab: ref(resource.tab),
    [form[0]]: reactive(structuredClone(form[1])),
    ...Object.fromEntries(rest),
    ...Object.fromEntries(Object.entries(resource.refs).map(([name, value]) => [name, ref(value)]))
  }
}
