import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import EmptyState from '@aziontech/webkit/empty-state'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import Skeleton from '@aziontech/webkit/skeleton'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'
import {
  constLine,
  DOMAIN_SCRIPT,
  ROWS_SCRIPT,
  TABLE_CARD,
  TABLE_IMPORTS,
  useDomainOverflow,
  WORKLOAD_COLUMNS,
  WORKLOAD_ROWS
} from './_lists-markup'

const components = {
  Avatar,
  Button,
  CardBox,
  CopyButton,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  EmptyState,
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  TableRoot,
  Tag,
  Tooltip
}

const script = (rows) => [
  ...TABLE_IMPORTS,
  "import { ref } from 'vue'",
  '',
  constLine('columns', WORKLOAD_COLUMNS),
  '',
  ...(rows ? ROWS_SCRIPT : ['const rows = []']),
  '',
  ...DOMAIN_SCRIPT
]

const meta = {
  title: 'Templates/Platform/Lists/ResourceTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The resource table of a console list page: a borderless data-driven `Table` inside a flush `CardBox`, sorted and paginated ten rows at a time, with the console cell recipes composed into the per-column slots. The name cell leads with the module glyph and underlines on hover; the ID cell (hidden by default on the page) pins a `CopyButton` to its right edge; the Domains cell is a truncating link with an external glyph and a `Tooltip` naming the destination, a +N `Tag` that opens the remaining domains in a `Popover` (searchable past ten, loading ten more at a time behind `Skeleton` rows) and a copy button pinned right; Status is a `Tag`; Last Modified is the editor’s `Avatar`, named on its `Tooltip`, beside the relative time; and the trailing action cell is an `IconButton` opening the row `Dropdown`. Workloads renders it as shown; Applications, Functions, Connectors, Certificates, Edge DNS, Object Storage, Firewall and the other indexes swap the middle columns for their own data over the same name, ID, Last Modified and action recipes. Bounded columns declare the console width floors (80 for fit columns, 104 for a tag column) and the Domains column takes the grow share. Built from `Table`, `CardBox`, `CopyButton`, `Tooltip`, `Tag`, `Popover`, `InputText`, `Skeleton`, `Button`, `Avatar`, `Dropdown` and `IconButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ rows: WORKLOAD_ROWS, columns: WORKLOAD_COLUMNS, ...useDomainOverflow() }),
    template: TABLE_CARD
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The first page of Workloads: ten rows, workload_09 inactive, each carrying 7 to 70 extra domains behind its +N Tag.'
      },
      source: { code: toSfc(script(true), TABLE_CARD) }
    }
  }
}

export const Empty = {
  render: () => ({
    components,
    setup: () => ({ rows: [], columns: WORKLOAD_COLUMNS, ...useDomainOverflow() }),
    template: TABLE_CARD
  }),
  parameters: {
    docs: {
      description: {
        story:
          'No workloads: the Table’s empty slot holds a medium EmptyState with a small secondary Create Workload and a small outlined Docs button in place of the body.'
      },
      source: { code: toSfc(script(false), TABLE_CARD) }
    }
  }
}
