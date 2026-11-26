// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4177-15489
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/code/code-block/code-block.vue
// component=CodeBlock
import figma from 'figma'

const instance = figma.selectedInstance

const showTabs = instance.getBoolean('showCodeEditorHeader')
const showFileName = instance.getBoolean('showFileName')
const fileNameBar = showFileName ? instance.findInstance('FileName') : undefined
const fileName =
  fileNameBar && fileNameBar.type === 'INSTANCE' ? fileNameBar.getString('filename') : ''
const content = instance.findInstance('CodeEditorContent')
const copyable = content.type === 'INSTANCE' ? content.getBoolean('showIconButton') : true
const fileNameField = fileName ? `, fileName: '${fileName}'` : ''

export default {
  example: figma.code`<CodeBlock
  :tabs="[${
    showTabs
      ? figma.code`
    { label: 'JavaScript', value: 'javascript', language: 'js', code: jsCode${fileNameField} },
    { label: 'TypeScript', value: 'typescript', language: 'ts', code: tsCode }`
      : figma.code`
    { label: 'JavaScript', value: 'javascript', language: 'js', code: jsCode${fileNameField} }`
  }
  ]"${
    copyable
      ? ''
      : figma.code`
  :copyable="false"`
  }
/>`,
  imports: ["import CodeBlock from '@aziontech/webkit/code-block'"],
  id: 'code-block',
  metadata: { nestable: false }
}
