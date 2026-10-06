import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import Flow from '@aziontech/webkit/flow'
import IconButton from '@aziontech/webkit/icon-button'
import Item from '@aziontech/webkit/item'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { DEPLOYMENT_LOGS_COMPONENTS, deploymentLogs } from './_deployment-logs-markup'
import {
  APPLICATION_TABS,
  FIREWALL_TABS,
  mergeScripts,
  pageScroll,
  pageTabs,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState,
  WORKLOAD_TABS
} from './_shell-markup'
import {
  blockScript,
  blockState,
  CLI_APPLICATION,
  CLI_APPLICATION_SUMMARY,
  declare,
  FIREWALL,
  FIREWALL_SUMMARY,
  getStarted,
  SUMMARY_COMPONENTS,
  WORKLOAD,
  WORKLOAD_SUMMARY
} from './_summary-markup'

const overviewColumn = (blocks, sectionEnd = ' pb-(--layout-section-gap)') =>
  `<div class="layout-column layout-boundary flex min-w-0 flex-col">
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)${sectionEnd}">
${indent(blocks.join('\n\n'), 2)}
  </section>
</div>`

const GET_STARTED = getStarted(CLI_APPLICATION.name)

const APPLICATION_MAIN = `<main class="flex h-full flex-col">
${indent(pageTabs())}

  <div class="relative flex min-h-0 flex-1 flex-col">
    <section class="min-h-0 flex-1 overflow-auto">
      <div class="flex min-h-full flex-col">
${indent(overviewColumn([CLI_APPLICATION_SUMMARY.template, GET_STARTED.template]), 4)}
      </div>
    </section>
  </div>
</main>`

const FIREWALL_MAIN = `<main class="flex h-full flex-col">
${indent(pageTabs())}

  <section class="min-h-0 flex-1 overflow-auto">
    <div class="flex min-h-full flex-col">
${indent(overviewColumn([FIREWALL_SUMMARY.template]), 3)}
    </div>
  </section>
</main>`

const PRODUCTION_STEPS = [
  {
    id: 'domain',
    icon: 'pi pi-globe',
    title: 'Add a custom domain',
    description:
      'Serve this workload on a domain of your own, with a free HTTPS certificate, instead of the generated Azion hostname.',
    actionLabel: 'Add Domain',
    done: false
  },
  {
    id: 'firewall',
    icon: 'pi pi-shield',
    title: 'Enable firewall protection',
    description:
      'Bind a firewall so requests are inspected before they reach the application. Rate limiting, WAF rules, and network lists.',
    actionLabel: 'Bind Firewall',
    done: false
  },
  {
    id: 'customPage',
    icon: 'pi pi-file',
    title: 'Set custom error pages',
    description: "Answer 4xx and 5xx with your own page instead of Azion's default response.",
    actionLabel: 'Bind Custom Page',
    done: false
  }
]

const CHECKLIST_TITLE = 'Ship to production'

const CHECKLIST_DESCRIPTION =
  'The create put this workload live on a generated hostname. These are the gates between that and production.'

