import Avatar from '@aziontech/webkit/avatar'
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
import { ref } from 'vue'

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
  LIST_IMPORTS,
  LIST_SCRIPT,
  listPage,
  pageHeading,
  pageMain,
  rowActions,
  tableCard,
  useColumns,
  useDeleteDialog,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const TEAMS = [
  {
    id: 'default-team',
    name: 'Default Team',
    status: 'Active',
    permissions: [
      'View Content Delivery Settings',
      'Edit Content Delivery Settings',
      'View Applications',
      'Edit Applications',
      'View Workloads',
      'Edit Workloads',
      'View Connectors',
      'Edit Connectors',
      'View Custom Pages',
      'Edit Custom Pages',
      'View DNS',
      'Edit DNS',
      'View Security Settings',
      'Edit Security Settings',
      'View Firewall',
      'Edit Firewall',
      'View Network Lists',
      'Edit Network Lists',
      'View Policies',
      'Edit Policies',
      'View Functions',
      'Edit Functions',
      'View Storage Bucket',
      'Edit Storage Bucket',
      'View Storage Object',
      'Edit Storage Object',
      'View Data Stream',
      'Edit Data Stream',
      'View analytics',
      'View Events',
      'View Orchestrator Nodes',
      'Edit Orchestrator Nodes',
      'View Orchestrator Services',
      'Edit Orchestrator Services',
      'View VCS Continuous Deployment',
      'Edit VCS Continuous Deployment',
      'View VCS Integrations',
      'Edit VCS Integrations',
      'View Subscriptions',
      'Edit Subscriptions',
      'View Payment Methods',
      'Edit Payment Methods',
      'View Bills',
      'View Users',
      'Edit Users',
      'View Marketplace Publisher',
      'Edit Marketplace Publisher',
      'Edit Multi-Factor Authentication',
      'SCIM Integration',
      'Real-Time Purge',
      'Wildcard Purge'
    ]
  },
  {
    id: 'read-only',
    name: 'Read Only',
    status: 'Active',
    permissions: [
      'View Content Delivery Settings',
      'View Applications',
      'View Workloads',
      'View Connectors',
      'View Custom Pages',
      'View DNS',
      'View Security Settings',
      'View Firewall',
      'View Network Lists',
      'View Policies',
      'View Functions',
      'View Storage Bucket',
      'View Storage Object',
      'View Data Stream',
      'View analytics',
      'View Events',
      'View Orchestrator Nodes',
      'View Orchestrator Services',
      'View VCS Continuous Deployment',
      'View VCS Integrations',
      'View Subscriptions',
      'View Payment Methods',
      'View Bills',
      'View Users',
      'View Marketplace Publisher',
      'Edit Multi-Factor Authentication',
      'SCIM Integration',
      'Real-Time Purge',
      'Wildcard Purge'
    ]
  },
  {
    id: 'billing-admins',
    name: 'Billing Admins',
    status: 'Inactive',
    permissions: [
      'View Subscriptions',
      'Edit Subscriptions',
      'View Payment Methods',
      'Edit Payment Methods',
      'View Bills'
    ]
  }
]

const COLUMNS = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    principal: true,
    hideable: false,
    grow: 2
  },
  { accessorKey: 'permissions', header: 'Permissions', minWidth: 256 },
  { accessorKey: 'status', header: 'Status', minWidth: 104 },
  { id: 'actions', kind: 'action', hideable: false }
]

const STATUS_SEVERITY = { Active: 'success', Inactive: 'secondary' }

const PERMISSIONS_CELL = `<template #cell-permissions="{ row }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="truncate text-body-sm text-(--text-default)">
      {{ row.permissions[0] ?? 'No permissions' }}
    </span>
    <Popover v-if="row.permissions.length > 1" placement="bottom-start" width="medium">
      <Popover.Trigger>
        <Tooltip text="Show all permissions">
          <button
            type="button"
            :aria-label="'Show all ' + row.permissions.length + ' permissions'"
            class="inline-flex shrink-0 items-center rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-xxs) text-label-xs text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >
            +{{ row.permissions.length - 1 }}
          </button>
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content>
        <p class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)">
          {{ row.permissions.length }} permissions
        </p>
        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="label in row.permissions"
            :key="label"
            class="block truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
          >{{ label }}</span>
        </div>
      </Popover.Content>
    </Popover>
  </div>
</template>`

const CELLS = [
  `<template #cell-name="{ row }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Avatar :label="row.name" size="small" kind="square" />
    <span class="truncate">{{ row.name }}</span>
  </div>
</template>`,
  PERMISSIONS_CELL,
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="statusSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'Team actions',
    handler: 'onTeamAction',
    groups: [
      {
        options: [
          { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
          { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-clone' }
        ]
      },
      { options: [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }] }
    ]
  })
)}
</template>`
]

const TEMPLATE = pageMain(
  listPage({
    heading: pageHeading({
      title: 'Teams Permissions',
      description: "Manage your account's teams and the access level each one grants.",
      documentation: 'https://www.azion.com/en/documentation/',
      actions: headingAction({ label: 'Create Team' })
    }),
    body: [
      controlsHeader({
        placeholder: 'Search teams',
        ariaLabel: 'Search teams',
        filename: 'teams.csv'
      }),
      tableCard({ rows: 'teams', cells: CELLS })
    ].join('\n\n'),
    after: deleteDialog({
      heading: 'Delete Team',
      description:
        'The selected Team will be deleted, along with all associated settings or instances. Check the'
    })
  })
)

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    ...DELETE_IMPORTS,
    webkitImport('Avatar', 'avatar'),
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('teams', TEAMS, 'ref'),
  declare('columns', COLUMNS),
  declare('statusSeverity', STATUS_SEVERITY),
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT(),
  '',
  ...DELETE_SCRIPT('teams'),
  '',
  'const onTeamAction = (event, value, row) => {',
  "  if (value === 'delete') askDelete(row)",
  "  if (value !== 'duplicate') return",
  '  teams.value = [',
  '    ...teams.value,',
  '    { ...row, id: `${row.id}-${teams.value.length + 1}`, name: `${row.name} (copy)` }',
  '  ]',
  '}'
]

const components = {
  Avatar,
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
  title: 'Templates/Platform/Account/AccountSettings/TeamsPermissions',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Teams and permissions panel of Account Settings (`/account/teams`): a page heading with Documentation and Create Team, the list controls row, and a flush table of teams whose permissions cell shows the first grant and a +N popover listing the rest; the row menu duplicates a team or opens the type-to-confirm delete dialog. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TableRoot`, `CardBox`, `Avatar`, `Tag`, `Popover`, `Dropdown`, `Dialog`, `Message`, `Switch`, `Tooltip`, `IconButton`, `InputText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const TeamsPermissions = {
  render: () => ({
    components,
    setup: () => {
      const teams = ref(structuredClone(TEAMS))
      const deletion = useDeleteDialog(teams)
      const onTeamAction = (event, value, row) => {
        if (value === 'delete') deletion.askDelete(row)
        if (value !== 'duplicate') return
        teams.value = [
          ...teams.value,
          { ...row, id: `${row.id}-${teams.value.length + 1}`, name: `${row.name} (copy)` }
        ]
      }
      return {
        teams,
        columns: COLUMNS,
        statusSeverity: STATUS_SEVERITY,
        ...useList(),
        ...useColumns(COLUMNS),
        ...deletion,
        onTeamAction
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Default Team, Read Only and Billing Admins with their real grants; Duplicate appends a copy and Delete asks for the team name before removing it.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
