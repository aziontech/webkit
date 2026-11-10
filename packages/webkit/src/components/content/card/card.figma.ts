// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5466-52854
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/card/card.vue
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance

const padded = instance.getEnum('padded', {
  true: true,
  false: false
})
const showHeader = instance.getBoolean('showHeaderSlot')
const showFooter = instance.getBoolean('showFooterSlot')
const header = instance.getSlot('headerSlot')
const content = instance.getSlot('contentSlot')
const footer = instance.getSlot('footerSlot')

export default {
  example: figma.code`<Card${padded ? '' : figma.code` :padded="false"`}>${
    showHeader
      ? figma.code`
  <template #header>
    ${header}
  </template>`
      : ''
  }
  <template #content>
    ${content}
  </template>${
    showFooter
      ? figma.code`
  <template #footer>
    ${footer}
  </template>`
      : ''
  }
</Card>`,
  imports: ["import Card from '@aziontech/webkit/card'"],
  id: 'card',
  metadata: { nestable: true }
}