const CHECKLIST = `<CardBox :padded="false">
  <template #header>
    <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
      <h2 class="truncate text-label-md text-(--text-default)">${CHECKLIST_TITLE}</h2>

      <Tag label="0 of 3" severity="secondary" size="small" class="shrink-0" />
    </div>

    <IconButton
      icon="pi pi-window-maximize"
      aria-label="Expand the production checklist"
      kind="outlined"
      size="small"
      class="shrink-0"
      @click="detailOpen = true"
    />
  </template>

  <template #content>
    <div class="flex flex-col">
      <Item v-for="step in productionSteps" :key="step.id" as-child size="small">
        <button
          type="button"
          :data-done="step.done || null"
          class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <Item.Media>
            <i
              :class="step.icon"
              class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
              aria-hidden="true"
            />
          </Item.Media>

          <Item.Content>
            <Item.Title class="truncate group-data-done/item:text-(--primary) group-data-done/item:line-through">
              {{ step.title }}
            </Item.Title>
          </Item.Content>

          <Item.Actions>
            <i v-if="step.done" class="pi pi-check text-body-sm leading-none text-(--primary)" aria-hidden="true" />
            <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
          </Item.Actions>
        </button>
      </Item>
    </div>
  </template>
</CardBox>

<Drawer v-model:open="detailOpen" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>${CHECKLIST_TITLE}</DrawerTitle>
            <Tag label="0 of 3" severity="secondary" size="small" class="shrink-0" />
          </div>
          <p class="text-body-sm text-(--text-muted)">
            ${CHECKLIST_DESCRIPTION}
          </p>
        </div>
        <DrawerClose />
      </PanelHeader>

      <PanelContent>
        <div class="flex flex-col gap-(--spacing-sm)">
          <Item
            v-for="step in productionSteps"
            :key="step.id"
            size="medium"
            :data-done="step.done || null"
            class="rounded-(--shape-card) border-(--border-muted) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance data-done:border-(--primary) data-done:bg-(--primary-mask) motion-reduce:transition-none"
          >
            <Item.Media>
              <span
                class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                aria-hidden="true"
              >
                <i :class="step.done ? 'pi pi-check' : step.icon" class="text-body-sm leading-none" />
              </span>
            </Item.Media>

            <Item.Content>
              <Item.Title class="group-data-done/item:text-(--primary) group-data-done/item:line-through">
                {{ step.title }}
              </Item.Title>
              <Item.Description class="group-data-done/item:text-(--primary) group-data-done/item:line-through">
                {{ step.description }}
              </Item.Description>
            </Item.Content>

            <Item.Footer>
              <Button :label="step.actionLabel" kind="outlined" size="small" @click="detailOpen = false" />
            </Item.Footer>
          </Item>
        </div>
      </PanelContent>

      <PanelFooter class="justify-end">
        <Button label="Done" kind="primary" size="medium" @click="detailOpen = false" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const FIREWALL_BIND = {
  bindLabel: 'Bind Firewall',
  changeLabel: 'Change Firewall',
  groupLabel: 'Firewalls',
  createLabel: 'Create Firewall',
  boundId: '',
  options: [
    { value: '5540123', label: 'payments-api' },
    { value: '5540119', label: 'api-hardening' },
    { value: '5540124', label: 'partner-gateway' },
    { value: '5540117', label: 'edgeflow-production' },
    { value: '5540127', label: 'edgeflow-canary' }
  ]
}

const CUSTOM_PAGE_BIND = {
  bindLabel: 'Bind Custom Page',
  changeLabel: 'Change Custom Page',
  groupLabel: 'Custom Pages',
  createLabel: 'Create Custom Page',
  boundId: '',
  options: [
    { value: 'cp-4013', label: 'Branded 404' },
    { value: 'cp-4014', label: 'Maintenance window' },
    { value: 'cp-4015', label: 'Server error' },
    { value: 'cp-4016', label: 'Blocked by firewall' },
    { value: 'cp-4017', label: 'Rate limited' }
  ]
}

const CONNECTOR_BIND = {
  bindLabel: 'Bind Connector',
  changeLabel: 'Change Connector',
  groupLabel: 'Connectors',
  createLabel: 'Create Connector',
  boundId: '1599818521',
  options: [
    { value: '7710021', label: 'api-primary' },
    { value: '7710022', label: 'assets-bucket' },
    { value: '7710023', label: 'api-failover' },
    { value: '7710024', label: 'uploads' },
    { value: '7710025', label: 'live-events' }
  ]
}

const TOPOLOGY_LEVELS = [
  {
    key: 'domains',
    nodes: [
      {
        key: 'domains',
        kind: 'Domains',
        icon: 'ai ai-domains',
        name: WORKLOAD.domains[0],
        status: '1 domain',
        severity: 'secondary',
        add: true,
        fields: [
          {
            label: 'Azion domain',
            value: WORKLOAD.domains[0],
            copy: true,
            url: `https://${WORKLOAD.domains[0]}`
          }
        ]
      }
    ]
  },
  {
    key: 'workload',
    nodes: [
      {
        key: 'workload',
        kind: 'Workload',
        icon: 'ai ai-workloads',
        name: WORKLOAD.name,
        status: 'Live',
        severity: 'success',
        href: `/workloads/${WORKLOAD.id}`,
        fields: [
          { label: 'ID', value: WORKLOAD.id },
          {
            label: 'Domain',
            value: WORKLOAD.domains[0],
            copy: true,
            url: `https://${WORKLOAD.domains[0]}`
          },
          { label: 'Environment', value: 'Production' }
        ]
      }
    ]
  },
  {
    key: 'firewall',
    nodes: [
      {
        key: 'firewall',
        kind: 'Firewall',
        icon: 'ai ai-edge-firewall',
        empty: true,
        status: 'Not bound',
        severity: 'secondary',
        dashed: true,
        message: 'Requests reach the application without inspection.',
        bind: FIREWALL_BIND
      }
    ]
  },
  {
    key: 'application',
    nodes: [
      {
        key: 'application',
        kind: 'Application',
        icon: 'ai ai-edge-application',
        name: 'workload-01',
        status: 'Active',
        severity: 'success',
        href: '/applications/1170472732',
        fields: [
          { label: 'ID', value: '1170472732' },
          { label: 'Repository', value: 'gab-az/workload-01' },
          { label: 'Branch', value: 'main' }
        ]
      },
      {
        key: 'customPage',
        kind: 'Custom Page',
        icon: 'ai ai-custom-pages',
        empty: true,
        status: 'Not bound',
        severity: 'secondary',
        dashed: true,
        terminal: true,
        message: "Errors answer with Azion's default page.",
        bind: CUSTOM_PAGE_BIND
      }
    ]
  },
  {
    key: 'connector',
    nodes: [
      {
        key: 'connector',
        kind: 'Connector',
        icon: 'ai ai-edge-connectors',
        name: 'workload-01-storage',
        status: 'Active',
        severity: 'success',
        href: '/connectors/1599818521/settings',
        message:
          'Provisioned with this workload. It is the application’s origin, so it can be re-pointed but not removed.',
        bind: CONNECTOR_BIND,
        fields: [
          { label: 'ID', value: '1599818521' },
          { label: 'Type', value: 'Object Storage' },
          { label: 'Address', value: 'workload-01-assets' }
        ]
      }
    ]
  },
  {
    key: 'storage',
    nodes: [
      {
        key: 'storage',
        kind: 'Storage',
        icon: 'ai ai-edge-storage',
        name: 'workload-01-assets',
        status: 'Public',
        severity: 'info',
        href: '/object-storage/workload-01-assets',
        terminal: true,
        fields: [
          { label: 'Access', value: 'Public' },
          { label: 'Objects', value: '24' },
          { label: 'Size', value: '1.2 MB' }
        ]
      }
    ]
  }
]

