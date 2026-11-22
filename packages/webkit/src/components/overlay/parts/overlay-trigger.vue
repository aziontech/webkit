<script setup lang="ts">
  import { computed, onBeforeUnmount, type Ref, useAttrs } from 'vue'

  import { TriggerHost } from './trigger-host'

  defineOptions({
    name: 'OverlayTrigger',
    inheritAttrs: false
  })

  /** The part of an anchored overlay's context that its trigger reads and drives. */
  interface OverlayTriggerContext {
    isOpen: Readonly<Ref<boolean>>
    disabled: Readonly<Ref<boolean>>
    setOpen: (value: boolean) => void
    triggerId: string
    triggerEl: Ref<globalThis.HTMLElement | null>
  }

  interface OverlayTriggerProps {
    /** Context of the overlay the trigger opens. */
    context: OverlayTriggerContext
    /** Kind of panel the trigger opens, announced as aria-haspopup. */
    haspopup: 'menu' | 'dialog'
    /** Id of the panel the trigger controls. */
    controls: string
  }

  const props = defineProps<OverlayTriggerProps>()

  const emit = defineEmits<{
    keydown: [event: globalThis.KeyboardEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const isOpen = computed(() => props.context.isOpen.value)
  const isDisabled = computed(() => props.context.disabled.value)

  const aria = computed(() => ({
    'aria-haspopup': props.haspopup,
    'aria-expanded': String(isOpen.value),
    'aria-controls': props.controls,
    'aria-disabled': isDisabled.value ? 'true' : undefined
  }))

  function onClick() {
    if (!isDisabled.value) props.context.setOpen(!isOpen.value)
  }

  const { triggerEl } = props.context

  function onControl(el: globalThis.HTMLElement | null) {
    triggerEl.value = el
  }

  onBeforeUnmount(() => {
    triggerEl.value = null
  })

  const ROOT_CLASS =
    'inline-flex w-fit shrink-0 outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
</script>

<template>
  <TriggerHost
    v-bind="attrs"
    :aria="aria"
    :control-id="context.triggerId"
    :disabled="isDisabled"
    as-button
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    :class="ROOT_CLASS"
    @click="onClick"
    @keydown="emit('keydown', $event)"
    @control="onControl"
  >
    <slot />
  </TriggerHost>
</template>
