// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3605-2260
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/pricing-card/pricing-card.vue
// component=PricingCard
import figma from 'figma'

const instance = figma.selectedInstance

const planTitle = instance.getString('planTitle')
const pricingDetails = instance.getString('pricingDetails')
const showPricingDetails = instance.getBoolean('showPricingDetails')
const showTag = instance.getBoolean('showTag')
const slotPosition = instance.getEnum('slotPosition', {
  bottom: 'bottom',
  middle: 'middle'
})
const variant = instance.getEnum('kind', {
  contained: 'contained',
  transparent: 'ghost'
})
const body = instance.getSlot('slot')
const actions = instance.getSlot('slotAction')

const tag = instance.findInstance('Tag')
const tagLabel = tag.type === 'INSTANCE' ? tag.getString('label') : 'Popular'

const currency = instance.findInstance('Currency')
const hasCurrency = currency.type === 'INSTANCE'
const value = hasCurrency ? currency.getString('value') : '20'
const prefix = hasCurrency ? currency.getString('prefix') : '$'
const suffix = hasCurrency ? currency.getString('suffix') : '/ month'
const showPrefix = hasCurrency ? currency.getBoolean('showPrefix') : true
const showSuffix = hasCurrency ? currency.getBoolean('showSuffix') : true

export default {
  example: figma.code`<PricingCard
  plan-title="${planTitle}"${
    showPricingDetails
      ? figma.code`
  pricing-details="${pricingDetails}"`
      : figma.code`
  :show-pricing-details="false"`
  }${
    showTag
      ? figma.code`
  show-tag`
      : ''
  }${
    showTag && tagLabel !== 'Popular'
      ? figma.code`
  tag-label="${tagLabel}"`
      : ''
  }${
    slotPosition === 'bottom'
      ? ''
      : figma.code`
  actions-position="${slotPosition}"`
  }${
    variant === 'contained'
      ? ''
      : figma.code`
  variant="${variant}"`
  }
  value="${value}"${
    prefix === '$'
      ? ''
      : figma.code`
  prefix="${prefix}"`
  }${
    suffix === '/ month'
      ? ''
      : figma.code`
  suffix="${suffix}"`
  }${
    showPrefix
      ? ''
      : figma.code`
  :show-prefix="false"`
  }${
    showSuffix
      ? ''
      : figma.code`
  :show-suffix="false"`
  }
>
  ${body}
  <template #actions>
    ${actions}
  </template>
</PricingCard>`,
  imports: ["import PricingCard from '@aziontech/webkit/pricing-card'"],
  id: 'pricing-card',
  metadata: { nestable: true }
}
