import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Popover from '@aziontech/webkit/popover'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_SCRIPT,
  compound,
  controlsHeader,
  declare,
  LIST_IMPORTS,
  LIST_SCRIPT,
  listPage,
  pageHeading,
  pageMain,
  PAGINATED,
  tableCard,
  useColumns,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const ACTIVITY = [
  {
    id: 'a-1',
    action: 'Signed in',
    category: 'Auth',
    user: 'gabriel@cerne.digital',
    ip: '189.6.44.12',
    date: 'October 04, 2026, 03:37:40 AM'
  },
  {
    id: 'a-2',
    action: 'Updated billing email',
    category: 'Billing',
    user: 'gabriel@cerne.digital',
    ip: '189.6.44.12',
    date: 'October 03, 2026, 09:37:40 AM'
  },
  {
    id: 'a-3',
    action: 'Created credential “CI / CD Pipeline”',
    category: 'Security',
    user: 'rafael.umman@azion.com',
    ip: '201.17.88.3',
    date: 'October 02, 2026, 09:37:40 AM'
  },
  {
    id: 'a-4',
    action: 'Invited marina.costa@azion.com',
    category: 'Users',
    user: 'gabriel@cerne.digital',
    ip: '189.6.44.12',
    date: 'September 28, 2026, 09:37:40 AM'
  },
  {
    id: 'a-5',
    action: 'Deployed vue-3-teste',
    category: 'Deploy',
    user: 'lucas.pereira@azion.com',
    ip: '177.92.10.55',
    date: 'September 26, 2026, 09:37:40 AM'
  }
]

const COLUMNS = [
  { accessorKey: 'action', header: 'Event', principal: true, hideable: false, grow: 2 },
  { accessorKey: 'category', header: 'Category', enableSorting: true, minWidth: 136 },
  { accessorKey: 'user', header: 'User', minWidth: 80 },
  { accessorKey: 'ip', header: 'IP address', minWidth: 80 },
  { accessorKey: 'date', header: 'Date', enableSorting: true, minWidth: 80 }
]

const CATEGORY_SEVERITY = {
  Auth: 'info',
  Billing: 'primary',
  Security: 'warning',
  Users: 'secondary',
  Deploy: 'success'
}

const CELLS = [
  `<template #cell-category="{ value }">
  <Tag :label="value" :severity="categorySeverity[value] ?? 'secondary'" size="medium" />
</template>`
]

const TEMPLATE = pageMain(
  listPage({
    heading: pageHeading({
      title: 'Activity History',
      description: 'Review recent account activity and audit events.',
      documentation: 'https://www.azion.com/en/documentation/'
    }),
    body: [
      controlsHeader({
        placeholder: 'Search activity',
        ariaLabel: 'Search activity',
        filename: 'activity.csv'
      }),
      tableCard({ rows: 'activity', extra: PAGINATED, cells: CELLS })
    ].join('\n\n')
  })
)

const IMPORTS = [
  ...webkitImports([...LIST_IMPORTS, webkitImport('Tag', 'tag')]),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('activity', ACTIVITY),
  declare('columns', COLUMNS),
  declare('categorySeverity', CATEGORY_SEVERITY),
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT()
]

const components = {
  Button,
  CardBox,
  IconButton,
  InputText,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/ActivityHistory',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Activity History panel of Account Settings (`/account/activity`): a page heading with Documentation, the list controls row, and a flush, read-only audit table whose category reads as a severity tag. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TableRoot`, `CardBox`, `Tag`, `Popover`, `Switch`, `Tooltip`, `IconButton`, `InputText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ActivityHistory = {
  render: () => ({
    components,
    setup: () => ({
      activity: ACTIVITY,
      columns: COLUMNS,
      categorySeverity: CATEGORY_SEVERITY,
      ...useList(),
      ...useColumns(COLUMNS)
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'Five audit events across Auth, Billing, Security, Users and Deploy.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
