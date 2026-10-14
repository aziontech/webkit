import Accordion from '@aziontech/webkit/accordion'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import Dropdown from '@aziontech/webkit/dropdown'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_SCRIPT,
  compactRow,
  compound,
  controlsHeader,
  declare,
  DELETE_IMPORTS,
  DELETE_SCRIPT,
  deleteDialog,
  fieldRow,
  flushCard,
  headingAction,
  lastModifiedCell,
  LIST_IMPORTS,
  LIST_SCRIPT,
  pageHeading,
  pageMain,
  PAGINATED,
  rowActions,
  SAVE_BAR,
  SAVED_FORM_SCRIPT,
  section,
  tableCard,
  useColumns,
  useDeleteDialog,
  useList,
  useSavedForm,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const FORM = { bindingPolicy: 'STRICT', deploymentPolicy: 'single_version', applyToExisting: false }

const BINDING_POLICIES = [
  { value: 'STRICT', label: 'Strict' },
  { value: 'FLEXIBLE', label: 'Flexible' }
]

const DEPLOYMENT_POLICIES = [
  { value: 'single_version', label: 'Single' },
  { value: 'versioned_urls', label: 'Versioned' }
]

const SETTINGS = [
  {
    id: 'azion-default',
    name: 'Azion Default',
    system: true,
    type: 'Default',
    bindingPolicy: 'Strict',
    deploymentPolicy: 'Single',
    status: 'Active',
    workloadsCount: 0,
    workloadNames: [],
    shared: false,
    lastModified: ''
  },
  {
    id: 's1',
    name: 'magalu-storefront',
    system: false,
    type: 'Default',
    bindingPolicy: 'Strict',
    deploymentPolicy: 'Single',
    status: 'Active',
    workloadsCount: 3,
    workloadNames: ['workload_01', 'workload_05', 'workload_09'],
    shared: true,
    lastModified: '3 days ago'
  },
  {
    id: 's2',
    name: 'azion-storefront',
    system: false,
    type: 'Default',
    bindingPolicy: 'Strict',
    deploymentPolicy: 'Single',
    status: 'Active',
    workloadsCount: 2,
    workloadNames: ['workload_02', 'workload_07'],
    shared: true,
    lastModified: '2 weeks ago'
  },
  {
    id: 's3',
    name: 'azion-storefront-legacy',
    system: false,
    type: 'Default',
    bindingPolicy: 'Flexible',
    deploymentPolicy: 'Single',
    status: 'Inactive',
    workloadsCount: 0,
    workloadNames: [],
    shared: false,
    lastModified: '4 weeks ago'
  },
  {
    id: 's4',
    name: 'docs-preview',
    system: false,
    type: 'Default',
    bindingPolicy: 'Flexible',
    deploymentPolicy: 'Versioned',
    status: 'Inactive',
    workloadsCount: 0,
    workloadNames: [],
    shared: false,
    lastModified: '2 months ago'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'workloadsCount', header: 'Workloads', enableSorting: true, minWidth: 136 },
  { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: 104 },
  { accessorKey: 'bindingPolicy', header: 'Binding policy', enableSorting: true, minWidth: 80 },
  {
    accessorKey: 'deploymentPolicy',
    header: 'Deployment policy',
    enableSorting: true,
    minWidth: 80
  },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const shared = (value, label, policy, disabled = false) => ({ value, label, policy, disabled })

const own = (value, label, policy) => ({ value, label, policy, disabled: false, owned: true })

const SETTING_OPTIONS = [
  shared('azion-default', 'Azion Default', 'single_version'),
  shared('s1', 'magalu-storefront', 'single_version'),
  shared('s2', 'azion-storefront', 'single_version'),
  shared('s3', 'azion-storefront-legacy', 'single_version', true),
  shared('s4', 'docs-preview', 'versioned_urls', true),
  shared('s5', 'analytics-canary', 'versioned_urls'),
  shared('s6', 'auth-service-prod', 'single_version'),
  shared('s7', 'marketing-site-prod', 'single_version'),
  shared('s8', 'status-page-stage', 'single_version', true),
  shared('s9', 'internal-tools-dev', 'single_version'),
  shared('s10', 'blog-platform-stage', 'versioned_urls'),
  own('ws-1020655', 'workload_01', 'single_version'),
  own('ws-1020655-stage', 'workload_01-stage', 'versioned_urls'),
  own('ws-1020828', 'workload_02', 'single_version'),
  own('ws-1020828-stage', 'workload_02-stage', 'versioned_urls'),
  own('ws-1021001', 'workload_03', 'single_version'),
  own('ws-1021001-stage', 'workload_03-stage', 'versioned_urls')
]

const settingName = (id) => SETTING_OPTIONS.find((option) => option.value === id)?.label ?? ''

const optionsFor = (environment) =>
  SETTING_OPTIONS.filter((option) =>
    option.owned
      ? option.value === environment.ownSettingsId
      : option.policy === environment.deploymentPolicy
  )

const binding = (workloadId, name, production) => ({
  id: workloadId,
  name,
  environments: [
    {
      name: 'Production',
      deploymentPolicy: 'single_version',
      policyLabel: 'Single',
      settingsId: production.settingsId,
      ownSettingsId: `ws-${workloadId}`,
      auto: true,
      reach: production.reach
    },
    {
      name: 'Stage',
      deploymentPolicy: 'versioned_urls',
      policyLabel: 'Versioned',
      settingsId: `ws-${workloadId}-stage`,
      ownSettingsId: `ws-${workloadId}-stage`,
      auto: true,
      reach: ''
    }
  ]
})

const WORKLOAD_BINDINGS = [
  binding('1020655', 'workload_01', { settingsId: 's1', reach: '3 workloads' }),
  binding('1020828', 'workload_02', { settingsId: 's2', reach: '2 workloads' }),
  binding('1021001', 'workload_03', { settingsId: 'ws-1021001', reach: '' })
]

const policySelect = ({ model, options, ariaLabel }) => `<Select
  v-model="form.${model}"
  size="large"
  class="w-full"
  :disabled="saving"
  :display-value="(value) => ${options}.find((option) => option.value === value)?.label ?? value"
>
  <Select.Trigger aria-label="${ariaLabel}" />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const DEFAULTS_SECTION = section({
  title: 'New workload defaults',
  hint: 'What the Deployment Setting created with the next environment is born with.',
  body: flushCard([
    fieldRow(
      'Binding policy',
      'Whether a version locks the resource IDs it shipped with. Changing it does not touch the settings that already exist.',
      policySelect({
        model: 'bindingPolicy',
        options: 'bindingPolicies',
        ariaLabel: 'Default binding policy'
      })
    ),
    fieldRow(
      'Deployment policy',
      'Single serves one version and a deploy replaces it; Versioned gives each version its own URL. An environment can only use a setting that matches its own.',
      policySelect({
        model: 'deploymentPolicy',
        options: 'deploymentPolicies',
        ariaLabel: 'Default version policy'
      })
    ),
    compactRow(
      'Apply to existing Deployment Settings',
      'Rewrite every setting this workspace already holds with the values above. Azion Default is never changed.',
      '<Switch v-model="form.applyToExisting" :disabled="saving" aria-label="Apply to existing Deployment Settings" />'
    )
  ])
})

const WORKLOAD_BINDINGS_CARD = `<CardBox :padded="false">
  <template #content>
    <Accordion class="[--accordion-inset:var(--spacing-md)]" type="single" arrow-position="left" collapsible>
      <Accordion.Item value="all-workloads" class="border-b-0">
        <Accordion.Trigger :level="3">
          <span class="flex min-h-12 flex-1 flex-wrap items-center gap-(--spacing-sm)">
            <span class="text-label-md text-(--text-default)">All workloads</span>
            <span class="text-body-sm text-(--text-muted)">{{ reachLabel(workloadBindings.length) }}</span>
            <Tag
              v-if="sharedWorkloads"
              :label="sharedWorkloads + ' on a shared setting'"
              severity="warning"
              size="medium"
            />
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <div class="flex min-w-0 flex-col gap-(--spacing-md) px-(--spacing-md) pb-(--spacing-md)">
            <InputText
              v-model="bindingSearch"
              size="medium"
              placeholder="Search workloads or settings"
              aria-label="Search workloads or Deployment Settings"
              class="w-full"
            >
              <template #iconLeft>
                <i class="pi pi-search" aria-hidden="true" />
              </template>
            </InputText>
            <p v-if="!bindingRows.length" class="py-(--spacing-md) text-body-sm text-(--text-muted)">
              No workload matches that.
            </p>
            <ul v-else class="m-0 flex list-none flex-col gap-0 p-0">
              <li
                v-for="workload in bindingRows"
                :key="workload.id"
                class="flex min-w-0 flex-col gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) py-(--spacing-sm) last:border-b-0"
              >
                <div class="flex min-w-0 flex-wrap items-center justify-between gap-(--spacing-sm)">
                  <a
                    :href="'/workloads/' + workload.id"
                    class="truncate text-label-md text-(--text-default) no-underline hover:underline"
                  >
                    {{ workload.name }}
                  </a>
                </div>
                <div
                  v-for="environment in workload.environments"
                  :key="environment.name"
                  class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
                >
                  <Tag :label="environment.name" severity="secondary" size="medium" />
                  <Tag :label="environment.policyLabel" severity="info" size="medium" />
                  <Select
                    v-model="environment.settingsId"
                    size="medium"
                    class="min-w-0 grow basis-(--container-2xs)"
                    :display-value="settingName"
                  >
                    <Select.Trigger :aria-label="'Deployment Setting for ' + workload.name + ' ' + environment.name" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in optionsFor(environment)"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.disabled"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                  <Tag v-if="environment.auto" label="Linked automatically" severity="secondary" size="medium" />
                  <Tag v-if="environment.reach" :label="'Shared · ' + environment.reach" severity="warning" size="medium" />
                </div>
              </li>
            </ul>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  </template>
</CardBox>`

const CELLS = [
  `<template #cell-name="{ value, row }">
  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="truncate">{{ value }}</span>
    <Tag v-if="row.system" label="Azion" severity="secondary" size="medium" />
  </span>
</template>`,
  `<template #cell-workloadsCount="{ row }">
  <Tooltip :text="row.workloadNames.length ? row.workloadNames.join(' · ') : 'No environment publishes with this setting yet.'">
    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
      <Tag v-if="row.shared" label="Shared" severity="warning" size="medium" />
      <span class="truncate" :class="row.workloadsCount ? '' : 'text-(--text-disabled)'">
        {{ reachLabel(row.workloadsCount) }}
      </span>
    </span>
  </Tooltip>
</template>`,
  `<template #cell-type="{ value }">
  <Tag :label="value" severity="info" size="medium" />
</template>`,
  `<template #cell-bindingPolicy="{ value }">
  <span class="truncate">{{ value }}</span>
</template>`,
  `<template #cell-deploymentPolicy="{ value }">
  <span class="truncate">{{ value }}</span>
</template>`,
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="value === 'Active' ? 'success' : 'secondary'" size="medium" />
</template>`,
  `<template #cell-lastModified="{ value }">
${indent(lastModifiedCell('value'))}
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'Row actions',
    handler: 'onSettingAction',
    when: '!row.system',
    groups: [
      {
        options: [
          { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
          { value: 'duplicate', label: 'Clone', icon: 'pi pi-clone' }
        ]
      },
      { options: [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }] }
    ]
  })
)}
</template>`
]

