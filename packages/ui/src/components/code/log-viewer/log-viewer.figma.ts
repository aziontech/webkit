// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3950-34695
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/code/log-viewer/log-viewer.vue
// component=LogViewer
import figma from 'figma'

const instance = figma.selectedInstance

const showHeader = instance.getBoolean('showLogHeader')
const header = showHeader ? instance.findInstance('LogHeader') : undefined
const content = instance.findInstance('LogContent')
const loading =
  content.type === 'INSTANCE' ? content.getEnum('loading', { true: true, False: false }) : false

export default {
  example: figma.code`<LogViewer
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
</LogViewer>`,
  imports: ["import LogViewer from '@aziontech/webkit/log-viewer'"],
  id: 'log-viewer',
  metadata: { nestable: false }
}
