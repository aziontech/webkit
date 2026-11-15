<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { DialogInjectionKey, type DialogSize } from './injection-key'

  defineOptions({
    name: 'Dialog',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const props = withDefaults(
    defineProps<{
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** Light-dismiss: when true, overlay click and Escape close the dialog. It does not govern the close button; see `closable`. */
      dismissible?: boolean
      /** Shows the close (X) button at the end of the dialog header. False removes it; Escape and overlay click still follow `dismissible`. */
      closable?: boolean
      /** Panel max-width preset passed to the inner Panel. */
      size?: DialogSize
    }>(),
    {
      defaultOpen: false,
      dismissible: true,
      closable: true,
      size: 'medium'
    }
  )

  /** Controlled open state. Use with v-model:open; while unbound the dialog starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const uid = useId()
  const triggerEl = ref<HTMLElement | null>(null)
  const returnFocusEl = ref<HTMLElement | null>(null)
  const hasDescription = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-dialog')

  const openProp = computed<boolean | undefined>(() => openModel.value)

  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
    }
  })

  const openDialog = () => {
    isOpen.set(true)
  }

  const closeDialog = () => {
    isOpen.set(false)
  }

  const dismissDialog = () => {
    if (!props.dismissible) return
    isOpen.set(false)
  }

  watch(
    () => isOpen.value,
    (open) => {
      if (open && typeof document !== 'undefined') {
        returnFocusEl.value = document.activeElement as HTMLElement | null
      }
    },
    { flush: 'sync' }
  )

  provide(DialogInjectionKey, {
    testId: testId.value,
    isOpen: computed(() => isOpen.value),
    get dismissible() {
      return props.dismissible
    },
    get closable() {
      return props.closable
    },
    get size() {
      return props.size
    },
    open: openDialog,
    close: closeDialog,
    dismiss: dismissDialog,
    titleId: `${uid}-title`,
    descriptionId: `${uid}-description`,
    hasDescription,
    registerDescription: () => {
      hasDescription.value = true
    },
    unregisterDescription: () => {
      hasDescription.value = false
    },
    triggerEl,
    returnFocusEl
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