const SETTINGS_SECTION = section({
  title: 'Deployment Settings',
  hint: 'Every setting this account holds, and the workloads each one publishes to.',
  body: `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(
  controlsHeader({
    placeholder: 'Search settings',
    ariaLabel: 'Search deployment settings',
    filename: 'deployment-settings.csv'
  })
)}

${indent(tableCard({ rows: 'settings', extra: PAGINATED, cells: CELLS }))}
</div>`
})

const TEMPLATE = pageMain(`<div class="min-h-0 flex-1 overflow-auto">
  <section class="layout-column layout-boundary flex min-w-0 flex-col">
${indent(
  pageHeading({
    title: 'Build & Deployment',
    description:
      'Every environment is linked to a Deployment Setting automatically, matching its deployment policy. Point two environments at the same setting when they should publish together.',
    documentation: 'https://www.azion.com/en/documentation/products/deploy/',
    actions: headingAction({ label: 'Create Deployment Settings' })
  }),
  2
)}
    <section class="layout-section-start flex min-w-0 flex-col">
      <Message
        severity="info"
        size="small"
        closable
        label="A Deployment Setting says how a deploy routes: its binding policy, its deployment policy, and its rollout defaults. Every environment is linked to one automatically, matching its own deployment policy — and only a matching setting can be chosen. Point two environments at the same setting and a deploy into it publishes to both."
      />
      <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
${indent(
  [
    DEFAULTS_SECTION,
    section({
      title: 'All workloads',
      hint: 'Every workload, every environment, and the Deployment Setting each one publishes with.',
      body: WORKLOAD_BINDINGS_CARD
    }),
    SETTINGS_SECTION
  ].join('\n'),
  4
)}
      </div>
    </section>
  </section>
${indent(SAVE_BAR)}
${indent(deleteDialog({ heading: 'Delete Deployment setting', description: '{{ deleteDescription }}' }))}
</div>`)

