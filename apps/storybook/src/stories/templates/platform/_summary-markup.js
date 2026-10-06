import Accordion from '@aziontech/webkit/accordion'
import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CodeBlock from '@aziontech/webkit/code-block'
import CopyButton from '@aziontech/webkit/copy-button'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import Message from '@aziontech/webkit/message'
import Popover from '@aziontech/webkit/popover'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref } from 'vue'

import { each, indent } from '../../_shared/markup'

const pad = (depth) => '  '.repeat(depth)

const quote = (text) =>
  text.includes('\n')
    ? `\`${text.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${')}\``
    : `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const KEY = /^[A-Za-z_$][\w$]*$/

export const literal = (value, depth = 0) => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'string') return quote(value)
  if (typeof value !== 'object') return String(value)
  if (Array.isArray(value)) {
    const flat = value.every((entry) => typeof entry !== 'object')
    const inline = `[${value.map((entry) => literal(entry, depth + 1)).join(', ')}]`
    if (flat && pad(depth).length + inline.length <= 90) return inline
    const entries = value.map((entry) => `${pad(depth + 1)}${literal(entry, depth + 1)}`)
    return `[\n${entries.join(',\n')}\n${pad(depth)}]`
  }
  const entries = Object.entries(value).map(
    ([key, entry]) => `${KEY.test(key) ? key : quote(key)}: ${literal(entry, depth + 1)}`
  )
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && pad(depth).length + inline.length <= 90) return inline
  return `{\n${entries.map((entry) => `${pad(depth + 1)}${entry}`).join(',\n')}\n${pad(depth)}}`
}

export const declare = (name, value) => `const ${name} = ${literal(value)}`

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const webkitImport = (name) => `import ${name} from '@aziontech/webkit/${kebab(name)}'`

export const blockScript = (...blocks) => {
  const parts = [...new Set(blocks.flatMap((block) => block.parts))].sort()
  const vue = [...new Set(blocks.flatMap((block) => block.vue ?? []))].sort()
  const body = blocks.flatMap((block) => block.script ?? [])
  return [
    ...parts.map(webkitImport),
    ...(vue.length ? [`import { ${vue.join(', ')} } from 'vue'`] : []),
    ...(body.length ? ['', ...body] : [])
  ]
}

export const blockState = (...blocks) =>
  Object.assign({}, ...blocks.map((block) => block.state?.() ?? {}))

export const SUMMARY_COMPONENTS = {
  Accordion,
  'Accordion.Item': Accordion.Item,
  'Accordion.Trigger': Accordion.Trigger,
  'Accordion.Content': Accordion.Content,
  Avatar,
  Button,
  CardBox,
  CodeBlock,
  CopyButton,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  IconButton,
  Message,
  Popover,
  'Popover.Trigger': Popover.Trigger,
  'Popover.Content': Popover.Content,
  SegmentedButton,
  StatusIndicator,
  Tag,
  Tooltip
}

const LABEL = 'text-label-sm text-(--text-muted)'

const VALUE = 'truncate text-body-sm text-(--text-default)'

const CODE = 'font-(family-name:--font-code) text-body-sm text-(--text-default)'

const LINK_BUTTON =
  'rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

const SUBJECT_BAND =
  '@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)'

const FACTS_BAND =
  '@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md)'

const STATE_BAND =
  '@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas)'

const summaryCard = (bands) => `<CardBox :padded="false">
  <template #content>
${indent(bands.join('\n\n'), 2)}
  </template>
</CardBox>`

const subjectBand = (identity, actions) => `<div class="${SUBJECT_BAND}">
  <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
${indent(identity, 2)}
  </div>

  <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
${indent(actions, 2)}
  </div>
</div>`

const factsBand = (grid, facts) => `<div class="${FACTS_BAND} ${grid}">
${indent(facts.join('\n\n'))}
</div>`

const stateBand = (
  body,
  padded = true
) => `<div class="${STATE_BAND}${padded ? ' px-(--spacing-md) py-(--spacing-xs)' : ''}">
${indent(body)}
</div>`

const resourceLink = ({ label, href, tooltip, external = false }) =>
  `<Tooltip text="${tooltip}" class="min-w-0 shrink!">
  <a
    href="${href}"${external ? '\n    target="_blank"\n    rel="noopener noreferrer"' : ''}
    class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
  >
    <span class="truncate underline-offset-2 group-hover/link:underline">${label}</span>${
      external ? `\n    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>` : ''
    }
    <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
  </a>
