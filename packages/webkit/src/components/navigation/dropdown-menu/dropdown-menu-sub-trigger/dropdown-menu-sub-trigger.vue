<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs } from 'vue'

  import { eventDirection } from '../../../../composables/use-direction'
  import { useDropdownSubContext } from '../composables/use-dropdown-sub-context'

  defineOptions({
    name: 'DropdownMenuSubTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    leading(): unknown
  }>()

  export interface DropdownMenuSubTriggerProps {
    /** Plain-text label; falls back to the default slot when omitted. */
    label?: string
    /** Prevents the row from opening its sub-menu and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<DropdownMenuSubTriggerProps>(), {
    label: '',
    disabled: false
  })

  const attrs = useAttrs()
  const sub = useDropdownSubContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu-sub-trigger'
  )

  const isOpen = computed(() => sub.isOpen.value)

  function setRowEl(el: unknown) {
    sub.triggerEl.value = el instanceof HTMLElement ? el : null
  }

  function onPointerenter() {
    if (props.disabled) return
    sub.parent.setActiveSub(sub.id, true)
  }

  function onFocus() {
    if (!isOpen.value) sub.parent.setActiveSub(null)
  }

  function onClick() {
    if (props.disabled) return
    sub.setOpen(true)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (props.disabled) return
    const forward = eventDirection(event) === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    if (event.key === forward || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      sub.setOpen(true, true)
    }
  }

  onBeforeUnmount(() => {
    sub.triggerEl.value = null
  })

  const ROOT_CLASS =
    'flex h-8 min-h-8 pointer-coarse:min-h-11 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-button) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-sm) py-(--spacing-2xs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
    'data-[state=open]:bg-(--bg-hover) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) data-[disabled]:hover:bg-transparent'
</script>

<template>
  <div
    v-bind="attrs"
    :id="sub.triggerId"
    :ref="setRowEl"
    role="menuitem"
    aria-haspopup="menu"
    :aria-expanded="isOpen ? 'true' : 'false'"
    :aria-controls="isOpen ? sub.contentId : undefined"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :class="ROOT_CLASS"
    @pointerenter="onPointerenter"
    @focus="onFocus"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span
      v-if="$slots['leading']"
      :data-testid="`${testId}__leading`"
      class="flex shrink-0 items-center"
    >
      <slot name="leading" />
    </span>

    <span class="flex-1 truncate text-start">
      <slot>{{ label }}</slot>
    </span>

    <i
      aria-hidden="true"
      class="az az-chevron-right shrink-0 text-[length:inherit] leading-none text-(--text-muted) rtl:-scale-x-100"
    />
  </div>
</template>
