<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { DropdownMenuInjectionKey } from './injection-key'
  import { getDropdownMenuItemClasses } from './presets/styles'

  defineOptions({
    name: 'DropdownMenuItem',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Visible label; falls back to the default slot. */
      label?: string
      /** Optional value emitted on select. */
      value?: string
      /** When true, applies the selected surface. */
      selected?: boolean
      /** Disables interaction. */
      disabled?: boolean
      /** PrimeIcons class for a leading icon. */
      icon?: string
      /** When set, renders an anchor instead of a button. */
      href?: string
      /** Link target when `href` is set. */
      target?: '_self' | '_blank'
    }>(),
    {
      label: '',
      value: undefined,
      selected: false,
      disabled: false,
      icon: '',
      href: '',
      target: '_self'
    }
  )

  const emit = defineEmits<{
    select: [value: string | undefined]
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DropdownMenuInjectionKey)

  const isAnchor = computed(() => Boolean(props.href) && !props.disabled)

  const rootClasses = computed(() =>
    getDropdownMenuItemClasses({
      selected: props.selected,
      disabled: props.disabled,
      extra: attrs.class as string | undefined
    })
  )

  const iconClasses = 'size-4 shrink-0 leading-none text-[length:inherit]'

  const handleActivate = (event: MouseEvent) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    emit('click', event)
    emit('select', props.value)

    if (ctx?.closeOnSelect) {
      ctx.close()
    }
  }
</script>

<template>
  <a
    v-if="isAnchor"
    role="menuitem"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="rootClasses"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : -1"
    :data-testid="`${ctx?.testId}__item`"
    @click="handleActivate"
  >
    <i
      v-if="icon"
      :class="[icon, iconClasses]"
      aria-hidden="true"
      :data-testid="`${ctx?.testId}__item-icon`"
    />
    <span
      class="min-w-0 flex-1 truncate"
      :data-testid="`${ctx?.testId}__item-label`"
    >
      <slot>{{ label }}</slot>
    </span>
  </a>
  <button
    v-else
    type="button"
    role="menuitem"
    :class="rootClasses"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    :data-testid="`${ctx?.testId}__item`"
    @click="handleActivate"
  >
    <i
      v-if="icon"
      :class="[icon, iconClasses]"
      aria-hidden="true"
      :data-testid="`${ctx?.testId}__item-icon`"
    />
    <span
      class="min-w-0 flex-1 truncate text-left"
      :data-testid="`${ctx?.testId}__item-label`"
    >
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>
