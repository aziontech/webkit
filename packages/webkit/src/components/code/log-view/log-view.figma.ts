// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/code/log-view/log-view.vue
// component=LogView
import figma from 'figma'

const instance = figma.selectedInstance

const showHeader = instance.getBoolean('showLogHeader')
const header = showHeader ? instance.findInstance('LogHeader') : undefined
const content = instance.findInstance('LogContent')
const loading =
  content.type === 'INSTANCE' ? content.getEnum('loading', { true: true, False: false }) : false

export default {
  example: figma.code`<LogView
  :lines="lines"${
    loading
      ? figma.code`
  loading`
      : ''
  }
>${
    header && header.type === 'INSTANCE'
      ? figma.code`
  ${header.executeTemplate().example}`
      : ''
  }${
    content.type === 'INSTANCE'
      ? figma.code`
  ${content.executeTemplate().example}`
      : ''
  }
</LogView>`,
  imports: ["import LogView from '@aziontech/webkit/log-view'"],
  id: 'log-view',
  metadata: { nestable: false }
}
