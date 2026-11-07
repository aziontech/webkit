import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import EmptyState from '@aziontech/webkit/empty-state'
import Flow from '@aziontech/webkit/flow'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputGroupRoot from '@aziontech/webkit/input-group-root'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import TabView from '@aziontech/webkit/tab-view'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { DEPLOYMENT_LOGS_COMPONENTS, deploymentLogs } from './_deployment-logs-markup'
import {
  headingAction as formsHeadingAction,
  pageHeading as formsPageHeading,
  saveBar as formsSaveBar,
  section as formsSection
} from './_forms-markup'
import { REFRESH_SCRIPT, useListRefresh } from './_lists-markup'
import {
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
  WORKLOAD_TABS
} from './_shell-markup'
import {
  blockScript,
  blockState,
  CLI_APPLICATION,
  CLI_APPLICATION_SUMMARY,
  declare,
  deploymentFooter,
  FIREWALL,
  FIREWALL_SUMMARY,
  getStarted,
  SUMMARY_COMPONENTS,
  WORKLOAD,
  WORKLOAD_SUMMARY_IN_PAGE
} from './_summary-markup'

const overviewColumn = (blocks, sectionEnd = ' pb-(--layout-section-gap)') =>
  `<div class="layout-column layout-boundary flex min-w-0 flex-col">
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)${sectionEnd}">
${indent(blocks.join('\n\n'), 2)}
  </section>
</div>`

const APPLICATION_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'versions', label: 'Versions' },
  { value: 'build', label: 'Build' },
  { value: 'deployments', label: 'Deployments' }
]

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

const applicationTab = (panel) => `<main class="flex h-full flex-col">
${indent(pageTabs())}

  <div class="relative flex min-h-0 flex-1 flex-col">
    <section class="min-h-0 flex-1 overflow-auto">
      <div class="flex min-h-full flex-col">
${indent(panel, 4)}
      </div>
    </section>
  </div>
</main>`

