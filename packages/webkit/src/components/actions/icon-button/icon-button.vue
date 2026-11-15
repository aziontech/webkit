<script setup lang="ts">
  import { computed, Transition, useAttrs } from 'vue'

  import { directionalIconClass } from '../../../utils/directional-icons'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type IconButtonKind = 'primary' | 'secondary' | 'outlined' | 'transparent' | 'danger'
  export type IconButtonSize = 'small' | 'medium' | 'large'
  export type IconButtonTarget = '_blank' | '_self'
  export type IconButtonType = 'button' | 'submit' | 'reset'

  defineOptions({
    name: 'IconButton',
    inheritAttrs: false,
    components: { Transition }
  })

  interface Props {
    /** Azion icon class for the icon. */
    icon: string
    /** Accessible name for the icon-only control; write it as the aria-label attribute. Leave it empty only when aria-labelledby names the button. */
    ariaLabel?: string
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
    /** Native button type. `submit` lets an icon-only control submit its form; `disabled` and `loading` still block it. Ignored when `href` is set. */
    type?: IconButtonType
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    href: '',
    target: '_self',
    iconTransition: false,
    iconClass: '',
    type: 'button'
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

  const ROOT_CLASS =
    "group/icon-button relative inline-flex shrink-0 items-center justify-center rounded-(--shape-button) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none disabled:before:hidden disabled:after:hidden not-data-[inactive]:data-[kind=primary]:bg-(--primary) not-data-[inactive]:data-[kind=primary]:text-(--primary-contrast) not-data-[inactive]:data-[kind=primary]:before:bg-(--bg-hover) not-data-[inactive]:data-[kind=primary]:after:bg-(--bg-active) not-data-[inactive]:data-[kind=secondary]:bg-(--secondary) not-data-[inactive]:data-[kind=secondary]:text-(--secondary-contrast) not-data-[inactive]:data-[kind=secondary]:before:bg-(--bg-hover) not-data-[inactive]:data-[kind=secondary]:after:bg-(--bg-active) not-data-[inactive]:data-[kind=outlined]:border not-data-[inactive]:data-[kind=outlined]:border-(--border-default) not-data-[inactive]:data-[kind=outlined]:bg-(--bg-surface) not-data-[inactive]:data-[kind=outlined]:text-(--text-default) not-data-[inactive]:data-[kind=outlined]:before:bg-(--bg-mask) not-data-[inactive]:data-[kind=outlined]:after:bg-(--bg-active) not-data-[inactive]:data-[kind=transparent]:bg-transparent not-data-[inactive]:data-[kind=transparent]:text-(--text-default) not-data-[inactive]:data-[kind=transparent]:before:bg-(--bg-mask) not-data-[inactive]:data-[kind=transparent]:after:bg-(--bg-active) not-data-[inactive]:data-[kind=danger]:border not-data-[inactive]:data-[kind=danger]:border-(--danger-border) not-data-[inactive]:data-[kind=danger]:bg-(--danger) not-data-[inactive]:data-[kind=danger]:text-(--danger-contrast) not-data-[inactive]:data-[kind=danger]:before:bg-(--bg-hover) not-data-[inactive]:data-[kind=danger]:after:bg-(--bg-active) data-[inactive]:border-transparent data-[inactive]:bg-(--bg-disabled) data-[inactive]:text-(--text-disabled) data-[inactive]:before:hidden data-[inactive]:after:hidden data-[loading]:cursor-wait data-[disabled]:cursor-not-allowed data-[size=large]:size-10 data-[size=large]:text-button-lg data-[size=medium]:size-8 data-[size=medium]:text-button-md data-[size=small]:size-7 data-[size=small]:text-button-md"

  const loadingTestId = computed(() => `${testId.value}__loading`)

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
    v-bind="$attrs"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="ROOT_CLASS"
    :aria-label="ariaLabel || undefined"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isInactive ? -1 : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inactive="isInactive ? '' : undefined"
    :data-kind="kind"
    :data-size="size"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      :data-transition="iconTransition || null"
      class="relative z-1 inline-flex items-center justify-center data-[transition]:shrink-0 data-[transition]:overflow-hidden data-[transition]:size-3 group-data-[size=large]/icon-button:data-[transition]:size-4"
    >
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/icon-button:size-4"
        :data-testid="loadingTestId"
      />
      <Transition
        v-else-if="iconTransition"
        mode="out-in"
        enter-active-class="pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-[scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="scale-0 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <i
          :key="icon"
          :class="[
            icon,
            directionalIconClass(icon),
            'inline-flex shrink-0 items-center justify-center text-[length:inherit] leading-none pointer-events-none absolute inset-0 inline-flex items-center justify-center',
            iconClass
          ]"
          aria-hidden="true"
        />
      </Transition>
      <i
        v-else
        :class="[icon, directionalIconClass(icon), iconClass]"
        class="inline-flex shrink-0 items-center justify-center text-[length:inherit] leading-none"
        aria-hidden="true"
      />
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
    :aria-label="ariaLabel || undefined"
    :aria-disabled="isInactive || undefined"
    :aria-busy="loading || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-loading="loading ? '' : undefined"
    :data-inactive="isInactive ? '' : undefined"
    :data-kind="kind"
    :data-size="size"
    :class="ROOT_CLASS"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      :data-transition="iconTransition || null"
      class="relative z-1 inline-flex items-center justify-center data-[transition]:shrink-0 data-[transition]:overflow-hidden data-[transition]:size-3 group-data-[size=large]/icon-button:data-[transition]:size-4"
    >
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/icon-button:size-4"
        :data-testid="loadingTestId"
      />
      <Transition
        v-else-if="iconTransition"
        mode="out-in"
        enter-active-class="pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-[scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="scale-0 opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <i
          :key="icon"
          :class="[
            icon,
            directionalIconClass(icon),
            'inline-flex shrink-0 items-center justify-center text-[length:inherit] leading-none pointer-events-none absolute inset-0 inline-flex items-center justify-center',
            iconClass
          ]"
          aria-hidden="true"
        />
      </Transition>
      <i
        v-else
        :class="[icon, directionalIconClass(icon), iconClass]"
        class="inline-flex shrink-0 items-center justify-center text-[length:inherit] leading-none"
        aria-hidden="true"
      />
    </span>
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
  </button>
</template>
