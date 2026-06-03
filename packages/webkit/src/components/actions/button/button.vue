<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger'
  export type ButtonSize = 'small' | 'medium' | 'large'
  export type ButtonTarget = '_blank' | '_self'

  defineOptions({
    name: 'Button',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label text. Use IconButton for icon-only controls. */
    label: string
    /** Visual variant. */
    kind?: ButtonKind
    /** Size token; affects height, padding, and typography. */
    size?: ButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** PrimeIcons class for the leading icon. */
    icon?: string
    /** When set, renders as an anchor link. */
    href?: string
    /** Link target when `href` is set. */
    target?: ButtonTarget
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    icon: '',
    href: '',
    target: '_self'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'actions-button')

  const isInactive = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href))

  const ghostLayerClasses = [
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:opacity-0 before:content-['']",
    'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
    "after:opacity-0 after:content-['']",
    'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
    'hover:before:opacity-100 active:after:opacity-100',
    'motion-reduce:before:transition-none motion-reduce:after:transition-none',
    'disabled:before:hidden disabled:after:hidden'
  ]

  const sharedClasses = [
    'relative inline-flex items-center justify-center whitespace-nowrap',
    'rounded-[var(--shape-button)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
    ...ghostLayerClasses
  ]

  const kindClasses: Record<ButtonKind, string> = {
    primary:
      'bg-[var(--primary)] text-[var(--primary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    secondary:
      'bg-[var(--secondary)] text-[var(--secondary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    outlined:
      'border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]',
    text: 'bg-transparent text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]',
    danger:
      'border border-[var(--danger-border)] bg-[var(--danger)] text-[var(--danger-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]'
  }

  const disabledClasses =
    'pointer-events-none cursor-not-allowed border-transparent bg-[var(--bg-disabled)] text-[var(--text-disabled)] before:hidden after:hidden'

  const sizeClasses: Record<ButtonSize, string> = {
    large: 'min-w-20 h-10 px-[var(--spacing-md)] text-button-lg',
    medium: 'min-w-16 h-8 px-[var(--spacing-sm)] text-button-md',
    small: 'min-w-14 h-7 px-[var(--spacing-xs)] text-button-md'
  }

  const spinnerSizeClasses: Record<ButtonSize, string> = {
    large: 'size-4',
    medium: 'size-3',
    small: 'size-3'
  }

  const rootClasses = computed(() => {
    const kind = props.disabled ? disabledClasses : kindClasses[props.kind]
    const loadingClasses = props.loading && !props.disabled ? 'cursor-loading' : ''

    return [sharedClasses, kind, sizeClasses[props.size], loadingClasses, attrs['class']]
  })

  const loadingTestId = computed(() => `${testId.value}-loading`)

  const handleClick = (event: MouseEvent) => {
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
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isInactive ? -1 : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
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
    :data-disabled="disabled ? '' : undefined"
    :class="rootClasses"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
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