const TOPOLOGY_NODE = `<div
  :data-state="openNodes[node.key] ? 'open' : 'closed'"
  :data-dashed="node.dashed || null"
  class="w-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-dashed:border-dashed"
>
  <Flow.Anchor>
    <button
      :id="\`\${node.key}-trigger\`"
      type="button"
      :aria-expanded="Boolean(openNodes[node.key])"
      :aria-controls="\`\${node.key}-body\`"
      :data-state="openNodes[node.key] ? 'open' : 'closed'"
      class="group flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs) text-left outline-none transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
      @click="openNodes[node.key] = !openNodes[node.key]"
    >
      <i :class="node.icon" class="shrink-0 text-body-xs leading-none text-(--text-muted)" aria-hidden="true" />
      <span class="truncate text-label-sm text-(--text-muted)">{{ node.kind }}</span>
      <Tag class="ml-auto shrink-0" :severity="node.severity" :label="node.status" size="small" />
      <i
        class="pi pi-chevron-down shrink-0 text-(--text-muted) transition-transform duration-150 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
  </Flow.Anchor>

  <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
    <span v-if="node.empty" class="min-w-0 truncate text-label-sm text-(--text-default)">—</span>
    <Tooltip
      v-else
      :text="node.href ? \`Open \${node.name} in \${node.kind}\` : ''"
      :disabled="!node.href"
      class="min-w-0 shrink!"
    >
      <component
        :is="node.href ? 'a' : 'span'"
        :href="node.href || undefined"
        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
      >
        <span class="truncate underline-offset-2" :class="node.href ? 'group-hover/link:underline' : ''">
          {{ node.name }}
        </span>
        <i v-if="node.href" class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
      </component>
    </Tooltip>

    <div v-if="node.bind || node.add" class="ml-auto flex shrink-0 items-center">
      <div v-if="node.bind" class="flex shrink-0 items-center gap-(--spacing-xxs)">
        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <Tooltip :text="node.bind.boundId ? node.bind.changeLabel : node.bind.bindLabel">
              <IconButton
                :icon="node.bind.boundId ? 'pi pi-pencil' : 'pi pi-plus'"
                kind="outlined"
                size="small"
                :aria-label="node.bind.boundId ? node.bind.changeLabel : node.bind.bindLabel"
              />
            </Tooltip>
          </Dropdown.Trigger>

          <Dropdown.Group :label="node.bind.groupLabel">
            <Dropdown.Option
              v-for="option in node.bind.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :selected="option.value === node.bind.boundId"
            />
          </Dropdown.Group>

          <Dropdown.Group>
            <Dropdown.Option value="__create__" :label="node.bind.createLabel" />
          </Dropdown.Group>
        </Dropdown>
      </div>
      <Tooltip v-else text="Add Domain">
        <IconButton icon="pi pi-plus" kind="outlined" size="small" aria-label="Add Domain" />
      </Tooltip>
    </div>
  </div>

  <div
    :id="\`\${node.key}-body\`"
    role="region"
    :aria-labelledby="\`\${node.key}-trigger\`"
    :inert="!openNodes[node.key] || undefined"
    :data-state="openNodes[node.key] ? 'open' : 'closed'"
    class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="overflow-hidden">
      <div class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)">
        <p v-if="node.message" class="text-body-xs text-(--text-muted)">{{ node.message }}</p>

        <div v-for="field in node.fields" :key="field.label" class="flex flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <a
              v-if="field.url"
              :href="field.url"
              target="_blank"
              rel="noopener noreferrer"
              class="truncate text-body-xs text-(--text-default) hover:underline"
            >
              {{ field.value }}
            </a>
            <span v-else class="truncate text-body-xs text-(--text-default)">{{ field.value }}</span>
            <CopyButton
              v-if="field.copy"
              kind="outlined"
              :value="field.value"
              :aria-label="\`Copy \${node.kind} \${field.label.toLowerCase()}\`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`

const TOPOLOGY = `<div class="flex flex-col gap-(--layout-group-gap)">
  <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <h1 class="text-balance text-heading-xs text-(--text-default)">Deployment topology</h1>
      </div>
    </div>
  </header>

  <CardBox :padded="false" class="overflow-x-auto bg-(--bg-surface-raised)">
    <template #content>
      <Flow align="start" class="[&>div]:w-full">
        <Flow.Parallel
          v-for="level in topologyLevels"
          :key="level.key"
          align="start"
          class="min-w-(--size-56) flex-1"
        >
          <Flow.Node
            v-for="node in level.nodes"
            :key="node.key"
            unstyled
            :terminal="Boolean(node.terminal)"
            class="w-full"
          >
${indent(TOPOLOGY_NODE, 6)}
          </Flow.Node>
        </Flow.Parallel>
      </Flow>
    </template>
  </CardBox>
</div>`

const DEPLOY = '<Button label="Deploy" kind="primary" size="medium" icon="pi pi-cloud-upload" />'

const WORKLOAD_MAIN = `<main class="flex h-full flex-col">
${indent(pageTabs(DEPLOY))}

  <section class="min-h-0 flex-1 overflow-auto">
    <div>
${indent(overviewColumn([WORKLOAD_SUMMARY.template, CHECKLIST, TOPOLOGY], ''), 3)}
    </div>
  </section>
</main>`