const VERSION_COLUMNS = [
  { accessorKey: 'name', header: 'Version', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'description', header: 'Description', grow: 2 },
  { accessorKey: 'state', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'createdAt', header: 'Created', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const VERSION_ROWS = [
  [
    'ANWDC7RA',
    'active',
    'Reorder Rules Engine rules',
    'Bruno Germano',
    '2026-11-05T17:37:18.145Z',
    '21 hours ago'
  ],
  [
    'APA7237R',
    'ready',
    'Add rule "Security headers"',
    'Gab Lisboa',
    '2026-11-03T14:37:18.145Z',
    '3 days ago'
  ],
  [
    'AQO0RYO8',
    'ready',
    'Bypass cache for /api/*',
    'Robson Junior',
    '2026-11-02T14:37:18.145Z',
    '4 days ago'
  ],
  [
    'AS1UHU4P',
    'ready',
    'Add rule "Redirect /blog to docs"',
    'Isaque Böck',
    '2026-11-01T14:37:18.145Z',
    '5 days ago'
  ],
  [
    'ATFO7PL6',
    'ready',
    'Add function instance "image-resize"',
    'Rafael Garbinatto',
    '2026-10-31T14:37:18.145Z',
    '6 days ago'
  ],
  [
    'AUTHXL1N',
    'ready',
    'Reorder Rules Engine rules',
    'Herbert Júlio',
    '2026-10-30T14:37:18.145Z',
    '1 week ago'
  ],
  [
    'AW7BNGI4',
    'ready',
    'Add rule "Security headers"',
    'Rafael Umman',
    '2026-10-29T14:37:18.145Z',
    '1 week ago'
  ],
  [
    'AXL5DBYL',
    'ready',
    'Bypass cache for /api/*',
    'Marcus Grando',
    '2026-10-28T14:37:18.145Z',
    '1 week ago'
  ],
  [
    'AYYZ37F2',
    'ready',
    'Add rule "Redirect /blog to docs"',
    'Bruno Germano',
    '2026-10-27T14:37:18.145Z',
    '1 week ago'
  ],
  [
    'A1CST2VJ',
    'ready',
    'Add function instance "image-resize"',
    'Gab Lisboa',
    '2026-10-26T14:37:18.145Z',
    '2 weeks ago'
  ],
  [
    'A2QMIYC0',
    'ready',
    'Reorder Rules Engine rules',
    'Robson Junior',
    '2026-10-24T14:37:18.145Z',
    '2 weeks ago'
  ],
  [
    'A44G8TSH',
    'ready',
    'Add rule "Security headers"',
    'Isaque Böck',
    '2026-10-24T14:37:18.145Z',
    '2 weeks ago'
  ],
  [
    'A5I9YP8Y',
    'archived',
    'Bypass cache for /api/*',
    'Rafael Garbinatto',
    '2026-10-22T14:37:18.145Z',
    '2 weeks ago'
  ]
].map(([id, state, description, author, createdAt, createdAgo]) => ({
  id,
  name: id,
  state,
  description,
  author,
  createdAt,
  createdAgo
}))

const VERSION_STATES = {
  active: { label: 'Deployed', severity: 'primary' },
  ready: { label: 'Ready', severity: 'success' },
  archived: { label: 'Archived', severity: 'secondary' }
}

const DEPLOYABLE = ['ready', 'active']

const VERSIONS_PANEL = `<div class="layout-column layout-boundary flex min-w-0 flex-col">
${indent(
  formsPageHeading({
    title: 'Versions',
    description:
      "Each version is an isolated snapshot of this application's configuration. Open one to view it, or deploy a Ready version.",
    actions: formsHeadingAction({ label: 'New Version' })
  })
)}

  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
    <header class="flex items-center gap-(--layout-group-gap)">
      <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
        <div class="flex shrink-0 items-center">
          <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
        </div>
        <InputText
          v-model="search"
          size="medium"
          placeholder="Search versions"
          aria-label="Search versions"
          class="min-w-36 grow basis-(--container-2xs)"
        >
          <template #iconLeft>
            <i class="pi pi-search" aria-hidden="true" />
          </template>
        </InputText>
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <Tooltip text="Refresh" class="shrink-0">
          <IconButton icon="pi pi-refresh" kind="outlined" size="medium" :loading="loading" aria-label="Refresh" @click="refresh" />
        </Tooltip>
        <Tooltip text="Download CSV" class="shrink-0">
          <IconButton
            icon="pi pi-download"
            kind="outlined"
            size="medium"
            :disabled="!tableRef"
            aria-label="Download CSV"
            @click="tableRef?.exportCsv({ filename: '${CLI_APPLICATION.name}-versions.csv' })"
          />
        </Tooltip>
        <Tooltip text="Columns" class="shrink-0">
          <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
        </Tooltip>
      </div>
    </header>

    <CardBox :padded="false">
      <template #content>
        <TableRoot
          ref="tableRef"
          v-model:pagination="pagination"
          v-model:globalFilter="search"
          v-model:columnVisibility="columnVisibility"
          :data="versions"
          :columns="columns"
          row-key="id"
          enable-sorting
          paginated
          :page-size="10"
          :border="false"
          :loading="loading"
        >
          <template #cell-name="{ value, row }">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="cursor-pointer truncate font-(family-name:--font-code) text-body-sm text-(--text-default) hover:underline">
                {{ value }}
              </span>
              <span v-if="row.id === latestId" class="shrink-0 text-body-sm text-(--text-muted)">
                Latest
              </span>
            </div>
          </template>

          <template #cell-description="{ value }">
            <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
          </template>

          <template #cell-state="{ value }">
            <Tag :label="versionStates[value].label" :severity="versionStates[value].severity" size="medium" />
          </template>

          <template #cell-createdAt="{ row }">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Tooltip :text="row.author">
                <Avatar :alt="row.author" :label="row.author" size="small" kind="square" />
              </Tooltip>
              <span class="truncate text-body-sm text-(--text-muted)">{{ row.createdAgo }}</span>
            </div>
          </template>

          <template #cell-actions="{ row }">
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger>
                <Tooltip text="Version actions">
                  <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Version actions" />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option value="open" label="Open configuration">
                  <template #left>
                    <i class="pi pi-eye" aria-hidden="true" />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option value="deploy" label="Deploy" :disabled="!deployable.includes(row.state)">
                  <template #left>
                    <i class="pi pi-cloud-upload" aria-hidden="true" />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </template>
        </TableRoot>
      </template>
    </CardBox>
  </section>
</div>`

const VERSIONS_PAGE = {
  parts: [
    'Avatar',
    'Button',
    'CardBox',
    'Dropdown',
    'IconButton',
    'InputText',
    'TableRoot',
    'Tag',
    'Tooltip'
  ],
  vue: ['ref'],
  script: [
    declare('columns', VERSION_COLUMNS),
    '',
    declare('versions', VERSION_ROWS),
    '',
    declare('versionStates', VERSION_STATES),
    '',
    declare('deployable', DEPLOYABLE),
    "const latestId = 'ANWDC7RA'",
    '',
    "const search = ref('')",
    'const pagination = ref({ pageIndex: 0, pageSize: 10 })',
    'const tableRef = ref(null)',
    'const columnVisibility = ref({})',
    '',
    ...REFRESH_SCRIPT
  ],
  state: () => ({
    columns: VERSION_COLUMNS,
    versions: VERSION_ROWS,
    versionStates: VERSION_STATES,
    deployable: DEPLOYABLE,
    latestId: 'ANWDC7RA',
    search: ref(''),
    pagination: ref({ pageIndex: 0, pageSize: 10 }),
    tableRef: ref(null),
    columnVisibility: ref({}),
    ...useListRefresh()
  })
}

const BUILD_ROW_ACTIONS = 'justify-end flex-1 max-w-(--container-3xs)'

const buildRow = (title, description, control) => `<Item size="small">
  <Item.Content>
    <Item.Title>${title}</Item.Title>
    <Item.Description>${description}</Item.Description>
  </Item.Content>
  <Item.Actions class="${BUILD_ROW_ACTIONS}">
${indent(control, 2)}
  </Item.Actions>
</Item>`

const GIT_CONNECT = `<CardBox>
  <template #content>
    <EmptyState
      size="medium"
      title="Connect your repository"
      description="Choose a Git provider, then pick the repository Azion builds this application from. Until then, new code reaches it from the CLI only."
      class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
    >
      <template #icon>
        <span class="relative flex size-10 items-center justify-center">
          <span
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
          />
          <span
            aria-hidden="true"
            class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
          />
          <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)">
            <i class="ai ai-github text-body-md leading-none text-(--text-default)" aria-hidden="true" />
          </span>
        </span>
      </template>
      <template #actions>
        <Button label="Continue with GitHub" icon="ai ai-github" kind="secondary" size="large" />
        <Link label="Manage connected providers" href="#" size="large" />
      </template>
    </EmptyState>
  </template>
</CardBox>`

const BUILD_CONFIGURATION = `<form aria-label="Build configuration" novalidate @submit.prevent="save">
  <CardBox :padded="false">
    <template #content>
      <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0" :disabled="saving">
        <legend class="sr-only">Build configuration</legend>
        <Item.List>
${indent(
  [
    buildRow(
      'Framework preset',
      'The preset the Azion CLI builds with.',
      `<Tooltip
  text="Detected from azion.config and can't be changed here."
  class="flex-1 cursor-not-allowed"
>
  <InputText
    model-value="${CLI_APPLICATION.framework.label}"
    size="large"
    disabled
    class="pointer-events-none w-full"
    aria-label="Framework preset"
  />
</Tooltip>`
    ),
    buildRow(
      'Build command',
      'The command that builds the application.',
      `<InputText
  v-model="buildConfig.buildCommand"
  size="large"
  :disabled="saving"
  class="w-full font-(family-name:--font-code)"
  aria-label="Build command"
/>`
    ),
    buildRow(
      'Deploy command',
      'The command that deploys the build to the edge.',
      `<InputText
  v-model="buildConfig.deployCommand"
  size="large"
  :disabled="saving"
  class="w-full font-(family-name:--font-code)"
  aria-label="Deploy command"
/>`
    )
  ].join('\n\n'),
  5
)}
        </Item.List>
      </fieldset>
    </template>
  </CardBox>
</form>`

const API_TOKEN = `${CLI_APPLICATION.name} build token`

const BUILD_DEPLOYMENT = `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(
  buildRow(
    'API token',
    'Stored as the AZION_PERSONAL_TOKEN GitHub secret.',
    `<InputGroupRoot class="w-full">
  <InputText model-value="${API_TOKEN}" size="large" class="flex-1" aria-label="API token" readonly />
  <CopyButton kind="transparent" value="${API_TOKEN}" aria-label="Copy API token" />
</InputGroupRoot>`
  ),
  3
)}
    </Item.List>
  </template>
</CardBox>`

const BUILD_PANEL = `<div class="flex min-w-0 flex-col">
  <div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(
  formsPageHeading({
    title: 'Build',
    description:
      'This application has no repository. Connect one here, or keep deploying from your terminal.',
    actions: formsHeadingAction({ label: 'Deploy', icon: 'pi pi-cloud-upload' })
  }),
  2
)}

    <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
${indent(
  [
    formsSection({
      title: 'Git repository',
      hint: 'Connect a provider to build this application from a repository.',
      anchor: true,
      body: GIT_CONNECT
    }),
    formsSection({
      title: 'Build configuration',
      hint: 'How the Azion CLI builds this application.',
      anchor: true,
      body: BUILD_CONFIGURATION
    }),
    formsSection({
      title: 'Deployment',
      hint: 'The personal token the workflow authenticates with, kept as a repository secret.',
      anchor: true,
      body: BUILD_DEPLOYMENT
    })
  ].join('\n\n'),
  3
)}
    </div>
  </div>

${indent(
  formsSaveBar({
    label: 'Build configuration changed.',
    hint: 'Saving applies it to the next build of this application.',
    bound: true
  })
)}
</div>`

const BUILD_DEFAULTS = { buildCommand: 'azion build', deployCommand: 'azion deploy --local' }

const BUILD_PAGE = {
  parts: [
    'Button',
    'CardBox',
    'CopyButton',
    'EmptyState',
    'Hint',
    'InputGroupRoot',
    'InputText',
    'Item',
    'Link',
    'Tooltip'
  ],
  vue: ['computed', 'reactive', 'ref'],
  script: [
    declare('buildDefaults', BUILD_DEFAULTS),
    '',
    'const buildConfig = reactive({ ...buildDefaults })',
    'const saving = ref(false)',
    'const baseline = ref(JSON.stringify(buildConfig))',
    'const dirty = computed(() => JSON.stringify(buildConfig) !== baseline.value)',
    '',
    'const save = () => {',
    '  saving.value = true',
    '  setTimeout(() => {',
    '    baseline.value = JSON.stringify(buildConfig)',
    '    saving.value = false',
    '  }, 800)',
    '}',
    '',
    'const discard = () => {',
    '  Object.assign(buildConfig, JSON.parse(baseline.value))',
    '}'
  ],
  state: () => {
    const buildConfig = reactive({ ...BUILD_DEFAULTS })
    const saving = ref(false)
    const baseline = ref(JSON.stringify(buildConfig))
    const dirty = computed(() => JSON.stringify(buildConfig) !== baseline.value)
    const save = () => {
      saving.value = true
      setTimeout(() => {
        baseline.value = JSON.stringify(buildConfig)
        saving.value = false
      }, 800)
    }
    const discard = () => {
      Object.assign(buildConfig, JSON.parse(baseline.value))
    }
    return { buildConfig, saving, dirty, save, discard }
  }
}

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

const CHECKLIST = `<CardBox
  :padded="false"
  :data-complete="complete || null"
  class="data-complete:[&>header]:border-b-0"
>
  <template #header>
    <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
      <h2 class="truncate text-label-md text-(--text-default)">${CHECKLIST_TITLE}</h2>

      <Tag
        :label="complete ? 'Ready for production' : \`\${doneCount} of \${productionSteps.length}\`"
        :severity="complete ? 'success' : 'secondary'"
        size="small"
        class="shrink-0"
      />
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
    <div v-if="!complete" class="flex flex-col">
      <Item
        v-for="step in productionSteps"
        :key="\`\${step.id}:\${step.done ? 'done' : 'todo'}\`"
        as-child
        size="small"
      >
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
            <Tag
              :label="complete ? 'Ready for production' : \`\${doneCount} of \${productionSteps.length}\`"
              :severity="complete ? 'success' : 'secondary'"
              size="small"
              class="shrink-0"
            />
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
            :key="\`\${step.id}:\${step.done ? 'done' : 'todo'}\`"
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
              <Tag
                v-if="step.done"
                icon="pi pi-check"
                :label="step.doneNote || 'Done'"
                severity="secondary"
                size="medium"
              />
              <Button
                v-else
                :label="step.actionLabel || step.title"
                kind="outlined"
                size="small"
                @click="detailOpen = false"
              />
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
  removeLabel: 'Remove Firewall',
  emptyLabel: 'No firewalls yet.',
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
  removeLabel: 'Remove Custom Page',
  emptyLabel: 'No custom pages yet.',
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
  removeLabel: 'Remove Connector',
  emptyLabel: 'No connectors yet.',
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
        :data-link="Boolean(node.href) || null"
        class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
      >
        <span class="truncate underline-offset-2" :class="node.href ? 'group-hover/link:underline' : ''">
          {{ node.name || '—' }}
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

          <Dropdown.Group :label="node.bind.options.length ? node.bind.groupLabel : ''">
            <template v-if="!node.bind.options.length" #top>
              <span class="text-body-xs text-(--text-muted)">{{ node.bind.emptyLabel }}</span>
            </template>
            <Dropdown.Option
              v-for="option in node.bind.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :selected="String(option.value) === String(node.bind.boundId)"
            />
          </Dropdown.Group>

          <Dropdown.Group>
            <Dropdown.Option value="__create__" :label="node.bind.createLabel" />
          </Dropdown.Group>
        </Dropdown>

        <Tooltip v-if="node.bind.boundId && node.removable" :text="node.bind.removeLabel">
          <IconButton icon="pi pi-times" kind="outlined" size="small" :aria-label="node.bind.removeLabel" />
        </Tooltip>
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

const DEPLOY = '<Button label="Deploy" kind="outlined" size="medium" icon="pi pi-cloud-upload" />'

const WORKLOAD_MAIN = `<main class="flex h-full flex-col">
${indent(pageTabs(DEPLOY))}

  <section class="min-h-0 flex-1 overflow-auto">
    <div>
${indent(overviewColumn([WORKLOAD_SUMMARY_IN_PAGE.template, CHECKLIST, TOPOLOGY], ''), 3)}
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
  vue: ['computed', 'reactive', 'ref'],
  script: [
    declare('productionSteps', PRODUCTION_STEPS),
    '',
    declare('topologyLevels', TOPOLOGY_LEVELS),
    '',
    'const detailOpen = ref(false)',
    'const openNodes = reactive({})',
    '',
    'const doneCount = computed(() => productionSteps.filter((step) => step.done).length)',
    'const complete = computed(',
    '  () => productionSteps.length > 0 && doneCount.value === productionSteps.length',
    ')'
  ],
  state: () => {
    const doneCount = computed(() => PRODUCTION_STEPS.filter((step) => step.done).length)
    return {
      productionSteps: PRODUCTION_STEPS,
      topologyLevels: TOPOLOGY_LEVELS,
      detailOpen: ref(false),
      openNodes: reactive({}),
      doneCount,
      complete: computed(
        () => PRODUCTION_STEPS.length > 0 && doneCount.value === PRODUCTION_STEPS.length
      )
    }
  }
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
      ['14:02:39', '[upload] Uploading .edge/storage to bucket webkit-sample', 'text'],
      ['14:02:40', '[upload] Prefix 20260722112530 (rotate-prefix)', 'text'],
      ['14:02:46', '[upload] 24 objects updated successfully', 'success'],
      ['14:02:47', '[upload] Storage Bucket webkit-sample successfully updated', 'success']
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
      ['14:02:53', '[manifest] Updated Application webkit-sample-vue with ID 1784552864', 'text'],
      ['14:02:55', '[manifest] Cache Setting __DEFAULT__ successfully updated', 'success'],
      ['14:02:56', '[manifest] Application webkit-sample-vue successfully updated', 'success']
    ]
  },
  {
    key: 'connector',
    title: 'Connector',
    description: 'Storage connector pointed at the bucket',
    durationLabel: '1.9s',
    logs: [
      ['14:02:56', '[manifest] Creating Connector origin-storage-default (storage)', 'text'],
      ['14:02:57', '[manifest] Bucket webkit-sample · prefix 20260722112530', 'text'],
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
      [
        '14:03:04',
        '[manifest] Workload webkit-sample with id 1784675753 successfully updated',
        'success'
      ],
      [
        '14:03:05',
        '[manifest] Workload Deployment d_7Kq2mVbHZ with id 5591028 successfully created',
        'success'
      ],
      ['14:03:06', '[manifest] Environment production', 'text'],
      ['14:03:07', '[manifest] Updated Domain webkit-sample with ID 1784675753', 'text']
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
      ['14:02:39', '[upload] Uploading .edge/storage to bucket webkit-sample', 'text'],
      ['14:02:40', '[upload] Prefix 20260730140211 (rotate-prefix)', 'text'],
      ['14:02:46', '[upload] 24 objects updated successfully', 'success'],
      ['14:02:47', '[upload] Storage Bucket webkit-sample successfully updated', 'success']
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
      ['14:02:53', '[manifest] Updated Application webkit-sample-vue with ID 1784552864', 'text'],
      ['14:02:55', '[manifest] Cache Setting __DEFAULT__ successfully updated', 'success'],
      ['14:02:56', '[manifest] Application webkit-sample-vue successfully updated', 'success']
    ]
  },
  {
    key: 'connector',
    title: 'Connector',
    description: 'Storage connector pointed at the bucket',
    durationLabel: '1.8s',
    logs: [
      ['14:02:56', '[manifest] Creating Connector origin-storage-default (storage)', 'text'],
      ['14:02:57', '[manifest] Bucket webkit-sample · prefix 20260730140211', 'text'],
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
        '409 Conflict: a rule with this behavior is already bound to workload webkit-sample',
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
    label: `Live at https://${DEPLOYMENT_DOMAIN} — published to webkit-sample (production) in 1m 1s.`
  },
  author: 'Rafael Garbinatto',
  createdOn: 'October 29, 2026, 11:30:58 AM',
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
  createdOn: 'November 06, 2026, 10:30:58 AM',
  createdAgo: '1 hour ago',
  duration: '48s',
  environment: 'Preview',
  trigger: { label: 'Console', icon: 'pi pi-desktop', source: 'Azion Console (UI)' },
  prefix: '20260730140211',
  steps: FAILED_STEPS,
  logs: { state: 'failed', at: 'rules' }
}

