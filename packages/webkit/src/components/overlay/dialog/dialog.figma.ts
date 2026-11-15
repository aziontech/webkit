// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4331-21485
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overlay/dialog/dialog.vue
// component=Dialog
import figma from 'figma'

const instance = figma.selectedInstance

const panel = instance.findInstance('_Panel')
const showHeader = panel.type === 'INSTANCE' ? panel.getBoolean('showHeader') : true
const showFooter = panel.type === 'INSTANCE' ? panel.getBoolean('showFooter') : true
const content = panel.type === 'INSTANCE' ? panel.getSlot('content') : undefined
const footer = panel.type === 'INSTANCE' ? panel.getSlot('footer') : undefined
const titleLayer = panel.type === 'INSTANCE' ? panel.findText('Dialog Title') : undefined
const title = titleLayer && titleLayer.type === 'TEXT' ? titleLayer.textContent : 'Dialog Title'

export default {
  example: figma.code`<Dialog>
  <DialogTrigger>
    <Button label="Open dialog" />
  </DialogTrigger>
  <DialogContent>${
    showHeader
      ? figma.code`
    <PanelHeader>
      <DialogTitle>${title}</DialogTitle>
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
  </DialogContent>
</Dialog>`,
  imports: [
    "import Dialog from '@aziontech/webkit/dialog'",
    "import DialogTrigger from '@aziontech/webkit/dialog-trigger'",
    "import DialogContent from '@aziontech/webkit/dialog-content'",
    "import DialogTitle from '@aziontech/webkit/dialog-title'",
    "import PanelHeader from '@aziontech/webkit/panel-header'",
    "import PanelContent from '@aziontech/webkit/panel-content'",
    "import PanelFooter from '@aziontech/webkit/panel-footer'",
    "import Button from '@aziontech/webkit/button'"
  ],
  id: 'dialog',
  metadata: { nestable: false }
}