const WORKLOAD_PAGE = {
  parts: [
    'Button',
    'CardBox',
    'CopyButton',
    'DrawerClose',
    'DrawerTitle',
    'Flow',
    'IconButton',
    'Item',
    'PanelContent',
    'PanelFooter',
    'PanelHeader',
    'Tag',
    'Tooltip'
  ],
  vue: ['reactive', 'ref'],
  script: [
    declare('productionSteps', PRODUCTION_STEPS),
    '',
    declare('topologyLevels', TOPOLOGY_LEVELS),
    '',
    'const detailOpen = ref(false)',
    'const openNodes = reactive({})'
  ],
  state: () => ({
    productionSteps: PRODUCTION_STEPS,
    topologyLevels: TOPOLOGY_LEVELS,
    detailOpen: ref(false),
    openNodes: reactive({})
  })
}

const FINISHED_STEPS = [
  {
    key: 'build',
    title: 'Build',
    description: 'Bundle written to .edge/worker.js',
    durationLabel: '28s',
    logs: [
      ['14:02:11', '[build] Running deploy command · azion deploy --auto --local', 'text'],
      ['14:02:11', '[build] Getting presets available', 'text'],
      ['14:02:12', '[build] Building with preset "vue" (azion bundler)', 'text'],
      ['14:02:38', '[build] vite build · 1.69 MB in dist/', 'text'],
      ['14:02:39', '[build] Wrote .edge/worker.js and .edge/manifest.json', 'text'],
      ['14:02:39', '[build] Build finished successfully', 'success']
    ]
  },
  {
    key: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to Storage',
    durationLabel: '8.1s',
    logs: [
      ['14:02:39', '[upload] Uploading .edge/storage to bucket my-app', 'text'],
      ['14:02:40', '[upload] Prefix 20260722112530 (rotate-prefix)', 'text'],
      ['14:02:46', '[upload] 24 objects updated successfully', 'success'],
      ['14:02:47', '[upload] Storage Bucket my-app successfully updated', 'success']
    ]
  },
  {
    key: 'manifest',
    title: 'Manifest',
    description: 'manifest.json read, every resource resolved',
    durationLabel: '1.9s',
    logs: [
      ['14:02:47', '[manifest] Reading manifest.json file', 'text'],
      [
        '14:02:48',
        '[manifest] Resolved 4 resources to apply: function, application, connector, workload',
        'text'
      ],
      ['14:02:48', '[manifest] 3 rules declared in the request phase', 'text'],
      ['14:02:49', '[manifest] manifest.json read successfully', 'success']
    ]
  },
  {
    key: 'function',
    title: 'Edge Function',
    description: 'Function and instance bound to the bundle',
    durationLabel: '3.6s',
    logs: [
      ['14:02:49', '[manifest] Updated Function __DEFAULT__ with ID 53089', 'text'],
      ['14:02:51', '[manifest] Bound .edge/worker.js to Function 53089', 'text'],
      [
        '14:02:53',
        '[manifest] Function Instance __DEFAULT__ with id 47458 successfully updated',
        'success'
      ]
    ]
  },
  {
    key: 'application',
    title: 'Application',
    description: 'Application and cache settings applied',
    durationLabel: '2.8s',
    logs: [
      ['14:02:53', '[manifest] Updated Application my-app-vue with ID 1784552864', 'text'],
      ['14:02:55', '[manifest] Cache Setting __DEFAULT__ successfully updated', 'success'],
      ['14:02:56', '[manifest] Application my-app-vue successfully updated', 'success']
    ]
  },
  {
    key: 'connector',
    title: 'Connector',
    description: 'Storage connector pointed at the bucket',
    durationLabel: '1.9s',
    logs: [
      ['14:02:56', '[manifest] Creating Connector origin-storage-default (storage)', 'text'],
      ['14:02:57', '[manifest] Bucket my-app · prefix 20260722112530', 'text'],
      [
        '14:02:58',
        '[manifest] Connector origin-storage-default with id 263718 successfully updated',
        'success'
      ]
    ]
  },
  {
    key: 'rules',
    title: 'Rules Engine',
    description: 'Request-phase rules applied',
    durationLabel: '4.8s',
    logs: [
      [
        '14:02:59',
        '[manifest] Rule Engine Set Storage Origin for All Requests with id 604943 successfully updated',
        'success'
      ],
      [
        '14:03:00',
        '[manifest] Rule Engine Deliver Static Assets with id 604944 successfully updated',
        'success'
      ],
      [
        '14:03:01',
        '[manifest] Rule Engine Redirect to index.html with id 604945 successfully updated',
        'success'
      ],
      ['14:03:03', '[manifest] 3 rules applied in the request phase', 'success']
    ]
  },
  {
    key: 'workload',
    title: 'Workload',
    description: 'Workload deployment published to the domain',
    durationLabel: '3.7s',
    logs: [
      ['14:03:04', '[manifest] Workload my-app with id 1784675753 successfully updated', 'success'],
      [
        '14:03:05',
        '[manifest] Workload Deployment d_7Kq2mVbHZ with id 5591028 successfully created',
        'success'
      ],
      ['14:03:06', '[manifest] Environment production', 'text'],
      ['14:03:07', '[manifest] Updated Domain my-app with ID 1784675753', 'text']
    ]
  },
  {
    key: 'purge',
    title: 'Cache Purge',
    description: 'Edge cache purged for the domain',
    durationLabel: '3.4s',
    logs: [
      ['14:03:08', '[purge] purge_on_publish · Initializing cache warming...', 'text'],
      ['14:03:09', '[purge] Purge request accepted for mh2saqc1un.map.azionedge.net', 'text'],
      ['14:03:10', '[purge] Cache warmed for 3 edge locations', 'text'],
      ['14:03:11', '[purge] Purge finished executing', 'success']
    ]
  },
  {
    key: 'finish',
    title: 'Live',
    description: 'Deployment serving traffic at the domain',
    durationLabel: '0.9s',
    logs: [
      [
        '14:03:12',
        '[deploy] To visualize your application access the Domain: https://mh2saqc1un.map.azionedge.net',
        'text'
      ],
      ['14:03:12', '[deploy] Deployed finished executing', 'success']
    ]
  }
]

