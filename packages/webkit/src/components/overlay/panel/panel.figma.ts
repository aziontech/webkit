// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=482-935
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overlay/panel/panel.vue
// component=Panel
import figma from 'figma'

const instance = figma.selectedInstance

const showHeader = instance.getBoolean('showHeader')
const showFooter = instance.getBoolean('showFooter')
const header = instance.getSlot('header')
const content = instance.getSlot('content')
const footer = instance.getSlot('footer')

export default {
  example: figma.code`<Panel>${
    showHeader
      ? figma.code`
  <PanelHeader>${
    header
      ? figma.code`
    ${header}`
      : ''
  }
  </PanelHeader>`
      : ''
  }
  <PanelContent>${
    content
      ? figma.code`
    ${content}`
      : ''
  }
  </PanelContent>${
    showFooter
      ? figma.code`
  <PanelFooter>${
    footer
      ? figma.code`
    ${footer}`
      : ''
  }
  </PanelFooter>`
      : ''
  }
</Panel>`,
  imports: [
    "import Panel from '@aziontech/webkit/panel'",
    "import PanelHeader from '@aziontech/webkit/panel-header'",
    "import PanelContent from '@aziontech/webkit/panel-content'",
    "import PanelFooter from '@aziontech/webkit/panel-footer'"
  ],
  id: 'panel',
  metadata: { nestable: false }
}
