<script setup lang="ts">
  // One monetary amount as three spans (symbol / figure / unit), never a formatted
  // string — see .specs/currency.md for the full rationale (size ladder, code-face
  // suffix, large's bottom-aligned unit, the amount's own tracking tokens).
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Currency',
    inheritAttrs: false
  })

  /** Reading distance of the amount, on the house size ladder. */
  export type CurrencySize = 'small' | 'medium' | 'large'

  interface CurrencyProps {
    /** Monetary value content. */
    value?: string
    /** Text displayed before the value. Empty hides the symbol entirely. */
    prefix?: string
    /** Text displayed after the value. Empty hides the unit entirely. */
    suffix?: string
    /** Size token; affects typography and the gap between the figure and the suffix. */
    size?: CurrencySize
  }

  withDefaults(defineProps<CurrencyProps>(), {
    value: '',
    prefix: '$',
    suffix: '',
    size: 'small'
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-currency')
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/currency inline-flex items-center whitespace-nowrap data-[size=small]:gap-(--spacing-xxs) data-[size=medium]:gap-(--spacing-xs) data-[size=large]:items-end data-[size=large]:gap-(--spacing-xs)"
  >
    <!-- Symbol and figure share a group so the root's gap separates the amount from
         its unit, not the symbol from its digits. -->
    <span
      class="inline-flex items-center gap-(--spacing-xxs) group-data-[size=large]/currency:gap-0"
    >
      <span
        v-if="prefix"
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__value`"
      >
        {{ value }}
      </span>
    </span>
    <span
      v-if="suffix"
      class="text-(--text-muted) group-data-[size=small]/currency:text-label-code-sm group-data-[size=medium]/currency:text-label-code-md group-data-[size=large]/currency:text-label-code-md group-data-[size=large]/currency:pb-(--spacing-md)"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