const FAILED_STEPS = [
  {
    key: 'build',
    title: 'Build',
    description: 'Bundle written to .edge/worker.js',
    durationLabel: '26s',
    logs: [
      ['14:02:11', '[build] Running deploy command · Azion Console (UI)', 'text'],
      ['14:02:11', '[build] Getting presets available', 'text'],
      ['14:02:12', '[build] Building with preset "vue" (azion bundler)', 'text'],
      ['14:02:38', '[build] vite build · 1.69 MB in dist/', 'text'],
      ['14:02:39', '[build] Wrote .edge/worker.js and .edge/manifest.json', 'text'],
      ['14:02:39', '[build] Build finished successfully', 'success']
    ]
  },
  {
    key: 'upload',
    title: 'Upload',
    description: 'Static assets uploaded to Storage',
    durationLabel: '7.8s',
    logs: [
      ['14:02:39', '[upload] Uploading .edge/storage to bucket my-app', 'text'],
      ['14:02:40', '[upload] Prefix 20260730140211 (rotate-prefix)', 'text'],
      ['14:02:46', '[upload] 24 objects updated successfully', 'success'],
      ['14:02:47', '[upload] Storage Bucket my-app successfully updated', 'success']
    ]
  },
  {
    key: 'manifest',
    title: 'Manifest',
    description: 'manifest.json read, every resource resolved',
    durationLabel: '1.7s',
    logs: [
      ['14:02:47', '[manifest] Reading manifest.json file', 'text'],
      [
        '14:02:48',
        '[manifest] Resolved 4 resources to apply: function, application, connector, workload',
        'text'
      ],
      ['14:02:48', '[manifest] 3 rules declared in the request phase', 'text'],
      ['14:02:49', '[manifest] manifest.json read successfully', 'success']
    ]
  },
  {
    key: 'function',
    title: 'Edge Function',
    description: 'Function and instance bound to the bundle',
    durationLabel: '3.4s',
    logs: [
      ['14:02:49', '[manifest] Updated Function __DEFAULT__ with ID 53089', 'text'],
      ['14:02:51', '[manifest] Bound .edge/worker.js to Function 53089', 'text'],
      [
        '14:02:53',
        '[manifest] Function Instance __DEFAULT__ with id 47458 successfully updated',
        'success'
      ]
    ]
  },
  {
    key: 'application',
    title: 'Application',
    description: 'Application and cache settings applied',
    durationLabel: '2.6s',
    logs: [
      ['14:02:53', '[manifest] Updated Application my-app-vue with ID 1784552864', 'text'],
      ['14:02:55', '[manifest] Cache Setting __DEFAULT__ successfully updated', 'success'],
      ['14:02:56', '[manifest] Application my-app-vue successfully updated', 'success']
    ]
  },
  {
    key: 'connector',
    title: 'Connector',
    description: 'Storage connector pointed at the bucket',
    durationLabel: '1.8s',
    logs: [
      ['14:02:56', '[manifest] Creating Connector origin-storage-default (storage)', 'text'],
      ['14:02:57', '[manifest] Bucket my-app · prefix 20260730140211', 'text'],
      [
        '14:02:58',
        '[manifest] Connector origin-storage-default with id 263718 successfully updated',
        'success'
      ]
    ]
  },
  {
    key: 'rules',
    title: 'Rules Engine',
    description: 'The Rules Engine rejected this deployment (409 Conflict).',
    durationLabel: '4.1s',
    logs: [
      [
        '14:02:59',
        '[manifest] Rule Engine Set Storage Origin for All Requests with id 604943 successfully updated',
        'text'
      ],
      [
        '14:03:01',
        '[ERROR] [manifest] Error while creating Rule Engine Deliver Static Assets',
        'warning'
      ],
      [
        '14:03:02',
        '409 Conflict: a rule with this behavior is already bound to workload my-app',
        'text'
      ],
      ['14:03:03', '[ERROR] [manifest] Deploy aborted — nothing was published.', 'warning']
    ]
  },
  {
    key: 'workload',
    title: 'Workload',
    description: 'Never ran — the deployment stopped at Rules Engine',
    durationLabel: '',
    logs: []
  },
  {
    key: 'purge',
    title: 'Cache Purge',
    description: 'Never ran — the deployment stopped at Rules Engine',
    durationLabel: '',
    logs: []
  },
  {
    key: 'finish',
    title: 'Live',
    description: 'Never ran — the deployment stopped at Rules Engine',
    durationLabel: '',
    logs: []
  }
]

const DEPLOYMENT_DOMAIN = 'mh2saqc1un.map.azionedge.net'

const FINISHED_DEPLOYMENT = {
  id: 'd_7Kq2mVbHZ',
  status: { label: 'Ready', severity: 'success' },
  failed: false,
  url: `https://${DEPLOYMENT_DOMAIN}`,
  banner: {
    severity: 'success',
    label: `Live at https://${DEPLOYMENT_DOMAIN} — published to my-app (production) in 1m 1s.`
  },
  author: 'Rafael Garbinatto',
  createdOn: 'September 26, 2026, 09:59:16 AM',
  createdAgo: '1 week ago',
  duration: '1m 1s',
  environment: 'Production',
  trigger: { label: 'CLI', icon: 'ai ai-azion-cli', source: 'azion deploy --auto --local' },
  prefix: '20260722112530',
  steps: FINISHED_STEPS,
  logs: { state: 'finished', at: '' }
}

