<script setup lang="ts">
  import { computed, Transition } from 'vue'

  import { useButtonRoot } from '../../../composables/use-button-root'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { directionalIconClass } from '../../../utils/directional-icons'
  import Spinner from '../../feedback/spinner/spinner.vue'

  export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  export type IconButtonSize = 'small' | 'medium' | 'large'
  export type IconButtonTarget = '_blank' | '_self'
  export type IconButtonType = 'button' | 'submit' | 'reset'

  defineOptions({
    name: 'IconButton',
    inheritAttrs: false,
    components: { Transition }
  })

  export interface IconButtonProps {
    /** Azion icon class for the icon. */
    icon: string
    /** Accessible name for the icon-only control; write it as the aria-label attribute. Leave it empty only when aria-labelledby names the button. */
    ariaLabel?: string
    /** Visual variant. */
    variant?: IconButtonVariant
    /** Size token; affects height and typography. */
    size?: IconButtonSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** When set to a safe URL, renders as an anchor link; a javascript, data or other unsafe URL is ignored and the control stays a button. With a download attribute, blob and data URLs are kept. */
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

  const props = withDefaults(defineProps<IconButtonProps>(), {
    ariaLabel: '',
    variant: 'primary',
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

  const { Root, rootAttrs, onClick } = useButtonRoot(props, 'icon-button', (event) =>
    emit('click', event)
  )
  const { t } = useTranslate({ common: en.common })
  const accessibleName = computed(() => {
    if (!props.ariaLabel) return undefined
    const newTab = rootAttrs.value['tag'] === 'a' && props.target === '_blank'
    return newTab ? `${props.ariaLabel} ${t('common.newTab')}` : props.ariaLabel
  })

  const ROOT_CLASS =
    'group/icon-button [:where(&)]:relative inline-flex shrink-0 items-center justify-center rounded-(--shape-button) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) before:pointer-events-none ' +
    "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 " +
    'after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none disabled:before:hidden ' +
    'disabled:after:hidden ' +
    'not-data-[inert]:data-[variant=primary]:bg-(--primary) not-data-[inert]:data-[variant=primary]:text-(--primary-foreground) ' +
    'not-data-[inert]:data-[variant=primary]:before:bg-(--bg-hover) not-data-[inert]:data-[variant=primary]:after:bg-(--bg-active) ' +
    'not-data-[inert]:data-[variant=secondary]:bg-(--secondary) not-data-[inert]:data-[variant=secondary]:text-(--secondary-foreground) ' +
    'not-data-[inert]:data-[variant=secondary]:before:bg-(--bg-hover) not-data-[inert]:data-[variant=secondary]:after:bg-(--bg-active) not-data-[inert]:data-[variant=outline]:border ' +
    'not-data-[inert]:data-[variant=outline]:border-(--border-default) not-data-[inert]:data-[variant=outline]:bg-(--bg-surface) ' +
    'not-data-[inert]:data-[variant=outline]:text-(--text-default) not-data-[inert]:data-[variant=outline]:before:bg-(--bg-mask) ' +
    'not-data-[inert]:data-[variant=outline]:after:bg-(--bg-active) not-data-[inert]:data-[variant=ghost]:bg-transparent not-data-[inert]:data-[variant=ghost]:text-(--text-default) ' +
    'not-data-[inert]:data-[variant=ghost]:before:bg-(--bg-mask) not-data-[inert]:data-[variant=ghost]:after:bg-(--bg-active) not-data-[inert]:data-[variant=danger]:border ' +
    'not-data-[inert]:data-[variant=danger]:border-(--danger-border) not-data-[inert]:data-[variant=danger]:bg-(--danger) ' +
    'not-data-[inert]:data-[variant=danger]:text-(--danger-foreground) not-data-[inert]:data-[variant=danger]:before:bg-(--bg-hover) ' +
    'not-data-[inert]:data-[variant=danger]:after:bg-(--bg-active) data-[inert]:border-transparent data-[inert]:bg-(--bg-disabled) data-[inert]:text-(--text-disabled) ' +
    'data-[inert]:before:hidden data-[inert]:after:hidden ' +
    'data-[loading]:cursor-wait ' +
    'data-[disabled]:cursor-not-allowed ' +
    'data-[size=large]:size-10 data-[size=large]:text-button-lg data-[size=medium]:size-8 data-[size=medium]:text-button-md data-[size=small]:size-7 data-[size=small]:text-button-md'

  const ICON_CLASS =
    'relative z-1 inline-flex items-center justify-center ' +
    'data-[transition]:shrink-0 data-[transition]:overflow-hidden data-[transition]:size-3 ' +
    'group-data-[size=large]/icon-button:data-[transition]:size-4'

  const ICON_ENTER_ACTIVE_CLASS =
    'pointer-events-none absolute inset-0 inline-flex items-center justify-center transition-[scale,opacity] duration-moderate-01 ease-productive-entrance ' +
    'motion-reduce:transition-none'
</script>

<template>
  <Root
    v-bind="rootAttrs"
    :aria-label="accessibleName"
    :data-variant="variant"
    :data-size="size"
    :class="ROOT_CLASS"
    @click="onClick"
  >
    <span
      :data-transition="iconTransition || null"
      :class="ICON_CLASS"
    >
      <Spinner
        v-if="loading"
        class="size-3 group-data-[size=large]/icon-button:size-4"
        :data-testid="`${rootAttrs['data-testid']}__loading`"
      />
      <Transition
        v-else-if="iconTransition"
        mode="out-in"
        :enter-active-class="ICON_ENTER_ACTIVE_CLASS"
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
  </Root>
</template>
