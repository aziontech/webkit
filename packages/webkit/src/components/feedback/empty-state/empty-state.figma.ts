// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=446-864
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/empty-state/empty-state.vue
// component=EmptyState
import figma from 'figma'

const instance = figma.selectedInstance

const titleLayer = instance.findText('Title')
const title = titleLayer.type === 'TEXT' ? titleLayer.textContent : ''
const descriptionLayer = instance.findText('Subtitle')
const description = descriptionLayer.type === 'TEXT' ? descriptionLayer.textContent : ''
const showIcon = instance.getBoolean('showIcon')
const bordered = instance.getEnum('bordered', { true: true, false: false })
const actions = instance.getSlot('slot')

export default {
  example: figma.code`<EmptyState
  title="${title}"${
    description
      ? figma.code`
  description="${description}"`
      : ''
  }${
    showIcon
      ? figma.code`
  icon="pi pi-inbox"`
      : ''
  }${
    bordered
      ? figma.code`
  bordered`
      : ''
  }
>
  <template #actions>
    ${actions}
  </template>
</EmptyState>`,
  imports: ["import EmptyState from '@aziontech/webkit/empty-state'"],
  id: 'empty-state',
  metadata: { nestable: false }
}