</Tooltip>`

const siteLink = (domain) =>
  resourceLink({
    label: domain,
    href: `https://${domain}`,
    tooltip: `Open ${domain} in a new tab`,
    external: true
  })

const domainOverflow = (listName, total) => `<Popover placement="bottom-start" width="small">
  <Popover.Trigger>
    <Tag label="+${total - 1}" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
  </Popover.Trigger>

  <Popover.Content>
    <div class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)">
      <p class="${LABEL}">${total} domains</p>
    </div>

    <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
      <a
        v-for="domain in ${listName}"
        :key="domain"
        :href="\`https://\${domain}\`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline"
      >
        <span class="truncate">{{ domain }}</span>
        <i class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none" aria-hidden="true" />
      </a>
    </div>

    <span class="sr-only" role="status">${total} domains</span>
  </Popover.Content>
</Popover>`

const menuOption = ({ value, label, icon }) => `<Dropdown.Option value="${value}" label="${label}">
  <template #left>
    <i class="${icon}" aria-hidden="true" />
  </template>
</Dropdown.Option>`

const actionsMenu = (label, groups) => `<Dropdown placement="bottom-end">
  <Dropdown.Trigger>
    <Tooltip text="${label}">
      <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="medium" aria-label="${label}" />
    </Tooltip>
  </Dropdown.Trigger>

${groups.map((options) => `  <Dropdown.Group>\n${each(options, menuOption, 2)}\n  </Dropdown.Group>`).join('\n\n')}
</Dropdown>`

const COPY_URL = { value: 'copy-url', label: 'Copy URL', icon: 'pi pi-copy' }

const MANAGE_DOMAINS = { value: 'manage-domains', label: 'Manage Domains', icon: 'ai ai-domains' }

const SETTINGS = { value: 'settings', label: 'Settings', icon: 'pi pi-cog' }

const COPY_ID = { value: 'copy-id', label: 'Copy ID', icon: 'pi pi-copy' }

const VISIT = `<Button label="Visit" kind="secondary" size="medium" icon="pi pi-external-link" />`

const documentationButton = (href) => `<Button
  class="w-full shrink-0 @lg/band:ml-auto @lg/band:w-auto"
  label="Documentation"
  kind="outlined"
  size="medium"
  icon="pi pi-book"
  href="${href}"
  target="_blank"
/>`

const label = (text) => `<span class="${LABEL}">${text}</span>`

const ADD_DOMAIN = `<Tooltip text="Add a custom domain">
  <button
    type="button"
    class="-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) p-1 text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
    aria-label="Add a custom domain"
  >
    <i class="pi pi-plus-circle text-body-sm leading-none" aria-hidden="true" />
  </button>
</Tooltip>`

const labelWithAdd = (
  text,
  element
) => `<${element} class="flex min-w-0 items-center gap-(--spacing-xxs)">
  ${label(text)}
${indent(ADD_DOMAIN)}
</${element}>`

const fact = ({
  heading,
  body,
  cell = 'flex min-w-0 flex-col gap-(--spacing-xxs)',
  row = 'flex min-h-7 min-w-0 items-center gap-(--spacing-xs)'
}) => `<div class="${cell}">
${indent(heading)}
  <div class="${row}">
${indent(body, 2)}
  </div>
</div>`

const person = (name, sentence) => `<span class="${VALUE}">
  ${sentence}
</span>
<Avatar alt="${name}" label="${name}" size="small" kind="square" class="shrink-0" />`

const WIDE = 'flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2'

const NARROW_ROW = 'flex min-h-7 min-w-0 items-center'

const CLI_DOCS = 'https://www.azion.com/en/documentation/products/azion-cli/overview/'

export const APPLICATION = {
  name: 'ecommerce-v2',
  addresses: ['shop.shopco.com', 'y6u7i8o9p0.azion.run'],
  deployment: '1213288756',
  environment: 'Production',
  status: { label: 'Ready', severity: 'success' },
  author: 'Isaque Böck',
  deployedAgo: '1 month ago',
  repository: 'shopco/ecommerce-v2',
  branch: 'develop',
  framework: { icon: 'ai-cor ai-nuxt', label: 'Nuxt' }
}

export const CLI_APPLICATION = {
  name: 'analytics-edge',
  addresses: ['z1x2c3v4b5.azion.run'],
  deployment: '1213279760',
  environment: 'Production',
  status: { label: 'Ready', severity: 'success' },
  author: 'Marcus Grando',
  deployedAgo: '3 weeks ago',
  repository: '',
  branch: '',
  framework: { icon: 'ai-cor ai-next', label: 'Next.js' }
}

