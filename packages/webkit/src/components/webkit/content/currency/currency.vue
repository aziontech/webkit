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
      'inline-flex items-center font-sora',
      isLarge.value ? 'gap-[var(--spacing-2)]' : 'gap-[var(--spacing-1)]'
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const groupClass = 'inline-flex items-center gap-[var(--spacing-1)]'

  const primaryTextClass = computed(() => {
    if (isLarge.value) {
      return [
        'text-[var(--text-default)]',
        'text-heading-sm leading-[var(--text-heading-sm-line-height,1.4)]'
      ]
    }

    return ['text-[var(--text-default)] leading-none', 'text-[length:var(--text-label-lg,1rem)]']
  })

  const suffixClass = computed(() => {
    if (isLarge.value) {
      return [
        'text-[var(--text-muted)] leading-none',
        'text-[length:var(--text-label-md,0.875rem)]'
      ]
    }

    return ['text-[var(--text-muted)] leading-none', 'text-[length:var(--text-label-sm,0.75rem)]']
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
