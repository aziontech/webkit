<script setup>
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Currency',
    inheritAttrs: false
  })

  const props = defineProps({
    value: {
      type: String,
      default: ''
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
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['small', 'large'].includes(value)
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'content-currency')

  const isLarge = computed(() => props.size === 'large')

  const rootClass = computed(() => {
    const classes = [
      'inline-flex items-center',
      isLarge.value ? 'gap-[var(--spacing-xs)]' : 'gap-[var(--spacing-xxs)]'
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const groupClass = 'inline-flex items-center gap-[var(--spacing-xxs)]'

  const primaryTextClass = computed(() => {
    if (isLarge.value) {
      return ['text-heading-md text-[var(--text-default)]']
    }

    return ['text-label-lg text-[var(--text-default)]']
  })

  const suffixClass = computed(() => {
    if (isLarge.value) {
      return ['text-label-md text-[var(--text-muted)]']
    }

    return ['text-label-sm text-[var(--text-muted)]']
  })
</script>

<template>
  <span
    :class="rootClass"
    :data-testid="testId"
  >
    <span :class="groupClass">
      <span
        v-if="showPrefix"
        :class="primaryTextClass"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        :class="primaryTextClass"
        :data-testid="`${testId}__value`"
      >
        {{ value }}
      </span>
    </span>
    <span
      v-if="showSuffix"
      :class="suffixClass"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
