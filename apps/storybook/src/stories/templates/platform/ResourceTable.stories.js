import Avatar from '@aziontech/webkit/avatar'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'
import {
  constLine,
  TABLE_CARD,
  TABLE_IMPORTS,
  WORKLOAD_COLUMNS,
  WORKLOAD_ROWS
} from './_lists-markup'

const components = {
  Avatar,
  CardBox,
  CopyButton,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  IconButton,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  TableRoot,
  Tag,
  Tooltip
}

const importsFor = (rows) => [
  ...TABLE_IMPORTS,
  '',
  constLine('columns', WORKLOAD_COLUMNS),
  '',
  constLine('rows', rows)
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
          'The resource table of a console list page: a data-driven `Table` inside a flush `CardBox`, with the console cell recipes composed into the per-column slots. The name cell leads with the module glyph; the ID cell pins a `CopyButton` to its right edge; the Domains cell is a left-truncating link with an external glyph and a `Tooltip` naming the destination, a +N `Tag` that opens the remaining domains in a `Popover`, and a copy button pinned right; Status is a `Tag`; Last Editor is an `Avatar` with the name; Last Modified is the relative time; and the trailing action cell is an `IconButton` opening the row’s `Dropdown`. Workloads and Applications render it; the bounded columns declare the console width floors (80 for fit columns, 104 for a chip column) and the Domains column takes the grow share. Built from `Table`, `CardBox`, `CopyButton`, `Tooltip`, `Tag`, `Popover`, `Avatar`, `Dropdown` and `IconButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ rows: WORKLOAD_ROWS, columns: WORKLOAD_COLUMNS }),
    template: TABLE_CARD
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Seven workloads, sorted and paginated by the Table itself; three rows carry extra domains behind the +N Tag.'
      },
      source: { code: toSfc(importsFor(WORKLOAD_ROWS), TABLE_CARD) }
    }
  }
}

export const Empty = {
  render: () => ({
    components,
    setup: () => ({ rows: [], columns: WORKLOAD_COLUMNS }),
    template: TABLE_CARD
  }),
  parameters: {
    docs: {
      description: {
        story: 'No rows: the Table renders its own EmptyState in place of the body.'
      },
      source: { code: toSfc(importsFor([]), TABLE_CARD) }
    }
  }
}
