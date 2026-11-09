import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
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
  headingAction,
  LIST_IMPORTS,
  LIST_SCRIPT,
  listPage,
  pageHeading,
  pageMain,
  PAGINATED,
  rowActions,
  tableCard,
  useColumns,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const USERS = [
  {
    id: 'u-1',
    name: 'Gabriel Lisboa',
    email: 'gabriel@cerne.digital',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'u-2',
    name: 'Rafael Umman',
    email: 'rafael.umman@azion.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 hours ago'
  },
  {
    id: 'u-3',
    name: 'Marina Costa',
    email: 'marina.costa@azion.com',
    role: 'Developer',
    status: 'Active',
    lastActive: 'Yesterday'
  },
  {
    id: 'u-4',
    name: 'Lucas Pereira',
    email: 'lucas.pereira@azion.com',
    role: 'Developer',
    status: 'Pending',
    lastActive: '—'
  },
  {
    id: 'u-5',
    name: 'Ana Rodrigues',
    email: 'ana.rodrigues@azion.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '3 days ago'
  },
  {
    id: 'u-6',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@azion.com',
    role: 'Viewer',
    status: 'Inactive',
    lastActive: '2 months ago'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'email', header: 'Email', grow: 2 },
  { accessorKey: 'role', header: 'Role', enableSorting: true, minWidth: 104 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'lastActive', header: 'Last Active', minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const ROLE_SEVERITY = {
  Owner: 'primary',
  Admin: 'info',
  Developer: 'secondary',
  Viewer: 'secondary'
}

const STATUS_SEVERITY = { Active: 'success', Pending: 'warning', Inactive: 'secondary' }

const CELLS = [
  `<template #cell-name="{ row }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Avatar :label="row.name" size="small" kind="square" />
    <span class="truncate">{{ row.name }}</span>
  </div>
</template>`,
  `<template #cell-role="{ value }">
  <Tag :label="value" :severity="roleSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="statusSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'User actions',
    handler: 'onUserAction',
    groups: [
      {
        options: [
          { value: 'view', label: 'View profile' },
          { value: 'edit', label: 'Edit role' }
        ]
      },
      { options: [{ value: 'remove', label: 'Remove', icon: 'pi pi-trash' }] }
    ]
  })
)}
</template>`
]

const TEMPLATE = pageMain(
  listPage({
    heading: pageHeading({
      title: 'Users management',
      description: 'Manage the teammates who have access to this account and their roles.',
      documentation: 'https://www.azion.com/en/documentation/',
      actions: headingAction({ label: 'Invite User', icon: 'pi pi-user-plus' })
    }),
    body: [
      controlsHeader({
        placeholder: 'Search users',
        ariaLabel: 'Search users',
        filename: 'users.csv'
      }),
      tableCard({ rows: 'users', extra: PAGINATED, cells: CELLS })
    ].join('\n\n')
  })
)

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    webkitImport('Avatar', 'avatar'),
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('users', USERS, 'ref'),
  declare('columns', COLUMNS),
  declare('roleSeverity', ROLE_SEVERITY),
  declare('statusSeverity', STATUS_SEVERITY),
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT(),
  '',
  'const onUserAction = (event, value, row) => {',
  "  if (value !== 'remove') return",
  '  users.value = users.value.filter((user) => user.id !== row.id)',
  '}'
]

const components = {
  Avatar,
  Button,
  CardBox,
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  IconButton,
  InputText,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/UsersManagement',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Users management panel of Account Settings (`/account/users`): a page heading with Documentation and Invite User, the list controls row, and a flush table of teammates with an avatar name cell, role and status tags, and a row menu that removes a user. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TableRoot`, `CardBox`, `Avatar`, `Tag`, `Dropdown`, `Popover`, `Switch`, `Tooltip`, `IconButton`, `InputText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const UsersManagement = {
  render: () => ({
    components,
    setup: () => {
      const users = ref(structuredClone(USERS))
      const onUserAction = (event, value, row) => {
        if (value !== 'remove') return
        users.value = users.value.filter((user) => user.id !== row.id)
      }
      return {
        users,
        columns: COLUMNS,
        roleSeverity: ROLE_SEVERITY,
        statusSeverity: STATUS_SEVERITY,
        ...useList(),
        ...useColumns(COLUMNS),
        onUserAction
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Six teammates from Owner to Viewer, one pending invite; Remove in a row menu drops that user from the table.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
