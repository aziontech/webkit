<script setup>
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Currency from '../currency/currency.vue'
  import Tag from '../tag/tag.vue'

  defineOptions({
    name: 'CardPricing',
    inheritAttrs: false
  })

  const props = defineProps({
    planTitle: {
      type: String,
      default: 'Pro'
    },
    description: {
      type: String,
      default: ''
    },
    pricingDetails: {
      type: String,
      default: ''
    },
    showPricingDetails: {
      type: Boolean,
      default: true
    },
    showTag: {
      type: Boolean,
      default: false
    },
    tagLabel: {
      type: String,
      default: 'Popular'
    },
    slotPosition: {
      type: String,
      default: 'bottom',
      validator: (value) => ['bottom', 'middle'].includes(value)
    },
    cardStyle: {
      type: String,
      default: 'contained',
      validator: (value) => ['contained', 'transparent'].includes(value)
    },
    value: {
      type: String,
      default: '20'
    },
    prefix: {
      type: String,
      default: '$'
    },
    suffix: {
      type: String,
      default: 'per month'
    },
    showPrefix: {
      type: Boolean,
      default: true
    },
    showSuffix: {
      type: Boolean,
      default: true
    },
    actionLabel: {
      type: String,
      default: 'Label'
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-card-pricing')

  const currencySize = computed(() => (props.slotPosition === 'middle' ? 'large' : 'small'))

  const isMiddle = computed(() => props.slotPosition === 'middle')

  const isContained = computed(() => props.cardStyle === 'contained')

  const rootClass = computed(() => {
    const classes = ['flex flex-col items-start overflow-clip w-full']

    if (isMiddle.value) {
      classes.push('min-h-[483px] justify-between')

      if (isContained.value) {
        classes.push(
          'bg-[var(--bg-surface)] border border-[length:var(--border-width-default)]',
          'border-[var(--border-muted)] rounded-[var(--shape-card)] p-[var(--spacing-xl)]'
        )
      } else {
        classes.push('px-[var(--spacing-xl)] py-[var(--spacing-xl)]')
      }
    } else if (isContained.value) {
      classes.push(
        'gap-[var(--spacing-xl)]',
        'bg-[var(--bg-surface)] border border-[length:var(--border-width-default)]',
        'border-[var(--border-muted)] rounded-[var(--shape-card)] p-[var(--spacing-xl)]'
      )
    } else {
      classes.push('gap-[var(--spacing-xl)] px-[var(--spacing-xl)] py-[var(--spacing-xl)]')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const titleClass = 'text-heading-md text-[var(--text-default)] [word-break:break-word]'

  const mutedTextClass =
    'text-body-sm text-[var(--text-muted)]  line-clamp-2 h-9 [word-break:break-word]'

  const pricingDetailsClass = 'text-body-xs text-[var(--text-muted)] h-8 [word-break:break-word]'

  const slotWrapperClass = 'min-h-[160px] w-full shrink-0'

  const actionsClass = computed(() => {
    const classes = ['flex w-full gap-[var(--spacing-md)] items-start shrink-0']

    if (isMiddle.value) {
      classes.push('pt-[var(--spacing-md)]')
    }

    return classes
  })
</script>

<template>
  <article
    :class="rootClass"
    :data-testid="testId"
  >
    <div
      :class="[
        'flex w-full flex-col items-start shrink-0',
        isMiddle ? 'gap-[var(--spacing-xl)]' : ''
      ]"
    >
      <div
        :class="[
          'flex w-full shrink-0 flex-col items-start',
          isMiddle
            ? 'gap-[var(--spacing-xs)] max-w-[256px]'
            : 'max-w-[256px] gap-[var(--spacing-xs)]'
        ]"
        :data-testid="`${testId}__header`"
      >
        <div
          :class="[
            'h-6 flex shrink-0 items-center',
            isMiddle ? 'w-full gap-[var(--spacing-sm)]' : 'gap-[var(--spacing-xs)]'
          ]"
        >
          <h3
            :class="titleClass"
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
          :class="mutedTextClass"
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
            :class="pricingDetailsClass"
            :data-testid="`${testId}__pricing-details`"
          >
            {{ pricingDetails }}
          </p>
        </div>

        <div
          :class="slotWrapperClass"
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
        :class="pricingDetailsClass"
        :data-testid="`${testId}__pricing-details`"
      >
        {{ pricingDetails }}
      </p>
    </div>

    <div
      v-if="!isMiddle"
      :class="actionsClass"
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
      :class="slotWrapperClass"
      :data-testid="`${testId}__slot`"
    >
      <slot />
    </div>

    <div
      v-if="isMiddle"
      :class="actionsClass"
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
