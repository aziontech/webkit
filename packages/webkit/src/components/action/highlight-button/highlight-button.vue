<script setup lang="ts">
  import { useButtonRoot } from '../../../composables/use-button-root'
  import { directionalIconClass } from '../../../utils/directional-icons'
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

  const { Root, rootAttrs, onClick } = useButtonRoot(props, 'highlight-button', (event) =>
    emit('click', event)
  )

  const ROOT_CLASS =
    'group/highlight relative inline-flex items-center justify-center isolate whitespace-nowrap p-px ' +
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
</script>

<template>
  <Root
    v-bind="rootAttrs"
    :class="ROOT_CLASS"
    :data-size="size"
    @click="onClick"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span
        data-theme="dark"
        :class="GLOW_CLASS"
      />
      <span :class="BASE_CLASS" />
      <span :class="SCRIM_CLASS" />
    </span>
    <span
      data-theme="dark"
      :class="CONTENT_CLASS"
      :data-size="size"
    >
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/highlight:size-4"
        :data-testid="`${rootAttrs['data-testid']}__loading`"
      />
      <i
        v-else-if="icon"
        :class="[icon, directionalIconClass(icon)]"
        class="shrink-0 text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      {{ label }}
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </Root>
</template>
