<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'CurrencyAmount',
    inheritAttrs: false
  })

  /** Reading distance of the amount, on the house size ladder. */
  export type CurrencyAmountSize = 'small' | 'medium' | 'large'

  export interface CurrencyAmountProps {
    /** Monetary value content. */
    value?: string
    /** Text displayed before the value. Empty hides the symbol entirely. */
    prefix?: string
    /** Text displayed after the value. Empty hides the unit entirely. */
    suffix?: string
    /** Size token; affects typography and the gap between the figure and the suffix. */
    size?: CurrencyAmountSize
  }

  withDefaults(defineProps<CurrencyAmountProps>(), {
    value: '',
    prefix: '$',
    suffix: '',
    size: 'medium'
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'currency-amount')
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/currency-amount inline-flex items-center whitespace-nowrap data-[size=small]:gap-(--spacing-2xs) data-[size=medium]:gap-(--spacing-xs) data-[size=large]:items-end data-[size=large]:gap-(--spacing-xs)"
  >
    <span
      class="inline-flex items-center gap-(--spacing-2xs) group-data-[size=large]/currency-amount:gap-0"
    >
      <span
        v-if="prefix"
        class="text-(--text-default) group-data-[size=small]/currency-amount:text-amount-sm group-data-[size=medium]/currency-amount:text-amount-md group-data-[size=large]/currency-amount:text-amount-lg"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        class="text-(--text-default) group-data-[size=small]/currency-amount:text-amount-sm group-data-[size=medium]/currency-amount:text-amount-md group-data-[size=large]/currency-amount:text-amount-lg"
        :data-testid="`${testId}__value`"
      >
        {{ value }}
      </span>
    </span>
    <span
      v-if="suffix"
      class="text-(--text-muted) group-data-[size=small]/currency-amount:text-label-code-sm group-data-[size=medium]/currency-amount:text-label-code-md group-data-[size=large]/currency-amount:text-label-code-md group-data-[size=large]/currency-amount:pb-(--spacing-md)"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