const FAILED_DEPLOYMENT = {
  id: 'd_xyCGVY2X4',
  status: { label: 'Error', severity: 'danger' },
  failed: true,
  url: '',
  banner: {
    severity: 'danger',
    label:
      'A rule with the same behavior is already bound to this workload, so the manifest was refused. Nothing was published — the workload keeps serving its previous deployment.'
  },
  author: 'Herbert Júlio',
  createdOn: 'October 04, 2026, 08:59:16 AM',
  createdAgo: '1 hour ago',
  duration: '48s',
  environment: 'Preview',
  trigger: { label: 'Console', icon: 'pi pi-desktop', source: 'Azion Console (UI)' },
  prefix: '20260730140211',
  steps: FAILED_STEPS,
  logs: { state: 'failed', at: 'rules' }
}

const DEPLOYMENT_LINK =
  'group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline'

const EXTERNAL_ICON =
  '<i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />'

const detailLink = ({ tooltip, href, label, external = false }) => `<Tooltip text="${tooltip}">
  <a
    href="${href}"${external ? '\n    target="_blank"\n    rel="noopener noreferrer"' : ''}
    class="${DEPLOYMENT_LINK}"
  >
    <span class="truncate underline-offset-2 group-hover/link:underline">
      ${label}
    </span>
    ${EXTERNAL_ICON}
  </a>
</Tooltip>`

const detailFact = (
  label,
  body,
  cell = 'flex flex-col gap-(--spacing-xxs)'
) => `<div class="${cell}">
  <span class="text-label-sm text-(--text-muted)">${label}</span>
${indent(body)}
</div>`

const deploymentFacts = (record) => [
  detailFact(
    'Created',
    `<div class="flex min-w-0 items-center gap-(--spacing-xs)">
  <Tooltip text="${record.author} · ${record.createdOn}">
    <Avatar alt="${record.author}" label="${record.author}" size="small" kind="square" />
  </Tooltip>
  <span class="truncate text-body-sm text-(--text-default)">
    ${record.author}
  </span>
  <span class="shrink-0 text-body-sm text-(--text-muted)">
    ${record.createdAgo}
  </span>
</div>`
  ),
  detailFact(
    'Status',
    `<div class="flex min-w-0 items-center gap-(--spacing-xs)">
  <StatusIndicator severity="${record.status.severity}" label="${record.status.label}" />
</div>`
  ),
  detailFact(
    'Duration',
    `<div class="flex min-w-0 items-center gap-(--spacing-xs)">
  <i class="pi pi-clock shrink-0 text-(--text-muted)" aria-hidden="true" />
  <span class="truncate text-body-sm text-(--text-default)">
    ${record.duration}
  </span>
</div>`
  ),
  detailFact(
    'Environment',
    `<div class="flex min-w-0 items-center">
  <Tag severity="secondary" size="medium" label="${record.environment}" />
</div>`
  ),
  detailFact(
    'Workload',
    detailLink({
      tooltip: 'Open my-app in Workloads',
      href: '/workloads/1784675753',
      label: 'my-app'
    })
  ),
  detailFact(
    'Application',
    detailLink({
      tooltip: 'Open my-app-vue in Application',
      href: '/applications/1784552864',
      label: 'my-app-vue'
    })
  ),
  detailFact(
    'Triggered By',
    `<div class="flex min-w-0 items-center">
  <Tooltip text="${record.trigger.source}">
    <Tag severity="secondary" size="medium" icon="${record.trigger.icon}" label="${record.trigger.label}" />
  </Tooltip>
</div>`
  ),
  detailFact(
    'Preset',
    `<div class="flex min-w-0 items-center">
  <Tooltip text="build.preset in azion.config.js">
    <Tag severity="secondary" size="medium" icon="pi pi-wrench" label="vue" />
  </Tooltip>
</div>`
  ),
  detailFact(
    'Storage',
    `<div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-default)">
  <i class="ai ai-edge-storage shrink-0 text-(--text-muted)" aria-hidden="true" />
  <span class="truncate">my-app</span>
  <span class="text-body-xs text-(--text-muted)" aria-hidden="true">·</span>
  <span class="text-label-code-sm text-(--text-muted)">
    ${record.prefix}
  </span>
</div>`,
    'flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3'
  ),
  detailFact(
    'Domains',
    `<div class="flex min-w-0 items-center gap-(--spacing-xs)">
  <i class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
${indent(
  detailLink({
    tooltip: `Open ${DEPLOYMENT_DOMAIN} in a new tab`,
    href: `https://${DEPLOYMENT_DOMAIN}`,
    label: DEPLOYMENT_DOMAIN,
    external: true
  })
)}
  <CopyButton
    kind="outlined"
    value="${DEPLOYMENT_DOMAIN}"
    aria-label="Copy domain name"
    class="shrink-0"
  />
</div>`,
    'flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3'
  )
]

const DEPLOYMENT_ACTIONS = [
  [
    { value: 'logs', label: 'Logs', icon: 'pi pi-align-left' },
    { value: 'requests', label: 'Requests', icon: 'pi pi-arrow-right-arrow-left' }
  ],
  [{ value: 'redeploy', label: 'Redeploy', icon: 'pi pi-refresh' }]
]

const actionOption = ({
  value,
  label,
  icon
}) => `<Dropdown.Option value="${value}" label="${label}">
  <template #left>
    <i class="${icon}" aria-hidden="true" />
  </template>
