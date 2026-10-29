// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4330-21320
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overlay/drawer/drawer.vue
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
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>${
      showHeader
        ? figma.code`
      <PanelHeader>
        <DrawerTitle>${title}</DrawerTitle>
        <DrawerClose />
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
    </DrawerContent>
  </DrawerPortal>
</Drawer>`,
  imports: [
    "import Drawer from '@aziontech/webkit/drawer'",
    "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
    "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
    "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
    "import DrawerContent from '@aziontech/webkit/drawer-content'",
    "import DrawerTitle from '@aziontech/webkit/drawer-title'",
    "import DrawerClose from '@aziontech/webkit/drawer-close'",
    "import PanelHeader from '@aziontech/webkit/panel-header'",
    "import PanelContent from '@aziontech/webkit/panel-content'",
    "import PanelFooter from '@aziontech/webkit/panel-footer'",
    "import Button from '@aziontech/webkit/button'"
  ],
  id: 'drawer',
  metadata: { nestable: false }
}
