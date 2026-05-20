<script setup>
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  // Component-specific dot colors per Figma Status Indicator (node 395:5596).
  // Not mapped to semantic theme tokens by design.
  const STATUS_DOT_COLORS = {
    positive: '#8bc249',
    info: '#66adff',
    neutral: '#4d4d4d',
    warning: '#fec111',
    alt: '#f3652b',
    danger: '#ff4141'
  }

  const props = defineProps({
    status: {
      type: String,
      default: 'positive',
      validator: (value) =>
        ['positive', 'info', 'neutral', 'warning', 'alt', 'danger'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Status'
    },
    class: {
      type: String,
      default: ''
    }
  })

  const attrs = useAttrs()

  const fontSans = 'font-[family-name:var(--font-sans),ui-sans-serif,system-ui,sans-serif]'

  const testId = computed(() => attrs['data-testid'] ?? 'feedback-status-indicator')

  const dotColor = computed(() => STATUS_DOT_COLORS[props.status] ?? STATUS_DOT_COLORS.positive)

  const rootClass = computed(() => {
    const classes = [
      'inline-flex items-center gap-[var(--spacing-2,0.5rem)]',
      'px-[var(--spacing-3,0.75rem)] py-[var(--spacing-1.5,0.375rem)]',
      'rounded-[4px]',
      fontSans
    ]

    if (props.class) {
      classes.push(props.class)
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const labelClass = computed(() => [
    'leading-none tracking-[-0.02em] whitespace-nowrap',
    'text-[length:var(--text-label-sm,0.75rem)]',
    props.loading ? 'text-[var(--text-muted)]' : 'text-[var(--text-default)]'
  ])
</script>

<template>
  <div
    role="status"
    :aria-busy="loading || undefined"
    :class="rootClass"
    :data-testid="testId"
  >
    <Spinner
      v-if="loading"
      class="size-2.5 shrink-0 text-[var(--text-muted)]"
      :data-testid="`${testId}__spinner`"
    />
    <span
      v-else
      class="size-2.5 shrink-0 rounded-full"
      :style="{ backgroundColor: dotColor }"
      aria-hidden="true"
      :data-testid="`${testId}__dot`"
    />
    <span
      :class="labelClass"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </div>
</template>