</Dropdown.Option>`

const DEPLOYMENT_MENU = `<Dropdown placement="bottom-end">
  <Dropdown.Trigger>
    <Tooltip text="Deployment actions">
      <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="medium" aria-label="Deployment actions" />
    </Tooltip>
  </Dropdown.Trigger>
${DEPLOYMENT_ACTIONS.map((options) => `  <Dropdown.Group>\n${options.map((option) => indent(actionOption(option), 2)).join('\n')}\n  </Dropdown.Group>`).join('\n')}
</Dropdown>`

const visitButton = (record) =>
  record.url
    ? `<Tooltip text="${record.url}">
  <Button
    label="Visit"
    kind="secondary"
    size="medium"
    icon="pi pi-external-link"
    href="${record.url}"
    target="_blank"
  />
</Tooltip>`
    : `<Tooltip text="Available once the deployment is live">
  <Button
    label="Visit"
    kind="secondary"
    size="medium"
    icon="pi pi-external-link"
    disabled
    target="_blank"
  />
</Tooltip>`

const DEPLOYMENT_SETTINGS = `<Accordion
  class="@container/band -mx-(--spacing-md) -my-(--spacing-sm) w-[calc(100%+2*var(--spacing-md))] [--accordion-inset:var(--spacing-md)]"
  type="single"
  arrow-position="left"
  collapsible
>
  <Accordion.Item value="settings">
    <div class="relative">
      <Accordion.Trigger>
        <span class="flex min-h-12 flex-1 items-center gap-(--spacing-sm)">
          <span class="text-label-md text-(--text-default)">Deployment Settings</span>
        </span>
      </Accordion.Trigger>

      <div
        class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:right-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pr-(--spacing-md) @lg/band:pb-0"
      >
        <Tooltip
          class="pointer-events-auto"
          text="Open Azion Default in Build & Deployment settings"
        >
          <a href="/account/build-deployment" class="${DEPLOYMENT_LINK}">
            <span class="truncate underline-offset-2 group-hover/link:underline">
              Azion Default
            </span>
            ${EXTERNAL_ICON}
          </a>
        </Tooltip>
      </div>
    </div>
    <Accordion.Content>
      <div
        class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
      >
${[
  ['Binding Policy', 'Strict'],
  ['Version Policy', 'Single']
]
  .map(
    ([label, value]) => `        <div class="flex flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">${label}</span>
          <span class="truncate text-body-sm text-(--text-default)">
            ${value}
          </span>
        </div>`
  )
  .join('\n')}
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`

const banner = (record) =>
  record.failed
    ? `<Message
  severity="${record.banner.severity}"
  size="small"
  label="${record.banner.label}"
  class="animate-popup-scale-in motion-reduce:animate-none"
  style="--popup-origin: top"
>
  <template #action>
    <Button label="Redeploy" kind="secondary" size="medium" icon="pi pi-refresh" />
  </template>
</Message>`
    : `<Message
  severity="${record.banner.severity}"
  size="small"
  label="${record.banner.label}"
  class="animate-popup-scale-in motion-reduce:animate-none"
  style="--popup-origin: top"
/>`

const logsSummary = (record) =>
  record.failed
    ? `<StatusIndicator severity="${record.status.severity}" label="${record.status.label}" />`
    : `<span class="text-label-sm text-(--text-muted)">
  ${record.duration}
</span>`

const deploymentLogsCard = (record, logs) => `<CardBox :padded="false" class="w-full">
  <template #content>
    <Accordion
      v-model:value="logsOpen"
      class="[--accordion-inset:var(--spacing-md)]"
      type="single"
      arrow-position="left"
      collapsible
    >
      <Accordion.Item value="logs">
        <div class="relative">
          <Accordion.Trigger>
            <span class="flex min-h-14 flex-1 items-center gap-(--spacing-sm)">
              <span class="text-label-md text-(--text-default)">Deployment Logs</span>
${indent(logsSummary(record), 7)}
            </span>
          </Accordion.Trigger>

          <div
            class="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-(--spacing-md) sm:flex"
          >
            <div class="pointer-events-auto flex items-center">
              <SegmentedButton
                v-if="logsOpen === 'logs'"
                v-model="logView"
                :options="logViews"
                class="shrink-0"
                size="medium"
                aria-label="Log view"
              />
            </div>
          </div>
        </div>

        <Accordion.Content>
${indent(logs.template, 5)}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  </template>
</CardBox>`

const deploymentPage = (record) => {
  const logs = deploymentLogs({
    steps: record.steps,
    state: record.logs.state,
    at: record.logs.at,
    header: false,
    progressBar: false,
    totalLabel: record.duration
  })
  const main = `<main class="flex min-h-full w-full flex-col">
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
${indent(banner(record), 2)}

    <CardBox class="[&>footer]:min-h-12">
      <template #header>
        <p class="text-heading-xs text-(--text-default)">Deployment Details</p>

        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
${indent(visitButton(record), 5)}

${indent(DEPLOYMENT_MENU, 5)}
        </div>
      </template>

      <template #content>
        <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2 lg:grid-cols-3">
${indent(deploymentFacts(record).join('\n'), 5)}
        </div>
      </template>

      <template #footer>
${indent(DEPLOYMENT_SETTINGS, 4)}
      </template>
    </CardBox>

${indent(deploymentLogsCard(record, logs), 2)}
  </section>
