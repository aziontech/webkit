<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Currency',
    inheritAttrs: false
  })

  type CurrencySize = 'small' | 'large'

  interface CurrencyProps {
    /** Monetary value content. */
    value?: string
    /** Text displayed before the value. */
    prefix?: string
    /** Text displayed after the value. */
    suffix?: string
    /** Visual size token for text and spacing. */
    size?: CurrencySize
  }

  const props = withDefaults(defineProps<CurrencyProps>(), {
    value: '',
    prefix: '$',
    suffix: '',
    size: 'small'
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-currency')

  const isLarge = computed(() => props.size === 'large')
</script>

<template>
  <span
    :class="[
      'inline-flex items-center',
      isLarge ? 'gap-[var(--spacing-xs)]' : 'gap-[var(--spacing-xxs)]',
      attrs.class
    ]"
    :data-testid="testId"
  >
    <span class="inline-flex items-center gap-[var(--spacing-xxs)]">
      <span
        v-if="prefix"
        :class="[
          isLarge
            ? 'text-heading-md text-[var(--text-default)]'
            : 'text-label-lg text-[var(--text-default)]'
        ]"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        :class="[
          isLarge
            ? 'text-heading-md text-[var(--text-default)]'
            : 'text-label-lg text-[var(--text-default)]'
        ]"
        :data-testid="`${testId}__value`"
      >
        {{ value }}
      </span>
    </span>
    <span
      v-if="suffix"
      :class="[
        isLarge
          ? 'text-label-md text-[var(--text-muted)]'
          : 'text-label-sm text-[var(--text-muted)]'
      ]"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