const domainCell = (domain, listName, total) =>
  [siteLink(domain), ...(total > 1 ? [domainOverflow(listName, total)] : [])].join('\n')

const sourceCell = (app) =>
  app.repository
    ? `<div class="flex min-w-0 items-center gap-(--spacing-xs)">
  <i class="pi pi-github shrink-0 text-(--text-muted)" aria-hidden="true" />
${indent(
  resourceLink({
    label: app.repository,
    href: `https://github.com/${app.repository}`,
    tooltip: `Open ${app.repository} in a new tab`,
    external: true
  })
)}
</div>
<div class="flex min-w-0 items-center gap-(--spacing-xxs)">
  <i class="ai ai-branch shrink-0 text-(--text-muted)" aria-hidden="true" />
  <span class="${VALUE}">${app.branch}</span>
</div>`
    : `<button
  type="button"
  class="inline-flex min-w-0 items-center gap-(--spacing-xs) ${LINK_BUTTON}"
>
  <span class="truncate">Connect Git Repository</span>
</button>`

const applicationState = (app) =>
  app.repository
    ? `Every push to
  <code class="${CODE}">${app.branch}</code>
  deploys this application to Production. To ship from your machine, drop your project
  anywhere on this page or run
  <code class="${CODE}">azion deploy</code>
  via the CLI.`
    : `To deploy to Production, drop your project anywhere on this page, connect Git, or run
  <code class="${CODE}">azion deploy</code>
  via the CLI.`

const applicationTemplate = (app) => {
  const [domain] = app.addresses
  const total = app.addresses.length
  return summaryCard([
    subjectBand(
      `<i class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
${siteLink(domain)}`,
      `${VISIT}

${actionsMenu('Application actions', [[COPY_URL], [MANAGE_DOMAINS, SETTINGS]])}`
    ),
    factsBand('grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6', [
      fact({
        cell: WIDE,
        heading: label('Deployment'),
        body: `${resourceLink({
          label: app.deployment,
          href: `/deployments/${app.deployment}`,
          tooltip: `Open ${app.deployment} in Deployments`
        })}
<Tag label="${app.environment}" severity="secondary" size="small" class="shrink-0" />`
      }),
      fact({
        cell: WIDE,
        heading: labelWithAdd('Domains', 'div'),
        body: domainCell(domain, 'addresses', total)
      }),
      fact({
        cell: WIDE,
        row: NARROW_ROW,
        heading: label('Status'),
        body: `<StatusIndicator severity="${app.status.severity}" label="${app.status.label}" />`
      }),
      fact({
        cell: WIDE,
        heading: label('Created'),
        body: person(app.author, `${app.deployedAgo} by ${app.author}`)
      }),
      fact({
        cell: WIDE,
        row: 'flex min-h-7 min-w-0 items-center gap-(--spacing-sm)',
        heading: label('Source'),
        body: sourceCell(app)
      }),
      fact({
        cell: WIDE,
        heading: label('Framework'),
        body: `<i class="${app.framework.icon} shrink-0 text-body-lg" aria-hidden="true" />
<span class="${VALUE}">
  ${app.framework.label}
</span>`
      })
    ]),
    stateBand(`<p class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)">
  ${applicationState(app)}
</p>

${documentationButton(CLI_DOCS)}`)
  ])
}

const applicationSummary = (app) => ({
  template: applicationTemplate(app),
  parts: [
    'Avatar',
    'Button',
    'CardBox',
    'Dropdown',
    'IconButton',
    'StatusIndicator',
    'Tag',
    'Tooltip',
    ...(app.addresses.length > 1 ? ['Popover'] : [])
  ],
  script: app.addresses.length > 1 ? [declare('addresses', app.addresses)] : [],
  state: () => (app.addresses.length > 1 ? { addresses: app.addresses } : {})
})

export const APPLICATION_SUMMARY = applicationSummary(APPLICATION)

export const CLI_APPLICATION_SUMMARY = applicationSummary(CLI_APPLICATION)

export const WORKLOAD = {
  id: '1020655',
  name: 'workload_01',
  domains: [
    'my-workload-1.azion.run',
    'my-workload-1-alias-1.azion.run',
    'my-workload-1-alias-2.azion.run',
    'my-workload-1-alias-3.azion.run',
    'my-workload-1-alias-4.azion.run',
    'my-workload-1-alias-5.azion.run',
    'my-workload-1-alias-6.azion.run',
    'my-workload-1-alias-7.azion.run'
  ],
  environments: [{ name: 'Production' }, { name: 'Stage' }],
  createdOn: 'Aug 20',
  owner: 'Robson Junior'
}

const ENVIRONMENT_MENU = `<Tooltip
  text="Select an environment to see its deployment and settings, or add another one"
