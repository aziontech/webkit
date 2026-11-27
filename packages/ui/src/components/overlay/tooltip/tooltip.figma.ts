// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4281-4543
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/overlay/tooltip/tooltip.vue
// component=Tooltip
import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text')

export default {
  example: figma.code`<Tooltip content="${text}">
  <IconButton icon="az az-copy" aria-label="Copy" />
</Tooltip>`,
  imports: [
    "import Tooltip from '@aziontech/ui/tooltip'",
    "import IconButton from '@aziontech/ui/icon-button'"
  ],
  id: 'tooltip',
  metadata: { nestable: true }
}
