<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../../composables/use-controllable'
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
      /** Controlled open state. Use with `v-model:open`. */
      open?: boolean
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** When true, overlay click and Escape close the dialog. */
      closeable?: boolean
      /** Panel max-width preset passed to the inner Panel. */
      size?: DialogSize
    }>(),
    {
      open: undefined,
      defaultOpen: false,
      closeable: true,
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'overlay-dialog')

  const openProp = computed(() => openModel.value ?? props.open)

  const isOpen = useControllable({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => {
      openModel.value = value
      emit('update:open', value)
    }
  })

  const openDialog = () => {
    isOpen.set(true)
  }

  const closeDialog = () => {
    if (!props.closeable) return
    isOpen.set(false)
  }

  provide(DialogInjectionKey, {
    testId: testId.value,
    isOpen: computed(() => isOpen.value),
    closeable: props.closeable,
    size: props.size,
    open: openDialog,
    close: closeDialog,
    titleId: `${uid}-title`,
    descriptionId: `${uid}-description`,
    triggerRef
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
