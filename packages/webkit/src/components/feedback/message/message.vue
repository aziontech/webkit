<script setup>
  import { computed, useAttrs } from 'vue'

  import Button from '../../button/button.vue'

  defineOptions({
    name: 'Message',
    inheritAttrs: false
  })

  const emit = defineEmits(['action'])

  const defaultIcons = {
    info: 'pi pi-info-circle',
    success: 'pi pi-check-circle',
    warning: 'pi pi-exclamation-triangle',
    danger: 'pi pi-exclamation-circle'
  }

  const severityStyles = {
    info: {
      container: 'bg-[var(--info)] border-[var(--info-border)] text-[var(--text-default)]',
      icon: 'text-[var(--info-contrast)]'
    },
    success: {
      container: 'bg-[var(--success)] border-[var(--success-border)] text-[var(--text-default)]',
      icon: 'text-[var(--success-contrast)]'
    },
    warning: {
      container: 'bg-[var(--warning)] border-[var(--warning-border)] text-[var(--text-default)]',
      icon: 'text-[var(--warning-contrast)]'
    },
    danger: {
      container: 'bg-[var(--danger)] border-[var(--danger-border)] text-[var(--text-default)]',
      icon: 'text-[var(--danger-contrast)]'
    }
  }

  const props = defineProps({
    severity: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'danger', 'error'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: undefined
    },
    actionLabel: {
      type: String,
      default: ''
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'feedback-message')

  const normalizedSeverity = computed(() => {
    const severity = String(props.severity || 'info').toLowerCase()

    if (severity === 'error') {
      return 'danger'
    }

    return ['info', 'success', 'warning', 'danger'].includes(severity) ? severity : 'info'
  })

  const currentSeverityStyle = computed(
    () => severityStyles[normalizedSeverity.value] ?? severityStyles.info
  )

  const role = computed(() =>
    ['danger', 'warning'].includes(normalizedSeverity.value) ? 'alert' : 'status'
  )

  const rootClass = computed(() => {
    const classes = [
      'flex min-h-[var(--h-14,3.5rem)] items-center gap-[var(--spacing-sm)]',
      'rounded-[var(--shape-button)] border border-[length:var(--border-width-default,1px)]',
      'p-[var(--spacing-sm)] shadow-[var(--shadow-xs)]',
      currentSeverityStyle.value.container
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const iconClass = computed(() => [
    props.icon || defaultIcons[normalizedSeverity.value],
    'size-4 shrink-0 leading-none',
    currentSeverityStyle.value.icon
  ])

  const titleClass = computed(() => ['text-label-sm text-[var(--text-default)]'])

  const descriptionClass = computed(() => ['text-body-xs text-[var(--text-muted)]'])

  const handleAction = (event) => {
    emit('action', event)
  }
</script>

<template>
  <div
    :role="role"
    :class="rootClass"
    :data-testid="testId"
  >
    <slot v-if="$slots.default" />
    <template v-else>
      <i
        :class="iconClass"
        aria-hidden="true"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)]">
        <p
          :class="titleClass"
          :data-testid="`${testId}__title`"
        >
          {{ title }}
        </p>
        <p
          v-if="description"
          :class="descriptionClass"
          :data-testid="`${testId}__description`"
        >
          {{ description }}
        </p>
      </div>
    </template>
    <slot name="action">
      <Button
        v-if="actionLabel"
        kind="text"
        size="small"
        :label="actionLabel"
        :data-testid="`${testId}__action`"
        @click="handleAction"
      />
    </slot>
  </div>
</template>