>
  <Dropdown
    placement="bottom-end"
    @select="(event, value) => { if (value !== '__add-environment__') environment = value }"
  >
    <Dropdown.Trigger>
      <span
        class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
      >
        <i class="ai ai-layers shrink-0 text-(--text-muted)" aria-hidden="true" />
        <span class="truncate">{{ environment }}</span>
        <i class="pi pi-chevron-down shrink-0 text-(--text-muted)" aria-hidden="true" />
      </span>
    </Dropdown.Trigger>

    <Dropdown.Group label="Environments">
      <Dropdown.Option
        v-for="option in environments"
        :key="option.name"
        :value="option.name"
        :label="option.name"
        :selected="option.name === environment"
      />
    </Dropdown.Group>

    <Dropdown.Group>
      <Dropdown.Option value="__add-environment__" label="Add Environment">
        <template #left>
          <i class="pi pi-plus" aria-hidden="true" />
        </template>
      </Dropdown.Option>
    </Dropdown.Group>
  </Dropdown>
</Tooltip>`

const DISC = 'M8 0a8 8 0 100 16A8 8 0 008 0z'

const CHECK =
  'M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z'

const POLICY_FIELDS = [
  { label: 'Binding policy', value: 'Strict' },
  { label: 'Deployment policy', value: 'Single' },
  { label: 'Canary', value: 'Enabled', enabled: true },
  { label: 'Skew protection', value: 'Enabled', enabled: true }
]

const policyField = (field) => `<div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
  <span class="${LABEL}">${field.label}</span>
  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">${
    field.enabled
      ? `
    <svg
      class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-contrast)"
      viewBox="0 0 16 16"
      fill="currentColor"
      fill-rule="evenodd"
      aria-hidden="true"
    >
      <path d="${DISC} ${CHECK}" />
    </svg>`
      : ''
  }
    <span class="${VALUE}">
      ${field.value}
    </span>
  </span>
</div>`

const DEPLOYMENT_FOOTER = `<Accordion
  class="[--accordion-inset:var(--spacing-md)]"
  type="single"
  arrow-position="left"
  collapsible
>
  <Accordion.Item value="deployment-settings" class="border-b-0">
    <div class="relative">
      <Accordion.Trigger :level="3">
        <span class="flex min-h-12 items-center">
          <span class="text-label-md text-(--text-default)">Deployment Settings</span>
        </span>
      </Accordion.Trigger>

      <div
        class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:right-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pr-(--spacing-md) @lg/band:pb-0"
      >
        <Tag label="Shared · 3 workloads" severity="warning" size="medium" class="shrink-0" />
        <Tooltip
          class="pointer-events-auto"
          text="Open magalu-storefront in Build & Deployment settings"
        >
          <a
            href="/account/build-deployment"
            class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
          >
            <span class="truncate underline-offset-2 group-hover/link:underline">
              magalu-storefront
            </span>
            <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
          </a>
        </Tooltip>
      </div>
    </div>

    <Accordion.Content>
      <div class="px-(--spacing-md) pt-(--spacing-xs)">
        <Message
          severity="warning"
          size="small"
          label="Deploying with this setting also publishes to workload_05, workload_09."
        />
      </div>

      <div
        class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
      >
${each(POLICY_FIELDS, policyField, 4)}
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`

const WORKLOAD_TEMPLATE = summaryCard([
  subjectBand(
    `<i class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
${domainCell(WORKLOAD.domains[0], 'domains', WORKLOAD.domains.length)}`,
    `${VISIT}

${ENVIRONMENT_MENU}

${actionsMenu('Workload actions', [[COPY_URL], [MANAGE_DOMAINS, SETTINGS]])}`
  ),
  factsBand('grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4', [
    fact({
      heading: labelWithAdd('Custom domains', 'span'),
      body: `<span class="truncate text-body-sm text-(--text-disabled)">
  None
</span>`
    }),
    fact({
      row: NARROW_ROW,
      heading: label('Status'),
      body: '<StatusIndicator severity="success" label="Live" />'
    }),
    fact({
      heading: label('Workload ID'),
      body: `<span class="truncate text-body-sm tabular-nums text-(--text-default)">
  ${WORKLOAD.id}
