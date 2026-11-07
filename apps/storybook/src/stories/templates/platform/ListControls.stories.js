import Avatar from '@aziontech/webkit/avatar'
import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import CalendarRoot from '@aziontech/webkit/calendar-root'
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
  COLUMNS_SCRIPT,
  constLine,
  CONTROLS_IMPORTS,
  controlsRow,
  FILTER_FIELDS_SCRIPT,
  filterStateScript,
  mergeImports,
  REFRESH_SCRIPT,
  useColumnsPanel,
  useFilterPanel,
  useListRefresh,
  WORKLOAD_COLUMNS,
  WORKLOAD_FILTER_FIELDS
} from './_lists-markup'

const components = {
  Avatar,
  Badge,
  Button,
  CalendarRoot,
  Chip,
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Tooltip
}

const APPLIED = { owner: ['Robson Junior', 'Isaque Böck'], status: ['Live'] }

const TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(controlsRow())}
${indent(APPLIED_CHIPS)}
</div>`

const script = (initial) => [
  ...mergeImports(CONTROLS_IMPORTS, ["import Chip from '@aziontech/webkit/chip'"]),
  "import { computed, nextTick, ref, watch } from 'vue'",
  '',
  ...FILTER_FIELDS_SCRIPT,
  '',
  constLine('columns', WORKLOAD_COLUMNS),
  '',
  "const search = ref('')",
  '',
  ...filterStateScript(initial),
  '',
  ...REFRESH_SCRIPT,
  '',
  ...COLUMNS_SCRIPT
]

const setupWith = (initial) => () => ({
  search: ref(''),
  ...useFilterPanel(WORKLOAD_FILTER_FIELDS, initial),
  ...useListRefresh(),
  ...useColumnsPanel(WORKLOAD_COLUMNS)
})

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
          'The row every console list page opens with, and the applied-filter chips under it. On the left, the Filter button opens a two-level `Popover`: a searchable list of fields, each showing its current value, then the values of the picked field as checkable rows (an `Avatar` per author), a Clear row once the field is applied, and for a date field a Custom… period that opens a range `Calendar`; once filters apply, a count `Badge` scales in on the button’s top-right corner. The search field takes the rest of the row. On the right, the refresh, download and columns `IconButton`s sit behind Tooltips; the columns button opens a `Popover` with one `Switch` per column, the principal column locked as always shown and a Show all columns reset while any is hidden. Each applied field becomes a removable `Chip` (field name, the picked authors’ avatars, the first value and a +N) that reopens the filter at that field. Workloads, Applications, Deployments, the Edge DNS records tab and every other resource index render this row between the page heading and the table card. Built from `Button`, `Badge`, `Popover`, `InputText`, `Avatar`, `Calendar`, `IconButton`, `Tooltip`, `Switch` and `Chip`, every control on the medium step of the console size ladder.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupWith({}), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing applied: the Filter button carries no count and the chips row does not render; the ID column starts hidden, so the columns panel offers Show all columns.'
      },
      source: { code: toSfc(script({}), TEMPLATE) }
    }
  }
}

export const Applied = {
  render: () => ({ components, setup: setupWith(APPLIED), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Two fields narrow the list: the Filter button carries a count Badge of 2 and one Chip per field sits under the row, the Author chip showing both picked avatars, the first name and a +1.'
      },
      source: { code: toSfc(script(APPLIED), TEMPLATE) }
    }
  }
}