</main>`
  return {
    main,
    blocks: [
      {
        parts: [
          'Accordion',
          'Avatar',
          'Button',
          'CardBox',
          'CopyButton',
          'Dropdown',
          'IconButton',
          'Message',
          'SegmentedButton',
          'StatusIndicator',
          'Tag',
          'Tooltip'
        ],
        vue: ['ref'],
        script: ['const logsOpen = ref(null)'],
        state: () => ({ logsOpen: ref(null) })
      },
      {
        parts: [],
        lines: [
          ...logs.imports,
          `import { ${logs.vue.join(', ')} } from 'vue'`,
          '',
          ...logs.scriptLines
        ],
        state: logs.setup
      }
    ]
  }
}

const FINISHED_PAGE = deploymentPage(FINISHED_DEPLOYMENT)

const FAILED_PAGE = deploymentPage(FAILED_DEPLOYMENT)

const components = {
  ...SHELL_COMPONENTS,
  ...SUMMARY_COMPONENTS,
  Button,
  CardBox,
  CopyButton,
  DrawerClose,
  DrawerTitle,
  Flow,
  'Flow.Parallel': Flow.Parallel,
  'Flow.Node': Flow.Node,
  'Flow.Anchor': Flow.Anchor,
  IconButton,
  Item,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  'Item.Footer': Item.Footer,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ...DEPLOYMENT_LOGS_COMPONENTS,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Tag,
  Tooltip
}

const page = ({
  active,
  breadcrumb,
  tabs,
  main,
  blocks,
  description,
  scroll = 'overflow-auto'
}) => {
  const template = shell({ withBreadcrumb: true, main: pageScroll(main, scroll) })
  const tabState = tabs ? { tabs, activeTab: ref('overview') } : {}
  return {
    render: () => ({
      components,
      setup: () => ({
        ...shellState(active),
        breadcrumb,
        ...tabState,
        ...blockState(...blocks)
      }),
      template
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: {
          code: toSfc(
            mergeScripts(
              scriptLines({
                parts: tabs ? ['Breadcrumb', 'TabView'] : ['Breadcrumb'],
                active,
                declarations: [
                  '',
                  declare('breadcrumb', breadcrumb),
                  ...(tabs ? [declare('tabs', tabs)] : [])
                ],
                state: tabs ? ["const activeTab = ref('overview')"] : []
              }),
              blockScript(...blocks),
              ...blocks.filter((block) => block.lines).map((block) => block.lines)
            ),
            template
          )
        }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Shell/SummaryPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Overview tab of a resource detail page as the console draws it: the platform shell with the resource breadcrumb, the full-bleed tab bar, then the column that opens on the resource summary card. The Application Overview follows it with Get started for an application made from the CLI, the Workload Overview with the production checklist and the deployment topology, and the Firewall Overview stops at the summary. The Deployment page sits in the same shell without tabs: a status banner, the Deployment Details card with its Deployment Settings footer, and the collapsible Deployment Logs card. Built from the platform shell, `TabView`, `CardBox`, `Dropdown`, `Popover`, `Accordion`, `Flow`, `Item`, `Drawer`, `Message`, `LogView`, `CodeBlock` and `SegmentedButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ApplicationOverview = page({
  active: 'applications',
  breadcrumb: [{ label: 'Applications', href: '/applications' }, { label: CLI_APPLICATION.name }],
  tabs: APPLICATION_TABS,
  main: APPLICATION_MAIN,
  blocks: [CLI_APPLICATION_SUMMARY, GET_STARTED],
  description:
    'An application made from the CLI: its eight detail tabs, the summary with no repository connected, and Get started with the Azion CLI and GitHub Actions paths.'
})

export const WorkloadOverview = page({
  active: 'workloads',
  breadcrumb: [{ label: 'Workloads', href: '/workloads' }, { label: WORKLOAD.name }],
  tabs: WORKLOAD_TABS,
  main: WORKLOAD_MAIN,
  blocks: [WORKLOAD_SUMMARY, WORKLOAD_PAGE],
  description:
    'A workload: the Deploy action on the tab row, the summary with its Deployment Settings band, the production checklist that expands into a drawer, and the deployment topology from domains to storage.'
})

export const FirewallOverview = page({
  active: 'firewall',
  breadcrumb: [{ label: 'Firewall', href: '/firewall' }, { label: FIREWALL.name }],
  tabs: FIREWALL_TABS,
  main: FIREWALL_MAIN,
  blocks: [FIREWALL_SUMMARY],
  description:
    'A firewall: its Overview, Rules Engine and Settings tabs, and the summary of what it protects and inspects.'
})

const deploymentStory = (record, built, description) =>
  page({
    active: 'deployments',
    breadcrumb: [{ label: 'Deployments', href: '/deployments' }, { label: record.id }],
    main: built.main,
    blocks: built.blocks,
    scroll: 'overflow-auto layout-boundary',
    description
  })

export const DeploymentDetail = deploymentStory(
  FINISHED_DEPLOYMENT,
  FINISHED_PAGE,
  'A deployment that went live: the success banner, the Deployment Details card with every fact and its Deployment Settings footer, and the collapsed Deployment Logs card that opens on the phased steps with the log view switch.'
)

export const DeploymentFailed = deploymentStory(
  FAILED_DEPLOYMENT,
  FAILED_PAGE,
  'A deployment the Rules Engine rejected: the danger banner with Redeploy, Visit disabled until the deployment is live, and logs that stop at the failed step with the rest skipped.'
)
