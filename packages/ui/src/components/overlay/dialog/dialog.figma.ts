// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4331-21485
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/overlay/dialog/dialog.vue
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
  </DialogContent>
</Dialog>`,
  imports: [
    "import Dialog from '@aziontech/ui/dialog'",
    "import DialogTrigger from '@aziontech/ui/dialog-trigger'",
    "import DialogContent from '@aziontech/ui/dialog-content'",
    "import DialogTitle from '@aziontech/ui/dialog-title'",
    "import PanelHeader from '@aziontech/ui/panel-header'",
    "import PanelBody from '@aziontech/ui/panel-body'",
    "import PanelFooter from '@aziontech/ui/panel-footer'",
    "import Button from '@aziontech/ui/button'"
  ],
  id: 'dialog',
  metadata: { nestable: false }
}
