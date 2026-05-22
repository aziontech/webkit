import figma from '@figma/code-connect/html'

import DropdownMenu from './dropdown-menu.vue'
import DropdownMenuItem from './dropdown-menu-item.vue'

figma.connect(
  DropdownMenu,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746',
  {
    props: {},
    example: () => `
<DropdownMenu v-model:open="open">
  <DropdownMenuTrigger><Button label="Open menu" kind="secondary" /></DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuContent>
      <DropdownMenuFromModel :nodes="menuNodes" />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenu>
    `
  }
)

figma.connect(
  DropdownMenuItem,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15346',
  {
    props: {
      selected: figma.boolean('Selected'),
      disabled: figma.boolean('Disabled')
    },
    example: (props) => `
<DropdownMenuItem label="Option 1" :selected="${props.selected}" :disabled="${props.disabled}" />
    `
  }
)