</span>
<CopyButton
  kind="outlined"
  value="${WORKLOAD.id}"
  aria-label="Copy workload ID"
  class="shrink-0"
/>`
    }),
    fact({
      heading: label('Created'),
      body: person(WORKLOAD.owner, `${WORKLOAD.createdOn} by ${WORKLOAD.owner}`)
    })
  ]),
  stateBand(DEPLOYMENT_FOOTER, false)
])

export const WORKLOAD_SUMMARY = {
  template: WORKLOAD_TEMPLATE,
  parts: [
    'Accordion',
    'Avatar',
    'Button',
    'CardBox',
    'CopyButton',
    'Dropdown',
    'IconButton',
    'Message',
    'Popover',
    'StatusIndicator',
    'Tag',
    'Tooltip'
  ],
  vue: ['ref'],
  script: [
    declare('domains', WORKLOAD.domains),
    declare('environments', WORKLOAD.environments),
    "const environment = ref('Production')"
  ],
  state: () => ({
    domains: WORKLOAD.domains,
    environments: WORKLOAD.environments,
    environment: ref('Production')
  })
}

export const FIREWALL = {
  name: 'edgeflow-production',
  application: { name: 'edgeflow-site', id: '3344556677' },
  environment: 'Production',
  rules: 14,
  author: 'Robson Junior',
  editedAgo: '6 days ago',
  modules: ['DDoS Protection', 'WAF', 'Network Shield', 'Bot Manager'],
  documentation: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/'
}

const firewallSentence = (modules) => {
  const inspecting = modules.slice(1)
  return `DDoS Protection, ${inspecting.slice(0, -1).join(', ')} and ${inspecting.at(-1)}`
}

const FIREWALL_TEMPLATE = summaryCard([
  subjectBand(
    `<i class="ai ai-edge-application shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
${resourceLink({
  label: FIREWALL.application.name,
  href: `/applications/${FIREWALL.application.id}`,
  tooltip: `Open ${FIREWALL.application.name} in Applications`
})}`,
    `<Button label="Rules Engine" kind="secondary" size="medium" icon="pi pi-sort-alt" />

${actionsMenu('Firewall actions', [[COPY_ID], [SETTINGS]])}`
  ),
  factsBand('grid grid-cols-2 gap-(--spacing-sm) lg:grid-cols-4', [
    fact({
      row: NARROW_ROW,
      heading: label('Status'),
      body: '<StatusIndicator severity="success" label="Active" />'
    }),
    fact({
      row: NARROW_ROW,
      heading: label('Environment'),
      body: `<Tag label="${FIREWALL.environment}" severity="secondary" size="small" class="shrink-0" />`
    }),
    fact({
      row: NARROW_ROW,
      heading: label('Rules'),
      body: `<button
  type="button"
  class="truncate ${LINK_BUTTON}"
>
  ${FIREWALL.rules} rules
</button>`
    }),
    fact({
      heading: label('Last Modified'),
      body: person(FIREWALL.author, `${FIREWALL.editedAgo} by ${FIREWALL.author}`)
    }),
    fact({
      cell: 'col-span-2 flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-4',
      row: 'flex min-h-7 min-w-0 flex-wrap items-center gap-(--spacing-xs)',
      heading: label('Modules'),
      body: FIREWALL.modules
        .map((name) => `<Tag label="${name}" severity="secondary" size="small" class="shrink-0" />`)
        .join('\n')
    })
  ]),
  stateBand(`<p class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)">
  ${firewallSentence(FIREWALL.modules)} inspect every request before it reaches
  ${FIREWALL.application.name}. The rules run in order, and the first one that refuses a request
  ends it.
</p>

