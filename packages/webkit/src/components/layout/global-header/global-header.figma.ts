// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4310-19617
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/layout/global-header/global-header.vue
// component=GlobalHeader
import figma from 'figma'

const instance = figma.selectedInstance

const showBrand = instance.getBoolean('showBrand')
const showLeft = instance.getBoolean('showLeft')
const showRight = instance.getBoolean('showRight')
const brand = instance.getSlot('brand')
const left = instance.getSlot('left')
const nav = instance.getSlot('nav')
const right = instance.getSlot('right')

export default {
  example: figma.code`<GlobalHeader>${
    showBrand
      ? figma.code`
  <GlobalHeader.Brand>
    ${brand}
  </GlobalHeader.Brand>`
      : ''
  }${
    showLeft
      ? figma.code`
  <GlobalHeader.Left>
    ${left}
  </GlobalHeader.Left>`
      : ''
  }
  <GlobalHeader.Middle>
    ${nav}
  </GlobalHeader.Middle>${
    showRight
      ? figma.code`
  <GlobalHeader.Right>
    ${right}
  </GlobalHeader.Right>`
      : ''
  }
</GlobalHeader>`,
  imports: ["import GlobalHeader from '@aziontech/webkit/global-header'"],
  id: 'global-header',
  metadata: { nestable: false }
}