const DEPLOYMENT_LINK =
  'group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)'

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
      tooltip: 'Open webkit-sample in Workloads',
      href: '/workloads/1784675753',
      label: 'webkit-sample'
    })
  ),
  detailFact(
    'Application',
    detailLink({
      tooltip: 'Open webkit-sample-vue in Application',
      href: '/applications/1784552864',
      label: 'webkit-sample-vue'
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
  <span class="truncate">webkit-sample</span>
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

const DEPLOYMENT_SETTINGS = deploymentFooter({
  name: 'Azion Default',
  reach: '',
  fields: [
    { label: 'Binding policy', value: 'Strict' },
    { label: 'Deployment policy', value: 'Single' },
    { label: 'Canary', value: 'Disabled', state: false },
    { label: 'Skew protection', value: 'Disabled', state: false }
  ]
})

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
  <template #header>
    <p class="min-w-0 truncate text-heading-xs text-(--text-default)">Deployment Logs</p>

    <div class="flex shrink-0 items-center gap-(--spacing-sm)">
${indent(logsSummary(record), 3)}
      <SegmentedButton v-model="logView" :options="logViews" size="medium" aria-label="Log view" />
    </div>
  </template>

  <template #content>
${indent(logs.template, 2)}
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

    <CardBox :padded="false">
      <template #header>
        <p class="text-heading-xs text-(--text-default)">Deployment Details</p>

        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
${indent(visitButton(record), 5)}

${indent(DEPLOYMENT_MENU, 5)}
        </div>
      </template>

      <template #content>
        <div class="grid grid-cols-1 gap-(--spacing-lg) p-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
${indent(deploymentFacts(record).join('\n'), 5)}
        </div>

        <div class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas)">
${indent(DEPLOYMENT_SETTINGS, 5)}
        </div>
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
        script: []
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
  EmptyState,
  Hint,
  InputGroupRoot,
  InputText,
  'Item.List': Item.List,
  Link,
  TableRoot,
  ...ENVIRONMENT_CRUMB_COMPONENTS,
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
  crumb = false,
  tabs,
  activeTab = 'overview',
  main,
  blocks,
  description,
  scroll = 'overflow-auto'
}) => {
  const template = shell({
    withBreadcrumb: true,
    ...(crumb ? { crumb: ENVIRONMENT_CRUMB } : {}),
    main: pageScroll(main, scroll)
  })
  const tabState = tabs ? { tabs, activeTab: ref(activeTab) } : {}
  const crumbState = crumb ? environmentCrumbState() : { breadcrumb }
  return {
    render: () => ({
      components,
      setup: () => ({
        ...shellState(active),
        ...crumbState,
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
                parts: [
                  'Breadcrumb',
                  ...(tabs ? ['TabView'] : []),
                  ...(crumb ? ENVIRONMENT_CRUMB_PARTS : [])
                ],
                active,
                declarations: [
                  ...(crumb
                    ? ENVIRONMENT_CRUMB_DECLARATIONS
                    : ['', declare('breadcrumb', breadcrumb)]),
                  ...(tabs ? [declare('tabs', tabs)] : [])
                ],
                state: [
                  ...(tabs ? [`const activeTab = ref('${activeTab}')`] : []),
                  ...(crumb ? ENVIRONMENT_CRUMB_STATE : [])
                ]
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
          'The Overview tab of a resource detail page as the console draws it: the platform shell with the resource breadcrumb, the full-bleed tab bar, then the column that opens on the resource summary card. The Application Overview (ApplicationDetail, `/applications/:id`) follows it with Get started for an application made from the CLI, and the same page plots its Versions tab (the versions table) and its Build tab (repository, build configuration and token bands); the Workload Overview (WorkloadDetail, `/workloads/:id`) ends its breadcrumb on the environment picker and follows the summary with the production checklist and the deployment topology; the Firewall Overview (FirewallDetail, `/firewall/:id`) stops at the summary. The Deployment page (DeploymentDetail, `/deployments/:id`) sits in the same shell without tabs: a status banner, the Deployment Details card with its Deployment Settings band, and the Deployment Logs card whose header carries the duration or the status and the Phased or Complete switch over the DeploymentLogs steps. The version page of an application is the ApplicationVersion template and the deploy drawers opened from these pages are the DeployDrawer template. The Deployments tab of an application and of a workload is the same controls row and deployments table as the Templates/Platform/Lists/Deployments template, scoped to the resource (the application tab adds a small Deployments heading with Documentation and an outlined Deploy action); the workload Settings tab is the WorkloadSettings story of Templates/Platform/Forms/SettingsPage. Built from the platform shell, `Select`, `TabView`, `TableRoot`, `EmptyState`, `InputGroup`, `CardBox`, `Dropdown`, `Popover`, `Accordion`, `Flow`, `Item`, `Drawer`, `Message`, `LogView`, `CodeBlock` and `SegmentedButton`.'
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
    'An application made from the CLI: its Overview, Versions, Build and Deployments tabs, the summary with its Azion domain and no repository connected, and Get started with the Azion CLI and GitHub Actions paths.'
})

export const ApplicationVersions = page({
  active: 'applications',
  breadcrumb: [{ label: 'Applications', href: '/applications' }, { label: CLI_APPLICATION.name }],
  tabs: APPLICATION_TABS,
  activeTab: 'versions',
  main: applicationTab(VERSIONS_PANEL),
  blocks: [VERSIONS_PAGE],
  description:
    'The Versions tab of the same application: the small Versions heading with New Version, the controls row (Filter, search, Refresh, Download CSV, Columns) and the paginated versions table, each row with its code-set name and Latest mark, the comment, the state Tag, who built it and when, and the Open configuration or Deploy actions.'
})

export const ApplicationBuild = page({
  active: 'applications',
  breadcrumb: [{ label: 'Applications', href: '/applications' }, { label: CLI_APPLICATION.name }],
  tabs: APPLICATION_TABS,
  activeTab: 'build',
  main: applicationTab(BUILD_PANEL),
  blocks: [BUILD_PAGE],
  description:
    'The Build tab of an application made from the CLI: the small Build heading with an outlined Deploy, the Git repository band holding the Connect your repository card, the Build configuration band with the read-only framework preset and the build and deploy commands, and the Deployment band with the API token. Editing a command raises the save bar.'
})

export const WorkloadOverview = page({
  active: 'workloads',
  crumb: true,
  tabs: WORKLOAD_TABS,
  main: WORKLOAD_MAIN,
  blocks: [WORKLOAD_SUMMARY_IN_PAGE, WORKLOAD_PAGE],
  description:
    'A workload: the breadcrumb ends on its environment picker, the outlined Deploy action sits on the tab row, the summary carries its Deployment Settings band (its own environment menu shows only below md, where the breadcrumb is hidden), the production checklist expands into a drawer, and the deployment topology runs from domains to storage with Bind controls on the open Firewall and Custom Page slots.'
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
  'A deployment that went live: the success banner, the Deployment Details card with every fact and its Deployment Settings band for Azion Default, and the Deployment Logs card with the run duration and the Phased or Complete switch over the phased steps.'
)

export const DeploymentFailed = deploymentStory(
  FAILED_DEPLOYMENT,
  FAILED_PAGE,
  'A deployment the Rules Engine rejected: the danger banner with Redeploy, Visit disabled until the deployment is live, and the Deployment Logs card with the Error status, open on the failed step with the rest skipped.'
)
