<script setup lang="ts">
  import { computed, provide, ref, toRef, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
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
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** Light-dismiss: when true, overlay click and Escape close the drawer. It does not govern the close button; see `closable`. */
      dismissible?: boolean
      /** Whether the close button (DrawerClose) and the context close() close the drawer; false renders the close button disabled. Escape and overlay click follow `dismissible`. Unset, it follows `dismissible` for 6.x compatibility (deprecated coupling: set it explicitly; from 7.0 unset means true). */
      closable?: boolean
      /** Edge the drawer panel slides from. */
      side?: DrawerSide
      /** Panel max-width preset (`small` `--container-sm`, `medium` `--container-xl`, `large` `--container-4xl`). Height is always 100% viewport. */
      size?: DrawerSize
    }>(),
    {
      defaultOpen: false,
      dismissible: true,
      closable: undefined,
      side: 'right',
      size: 'medium'
    }
  )

  /** Controlled open state. Use with v-model:open; while unbound the drawer starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const returnFocusRef = ref<HTMLElement | null>(null)
  const hasDescription = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-drawer')

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const openDrawer = () => {
    isOpen.set(true)
  }

  const isClosable = computed(() => props.closable ?? props.dismissible)

  const closeDrawer = () => {
    if (!isClosable.value) return
    isOpen.set(false)
  }

  const dismissDrawer = () => {
    if (!props.dismissible) return
    isOpen.set(false)
  }

  watch(
    () => isOpen.value,
    (open) => {
      if (open && typeof document !== 'undefined') {
        returnFocusRef.value = document.activeElement as HTMLElement | null
      }
    },
    { flush: 'sync' }
  )

  provide(DrawerInjectionKey, {
    testId: testId.value,
    isOpen: computed(() => isOpen.value),
    get dismissible() {
      return props.dismissible
    },
    get closable() {
      return isClosable.value
    },
    size: toRef(props, 'size'),
    open: openDrawer,
    close: closeDrawer,
    dismiss: dismissDrawer,
    titleId: `${uid}-title`,
    descriptionId: `${uid}-description`,
    hasDescription,
    registerDescription: () => {
      hasDescription.value = true
    },
    unregisterDescription: () => {
      hasDescription.value = false
    },
    triggerRef,
    returnFocusRef,
    get side() {
      return props.side
    }
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-testid="testId"
  >
    <slot />
  </div>
</template>
