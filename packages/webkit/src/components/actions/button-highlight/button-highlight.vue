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
    'relative inline-flex items-center justify-center whitespace-nowrap ' +
    'border border-[length:var(--border-width-default)] border-[var(--secondary-mask)] ' +
    'rounded-[var(--shape-button)] text-[var(--text-default)] ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] ' +
    '[background-image:linear-gradient(var(--bg-backdrop),var(--bg-backdrop)),linear-gradient(120deg,var(--color-accent-900)_17%,var(--color-accent-100)_53%,var(--color-accent-600)_96%)] ' +
    'data-[size=large]:min-w-20 data-[size=large]:h-10 data-[size=large]:px-[var(--spacing-md)] data-[size=large]:text-button-lg ' +
    'data-[size=medium]:min-w-16 data-[size=medium]:h-8 data-[size=medium]:px-[var(--spacing-sm)] data-[size=medium]:text-button-md ' +
    'data-[size=small]:min-w-14 data-[size=small]:h-7 data-[size=small]:px-[var(--spacing-xs)] data-[size=small]:text-button-md ' +
    'data-[loading]:cursor-loading ' +
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed ' +
    'data-[disabled]:border-transparent data-[disabled]:text-[var(--text-disabled)] ' +
    'data-[disabled]:[background-image:none] data-[disabled]:bg-[var(--bg-disabled)]'

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
    <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
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
    <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
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
