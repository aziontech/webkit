import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_SCRIPT,
  compound,
  controlsHeader,
  declare,
  DELETE_IMPORTS,
  DELETE_SCRIPT,
  deleteDialog,
  headingAction,
  lastModifiedCell,
  LIST_IMPORTS,
  LIST_SCRIPT,
  listPage,
  pageHeading,
  pageMain,
  PAGINATED,
  rowActions,
  tableCard,
  useColumns,
  useDeleteDialog,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const ENVIRONMENTS = [
  {
    id: 'env-production',
    name: 'Production',
    deploymentPolicy: 'single_version',
    workloadsCount: 20,
    robotsPolicy: 'preserve_origin',
    protectionLabel: '',
    branchLabel: 'Branch is main',
    lastModified: '2 days ago'
  },
  {
    id: 'env-stage',
    name: 'Stage',
    deploymentPolicy: 'versioned_urls',
    workloadsCount: 20,
    robotsPolicy: 'noindex',
    protectionLabel: '',
    branchLabel: 'Branch starts with release/',
    lastModified: '1 week ago'
  },
  {
    id: 'env-preview',
    name: 'Preview',
    deploymentPolicy: 'versioned_urls',
    workloadsCount: 0,
    robotsPolicy: 'noindex',
    protectionLabel: 'IP allowlist · 1 range',
    branchLabel: '',
    lastModified: '3 weeks ago'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  {
    accessorKey: 'deploymentPolicy',
    header: 'Deployment policy',
    enableSorting: true,
    minWidth: 104
  },
  { accessorKey: 'workloadsCount', header: 'Workloads', enableSorting: true, minWidth: 136 },
  { accessorKey: 'robotsPolicy', header: 'Robots', enableSorting: true, minWidth: 80 },
  { accessorKey: 'protectionLabel', header: 'Protection', minWidth: 80 },
  { accessorKey: 'branchLabel', header: 'Branch tracking', minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const POLICY_LABELS = { single_version: 'Single', versioned_urls: 'Versioned' }

const ROBOTS_LABELS = { preserve_origin: 'Preserve origin', index: 'Index', noindex: 'No index' }

const MUTED_CELL = (key, fallback) => `<template #cell-${key}="{ value }">
  <span class="truncate" :class="value ? '' : 'text-(--text-disabled)'">
    {{ value || '${fallback}' }}
  </span>
</template>`

const CELLS = [
  `<template #cell-name="{ value }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="truncate">{{ value }}</span>
  </div>
</template>`,
  `<template #cell-deploymentPolicy="{ value }">
  <Tag :label="policyLabels[value]" severity="info" size="medium" />
</template>`,
  `<template #cell-workloadsCount="{ value }">
  <span class="truncate" :class="value ? '' : 'text-(--text-disabled)'">
    {{ value === 1 ? '1 workload' : value + ' workloads' }}
  </span>
</template>`,
  `<template #cell-robotsPolicy="{ value }">
  <span class="truncate">{{ robotsLabels[value] }}</span>
</template>`,
  MUTED_CELL('protectionLabel', 'Open'),
  MUTED_CELL('branchLabel', 'Not tracking'),
  `<template #cell-lastModified="{ value }">
${indent(lastModifiedCell('value'))}
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'Row actions',
    handler: 'onEnvironmentAction',
    groups: [
      { options: [{ value: 'edit', label: 'Edit', icon: 'pi pi-pencil' }] },
      {
        when: "row.id !== 'env-production'",
        options: [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
      }
    ]
  })
)}
</template>`
]

const TEMPLATE = pageMain(
  listPage({
    heading: pageHeading({
      title: 'Environments',
      description:
        'Where a deployment lands. Each one declares how its URLs work, who may reach it, and what builds it.',
      documentation: 'https://www.azion.com/en/documentation/products/deploy/',
      actions: headingAction({ label: 'Create Environment' })
    }),
    lead: `<Message
  severity="info"
  size="small"
  closable
  label="An environment's deployment policy decides which Deployment Settings can serve it — only a setting with the same policy can be linked. Build & Deployment holds those settings and the pairing."
/>`,
    body: [
      controlsHeader({
        placeholder: 'Search environments',
        ariaLabel: 'Search environments',
        filename: 'environments.csv'
      }),
      tableCard({ rows: 'environments', extra: PAGINATED, cells: CELLS })
    ].join('\n\n'),
    after: deleteDialog({ heading: 'Delete Environment', description: '{{ deleteDescription }}' })
  })
)

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    ...DELETE_IMPORTS,
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('environments', ENVIRONMENTS, 'ref'),
  declare('columns', COLUMNS),
  declare('policyLabels', POLICY_LABELS),
  declare('robotsLabels', ROBOTS_LABELS),
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT({ robotsPolicy: false }),
  '',
  ...DELETE_SCRIPT('environments'),
  'const deleteDescription = computed(() => {',
  '  const count = pendingDelete.value?.workloadsCount ?? 0',
  '  if (count === 0) {',
  "    return 'The selected environment will be deleted. No workload publishes into it. Check the'",
  '  }',
  "  return `The selected environment will be deleted, and ${count} ${count === 1 ? 'workload' : 'workloads'} will stop publishing into it. Check the`",
  '})',
  '',
  'const onEnvironmentAction = (event, value, row) => {',
  "  if (value === 'delete') askDelete(row)",
  '}'
]

const components = {
  Button,
  CardBox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  IconButton,
  InputText,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/Environments',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Environments panel of Account Settings (`/account/environments`): a page heading with Documentation and Create Environment, a closable info message on how deployment policies pair with Deployment Settings, the list controls row, and a flush table of environments with policy tags, muted empty cells and a row menu whose Delete opens the type-to-confirm dialog (Production cannot be deleted). The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TableRoot`, `CardBox`, `Message`, `Tag`, `Dropdown`, `Dialog`, `Popover`, `Switch`, `Tooltip`, `IconButton`, `InputText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Environments = {
  render: () => ({
    components,
    setup: () => {
      const environments = ref(structuredClone(ENVIRONMENTS))
      const deletion = useDeleteDialog(environments)
      const deleteDescription = computed(() => {
        const count = deletion.pendingDelete.value?.workloadsCount ?? 0
        if (count === 0) {
          return 'The selected environment will be deleted. No workload publishes into it. Check the'
        }
        return `The selected environment will be deleted, and ${count} ${count === 1 ? 'workload' : 'workloads'} will stop publishing into it. Check the`
      })
      const onEnvironmentAction = (event, value, row) => {
        if (value === 'delete') deletion.askDelete(row)
      }
      return {
        environments,
        columns: COLUMNS,
        policyLabels: POLICY_LABELS,
        robotsLabels: ROBOTS_LABELS,
        ...useList(),
        ...useColumns(COLUMNS, { robotsPolicy: false }),
        ...deletion,
        deleteDescription,
        onEnvironmentAction
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Production, Stage and Preview with the Robots column hidden by default; Delete on Stage or Preview asks for the name first.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
