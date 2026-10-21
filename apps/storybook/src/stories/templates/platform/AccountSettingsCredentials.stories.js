import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
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

const CREDENTIALS = [
  {
    id: 'c-1',
    name: 'Production API',
    token: 'azion_prod_9f3a1c7e',
    created: 'January 12, 2026',
    lastUsed: '2 hours ago',
    status: 'Active'
  },
  {
    id: 'c-2',
    name: 'CI / CD Pipeline',
    token: 'azion_ci_4b8d2f0a',
    created: 'March 03, 2026',
    lastUsed: 'Yesterday',
    status: 'Active'
  },
  {
    id: 'c-3',
    name: 'Staging Sandbox',
    token: 'azion_stg_1e6c9a4d',
    created: 'May 21, 2026',
    lastUsed: '1 week ago',
    status: 'Active'
  },
  {
    id: 'c-4',
    name: 'Legacy Integration',
    token: 'azion_leg_7d2f5b8c',
    created: 'November 08, 2025',
    lastUsed: '3 months ago',
    status: 'Revoked'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'token', header: 'Token', grow: 2 },
  { accessorKey: 'created', header: 'Created', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastUsed', header: 'Last used', minWidth: 80 },
  { accessorKey: 'status', header: 'Status', minWidth: 104 },
  { id: 'actions', kind: 'action', hideable: false }
]

const STATUS_SEVERITY = { Active: 'success', Expired: 'danger', Revoked: 'danger' }

const CELLS = [
  `<template #cell-token="{ value }">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 truncate">{{ value }}</span>
    <CopyButton kind="outlined" :value="value" aria-label="Copy token" />
  </div>
</template>`,
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="statusSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'Credential actions',
    handler: 'onCredentialAction',
    groups: [
      { options: [{ value: 'view', label: 'View details' }] },
      { options: [{ value: 'revoke', label: 'Revoke', icon: 'pi pi-ban' }] }
    ]
  })
)}
</template>`
]

const TEMPLATE = pageMain(
  listPage({
    heading: pageHeading({
      title: 'Credentials',
      description: 'Manage the API tokens used to authenticate against this account.',
      documentation: 'https://www.azion.com/en/documentation/',
      actions: headingAction({ label: 'Create Credential' })
    }),
    body: [
      controlsHeader({
        placeholder: 'Search credentials',
        ariaLabel: 'Search credentials',
        filename: 'credentials.csv'
      }),
      tableCard({ rows: 'credentials', extra: PAGINATED, cells: CELLS })
    ].join('\n\n')
  })
)

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    webkitImport('CopyButton', 'copy-button'),
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('credentials', CREDENTIALS, 'ref'),
  declare('columns', COLUMNS),
  declare('statusSeverity', STATUS_SEVERITY),
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT(),
  '',
  'const onCredentialAction = (event, value, row) => {',
  "  if (value !== 'revoke') return",
  '  credentials.value = credentials.value.map((credential) =>',
  "    credential.id === row.id ? { ...credential, status: 'Revoked' } : credential",
  '  )',
  '}'
]

const components = {
  Button,
  CardBox,
  CopyButton,
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
  title: 'Templates/Platform/Account/AccountSettings/Credentials',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Credentials panel of Account Settings (`/account/credentials`): a page heading with Documentation and Create Credential, the list controls row, and a flush table of API tokens with a copy button on each token and a row menu that revokes it. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TableRoot`, `CardBox`, `CopyButton`, `Tag`, `Dropdown`, `Popover`, `Switch`, `Tooltip`, `IconButton`, `InputText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Credentials = {
  render: () => ({
    components,
    setup: () => {
      const credentials = ref(structuredClone(CREDENTIALS))
      const onCredentialAction = (event, value, row) => {
        if (value !== 'revoke') return
        credentials.value = credentials.value.map((credential) =>
          credential.id === row.id ? { ...credential, status: 'Revoked' } : credential
        )
      }
      return {
        credentials,
        columns: COLUMNS,
        statusSeverity: STATUS_SEVERITY,
        ...useList(),
        ...useColumns(COLUMNS),
        onCredentialAction
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'Four tokens, one already revoked; Revoke in a row menu flips that token to Revoked.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
