<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { directionalIconClass } from '../../../utils/directional-icons'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'transparent' | 'danger' | 'link'
  export type ButtonSize = 'small' | 'medium' | 'large'
  export type ButtonTarget = '_blank' | '_self'
  export type ButtonIconPosition = 'leading' | 'trailing'
  export type ButtonType = 'button' | 'submit' | 'reset'

  defineOptions({
    name: 'Button',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label text. Use IconButton for icon-only controls. */
    label: string
    /** Visual variant. `link` draws an inline text action in the link colour, with no box; `size` does not apply to it. */
    kind?: ButtonKind
    /** Size token; affects height, padding, and typography. */
    size?: ButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** PrimeIcons class for the icon drawn beside the label. */
    icon?: string
    /** Which side of the label the icon sits on. A leading glyph names the action; a trailing one points at where it goes. */
    iconPosition?: ButtonIconPosition
    /** Nudges a trailing icon along its axis on hover. Off by default; marketing CTAs opt in. */
    animated?: boolean
    /** When set, renders as an anchor link. */
    href?: string
    /** Link target when `href` is set. */
    target?: ButtonTarget
    /** Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set. */
    type?: ButtonType
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    icon: '',
    iconPosition: 'leading',
    animated: false,
    href: '',
    target: '_self',
    type: 'button'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    /** A mark drawn before the label, ahead of a leading icon; it stays first when the icon trails. */
    prefix?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'actions-button')

  const forwardedAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest['class']
    return rest
  })

  const isInactive = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href))

  const sharedClasses =
    "group/button relative inline-flex items-center justify-center whitespace-nowrap rounded-(--shape-button) forced-colors:border forced-colors:border-[ButtonBorder] forced-colors:disabled:border-[GrayText] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none disabled:before:hidden disabled:after:hidden"

  const kindClasses: Record<ButtonKind, string> = {
    primary:
      'bg-(--primary) text-(--primary-contrast) before:bg-(--bg-hover) after:bg-(--bg-active)',
    secondary:
      'bg-(--secondary) text-(--secondary-contrast) before:bg-(--bg-hover) after:bg-(--bg-active)',
    outlined:
      'border border-(--border-default) bg-(--bg-surface) text-(--text-default) before:bg-(--bg-mask) after:bg-(--bg-active)',
    transparent:
      'bg-transparent text-(--text-default) before:bg-(--bg-mask) after:bg-(--bg-active)',
    danger:
      'border border-(--danger-border) bg-(--danger) text-(--danger-contrast) before:bg-(--bg-hover) after:bg-(--bg-active)',
    link: 'bg-transparent text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline motion-reduce:transition-none before:hidden after:hidden forced-colors:border-0 forced-colors:text-[LinkText]'
  }

  const inactiveClasses =
    'border-transparent bg-(--bg-disabled) text-(--text-disabled) before:hidden after:hidden'

  const linkInactiveClasses =
    'border-transparent text-(--text-disabled) before:hidden after:hidden forced-colors:border-0'

  const sizeClasses: Record<ButtonSize, string> = {
    large: 'min-w-20 h-10 px-(--spacing-md) text-button-lg',
    medium: 'min-w-16 h-8 px-(--spacing-sm) text-button-md',
    small: 'min-w-14 h-7 px-(--spacing-xs) text-button-md'
  }

  const spinnerSizeClasses: Record<ButtonSize, string> = {
    large: 'size-4',
    medium: 'size-3',
    small: 'size-3'
  }

  const rootClasses = computed(() => {
    const isLink = props.kind === 'link'
    const cursor = props.disabled ? 'cursor-not-allowed' : props.loading ? 'cursor-wait' : ''
    return [
      sharedClasses,
      cursor ? [cursor, isLink ? linkInactiveClasses : inactiveClasses] : kindClasses[props.kind],
      isLink ? 'text-body-sm' : sizeClasses[props.size],
      attrs['class']
    ]
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
    v-bind="forwardedAttrs"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="rootClasses"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isInactive ? -1 : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-kind="kind"
    :data-icon-position="icon ? iconPosition : undefined"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <slot name="prefix" />
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        class="group-data-[icon-position=trailing]/button:order-last"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="[icon, directionalIconClass(icon)]"
        :data-icon-position="iconPosition"
        :data-animated="animated && iconPosition === 'trailing' ? '' : undefined"
        class="shrink-0 text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/button:data-animated:translate-x-0.5 rtl:group-hover/button:data-animated:-translate-x-0.5 group-data-[icon-position=trailing]/button:order-last motion-reduce:transition-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </a>

  <button
    v-else
    v-bind="forwardedAttrs"
    :type="type"
    :disabled="disabled"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-kind="kind"
    :data-icon-position="icon ? iconPosition : undefined"
    :class="rootClasses"
    :data-testid="testId"
    @click="handleClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <slot name="prefix" />
      <Spinner
        v-if="loading"
        :class="spinnerSizeClasses[size]"
        class="group-data-[icon-position=trailing]/button:order-last"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        :class="[icon, directionalIconClass(icon)]"
        :data-icon-position="iconPosition"
        :data-animated="animated && iconPosition === 'trailing' ? '' : undefined"
        class="shrink-0 text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/button:data-animated:translate-x-0.5 rtl:group-hover/button:data-animated:-translate-x-0.5 group-data-[icon-position=trailing]/button:order-last motion-reduce:transition-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </button>
</template>
