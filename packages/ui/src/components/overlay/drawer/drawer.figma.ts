// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4330-21320
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/overlay/drawer/drawer.vue
// component=Drawer
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium',
  small: 'small'
})

const panel = instance.findInstance('_Panel')
const showHeader = panel.type === 'INSTANCE' ? panel.getBoolean('showHeader') : true
const showFooter = panel.type === 'INSTANCE' ? panel.getBoolean('showFooter') : true
const content = panel.type === 'INSTANCE' ? panel.getSlot('content') : undefined
const footer = panel.type === 'INSTANCE' ? panel.getSlot('footer') : undefined
const titleLayer = panel.type === 'INSTANCE' ? panel.findText('Dialog Title') : undefined
const title = titleLayer && titleLayer.type === 'TEXT' ? titleLayer.textContent : 'Drawer Title'

export default {
  example: figma.code`<Drawer${size !== 'medium' ? figma.code` size="${size}"` : ''}>
  <DrawerTrigger>
    <Button label="Open drawer" />
  </DrawerTrigger>
  <DrawerContent>${
    showHeader
      ? figma.code`
    <PanelHeader>
      <DrawerTitle>${title}</DrawerTitle>
    </PanelHeader>`
      : ''
  }
    <PanelBody>${
      content
        ? figma.code`
      ${content}`
        : ''
    }
    </PanelBody>${
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
  </DrawerContent>
</Drawer>`,
  imports: [
    "import Drawer from '@aziontech/ui/drawer'",
    "import DrawerTrigger from '@aziontech/ui/drawer-trigger'",
    "import DrawerContent from '@aziontech/ui/drawer-content'",
    "import DrawerTitle from '@aziontech/ui/drawer-title'",
    "import PanelHeader from '@aziontech/ui/panel-header'",
    "import PanelBody from '@aziontech/ui/panel-body'",
    "import PanelFooter from '@aziontech/ui/panel-footer'",
    "import Button from '@aziontech/ui/button'"
  ],
  id: 'drawer',
  metadata: { nestable: false }
}