const REACH_SCRIPT = [
  'const reachLabel = (count) => {',
  "  if (!count) return 'No workloads'",
  "  return count === 1 ? '1 workload' : `${count} workloads`",
  '}'
]

const reachLabel = (count) => {
  if (!count) return 'No workloads'
  return count === 1 ? '1 workload' : `${count} workloads`
}

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    ...DELETE_IMPORTS,
    webkitImport('Accordion', 'accordion'),
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('Hint', 'hint'),
    webkitImport('Item', 'item'),
    webkitImport('Select', 'select'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'reactive', 'ref']),
  '',
  declare('form', FORM, 'reactive'),
  ...SAVED_FORM_SCRIPT,
  declare('bindingPolicies', BINDING_POLICIES),
  declare('deploymentPolicies', DEPLOYMENT_POLICIES),
  '',
  ...REACH_SCRIPT,
  declare('settingOptions', SETTING_OPTIONS),
  "const settingName = (id) => settingOptions.find((option) => option.value === id)?.label ?? ''",
  'const optionsFor = (environment) =>',
  '  settingOptions.filter((option) =>',
  '    option.owned',
  '      ? option.value === environment.ownSettingsId',
  '      : option.policy === environment.deploymentPolicy',
  '  )',
  declare('workloadBindings', WORKLOAD_BINDINGS, 'reactive'),
  "const bindingSearch = ref('')",
  'const bindingRows = computed(() => {',
  '  const query = bindingSearch.value.trim().toLowerCase()',
  '  if (!query) return workloadBindings',
  '  return workloadBindings.filter(',
  '    (workload) =>',
  '      workload.name.toLowerCase().includes(query) ||',
  '      workload.environments.some((environment) =>',
  '        settingName(environment.settingsId).toLowerCase().includes(query)',
  '      )',
  '  )',
  '})',
  'const sharedWorkloads = workloadBindings.filter((workload) =>',
  '  workload.environments.some((environment) => environment.reach)',
  ').length',
  '',
  declare('settings', SETTINGS, 'ref'),
  declare('columns', COLUMNS),
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT({ type: false }),
  '',
  ...DELETE_SCRIPT('settings'),
  'const deleteDescription = computed(() => {',
  '  const count = pendingDelete.value?.workloadsCount ?? 0',
  '  if (count === 0) {',
  "    return 'The selected Deployment setting will be deleted. No environment publishes with it. Check the'",
  '  }',
  '  return `The selected Deployment setting will be deleted, and ${reachLabel(count)} will fall back to Azion Default on the next deploy. Check the`',
  '})',
  '',
  'const onSettingAction = (event, value, row) => {',
  "  if (value === 'delete') askDelete(row)",
  '}'
]

