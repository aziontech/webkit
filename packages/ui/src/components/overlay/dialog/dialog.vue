<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useModalRoot } from '../../../composables/use-modal-root'
  import { DialogInjectionKey, type DialogSize } from './injection-key'

  defineOptions({
    name: 'Dialog',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface DialogProps {
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
    /** Light-dismiss: when true, overlay click and Escape close the dialog. It does not govern the close button; see `closable`. */
    dismissible?: boolean
    /** Shows the close (X) button at the end of the dialog header. False removes it; Escape and overlay click still follow `dismissible`. */
    closable?: boolean
    /** Panel max-width preset passed to the inner Panel. */
    size?: DialogSize
  }

  const props = withDefaults(defineProps<DialogProps>(), {
    defaultOpen: false,
    dismissible: true,
    closable: true,
    size: 'medium'
  })

  /** Controlled open state. Use with v-model:open; while unbound the dialog starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'dialog')

  const modal = useModalRoot(openModel, {
    defaultOpen: props.defaultOpen,
    dismissible: () => props.dismissible
  })
  const { isOpen } = modal

  provide(DialogInjectionKey, {
    ...modal,
    testId: testId.value,
    get dismissible() {
      return props.dismissible
    },
    get closable() {
      return props.closable
    },
    get size() {
      return props.size
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
