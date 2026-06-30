<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import { computed, ref, useAttrs } from 'vue'

  export type ChipSize = 'small' | 'medium'

  defineOptions({
    name: 'Chip',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: ChipSize
    /** When true, renders a trailing remove button that emits remove. */
    removable?: boolean
    /** When true, the chip body becomes interactive and emits click on activation (click / Enter / Space). */
    clickable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    size: 'medium',
    removable: false,
    clickable: false
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent]
    click: [event: MouseEvent | KeyboardEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-chip')

  // Dismiss motion — same opacity fade-out as the Message component (animations.js tokens).
  const REMOVE_MS = Number.parseInt(duration['fast-02'], 10)
  const removeTransitionStyle = {
    transition: `opacity ${duration['fast-02']} ${curve['productive-exit']}`
  }

  const visible = ref(true)
  let pendingRemoveEvent: MouseEvent | undefined

  function onRemove(event: MouseEvent) {
    if (!visible.value) {
      return
    }

    pendingRemoveEvent = event
    visible.value = false
  }

  function handleAfterLeave() {
    if (pendingRemoveEvent) {
      emit('remove', pendingRemoveEvent)
      pendingRemoveEvent = undefined
    }
  }

  function onClick(event: MouseEvent) {
    if (!props.clickable) {
      return
    }

    emit('click', event)
  }

  function onKeydown(event: KeyboardEvent) {
    // Only the chip root drives activation; keys originating in the remove button are ignored.
    if (!props.clickable || event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      emit('click', event)
    }
  }
</script>

<template>
  <Transition
    :duration="{ enter: 0, leave: REMOVE_MS }"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    leave-active-class="motion-reduce:transition-none"
    @after-leave="handleAfterLeave"
  >
    <span
      v-if="visible"
      v-bind="$attrs"
      :data-testid="testId"
      :data-size="size"
      :data-removable="removable || null"
      :data-clickable="clickable || null"
      :role="clickable ? 'button' : undefined"
      :tabindex="clickable ? 0 : undefined"
      :style="removeTransitionStyle"
      :class="attrs.class"
      class="relative inline-flex items-center justify-center overflow-hidden border border-[var(--border-default)] border-[length:var(--border-width-default)] bg-[var(--bg-surface-raised)] text-[var(--text-default)] shadow-[var(--shadow-sm)] leading-none rounded-[var(--shape-elements)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--bg-hover)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--bg-active)] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance motion-reduce:before:transition-none motion-reduce:after:transition-none data-[size=medium]:text-label-md data-[size=small]:text-label-sm data-[size=medium]:h-6 data-[size=small]:h-5 data-[size=medium]:py-[var(--spacing-xs)] data-[size=medium]:px-[var(--spacing-sm)] data-[size=small]:p-[var(--spacing-xs)] data-[size=medium]:data-[removable]:pr-[var(--spacing-xs)] data-[size=small]:data-[removable]:pr-[var(--spacing-xxs)] data-[clickable]:cursor-pointer data-[clickable]:hover:before:opacity-100 data-[clickable]:active:after:opacity-100 data-[clickable]:focus-visible:outline-none data-[clickable]:focus-visible:ring-2 data-[clickable]:focus-visible:ring-[var(--ring-color)] data-[clickable]:focus-visible:ring-offset-2 data-[clickable]:focus-visible:ring-offset-[var(--bg-canvas)]"
      @click="onClick"
      @keydown="onKeydown"
    >
      <span class="relative z-[1] inline-flex items-center justify-center gap-[var(--spacing-xxs)]">
        <slot v-if="$slots['default']" />
        <span
          v-else-if="label"
          :data-testid="`${testId}__label`"
        >
          {{ label }}
        </span>
        <button
          v-if="removable"
          type="button"
          aria-label="Remove"
          :data-testid="`${testId}__remove`"
          class="inline-flex shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
          @click.stop="onRemove"
        >
          <i
            class="pi pi-times flex shrink-0 items-center size-[14px]"
            aria-hidden="true"
            :data-testid="`${testId}__remove-icon`"
          />
        </button>
      </span>
    </span>
  </Transition>
</template>
