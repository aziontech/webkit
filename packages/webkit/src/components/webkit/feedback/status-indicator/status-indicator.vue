<script setup>
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  const STATUS_DOT_CLASSES = {
    positive: 'bg-[var(--success-contrast)]',
    info: 'bg-[var(--info-contrast)]',
    neutral: 'bg-[var(--text-muted)]',
    warning: 'bg-[var(--warning-contrast)]',
    alt: 'bg-[var(--primary)]',
    danger: 'bg-[var(--danger-contrast)]'
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
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'feedback-status-indicator')

  const dotClass = computed(() => STATUS_DOT_CLASSES[props.status] ?? STATUS_DOT_CLASSES.positive)

  const rootClass = computed(() => {
    const classes = [
      'inline-flex items-center gap-[var(--spacing-2)]',
      'px-[var(--spacing-3)] py-[var(--spacing-1.5)]',
      'rounded-[var(--shape-elements)]'
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const labelClass = computed(() => [
    'text-label-sm whitespace-nowrap',
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
      :class="dotClass"
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
