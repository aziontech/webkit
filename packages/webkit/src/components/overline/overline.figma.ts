// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6482-17218
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overline/overline.vue
// component=Overline
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const showPrefix = instance.getBoolean('showPrefix')
const rawPrefix = showPrefix ? instance.getString('prefix') : ''
const prefix = ['//', '<>', '</>'].includes(rawPrefix) ? rawPrefix : ''
const showCursor = instance.getBoolean('showCursor')

export default {
  example: figma.code`<Overline${prefix ? figma.code` prefix="${prefix}"` : ''}${showCursor ? figma.code` show-cursor` : ''}>${label}</Overline>`,
  imports: ["import Overline from '@aziontech/webkit/overline'"],
  id: 'overline',
  metadata: { nestable: true }
}
