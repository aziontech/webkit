// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4281-4543
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overlay/tooltip/tooltip.vue
// component=Tooltip
import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text')

export default {
  example: figma.code`<Tooltip text="${text}">
  <IconButton icon="pi pi-info-circle" aria-label="More information" />
</Tooltip>`,
  imports: [
    "import Tooltip from '@aziontech/webkit/tooltip'",
    "import IconButton from '@aziontech/webkit/icon-button'"
  ],
  id: 'tooltip',
  metadata: { nestable: true }
}
