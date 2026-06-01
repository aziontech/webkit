<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type ButtonHighlightSize = 'small' | 'medium' | 'large'
  export type ButtonHighlightTarget = '_blank' | '_self'

  defineOptions({
    name: 'ButtonHighlight',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label text. Required — use IconButton for icon-only controls. */
    label: string
    /** Size token; affects height, padding, and typography. */
    size?: ButtonHighlightSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** PrimeIcons class for the leading icon. */
    icon?: string
    /** When set, renders as an anchor link. */
    href?: string
    /** Link target when href is set. */
    target?: ButtonHighlightTarget
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-button-highlight'
  )

  const loadingTestId = computed(() => `${testId.value}-loading`)

  const isInactive = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href))

  const ROOT_CLASS =
    'group/highlight relative inline-flex items-center justify-center isolate overflow-hidden whitespace-nowrap p-px ' +
    'rounded-[var(--shape-button)] ' +
    'border border-[length:var(--border-width-default)] border-[var(--secondary-mask)] ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] ' +
    'data-[size=large]:min-w-20 data-[size=large]:h-10 ' +
    'data-[size=medium]:min-w-16 data-[size=medium]:h-8 ' +
    'data-[size=small]:min-w-14 data-[size=small]:h-7 ' +
    'data-[loading]:cursor-loading ' +
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed ' +
    'data-[disabled]:border-transparent data-[disabled]:bg-[var(--bg-disabled)]'

  const GLOW_CLASS =
    'absolute inset-0 pointer-events-none ' +
    'animate-spin [animation-duration:8s] [animation-timing-function:linear] ' +
    '[background:linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-primary-500))] ' +
    '[filter:blur(12px)] ' +
    'motion-reduce:animate-none ' +
    'group-data-[disabled]/highlight:hidden'

  const BASE_CLASS =
    'absolute inset-px pointer-events-none rounded-[inherit] ' +
    '[background-image:linear-gradient(120deg,var(--color-accent-900)_17%,var(--color-accent-100)_53%,var(--color-accent-600)_96%)] ' +
    'transition-opacity duration-300 ease-out motion-reduce:transition-none ' +
    'group-hover/highlight:opacity-25 ' +
    'group-data-[disabled]/highlight:[background-image:none] ' +
    'group-data-[disabled]/highlight:bg-[var(--bg-disabled)] ' +
    'group-data-[disabled]/highlight:opacity-100'

  const SCRIM_CLASS =
    'absolute inset-px pointer-events-none rounded-[inherit] ' +
    'bg-[var(--bg-backdrop)] ' +
    'transition-opacity duration-300 ease-out motion-reduce:transition-none ' +
    'group-hover/highlight:opacity-25 ' +
    'group-data-[disabled]/highlight:hidden'

  const CONTENT_CLASS =
    'relative z-[1] inline-flex items-center justify-center gap-[var(--spacing-xs)] w-full h-full ' +
    'text-[var(--text-default)] ' +
    'data-[size=large]:px-[var(--spacing-md)] data-[size=large]:text-button-lg ' +
    'data-[size=medium]:px-[var(--spacing-sm)] data-[size=medium]:text-button-md ' +
    'data-[size=small]:px-[var(--spacing-xs)] data-[size=small]:text-button-md ' +
    'group-data-[disabled]/highlight:text-[var(--text-disabled)]'

  const rootClasses = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

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
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      aria-hidden="true"
      :class="GLOW_CLASS"
    />
    <span
      aria-hidden="true"
      :class="BASE_CLASS"
    />
    <span
      aria-hidden="true"
      :class="SCRIM_CLASS"
    />
    <span
      :class="CONTENT_CLASS"
      :data-size="size"
    >
      <Spinner
        v-if="loading"
        :class="size === 'large' ? 'size-4' : 'size-3'"
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
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      aria-hidden="true"
      :class="GLOW_CLASS"
    />
    <span
      aria-hidden="true"
      :class="BASE_CLASS"
    />
    <span
      aria-hidden="true"
      :class="SCRIM_CLASS"
    />
    <span
      :class="CONTENT_CLASS"
      :data-size="size"
    >
      <Spinner
        v-if="loading"
        :class="size === 'large' ? 'size-4' : 'size-3'"
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