const components = {
  ...compound('Accordion', Accordion, ['Item', 'Trigger', 'Content']),
  Button,
  CardBox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  Hint,
  IconButton,
  InputText,
  ...compound('Item', Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  ...compound('Select', Select, ['Trigger', 'Content', 'Option']),
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/BuildDeployment',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Build & Deployment panel of Account Settings (`/account/build-deployment`): a page heading with Documentation and Create Deployment Settings, a closable info message, then three stacked sections: the new-workload defaults form (with the unsaved-changes bar), the All workloads accordion that binds each environment to a Deployment Setting, and the Deployment Settings table with its list controls and a type-to-confirm delete. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `CardBox`, `Item`, `Select`, `Switch`, `Accordion`, `TableRoot`, `Tag`, `Tooltip`, `Dropdown`, `Popover`, `Dialog`, `Message`, `Hint`, `InputText`, `IconButton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const BuildDeployment = {
  render: () => ({
    components,
    setup: () => {
      const settings = ref(structuredClone(SETTINGS))
      const deletion = useDeleteDialog(settings)
      const workloadBindings = reactive(structuredClone(WORKLOAD_BINDINGS))
      const bindingSearch = ref('')
      const bindingRows = computed(() => {
        const query = bindingSearch.value.trim().toLowerCase()
        if (!query) return workloadBindings
        return workloadBindings.filter(
          (workload) =>
            workload.name.toLowerCase().includes(query) ||
            workload.environments.some((environment) =>
              settingName(environment.settingsId).toLowerCase().includes(query)
            )
        )
      })
      const deleteDescription = computed(() => {
        const count = deletion.pendingDelete.value?.workloadsCount ?? 0
        if (count === 0) {
          return 'The selected Deployment setting will be deleted. No environment publishes with it. Check the'
        }
        return `The selected Deployment setting will be deleted, and ${reachLabel(count)} will fall back to Azion Default on the next deploy. Check the`
      })
      const onSettingAction = (event, value, row) => {
        if (value === 'delete') deletion.askDelete(row)
      }
      return {
        ...useSavedForm(FORM),
        bindingPolicies: BINDING_POLICIES,
        deploymentPolicies: DEPLOYMENT_POLICIES,
        reachLabel,
        settingName,
        optionsFor,
        workloadBindings,
        bindingSearch,
        bindingRows,
        sharedWorkloads: workloadBindings.filter((workload) =>
          workload.environments.some((environment) => environment.reach)
        ).length,
        settings,
        columns: COLUMNS,
        ...useList(),
        ...useColumns(COLUMNS, { type: false }),
        ...deletion,
        deleteDescription,
        onSettingAction
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Strict and Single defaults, three workloads in the All workloads accordion, and five Deployment Settings led by Azion Default; change a default to raise the save bar.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
