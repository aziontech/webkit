<script setup lang="ts">
  import { computed, provide, toRef, useAttrs } from 'vue'

  import { useModalRoot } from '../../../composables/use-modal-root'
  import { DrawerInjectionKey, type DrawerSide, type DrawerSize } from './injection-key'

  defineOptions({
    name: 'Drawer',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface DrawerProps {
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
    /** Light-dismiss: when true, overlay click and Escape close the drawer. It does not govern the close button; see `closable`. */
    dismissible?: boolean
    /** Shows the close (X) button at the end of the drawer header. False removes it; Escape and overlay click still follow `dismissible`. */
    closable?: boolean
    /**
     * Renders the overlay, traps focus and locks page scroll. False leaves the page beside the drawer
     * usable: no overlay, no focus trap, no scroll lock, aria-modal false; Escape, the close button and
     * focus restore still work.
     */
    modal?: boolean
    /** Edge the drawer panel slides from, in reading direction: start is the left edge in ltr and the right edge in rtl. */
    side?: DrawerSide
    /**
     * Panel width preset: `small` `--container-sm`, `medium` 30% of the screen (at least
     * `--container-md`), `large` 40% of the screen (at least `--container-lg`), the widest and the
     * default. Height is always 100% viewport.
     */
    size?: DrawerSize
  }

  const props = withDefaults(defineProps<DrawerProps>(), {
    defaultOpen: false,
    dismissible: true,
    closable: true,
    modal: true,
    side: 'end',
    size: 'large'
  })

  /** Controlled open state. Use with v-model:open; while unbound the drawer starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'drawer')

  const modal = useModalRoot(openModel, {
    defaultOpen: props.defaultOpen,
    dismissible: () => props.dismissible
  })
  const { isOpen } = modal

  provide(DrawerInjectionKey, {
    ...modal,
    testId: testId.value,
    get dismissible() {
      return props.dismissible
    },
    get closable() {
      return props.closable
    },
    get modal() {
      return props.modal
    },
    size: toRef(props, 'size'),
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
