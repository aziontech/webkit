<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { DropdownMenuInjectionKey } from './injection-key'
  import type { DropdownMenuSide } from './position-panel'

  defineOptions({
    name: 'DropdownMenu',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Controlled open state. Use with `v-model:open`. */
      open?: boolean
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** When true, Escape and outside click close the menu. */
      closeable?: boolean
      /** When true, selecting an item closes the menu. */
      closeOnSelect?: boolean
      /** Preferred panel placement; `auto` picks the side with the most viewport space. */
      side?: DropdownMenuSide
      /** Gap between trigger and panel (px). */
      sideOffset?: number
      /** Horizontal offset from trigger left edge (px). */
      alignOffset?: number
    }>(),
    {
      open: undefined,
      defaultOpen: false,
      closeable: true,
      closeOnSelect: true,
      side: 'auto',
      sideOffset: 4,
      alignOffset: 0
    }
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const openModel = defineModel<boolean>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'overlay-dropdown-menu'
  )

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
      emit('update:open', value)
    }
  })

  const openMenu = () => {
    isOpen.set(true)
  }

  const closeMenu = () => {
    if (!props.closeable) return
    isOpen.set(false)
  }

  provide(DropdownMenuInjectionKey, {
    testId: testId.value,
    isOpen: computed(() => isOpen.value),
    closeable: props.closeable,
    closeOnSelect: props.closeOnSelect,
    side: props.side,
    sideOffset: props.sideOffset,
    alignOffset: props.alignOffset,
    open: openMenu,
    close: closeMenu,
    triggerRef,
    menuId: `${uid}-menu`
  })
</script>

<template>
  <div
    :data-state="isOpen ? 'open' : 'closed'"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
