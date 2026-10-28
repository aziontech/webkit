// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6482-17153
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/marketing/hero/hero-title/hero-title.vue
// component=HeroTitle
import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('title')
const description = instance.getString('description')
const centered = instance.getEnum('centered', {
  true: true,
  false: false
})
const showOverline = instance.getBoolean('showOverline')
const overline = instance.findInstance('Overline')
const eyebrow = showOverline && overline.type === 'INSTANCE' ? overline.getString('label') : ''
const prefix =
  showOverline && overline.type === 'INSTANCE' && overline.getBoolean('showPrefix')
    ? overline.getString('prefix')
    : ''
const eyebrowPrefix = ['//', '<>', '</>'].includes(prefix) ? prefix : ''
const showButtons = instance.getBoolean('showButtons')
const showStackedButtons = instance.getBoolean('showStackedButtons')
const buttons = instance.findConnectedInstances((node) => node.name === 'Button')
const visibleButtons = showButtons
  ? buttons.slice(0, 2)
  : showStackedButtons
    ? buttons.slice(-2)
    : []
const actions = visibleButtons.map((button) => button.executeTemplate().example)

export default {
  example: figma.code`<HeroTitle
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
    eyebrow && eyebrowPrefix
      ? figma.code`
  eyebrow-prefix="${eyebrowPrefix}"`
      : ''
  }${
    centered
      ? figma.code`
  centered`
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
</HeroTitle>`,
  imports: ["import HeroTitle from '@aziontech/webkit/hero-title'"],
  id: 'hero-title',
  metadata: { nestable: false }
}
