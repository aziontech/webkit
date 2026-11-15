<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { directionalIconClass } from '../../../utils/directional-icons'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type ButtonHighlightSize = 'small' | 'medium' | 'large'
  export type ButtonHighlightTarget = '_blank' | '_self'

  defineOptions({
    name: 'ButtonHighlight',
    inheritAttrs: false
  })

  export interface ButtonHighlightProps {
    /** Visible label text. Required — use IconButton for icon-only controls. */
    label: string
    /** Size token; affects height, padding, and typography. */
    size?: ButtonHighlightSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** Azion icon class for the leading icon. */
    icon?: string
    /** When set, renders as an anchor link. */
    href?: string
    /** Link target when href is set. */
    target?: ButtonHighlightTarget
  }

  const props = withDefaults(defineProps<ButtonHighlightProps>(), {
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

  const loadingTestId = computed(() => `${testId.value}__loading`)

  const isInert = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href))

  const ROOT_CLASS =
    'group/highlight relative inline-flex items-center justify-center isolate overflow-hidden whitespace-nowrap p-px ' +
    'rounded-(--shape-button) ' +
    'border border-(length:--border-width-default) border-(--secondary-mask) ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[size=large]:min-w-20 data-[size=large]:h-10 ' +
    'data-[size=medium]:min-w-16 data-[size=medium]:h-8 ' +
    'data-[size=small]:min-w-14 data-[size=small]:h-7 ' +
    'data-[loading]:cursor-wait ' +
    'data-[disabled]:cursor-not-allowed ' +
    'data-[inert]:border-transparent data-[inert]:bg-(--bg-disabled)'

  const GLOW_CLASS =
    'absolute inset-0 pointer-events-none ' +
    'animate-spin [animation-duration:8s] [animation-timing-function:linear] ' +
    '[background:linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-brand-primary-500))] ' +
    '[filter:blur(12px)] ' +
    'motion-reduce:animate-none ' +
    'group-data-[inert]/highlight:hidden'

  const BASE_CLASS =
    'absolute inset-px pointer-events-none rounded-[inherit] ' +
    '[background-image:linear-gradient(120deg,var(--color-brand-accent-900)_17%,var(--color-brand-accent-100)_53%,var(--color-brand-accent-600)_96%)] ' +
    'transition-opacity duration-300 ease-out motion-reduce:transition-none ' +
    'group-hover/highlight:opacity-25 ' +
    'group-data-[inert]/highlight:[background-image:none] ' +
    'group-data-[inert]/highlight:bg-(--bg-disabled) ' +
    'group-data-[inert]/highlight:opacity-100'

  const SCRIM_CLASS =
    'absolute inset-px pointer-events-none rounded-[inherit] ' +
    'bg-(--bg-backdrop) ' +
    'transition-opacity duration-300 ease-out motion-reduce:transition-none ' +
    'group-hover/highlight:opacity-25 ' +
    'group-data-[inert]/highlight:hidden'

  const CONTENT_CLASS =
    'relative z-1 inline-flex items-center justify-center gap-(--spacing-xs) w-full h-full ' +
    'text-(--color-base-white) ' +
    'data-[size=large]:px-(--spacing-md) data-[size=large]:text-button-lg ' +
    'data-[size=medium]:px-(--spacing-sm) data-[size=medium]:text-button-md ' +
    'data-[size=small]:px-(--spacing-xs) data-[size=small]:text-button-md ' +
    'group-data-[inert]/highlight:text-(--text-disabled)'

  const onClick = (event: MouseEvent) => {
    if (isInert.value) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <a
    v-if="isAnchor"
    v-bind="$attrs"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="ROOT_CLASS"
    :aria-disabled="isInert || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isInert ? -1 : undefined"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-testid="testId"
    @click="onClick"
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
        class="size-3 group-data-[size=large]/highlight:size-4"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="[icon, directionalIconClass(icon)]"
        class="shrink-0 text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
  </a>

  <button
    v-else
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :aria-disabled="isInert || undefined"
    :aria-busy="loading || undefined"
    :class="ROOT_CLASS"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-testid="testId"
    @click="onClick"
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
        class="size-3 group-data-[size=large]/highlight:size-4"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="[icon, directionalIconClass(icon)]"
        class="shrink-0 text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
  </button>
</template>
