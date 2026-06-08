<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Tag from '../../tag/tag.vue'
  import Currency from '../currency/currency.vue'

  defineOptions({
    name: 'CardPricing',
    inheritAttrs: false
  })

  interface CardPricingProps {
    /** plan Title. */
    planTitle?: string
    /** description. */
    description?: string
    /** pricing Details. */
    pricingDetails?: string
    /** show Pricing Details. */
    showPricingDetails?: boolean
    /** show Tag. */
    showTag?: boolean
    /** tag Label. */
    tagLabel?: string
    /** slot Position. */
    slotPosition?: 'bottom' | 'middle'
    /** card Style. */
    cardStyle?: 'contained' | 'transparent'
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
  }

  const props = withDefaults(defineProps<CardPricingProps>(), {
    planTitle: 'Pro',
    description: '',
    pricingDetails: '',
    showPricingDetails: true,
    showTag: false,
    tagLabel: 'Popular',
    slotPosition: 'bottom',
    cardStyle: 'contained',
    value: '20',
    prefix: '$',
    suffix: 'per month',
    showPrefix: true,
    showSuffix: true,
    actionLabel: 'Label'
  })

  defineSlots<{
    actions?: () => unknown
    default?: () => unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-card-pricing')

  const currencySize = computed(() => (props.slotPosition === 'middle' ? 'large' : 'small'))

  const isMiddle = computed(() => props.slotPosition === 'middle')

  const isContained = computed(() => props.cardStyle === 'contained')

  const rootClasses = computed(() => [
    'flex w-full flex-col items-start',
    isMiddle.value ? 'min-h-[483px] justify-between' : 'gap-[var(--spacing-lg)]',
    isContained.value
      ? 'bg-[var(--bg-surface)] border-[length:var(--border-width-default)] border-[var(--border-muted)] rounded-[var(--shape-card)] p-[var(--spacing-lg)]'
      : 'p-[var(--spacing-lg)]',
    attrs.class
  ])

  const headerContainerClasses = computed(() =>
    isMiddle.value
      ? 'flex w-full shrink-0 flex-col items-start gap-[var(--spacing-xs)] max-w-[256px]'
      : 'flex w-full shrink-0 flex-col items-start max-w-[256px] gap-[var(--spacing-xs)]'
  )

  const actionsClasses = computed(() => [
    'flex w-full gap-[var(--spacing-md)] items-start shrink-0',
    isMiddle.value ? 'pt-[var(--spacing-md)]' : ''
  ])
</script>

<template>
  <article
    :class="rootClasses"
    :data-testid="testId"
  >
    <div
      :class="[
        'flex w-full flex-col items-start shrink-0',
        isMiddle ? 'gap-[var(--spacing-lg)]' : ''
      ]"
    >
      <div
        :class="headerContainerClasses"
        :data-testid="`${testId}__header`"
      >
        <div
          :class="[
            'h-6 flex shrink-0 items-center',
            isMiddle ? 'w-full gap-[var(--spacing-sm)]' : 'gap-[var(--spacing-xs)]'
          ]"
        >
          <h3
            class="text-heading-md text-[var(--text-default)] [word-break:break-word]"
            :data-testid="`${testId}__title`"
          >
            {{ planTitle }}
          </h3>
          <Tag
            v-if="showTag"
            severity="primary"
            :value="tagLabel"
            :data-testid="`${testId}__tag`"
          />
        </div>
        <p
          v-if="description"
          class="text-body-sm text-[var(--text-muted)] h-9 [word-break:break-word]"
          :data-testid="`${testId}__description`"
        >
          {{ description }}
        </p>
      </div>

      <template v-if="isMiddle">
        <div
          class="flex w-full flex-col gap-[var(--spacing-xxs)] items-start h-16 shrink-0"
          :data-testid="`${testId}__pricing`"
        >
          <Currency
            :size="currencySize"
            :value="value"
            :prefix="prefix"
            :suffix="suffix"
            :show-prefix="showPrefix"
            :show-suffix="showSuffix"
            :data-testid="`${testId}__currency`"
          />
          <p
            v-if="showPricingDetails && pricingDetails"
            class="text-body-xs text-[var(--text-muted)] h-8 [word-break:break-word]"
            :data-testid="`${testId}__pricing-details`"
          >
            {{ pricingDetails }}
          </p>
        </div>

        <div
          class="min-h-[160px] w-full shrink-0"
          :data-testid="`${testId}__slot`"
        >
          <slot />
        </div>
      </template>
    </div>

    <div
      v-if="!isMiddle"
      class="flex w-full flex-col gap-[var(--spacing-xxs)] items-start h-16 shrink-0"
      :data-testid="`${testId}__pricing`"
    >
      <Currency
        :size="currencySize"
        :value="value"
        :prefix="prefix"
        :suffix="suffix"
        :show-prefix="showPrefix"
        :show-suffix="showSuffix"
        :data-testid="`${testId}__currency`"
      />
      <p
        v-if="showPricingDetails && pricingDetails"
        class="text-body-xs text-[var(--text-muted)] h-8 [word-break:break-word]"
        :data-testid="`${testId}__pricing-details`"
      >
        {{ pricingDetails }}
      </p>
    </div>

    <div
      v-if="!isMiddle"
      :class="actionsClasses"
      :data-testid="`${testId}__actions`"
    >
      <slot name="actions">
        <Button
          v-if="actionLabel"
          kind="outlined"
          size="large"
          :label="actionLabel"
          class="w-full"
          :data-testid="`${testId}__action`"
        />
      </slot>
    </div>

    <div
      v-if="!isMiddle"
      class="min-h-[160px] w-full shrink-0"
      :data-testid="`${testId}__slot`"
    >
      <slot />
    </div>

    <div
      v-if="isMiddle"
      :class="actionsClasses"
      :data-testid="`${testId}__actions`"
    >
      <slot name="actions">
        <Button
          v-if="actionLabel"
          kind="outlined"
          size="large"
          :label="actionLabel"
          class="w-full"
          :data-testid="`${testId}__action`"
        />
      </slot>
    </div>
  </article>
</template>
