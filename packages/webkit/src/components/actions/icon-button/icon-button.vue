<script setup lang="ts">
  import { computed, Transition, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'
  import {
    iconTransitionEnterActiveClasses,
    iconTransitionEnterFromClasses,
    iconTransitionEnterToClasses,
    iconTransitionHostClasses,
    iconTransitionIconClasses,
    iconTransitionLeaveActiveClasses,
    iconTransitionLeaveFromClasses,
    iconTransitionLeaveToClasses
  } from './presets/icon-transition.js'

  export type IconButtonKind = 'primary' | 'secondary' | 'outlined' | 'transparent' | 'danger'
  export type IconButtonSize = 'small' | 'medium' | 'large'
  export type IconButtonTarget = '_blank' | '_self'

  defineOptions({
    name: 'IconButton',
    inheritAttrs: false,
    components: { Transition }
  })

  interface Props {
    /** PrimeIcons class for the icon. */
    icon: string
    /** Accessible name for icon-only controls. */
    ariaLabel: string
    /** Visual variant. */
    kind?: IconButtonKind
    /** Size token; affects height and typography. */
    size?: IconButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** When set, renders as an anchor link. */
    href?: string
    /** Link target when `href` is set. */
    target?: IconButtonTarget
    /** Animates icon swaps with enter/leave transitions. */
    iconTransition?: boolean
    /** Extra classes applied to the icon glyph. */
    iconClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    href: '',
    target: '_self',
    iconTransition: false,
    iconClass: ''
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-icon-button'
  )

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
    'relative inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--shape-button)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
    ...ghostLayerClasses
  ]

  const kindClasses: Record<IconButtonKind, string> = {
    primary:
      'bg-[var(--primary)] text-[var(--primary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    secondary:
      'bg-[var(--secondary)] text-[var(--secondary-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]',
    outlined:
      'border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]',
    transparent:
      'bg-transparent text-[var(--text-default)] before:bg-[var(--bg-mask)] after:bg-[var(--bg-active)]',
    danger:
      'border border-[var(--danger-border)] bg-[var(--danger)] text-[var(--danger-contrast)] before:bg-[var(--bg-hover)] after:bg-[var(--bg-active)]'
  }

  // Disabled shows the not-allowed cursor. Interaction is blocked natively (`<button :disabled>`)
  // and via the handleClick guard (anchor), so pointer-events stay on for the cursor to render.
  const disabledClasses =
    'cursor-not-allowed border-transparent bg-[var(--bg-disabled)] text-[var(--text-disabled)] before:hidden after:hidden'

  // Loading reuses the disabled visual tokens (per design) but keeps the loading cursor
  // and the spinner. Interaction stays blocked via handleClick.
  const loadingClasses =
    'cursor-wait border-transparent bg-[var(--bg-disabled)] text-[var(--text-disabled)] before:hidden after:hidden'

  const iconClasses =
    'inline-flex shrink-0 items-center justify-center text-[length:inherit] leading-none'

  const sizeClasses: Record<IconButtonSize, string> = {
    large: 'size-10 text-button-lg',
    medium: 'size-8 text-button-md',
    small: 'size-7 text-button-md'
  }

  const iconSlotSizeClasses: Record<IconButtonSize, string> = {
    large: 'size-4',
    medium: 'size-3',
    small: 'size-3'
  }

  const spinnerSizeClasses = iconSlotSizeClasses

  const rootClasses = computed(() => {
    const stateClasses = props.disabled
      ? disabledClasses
      : props.loading
        ? loadingClasses
        : kindClasses[props.kind]

    return [sharedClasses, stateClasses, sizeClasses[props.size], attrs.class]
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
    :aria-label="ariaLabel"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isInactive ? -1 : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      :class="
        iconTransition
          ? [iconTransitionHostClasses, iconSlotSizeClasses[size]]
          : 'relative z-[1] inline-flex items-center justify-center'
      "
    >
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        :data-testid="loadingTestId"
      />
      <Transition
        v-else-if="iconTransition"
        mode="out-in"
        :enter-active-class="iconTransitionEnterActiveClasses"
        :enter-from-class="iconTransitionEnterFromClasses"
        :enter-to-class="iconTransitionEnterToClasses"
        :leave-active-class="iconTransitionLeaveActiveClasses"
        :leave-from-class="iconTransitionLeaveFromClasses"
        :leave-to-class="iconTransitionLeaveToClasses"
      >
        <i
          :key="icon"
          :class="[icon, iconClasses, iconTransitionIconClasses, iconClass]"
          aria-hidden="true"
        />
      </Transition>
      <i
        v-else
        :class="[icon, iconClasses, iconClass]"
        aria-hidden="true"
      />
    </span>
  </a>

  <button
    v-else
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="rootClasses"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      :class="
        iconTransition
          ? [iconTransitionHostClasses, iconSlotSizeClasses[size]]
          : 'relative z-[1] inline-flex items-center justify-center'
      "
    >
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        :data-testid="loadingTestId"
      />
      <Transition
        v-else-if="iconTransition"
        mode="out-in"
        :enter-active-class="iconTransitionEnterActiveClasses"
        :enter-from-class="iconTransitionEnterFromClasses"
        :enter-to-class="iconTransitionEnterToClasses"
        :leave-active-class="iconTransitionLeaveActiveClasses"
        :leave-from-class="iconTransitionLeaveFromClasses"
        :leave-to-class="iconTransitionLeaveToClasses"
      >
        <i
          :key="icon"
          :class="[icon, iconClasses, iconTransitionIconClasses, iconClass]"
          aria-hidden="true"
        />
      </Transition>
      <i
        v-else
        :class="[icon, iconClasses, iconClass]"
        aria-hidden="true"
      />
    </span>
  </button>
</template>
