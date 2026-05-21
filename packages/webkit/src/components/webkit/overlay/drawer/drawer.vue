<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../../composables/use-controllable'
  import { DrawerInjectionKey, type DrawerSide, type DrawerSize } from './injection-key'

  defineOptions({
    name: 'Drawer',
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
      /** When true, overlay click and Escape close the drawer. */
      closeable?: boolean
      /** Edge the drawer panel slides from. */
      side?: DrawerSide
      /** Panel max-width preset. */
      size?: DrawerSize
    }>(),
    {
      open: undefined,
      defaultOpen: false,
      closeable: true,
      side: 'right',
      size: 'medium'
    }
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const openModel = defineModel<boolean>('open', { default: undefined })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-drawer')

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
      emit('update:open', value)
    }
  })

  const openDrawer = () => {
    isOpen.set(true)
  }

  const closeDrawer = () => {
    if (!props.closeable) return
    isOpen.set(false)
  }

  provide(DrawerInjectionKey, {
    testId: testId.value,
    isOpen: computed(() => isOpen.value),
    closeable: props.closeable,
    size: props.size,
    open: openDrawer,
    close: closeDrawer,
    titleId: `${uid}-title`,
    descriptionId: `${uid}-description`,
    triggerRef,
    side: props.side
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
