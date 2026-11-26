// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3606-4358
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/currency-amount/currency-amount.vue
// component=Currency
import figma from 'figma'

const instance = figma.selectedInstance

const value = instance.getString('value')
const prefix = instance.getString('prefix')
const suffix = instance.getString('suffix')
const showPrefix = instance.getBoolean('showPrefix')
const showSuffix = instance.getBoolean('showSuffix')
const size = instance.getEnum('size', {
  small: 'small',
  medium: 'medium',
  large: 'large'
})

export default {
  example: figma.code`<CurrencyAmount
  value="${value}"${
    showPrefix
      ? prefix === '$'
        ? ''
        : figma.code`
  prefix="${prefix}"`
      : figma.code`
  prefix=""`
  }${
    showSuffix
      ? figma.code`
  suffix="${suffix}"`
      : ''
  }${
    size === 'small'
      ? ''
      : figma.code`
  size="${size}"`
  }
/>`,
  imports: ["import CurrencyAmount from '@aziontech/webkit/currency-amount'"],
  id: 'currency',
  metadata: { nestable: true }
}