${documentationButton(FIREWALL.documentation)}`)
])

export const FIREWALL_SUMMARY = {
  template: FIREWALL_TEMPLATE,
  parts: [
    'Avatar',
    'Button',
    'CardBox',
    'Dropdown',
    'IconButton',
    'StatusIndicator',
    'Tag',
    'Tooltip'
  ]
}

const PATHS = [
  { label: 'Azion CLI', value: 'cli' },
  { label: 'GitHub Actions', value: 'actions' }
]

const INSTALL_STEP = {
  title: 'Install the Azion CLI',
  description:
    'Install it globally. It builds with your framework preset and ships straight to the edge.',
  tabs: [
    { label: 'npm', value: 'npm', language: 'bash', code: 'npm install -g azion' },
    { label: 'yarn', value: 'yarn', language: 'bash', code: 'yarn global add azion' },
    { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g azion' },
    { label: 'brew', value: 'brew', language: 'bash', code: 'brew install azion' }
  ]
}

const cliSteps = (name) => [
  INSTALL_STEP,
  {
    title: 'Link your project',
    description:
      'Authenticate, then link the local project to this application so every deploy lands on it.',
    tabs: [
      {
        label: 'Link',
        value: 'link',
        language: 'bash',
        code: ['azion login', `azion link \\\n  --name ${name}`].join('\n')
      }
    ]
  },
  {
    title: 'Deploy and visit your site',
    description:
      'Build and ship. The CLI prints the domain when it finishes, and sync reconciles azion.json with what Console shows.',
    tabs: [
      {
        label: 'Deploy',
        value: 'deploy',
        language: 'bash',
        code: ['azion deploy --auto --local', 'azion sync'].join('\n')
      }
    ]
  }
]

const WORKFLOW = [
  'on:',
  '  push:',
  '    branches: [main]',
  '',
  'jobs:',
  '  deploy:',
  '    runs-on: ubuntu-latest',
  '    steps:',
  '      - uses: actions/checkout@v4',
  '      - run: npm install -g azion',
  '      - run: azion login --token ${{ secrets.AZION_PERSONAL_TOKEN }}',
  '      - run: azion deploy --auto --local'
].join('\n')

const ACTIONS_STEPS = [
  {
    title: 'Store your personal token',
    description:
      'Create a personal token in Account Settings and keep it as the repository secret the workflow authenticates with.',
    tabs: [
      {
        label: 'Secret',
        value: 'secret',
        language: 'bash',
        code: ['gh secret set \\', '  AZION_PERSONAL_TOKEN'].join('\n')
      }
    ]
  },
  {
    title: 'Add the deploy workflow',
    description:
      'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
    tabs: [
      {
        label: 'azion-deploy.yml',
        value: 'workflow',
        fileName: '.github/workflows/azion-deploy.yml',
        language: 'yaml',
        code: WORKFLOW
      }
    ]
  },
  {
    title: 'Push to deploy',
    description:
      'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
    tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
  }
]

const GET_STARTED_TEMPLATE = `<div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
  <header class="group/heading flex flex-col">
    <div class="flex flex-col gap-(--spacing-md) px-(--spacing-xs) md:flex-row md:items-start md:justify-between">
      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)">
            Get started
          </h2>
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Two ways to build and deploy this application. Pick one and follow the steps, or read the
          <a
            href="${CLI_DOCS}"
            target="_blank"
            rel="noopener noreferrer"
            class="${LINK_BUTTON.replace('text-body-sm ', '')}"
            >Azion CLI docs</a
          >.
        </p>
      </div>
      <div class="flex w-full flex-wrap items-center gap-(--spacing-xs) md:w-auto md:shrink-0 md:flex-nowrap">
        <SegmentedButton v-model="path" :options="PATHS" size="large" aria-label="Deploy with" />
      </div>
    </div>
  </header>

  <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
    <div v-for="(step, index) in steps" :key="step.title" class="relative flex min-w-0">
      <span
        v-if="index > 0"
        aria-hidden="true"
        class="absolute right-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
      />
      <CardBox :padded="false" class="min-w-0 flex-1">
        <template #content>
          <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)">
                {{ index + 1 }}
              </span>
              <h3 class="min-w-0 text-heading-xs text-(--text-default)">{{ step.title }}</h3>
            </div>
            <p class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</p>
            <CodeBlock
              :tabs="step.tabs"
              :show-line-numbers="false"
              :copy-aria-label="\`Copy the commands for \${step.title}\`"
              class="mt-(--spacing-xxs) min-w-0"
            />
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</div>`

export const getStarted = (name, initialPath = 'cli') => {
  const CLI_STEPS = cliSteps(name)
  return {
    template: GET_STARTED_TEMPLATE,
    parts: ['CardBox', 'CodeBlock', 'SegmentedButton'],
    vue: ['computed', 'ref'],
    script: [
      declare('PATHS', PATHS),
      '',
      declare('CLI_STEPS', CLI_STEPS),
      '',
      declare('ACTIONS_STEPS', ACTIONS_STEPS),
      '',
      `const path = ref('${initialPath}')`,
      "const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))"
    ],
    state: () => {
      const path = ref(initialPath)
      const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
      return { PATHS, path, steps }
    }
  }
}
