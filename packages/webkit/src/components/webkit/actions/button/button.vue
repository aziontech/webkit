<script setup>
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  defineOptions({
    name: 'Button',
    inheritAttrs: false
  })

  const emit = defineEmits(['click'])

  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    kind: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outlined', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'large',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: '_self',
      validator: (value) => ['_blank', '_self'].includes(value)
    }
  })

  const attrs = useAttrs()

  const testId = computed(() => attrs['data-testid'] ?? 'action-button')

  const isInactive = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href) && !isInactive.value)

  const ghostLayerClasses = [
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:opacity-0 before:content-['']",
    'before:transition-opacity before:duration-150 before:ease-out',
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
    "after:opacity-0 after:content-['']",
    'after:transition-opacity after:duration-150 after:ease-out',
    'hover:before:opacity-100 active:after:opacity-100',
    'motion-reduce:before:transition-none motion-reduce:after:transition-none',
    'disabled:before:hidden disabled:after:hidden'
  ]

  const sharedClasses = [
    'relative inline-flex items-center justify-center whitespace-nowrap',
    'rounded-[var(--shape-button)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)]',
    ...ghostLayerClasses
  ]

  const kindClasses = {
    primary:
      'bg-[var(--primary)] text-[var(--primary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    secondary:
      'bg-[var(--secondary)] text-[var(--secondary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    outlined:
      'border border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]',
    text: 'bg-transparent text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]'
  }

  const disabledClasses =
    'pointer-events-none border-transparent bg-[var(--bg-disabled)] text-[var(--text-disabled)] before:hidden after:hidden'

  const sizeClasses = {
    large: 'min-w-20 h-10 px-[var(--spacing-elements-md)] text-button-lg',
    medium: 'min-w-16 h-8 px-[var(--spacing-elements-sm)] text-button-md',
    small: 'min-w-14 h-7 px-[var(--spacing-elements-xs)] text-button-md'
  }

  const spinnerSizeClasses = {
    large: 'size-4',
    medium: 'size-3',
    small: 'size-3'
  }

  const rootClasses = computed(() => {
    const kind = props.disabled ? disabledClasses : kindClasses[props.kind]
    const loadingClasses = props.loading && !props.disabled ? 'cursor-loading' : ''

    return [sharedClasses, kind, sizeClasses[props.size], loadingClasses, attrs.class]
  })

  const loadingTestId = computed(() => `${testId.value}-loading`)

  const handleClick = (event) => {
    if (isInactive.value) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <a
    v-if="isAnchor"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="rootClasses"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-[1] inline-flex items-center gap-spacing-elements-xs">
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="icon"
        class="shrink-0 text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
  </a>

  <button
    v-else
    type="button"
    :disabled="disabled"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :class="rootClasses"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-[1] inline-flex items-center gap-spacing-elements-xs">
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="icon"
        class="shrink-0 text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
  </button>
</template>
