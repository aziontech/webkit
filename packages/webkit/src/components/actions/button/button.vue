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

  export interface ButtonProps {
    /** Visible label text, the fallback of the default slot. Use IconButton for icon-only controls. */
    label?: string
    /** Visual variant. `link` draws an inline text action in the link colour, with no box; `size` does not apply to it. */
    kind?: ButtonKind
    /** Size token; affects height, padding, and typography. */
    size?: ButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** Azion icon class for the icon drawn beside the label. */
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
  const props = withDefaults(defineProps<ButtonProps>(), {
    label: '',
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
    /** The visible label; falls back to `label`. */
    default?(): unknown
    /** A mark drawn before the label, ahead of a leading icon; it stays first when the icon trails. */
    leading?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'actions-button')

  const isInert = computed(() => props.disabled || props.loading)

  const isAnchor = computed(() => Boolean(props.href))

  const ROOT_CLASS =
    "group/button relative inline-flex items-center justify-center whitespace-nowrap rounded-(--shape-button) forced-colors:border forced-colors:border-[ButtonBorder] forced-colors:disabled:border-[GrayText] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none disabled:before:hidden disabled:after:hidden not-data-[inert]:data-[kind=primary]:bg-(--primary) not-data-[inert]:data-[kind=primary]:text-(--primary-foreground) not-data-[inert]:data-[kind=primary]:before:bg-(--bg-hover) not-data-[inert]:data-[kind=primary]:after:bg-(--bg-active) not-data-[inert]:data-[kind=secondary]:bg-(--secondary) not-data-[inert]:data-[kind=secondary]:text-(--secondary-foreground) not-data-[inert]:data-[kind=secondary]:before:bg-(--bg-hover) not-data-[inert]:data-[kind=secondary]:after:bg-(--bg-active) not-data-[inert]:data-[kind=outlined]:border not-data-[inert]:data-[kind=outlined]:border-(--border-default) not-data-[inert]:data-[kind=outlined]:bg-(--bg-surface) not-data-[inert]:data-[kind=outlined]:text-(--text-default) not-data-[inert]:data-[kind=outlined]:before:bg-(--bg-mask) not-data-[inert]:data-[kind=outlined]:after:bg-(--bg-active) not-data-[inert]:data-[kind=transparent]:bg-transparent not-data-[inert]:data-[kind=transparent]:text-(--text-default) not-data-[inert]:data-[kind=transparent]:before:bg-(--bg-mask) not-data-[inert]:data-[kind=transparent]:after:bg-(--bg-active) not-data-[inert]:data-[kind=danger]:border not-data-[inert]:data-[kind=danger]:border-(--danger-border) not-data-[inert]:data-[kind=danger]:bg-(--danger) not-data-[inert]:data-[kind=danger]:text-(--danger-foreground) not-data-[inert]:data-[kind=danger]:before:bg-(--bg-hover) not-data-[inert]:data-[kind=danger]:after:bg-(--bg-active) not-data-[inert]:data-[kind=link]:bg-transparent not-data-[inert]:data-[kind=link]:text-(--text-link) not-data-[inert]:data-[kind=link]:underline-offset-2 not-data-[inert]:data-[kind=link]:transition-colors not-data-[inert]:data-[kind=link]:duration-fast-02 not-data-[inert]:data-[kind=link]:ease-productive-entrance not-data-[inert]:data-[kind=link]:hover:text-(--text-link-hover) not-data-[inert]:data-[kind=link]:hover:underline not-data-[inert]:data-[kind=link]:motion-reduce:transition-none not-data-[inert]:data-[kind=link]:before:hidden not-data-[inert]:data-[kind=link]:after:hidden not-data-[inert]:data-[kind=link]:forced-colors:border-0 not-data-[inert]:data-[kind=link]:forced-colors:text-[LinkText] data-[inert]:not-data-[kind=link]:border-transparent data-[inert]:not-data-[kind=link]:bg-(--bg-disabled) data-[inert]:not-data-[kind=link]:text-(--text-disabled) data-[inert]:not-data-[kind=link]:before:hidden data-[inert]:not-data-[kind=link]:after:hidden data-[inert]:data-[kind=link]:border-transparent data-[inert]:data-[kind=link]:text-(--text-disabled) data-[inert]:data-[kind=link]:before:hidden data-[inert]:data-[kind=link]:after:hidden data-[inert]:data-[kind=link]:forced-colors:border-0 data-[loading]:cursor-wait data-[disabled]:cursor-not-allowed not-data-[kind=link]:data-[size=large]:min-w-20 not-data-[kind=link]:data-[size=large]:h-10 not-data-[kind=link]:data-[size=large]:px-(--spacing-md) not-data-[kind=link]:data-[size=large]:text-button-lg not-data-[kind=link]:data-[size=medium]:min-w-16 not-data-[kind=link]:data-[size=medium]:h-8 not-data-[kind=link]:data-[size=medium]:px-(--spacing-sm) not-data-[kind=link]:data-[size=medium]:text-button-md not-data-[kind=link]:data-[size=small]:min-w-14 not-data-[kind=link]:data-[size=small]:h-7 not-data-[kind=link]:data-[size=small]:px-(--spacing-xs) not-data-[kind=link]:data-[size=small]:text-button-md data-[kind=link]:text-body-sm"

  const loadingTestId = computed(() => `${testId.value}__loading`)

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
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-kind="kind"
    :data-size="size"
    :data-icon-position="icon ? iconPosition : undefined"
    :data-testid="testId"
    @click="onClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <slot name="leading" />
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/button:size-4 group-data-[icon-position=trailing]/button:order-last"
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
      <slot>{{ label }}</slot>
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </a>

  <button
    v-else
    v-bind="$attrs"
    :type="type"
    :disabled="disabled"
    :aria-disabled="isInert || undefined"
    :aria-busy="loading || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-kind="kind"
    :data-size="size"
    :data-icon-position="icon ? iconPosition : undefined"
    :class="ROOT_CLASS"
    :data-testid="testId"
    @click="onClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <slot name="leading" />
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/button:size-4 group-data-[icon-position=trailing]/button:order-last"
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
      <slot>{{ label }}</slot>
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </button>
</template>
