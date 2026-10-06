import Avatar from '@aziontech/webkit/avatar'
import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Chip from '@aziontech/webkit/chip'
import CopyButton from '@aziontech/webkit/copy-button'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  constLine,
  controlsRow,
  TABLE_CARD,
  TABLE_IMPORTS,
  WORKLOAD_COLUMNS,
  WORKLOAD_ROWS
} from './_lists-markup'

const components = {
  Avatar,
  Badge,
  Button,
  CardBox,
  Chip,
  CopyButton,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  TableRoot,
  Tag,
  Tooltip
}

const PAGE_IMPORTS = [
  "import Badge from '@aziontech/webkit/badge'",
  "import Button from '@aziontech/webkit/button'",
  "import Chip from '@aziontech/webkit/chip'",
  "import InputText from '@aziontech/webkit/input-text'"
]

const IMPORTS = [
  ...[...TABLE_IMPORTS, ...PAGE_IMPORTS].sort(),
  "import { ref } from 'vue'",
  '',
  "const search = ref('')",
  constLine('columns', WORKLOAD_COLUMNS),
  '',
  constLine('rows', WORKLOAD_ROWS)
]

const PAGE_HEADING = `<header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <h1 class="text-balance text-heading-sm text-(--text-default)">Workloads</h1>
    <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
  </div>
  <div class="grid w-full gap-(--spacing-sm) md:flex md:w-auto md:shrink-0 md:items-center">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="large"
      href="https://www.azion.com/en/documentation/products/build/edge-application/workloads/"
      target="_blank"
    />
    <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="large" />
  </div>
</header>`

const PAGE_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex min-h-full flex-col">
${indent(PAGE_HEADING, 2)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(controlsRow({ count: 2 }), 4)}
${indent(APPLIED_CHIPS, 4)}
        <section class="flex min-h-0 flex-col">
${indent(TABLE_CARD, 5)}
        </section>
      </section>
    </section>
  </main>
</div>`

const meta = {
  title: 'Templates/Platform/Lists/ModuleList',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The canonical first-level list page: a page heading with the module name, its one-line description, a Documentation button and the large Create action, over the controls row, the applied-filter chips and the resource table, laid out on the canvas with the console page column and section rhythm. Workloads, Applications, Connectors and every other module index take this shape. Composed from the ListControls and ResourceTable templates: `Button`, `Badge`, `InputText`, `IconButton`, `Tooltip`, `Chip`, `CardBox`, `Table`, `CopyButton`, `Tag`, `Popover`, `Avatar` and `Dropdown`, with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities carrying the inset, the measure and the vertical rhythm.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ search: ref(''), rows: WORKLOAD_ROWS, columns: WORKLOAD_COLUMNS }),
    template: PAGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Workloads with two filters applied and seven rows; the heading actions stack to full width below the md breakpoint.'
      },
      source: { code: toSfc(IMPORTS, PAGE_TEMPLATE) }
    }
  }
}
