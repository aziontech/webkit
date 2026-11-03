<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Tag from '../../tag/tag.vue'
  import Currency from '../currency/currency.vue'

  defineOptions({
    name: 'CardPricing',
    inheritAttrs: false
  })

  /** Which composition the card is — see the block comment above. */
  export type CardPricingSlotPosition = 'bottom' | 'middle'
  /** Whether the card draws its own surface. */
  export type CardPricingKind = 'contained' | 'transparent'

  interface CardPricingProps {
    /** plan Title. */
    planTitle?: string
    /** pricing Details. */
    pricingDetails?: string
    /** show Pricing Details. */
    showPricingDetails?: boolean
    /** show Tag. */
    showTag?: boolean
    /** tag Label. */
    tagLabel?: string
    /** Reserves the caveat's band so a row of cards aligns row-for-row. Set it on every card in the row. */
    aligned?: boolean
    /** slot Position. */
    slotPosition?: CardPricingSlotPosition
    /** card Style. */
    kind?: CardPricingKind
    /** value. */
    value?: string
    /** prefix. */
    prefix?: string
    /** suffix. */
    suffix?: string
    /** show Prefix. */
    showPrefix?: boolean
    /** show Suffix. */
    showSuffix?: boolean
    /** action Label. */
    actionLabel?: string
    /** Rolls the price into place when value changes, such as on a billing-period toggle. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<CardPricingProps>(), {
    planTitle: 'Pro',
    pricingDetails: '',
    showPricingDetails: true,
    showTag: false,
    tagLabel: 'Popular',
    aligned: false,
    slotPosition: 'bottom',
    kind: 'contained',
    value: '20',
    prefix: '$',
    suffix: '/ mon',
    showPrefix: true,
    showSuffix: true,
    actionLabel: 'Label',
    animated: false
  })

  defineSlots<{
    actions?: () => unknown
    default?: () => unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-card-pricing')

  const isMiddle = computed(() => props.slotPosition === 'middle')

  const currencySize = computed(() => (isMiddle.value ? 'large' : 'medium'))

  const currencyPrefix = computed(() => (props.showPrefix ? props.prefix : ''))
  const currencySuffix = computed(() => (props.showSuffix ? props.suffix : ''))
</script>

<template>
  <article
    v-bind="$attrs"
    :data-testid="testId"
    :data-slot-position="slotPosition"
    :data-kind="kind"
    :data-aligned="aligned || null"
    class="group/card flex w-full flex-col items-start overflow-clip p-(--spacing-lg) data-[slot-position=bottom]:gap-(--spacing-lg) data-[slot-position=middle]:justify-between data-[kind=contained]:rounded-(--shape-card) data-[kind=contained]:border-(length:--border-width-default) data-[kind=contained]:border-(--border-default) data-[kind=contained]:bg-(--bg-surface)"
  >
    <div
      class="flex w-full flex-col items-start group-data-[slot-position=bottom]/card:shrink-0 group-data-[slot-position=middle]/card:min-h-px group-data-[slot-position=middle]/card:flex-1 group-data-[slot-position=middle]/card:gap-(--spacing-lg)"
    >
      <div
        class="flex w-full max-w-(--container-xs) shrink-0 flex-col items-start group-data-[slot-position=bottom]/card:gap-(--spacing-xs) group-data-[slot-position=middle]/card:gap-(--spacing-md)"
        :data-testid="`${testId}__header`"
      >
        <div class="flex min-h-6 w-full shrink-0 items-center gap-(--spacing-xs)">
          <h3
            class="text-overline-md text-(--text-default) [word-break:break-word]"
            :data-testid="`${testId}__title`"
          >
            {{ planTitle }}
          </h3>
          <Tag
            v-if="showTag"
            severity="primary"
            :label="tagLabel"
            :data-testid="`${testId}__tag`"
          />
        </div>

        <div
          class="flex w-full shrink-0 flex-col items-start gap-(--spacing-xxs) group-data-[slot-position=bottom]/card:min-h-11 group-data-[slot-position=middle]/card:min-h-16"
          :data-testid="`${testId}__pricing`"
        >
          <Currency
            :size="currencySize"
            :value="value"
            :prefix="currencyPrefix"
            :suffix="currencySuffix"
            :animated="animated"
            :data-testid="`${testId}__currency`"
          />
          <p
            v-if="(showPricingDetails && pricingDetails) || aligned"
            class="text-(--text-muted) [word-break:break-word] group-data-[aligned]/card:min-h-[3lh] group-data-[slot-position=bottom]/card:text-body-sm group-data-[slot-position=middle]/card:text-body-md"
            :data-testid="`${testId}__pricing-details`"
          >
            {{ showPricingDetails ? pricingDetails : '' }}
          </p>
        </div>
      </div>

      <div
        v-if="isMiddle"
        class="min-h-40 w-full flex-1"
        :data-testid="`${testId}__slot`"
      >
        <slot />
      </div>
    </div>

    <div
      class="flex w-full shrink-0 items-start gap-(--spacing-md) group-data-[slot-position=middle]/card:pt-(--spacing-xl)"
      :data-testid="`${testId}__actions`"
    >
      <slot name="actions">
        <Button
          v-if="actionLabel"
          :kind="isMiddle ? 'secondary' : 'outlined'"
          size="large"
          :label="actionLabel"
          class="w-full"
          :data-testid="`${testId}__action`"
        />
      </slot>
    </div>

    <div
      v-if="!isMiddle"
      class="min-h-40 w-full shrink-0"
      :data-testid="`${testId}__slot`"
    >
      <slot />
    </div>
  </article>
</template>
