// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4310-19617
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/layout/app-header/app-header.vue
// component=AppHeader
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
  example: figma.code`<AppHeader>${
    showBrand
      ? figma.code`
  <AppHeader.Brand>
    ${brand}
  </AppHeader.Brand>`
      : ''
  }${
    showLeft
      ? figma.code`
  <AppHeader.Start>
    ${left}
  </AppHeader.Start>`
      : ''
  }
  <AppHeader.Center>
    ${nav}
  </AppHeader.Center>${
    showRight
      ? figma.code`
  <AppHeader.End>
    ${right}
  </AppHeader.End>`
      : ''
  }
</AppHeader>`,
  imports: ["import AppHeader from '@aziontech/ui/app-header'"],
  id: 'app-header',
  metadata: { nestable: false }
}
