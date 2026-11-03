// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6482-17180
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/marketing/section-title/section-title.vue
// component=SectionTitle
import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('title')
const showSubtitle = instance.getBoolean('showSubtitle')
const description = showSubtitle ? instance.getString('description') : ''
const kind = instance.getEnum('kind', {
  horizontal: 'horizontal',
  left: 'left',
  centered: 'centered'
})
const showOverline = instance.getBoolean('showOverline')
const overline = instance.findInstance('Overline')
const eyebrow = showOverline && overline.type === 'INSTANCE' ? overline.getString('label') : ''
const showButtons = instance.getBoolean('showButtons')
const showStackedButton = instance.getBoolean('showStackedButton')
const buttons = instance.findConnectedInstances((node) => node.name === 'Button')
const visibleButtons = showButtons
  ? buttons.slice(0, 2)
  : showStackedButton
    ? buttons.slice(-2)
    : []
const actions = visibleButtons.map((button) => button.executeTemplate().example)

export default {
  example: figma.code`<SectionTitle
  title="${title}"${
    description
      ? figma.code`
  description="${description}"`
      : ''
  }${
    eyebrow
      ? figma.code`
  eyebrow="${eyebrow}"`
      : ''
  }${
    kind && kind !== 'centered'
      ? figma.code`
  kind="${kind}"`
      : ''
  }
>${
    actions.length > 0
      ? figma.code`
  <template #actions>
    ${actions}
  </template>`
      : ''
  }
</SectionTitle>`,
  imports: ["import SectionTitle from '@aziontech/webkit/section-title'"],
  id: 'section-title',
  metadata: { nestable: false }
}
