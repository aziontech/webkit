// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3777-17139
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/sidebar/sidebar.vue
// component=Sidebar
import figma from 'figma'

const instance = figma.selectedInstance

const showHeader = instance.getBoolean('showHeader')
const showFooter = instance.getBoolean('showFooter')
const header = instance.getSlot('header')
const content = instance.getSlot('content')
const footer = instance.getSlot('footer')

export default {
  example: figma.code`<Sidebar>${
    showHeader
      ? figma.code`
  <template #header>
    <SidebarHeader>
      ${header}
    </SidebarHeader>
  </template>`
      : ''
  }
  ${content}${
    showFooter
      ? figma.code`
  <template #footer>
    <SidebarFooter>
      ${footer}
    </SidebarFooter>
  </template>`
      : ''
  }
</Sidebar>`,
  imports: [
    "import Sidebar from '@aziontech/webkit/sidebar'",
    "import SidebarHeader from '@aziontech/webkit/sidebar-header'",
    "import SidebarFooter from '@aziontech/webkit/sidebar-footer'"
  ],
  id: 'sidebar',
  metadata: { nestable: false }
}
