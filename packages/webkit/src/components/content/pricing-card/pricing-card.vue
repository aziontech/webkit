<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../action/button/button.vue'
  import CurrencyAmount from '../currency-amount/currency-amount.vue'
  import Tag from '../tag/tag.vue'

  defineOptions({
    name: 'PricingCard',
    inheritAttrs: false
  })

  /** Composition of the card: `bottom` stacks the actions under the price, `middle` puts the price and actions between the header and the default slot. */
  export type PricingCardActionsPosition = 'bottom' | 'middle'
  /** Whether the card draws its own surface. */
  export type PricingCardVariant = 'contained' | 'ghost'

  export interface PricingCardProps {
    /** Plan name shown as the card heading. */
    title?: string
    /** Caveat under the price, such as the billing terms. */
    pricingDetails?: string
    /** Shows the pricing details line. */
    showPricingDetails?: boolean
    /** Shows the tag beside the plan name. */
    showTag?: boolean
    /** Text of the tag beside the plan name. */
    tagLabel?: string
    /** Reserves the caveat's band so a row of cards aligns row-for-row. Set it on every card in the row. */
    equalHeight?: boolean
    /** Composition of the card: `bottom` stacks the actions under the price, `middle` puts the price and actions between the header and the default slot. */
    actionsPosition?: PricingCardActionsPosition
    /** Whether the card draws its own surface: `contained` has a border and a surface, `ghost` sits on the page. */
    variant?: PricingCardVariant
    /** Price amount, already formatted, without the currency symbol. */
    value?: string
    /** Text before the amount, usually the currency symbol. */
    prefix?: string
    /** Text after the amount, usually the billing period. */
    suffix?: string
    /** Shows the prefix. */
    showPrefix?: boolean
    /** Shows the suffix. */
    showSuffix?: boolean
    /** Label of the default action button. */
    actionLabel?: string
    /** Fades the old price out and the new one in when the price changes, such as on a billing-period switch. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<PricingCardProps>(), {
    title: '',
    pricingDetails: '',
    showPricingDetails: true,
    showTag: false,
    tagLabel: 'Popular',
    equalHeight: false,
    actionsPosition: 'bottom',
    variant: 'contained',
    value: '20',
    prefix: '$',
    suffix: '/ month',
    showPrefix: true,
    showSuffix: true,
    actionLabel: 'Label',
    animated: false
  })

  const slots = defineSlots<{
    actions?: () => unknown
    default?: () => unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'pricing-card')

  const isMiddle = computed(() => props.actionsPosition === 'middle')

  const actionVariant = computed(() => {
    if (props.showTag) return 'primary'
    return isMiddle.value ? 'secondary' : 'outline'
  })

  const currencySize = computed(() => (isMiddle.value ? 'large' : 'medium'))

  const currencyPrefix = computed(() => (props.showPrefix ? props.prefix : ''))
  const currencySuffix = computed(() => (props.showSuffix ? props.suffix : ''))

  const priceKey = computed(() => `${currencyPrefix.value}|${props.value}|${currencySuffix.value}`)

  const ROOT_CLASS =
    'group/card flex w-full flex-col items-start overflow-clip p-(--spacing-lg) ' +
    'data-[actions-position=bottom]:gap-(--spacing-lg) data-[actions-position=middle]:justify-between ' +
    'data-[variant=contained]:rounded-(--shape-card) data-[variant=contained]:border-(length:--border-width-default) data-[variant=contained]:border-(--border-default) ' +
    'data-[variant=contained]:bg-(--bg-surface)'

  const CONTENT_CLASS =
    'flex w-full flex-col items-start ' +
    'group-data-[actions-position=bottom]/card:shrink-0 group-data-[actions-position=middle]/card:min-h-px group-data-[actions-position=middle]/card:flex-1 ' +
    'group-data-[actions-position=middle]/card:gap-(--spacing-lg)'

  const HEADER_CLASS =
    'flex w-full max-w-(--container-xs) shrink-0 flex-col items-start ' +
    'group-data-[actions-position=bottom]/card:gap-(--spacing-xs) group-data-[actions-position=middle]/card:gap-(--spacing-md)'

  const PRICING_DETAILS_CLASS =
    'text-(--text-muted) [word-break:break-word] ' +
    'group-data-[equal-height]/card:min-h-[3lh] ' +
    'group-data-[actions-position=bottom]/card:text-body-sm group-data-[actions-position=middle]/card:text-body-md'
</script>

<template>
  <article
    v-bind="$attrs"
    :data-testid="testId"
    :data-actions-position="actionsPosition"
    :data-variant="variant"
    :data-equal-height="equalHeight || null"
    :data-animated="animated || null"
    :class="ROOT_CLASS"
  >
    <div :class="CONTENT_CLASS">
      <div
        :class="HEADER_CLASS"
        :data-testid="`${testId}__header`"
      >
        <div class="flex min-h-6 w-full shrink-0 items-center gap-(--spacing-xs)">
          <h3
            class="text-overline-md text-(--text-default) [word-break:break-word]"
            :data-testid="`${testId}__title`"
          >
            {{ title }}
          </h3>
          <Tag
            v-if="showTag"
            variant="primary"
            :label="tagLabel"
            :data-testid="`${testId}__tag`"
          />
        </div>

        <div
          class="flex w-full shrink-0 flex-col items-start gap-(--spacing-2xs) group-data-[actions-position=bottom]/card:min-h-11 group-data-[actions-position=middle]/card:min-h-16"
          :data-testid="`${testId}__pricing`"
        >
          <Transition
            v-if="animated"
            mode="out-in"
            enter-active-class="animate-fade-in motion-reduce:animate-none"
            leave-active-class="animate-fade-out motion-reduce:animate-none"
          >
            <CurrencyAmount
              :key="priceKey"
              :size="currencySize"
              :value="value"
              :prefix="currencyPrefix"
              :suffix="currencySuffix"
              :data-testid="`${testId}__currency`"
            />
          </Transition>
          <CurrencyAmount
            v-else
            :size="currencySize"
            :value="value"
            :prefix="currencyPrefix"
            :suffix="currencySuffix"
            :data-testid="`${testId}__currency`"
          />
          <p
            v-if="(showPricingDetails && pricingDetails) || equalHeight"
            :class="PRICING_DETAILS_CLASS"
            :data-testid="`${testId}__pricing-details`"
          >
            {{ showPricingDetails ? pricingDetails : '' }}
          </p>
        </div>
      </div>

      <div
        v-if="isMiddle"
        class="w-full flex-1 group-data-[equal-height]/card:min-h-40"
        :data-testid="`${testId}__slot`"
      >
        <slot />
      </div>
    </div>

    <div
      class="flex w-full shrink-0 items-start gap-(--spacing-md) group-data-[actions-position=middle]/card:pt-(--spacing-xl)"
      :data-testid="`${testId}__actions`"
    >
      <slot name="actions">
        <Button
          v-if="actionLabel"
          :variant="actionVariant"
          size="large"
          :label="actionLabel"
          class="w-full"
          :data-testid="`${testId}__action`"
        />
      </slot>
    </div>

    <div
      v-if="!isMiddle && slots.default"
      class="w-full shrink-0"
      :data-testid="`${testId}__slot`"
    >
      <slot />
    </div>
  </article>
</template>
