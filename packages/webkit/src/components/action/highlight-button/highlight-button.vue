<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { directionalIconClass } from '../../../utils/directional-icons'
  import { safeHref } from '../../../utils/safe-href'
  import Spinner from '../../feedback/spinner/spinner.vue'

  export type HighlightButtonSize = 'small' | 'medium' | 'large'
  export type HighlightButtonTarget = '_blank' | '_self'

  defineOptions({
    name: 'HighlightButton',
    inheritAttrs: false
  })

  export interface HighlightButtonProps {
    /** Visible label text. Required — use IconButton for icon-only controls. */
    label: string
    /** Size token; affects height, padding, and typography. */
    size?: HighlightButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** Azion icon class for the leading icon. */
    icon?: string
    /** When set to a safe URL, renders as an anchor link; a javascript, data or other unsafe URL is ignored and the control stays a button. */
    href?: string
    /** Link target when href is set. */
    target?: HighlightButtonTarget
  }

  const props = withDefaults(defineProps<HighlightButtonProps>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'highlight-button')

  const loadingTestId = computed(() => `${testId.value}__loading`)

  const isInert = computed(() => props.disabled || props.loading)

  const linkHref = computed(() => safeHref(props.href))

  const isAnchor = computed(() => linkHref.value !== null)

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
    'animate-spin-settle ' +
    '[background:linear-gradient(90deg,var(--text-default),var(--brand-blue),var(--primary))] ' +
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
    'text-(--text-default) ' +
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
  <component
    :is="isAnchor ? 'a' : 'button'"
    v-bind="$attrs"
    :href="isAnchor ? (linkHref ?? undefined) : undefined"
    :target="isAnchor ? target : undefined"
    :rel="isAnchor && target === '_blank' ? 'noopener noreferrer' : undefined"
    :type="isAnchor ? undefined : 'button'"
    :disabled="isAnchor ? undefined : disabled"
    :class="ROOT_CLASS"
    :aria-disabled="isInert || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isAnchor && isInert ? -1 : undefined"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-testid="testId"
    @click="onClick"
  >
    <span
      aria-hidden="true"
      data-theme="dark"
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
      data-theme="dark"
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
  </component>
</template>
