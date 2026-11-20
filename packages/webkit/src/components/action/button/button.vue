<script setup lang="ts">
  import { computed, type FunctionalComponent, h, useAttrs, watch } from 'vue'

  import { useAnnouncer } from '../../../composables/use-announcer'
  import { directionalIconClass } from '../../../utils/directional-icons'
  import { safeHref } from '../../../utils/safe-href'
  import Spinner from '../../feedback/spinner/spinner.vue'

  export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
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
    variant?: ButtonVariant
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
    /** When set to a safe URL, renders as an anchor link; a javascript, data or other unsafe URL is ignored and the control stays a button. With a download attribute, blob and data URLs are kept. */
    href?: string
    /** Link target when `href` is set. */
    target?: ButtonTarget
    /** Native button type. `submit` lets the control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set. */
    type?: ButtonType
    /** Why the action is unavailable. While `disabled`, the button stays focusable and carries this text as its description, shown by the browser on hover. */
    disabledReason?: string
    /** What a screen reader hears when `loading` starts, such as Saving changes. Empty announces nothing. */
    loadingLabel?: string
  }
  const props = withDefaults(defineProps<ButtonProps>(), {
    label: '',
    variant: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    icon: '',
    iconPosition: 'leading',
    animated: false,
    href: '',
    target: '_self',
    type: 'button',
    disabledReason: '',
    loadingLabel: ''
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
  const { announce } = useAnnouncer()

  const Root: FunctionalComponent<{ tag: 'a' | 'button' }> = (
    { tag },
    { attrs: rootAttrs, slots }
  ) => h(tag, rootAttrs, slots['default']?.())
  Root.props = ['tag']

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'button')
  const loadingTestId = computed(() => `${testId.value}__loading`)

  const isInert = computed(() => props.disabled || props.loading)
  const linkHref = computed(() =>
    safeHref(props.href, attrs['download'] != null && attrs['download'] !== false)
  )

  const isAnchor = computed(() => linkHref.value !== null)
  const hasReason = computed(() => props.disabled && props.disabledReason.length > 0)

  watch(
    () => props.loading,
    (value) => {
      if (value) announce(props.loadingLabel)
    }
  )

  const ROOT_CLASS =
    'group/button relative inline-flex items-center justify-center whitespace-nowrap rounded-(--shape-button) ' +
    'forced-colors:border forced-colors:border-[ButtonBorder] forced-colors:data-[disabled]:border-[GrayText] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity " +
    'before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 ' +
    "after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 " +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none disabled:before:hidden disabled:after:hidden ' +
    'not-data-[inert]:data-[variant=primary]:bg-(--primary) not-data-[inert]:data-[variant=primary]:text-(--primary-foreground) ' +
    'not-data-[inert]:data-[variant=primary]:before:bg-(--bg-hover) not-data-[inert]:data-[variant=primary]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=secondary]:bg-(--secondary) not-data-[inert]:data-[variant=secondary]:text-(--secondary-foreground) ' +
    'not-data-[inert]:data-[variant=secondary]:before:bg-(--bg-hover) not-data-[inert]:data-[variant=secondary]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=outline]:border not-data-[inert]:data-[variant=outline]:border-(--border-default) ' +
    'not-data-[inert]:data-[variant=outline]:bg-(--bg-surface) not-data-[inert]:data-[variant=outline]:text-(--text-default) ' +
    'not-data-[inert]:data-[variant=outline]:before:bg-(--bg-mask) not-data-[inert]:data-[variant=outline]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=ghost]:bg-transparent not-data-[inert]:data-[variant=ghost]:text-(--text-default) ' +
    'not-data-[inert]:data-[variant=ghost]:before:bg-(--bg-mask) not-data-[inert]:data-[variant=ghost]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=danger]:border not-data-[inert]:data-[variant=danger]:border-(--danger-border) ' +
    'not-data-[inert]:data-[variant=danger]:bg-(--danger) not-data-[inert]:data-[variant=danger]:text-(--danger-foreground) ' +
    'not-data-[inert]:data-[variant=danger]:before:bg-(--bg-hover) not-data-[inert]:data-[variant=danger]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=link]:bg-transparent not-data-[inert]:data-[variant=link]:text-(--text-link) ' +
    'not-data-[inert]:data-[variant=link]:underline-offset-2 not-data-[inert]:data-[variant=link]:transition-colors ' +
    'not-data-[inert]:data-[variant=link]:duration-fast-02 not-data-[inert]:data-[variant=link]:ease-productive-entrance ' +
    'not-data-[inert]:data-[variant=link]:hover:text-(--text-link-hover) not-data-[inert]:data-[variant=link]:hover:underline ' +
    'not-data-[inert]:data-[variant=link]:motion-reduce:transition-none not-data-[inert]:data-[variant=link]:before:hidden ' +
    'not-data-[inert]:data-[variant=link]:after:hidden not-data-[inert]:data-[variant=link]:forced-colors:border-0 ' +
    'not-data-[inert]:data-[variant=link]:forced-colors:text-[LinkText] ' +
    'data-[inert]:not-data-[variant=link]:border-transparent data-[inert]:not-data-[variant=link]:bg-(--bg-disabled) ' +
    'data-[inert]:not-data-[variant=link]:text-(--text-disabled) data-[inert]:not-data-[variant=link]:before:hidden ' +
    'data-[inert]:not-data-[variant=link]:after:hidden data-[inert]:data-[variant=link]:border-transparent ' +
    'data-[inert]:data-[variant=link]:text-(--text-disabled) data-[inert]:data-[variant=link]:before:hidden data-[inert]:data-[variant=link]:after:hidden ' +
    'data-[inert]:data-[variant=link]:forced-colors:border-0 ' +
    'data-[loading]:cursor-wait data-[disabled]:cursor-not-allowed ' +
    'not-data-[variant=link]:data-[size=large]:min-w-20 not-data-[variant=link]:data-[size=large]:h-10 ' +
    'not-data-[variant=link]:data-[size=large]:px-(--spacing-md) not-data-[variant=link]:data-[size=large]:text-button-lg ' +
    'not-data-[variant=link]:data-[size=medium]:min-w-16 not-data-[variant=link]:data-[size=medium]:h-8 ' +
    'not-data-[variant=link]:data-[size=medium]:px-(--spacing-sm) not-data-[variant=link]:data-[size=medium]:text-button-md ' +
    'not-data-[variant=link]:data-[size=small]:min-w-14 not-data-[variant=link]:data-[size=small]:h-7 ' +
    'not-data-[variant=link]:data-[size=small]:px-(--spacing-xs) not-data-[variant=link]:data-[size=small]:text-button-md data-[variant=link]:text-body-sm'

  const ICON_CLASS =
    'shrink-0 text-[length:inherit] leading-none ' +
    'transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none ' +
    'group-hover/button:data-animated:translate-x-0.5 rtl:group-hover/button:data-animated:-translate-x-0.5 ' +
    'group-data-[icon-position=trailing]/button:order-last'

  const onClick = (event: MouseEvent) => {
    if (isInert.value) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <Root
    :tag="isAnchor ? 'a' : 'button'"
    v-bind="$attrs"
    :href="linkHref ?? undefined"
    :target="isAnchor ? target : undefined"
    :rel="isAnchor && target === '_blank' ? 'noopener noreferrer' : undefined"
    :type="isAnchor ? undefined : type"
    :disabled="!isAnchor && disabled && !hasReason ? true : undefined"
    :tabindex="isAnchor && isInert && !hasReason ? -1 : undefined"
    :aria-disabled="isInert || undefined"
    :aria-busy="loading || undefined"
    :title="hasReason ? disabledReason : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inert="isInert ? '' : undefined"
    :data-variant="variant"
    :data-size="size"
    :data-icon-position="icon ? iconPosition : undefined"
    :data-testid="testId"
    :class="ROOT_CLASS"
    @click="onClick"
  >
    <span
      data-slot="content"
      class="relative z-1 inline-flex min-w-0 max-w-full items-center gap-(--spacing-xs)"
    >
      <slot name="leading" />
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/button:size-4 group-data-[icon-position=trailing]/button:order-last"
        :data-testid="loadingTestId"
      />
      <i
        v-else-if="icon"
        data-slot="icon"
        :class="[ICON_CLASS, icon, directionalIconClass(icon)]"
        :data-icon-position="iconPosition"
        :data-animated="animated && iconPosition === 'trailing' ? '' : undefined"
        aria-hidden="true"
      />
      <slot
        ><span
          v-if="label"
          data-slot="label"
          class="min-w-0 overflow-x-clip text-ellipsis"
          >{{ label }}</span
        ></slot
      >
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </Root>
</template>
