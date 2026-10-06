import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import Chip from '@aziontech/webkit/chip'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import Switch from '@aziontech/webkit/switch'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  COLUMN_OPTIONS,
  COLUMN_VISIBILITY_SCRIPT,
  COLUMNS_POPOVER,
  constLine,
  CONTROLS_IMPORTS,
  controlsRow,
  useColumnVisibility
} from './_lists-markup'

const components = {
  Badge,
  Button,
  Chip,
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Tooltip
}

const SEARCH_SCRIPT = ["import { ref } from 'vue'", '', "const search = ref('')"]

const DEFAULT_TEMPLATE = controlsRow()

const APPLIED_TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(controlsRow({ count: 2 }))}
${indent(APPLIED_CHIPS)}
</div>`

const COLUMNS_TEMPLATE = controlsRow({ columns: COLUMNS_POPOVER })

const DEFAULT_IMPORTS = [...CONTROLS_IMPORTS, ...SEARCH_SCRIPT]

const APPLIED_IMPORTS = [
  "import Badge from '@aziontech/webkit/badge'",
  "import Button from '@aziontech/webkit/button'",
  "import Chip from '@aziontech/webkit/chip'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  ...SEARCH_SCRIPT
]

const COLUMNS_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import PopoverRoot from '@aziontech/webkit/popover-root'",
  "import PopoverContent from '@aziontech/webkit/popover-content'",
  "import PopoverTrigger from '@aziontech/webkit/popover-trigger'",
  "import Switch from '@aziontech/webkit/switch'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, ref } from 'vue'",
  '',
  "const search = ref('')",
  'const columnsOpen = ref(false)',
  constLine('columns', COLUMN_OPTIONS),
  ...COLUMN_VISIBILITY_SCRIPT
]

const meta = {
  title: 'Templates/Platform/Lists/ListControls',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The row every console list page opens with: a Filter button that carries a count Badge once filters narrow the list, the search field beside it, and on the right the refresh, download and columns IconButtons behind Tooltips, with the applied-filter Chips wrapping onto the line below. Workloads, Applications and every other resource index render it between the page heading and the table card. Built from `Button`, `Badge`, `InputText`, `IconButton`, `Tooltip`, `Chip` and, for the columns panel, `Popover` and `Switch`; every control sits on the medium step of the console size ladder, one step under the large heading action. The published `Table` ships the same row as context-aware parts (`Table.Filter`, `Table.Search`, `Table.AppliedFilters`, `Table.RefreshButton`, `Table.Export`, `Table.ColumnSelector`); this template documents the console’s current hand-composed row.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ search: ref('') }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story: 'Nothing applied: the Filter button carries no count and no chips row renders.'
      },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_TEMPLATE) }
    }
  }
}

export const Applied = {
  render: () => ({
    components,
    setup: () => ({ search: ref('') }),
    template: APPLIED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Two fields narrow the list: the Filter button carries a count Badge of 2 on its top-right corner and one Chip per field sits under the row, the Author chip summarising its first value with a +1.'
      },
      source: { code: toSfc(APPLIED_IMPORTS, APPLIED_TEMPLATE) }
    }
  }
}

export const ColumnsPopover = {
  render: () => ({
    components,
    setup() {
      const search = ref('')
      const columnsOpen = ref(false)
      return {
        search,
        columnsOpen,
        columns: COLUMN_OPTIONS,
        ...useColumnVisibility(COLUMN_OPTIONS)
      }
    },
    template: COLUMNS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The columns IconButton as a Popover trigger: one Switch per column, the principal column locked as always shown, and a Show all columns reset that appears while any column is hidden; closed by default.'
      },
      source: { code: toSfc(COLUMNS_IMPORTS, COLUMNS_TEMPLATE) }
    }
  }
}
