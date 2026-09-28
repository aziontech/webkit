<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  export type ChipKind = 'filled' | 'outlined' | 'dashed'
  export type ChipSize = 'small' | 'medium'

  defineOptions({
    name: 'Chip',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Visual variant. Filled is an applied value, outlined an available one, dashed the control that adds one. */
    kind?: ChipKind
    /** Size token; `small` is a fixed 24px, `medium` a fixed 32px. */
    size?: ChipSize
    /** When true, renders a trailing remove button that emits remove. */
    removable?: boolean
    /** When true, the chip body becomes interactive and emits click on activation (click / Enter / Space). */
    clickable?: boolean
    /** When true, the chip becomes a toggle: activating it flips the selected model and emits click. */
    selectable?: boolean
    /** Suppresses activation, toggling and removal. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'filled',
    size: 'medium',
    removable: false,
    clickable: false,
    selectable: false,
    disabled: false
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent, label: string]
    click: [event: MouseEvent | KeyboardEvent, label: string]
  }>()

  /** Whether a selectable chip is toggled on; bind with v-model:selected. */
  const selected = defineModel<boolean>('selected', { default: false })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-chip')

  const interactive = computed(() => props.clickable || props.selectable)

  const active = computed(() => interactive.value && !props.disabled)

  // One string for the remove control's tooltip AND its accessible name, so they cannot
  // drift; in a row of chips, `label` is what tells identical Remove controls apart.
  const removeLabel = computed(() => (props.label ? `Remove ${props.label}` : 'Remove'))

  // Presence is the consumer's call: emit and stop. A chip that fades itself out before
  // emitting cannot survive its own removal, and the inline transition style that fade
  // needs silently overrides any transition utility a consumer puts on the root.
  function onRemove(event: MouseEvent) {
    if (props.disabled) {
      return
    }

    emit('remove', event, props.label)
  }

  function onClick(event: MouseEvent) {
    if (!active.value) {
      return
    }

    if (props.selectable) {
      selected.value = !selected.value
    }

    emit('click', event, props.label)
  }

  function onKeydown(event: KeyboardEvent) {
    // Only the chip root drives activation; keys originating in the remove button are ignored.
    if (!active.value || event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Synthesise a real DOM click, as a native button does: overlay triggers open on the
      // DOM click that bubbles out of their child, so a chip that only emitted a Vue event
      // worked with the mouse but did nothing from the keyboard. The dispatched click runs
      // `onClick`, so `click` is still emitted exactly once.
      ;(event.currentTarget as globalThis.HTMLElement).click()
    }
  }
</script>

<template>
  <!-- All three kinds share one surface fill and differ only in elevation (`filled`
       carries the small shadow) and the dash: the raised-surface token equals the surface
       token in the light theme, so a fill distinction cannot carry the applied/available
       contrast. -->
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-removable="removable || null"
    :data-clickable="active || null"
    :data-selected="(selectable && selected) || null"
    :data-disabled="disabled || null"
    :role="interactive ? 'button' : undefined"
    :tabindex="active ? 0 : undefined"
    :aria-pressed="selectable ? selected : undefined"
    :aria-disabled="interactive && disabled ? 'true' : undefined"
    :class="attrs.class"
    class="relative inline-flex w-fit items-center justify-center overflow-hidden rounded-full border border-solid border-(--border-default) bg-(--bg-surface) text-(--text-default) leading-none transition-[color,background-color,border-color,box-shadow] duration-fast-02 ease-productive-entrance motion-reduce:transition-none text-label-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance motion-reduce:before:transition-none data-[kind=filled]:shadow-(--shadow-sm) data-[kind=dashed]:border-dashed data-[size=small]:h-6 data-[size=small]:px-(--spacing-xs) data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-sm) data-[size=small]:data-[removable]:pr-(--spacing-xxs) data-[size=medium]:data-[removable]:pr-(--spacing-xxs) data-[clickable]:cursor-pointer data-[clickable]:hover:border-(--border-strong) data-[clickable]:hover:before:opacity-100 data-[clickable]:active:before:opacity-100 data-[clickable]:active:border-(--border-strong) data-[clickable]:focus-visible:outline-none data-[clickable]:focus-visible:ring-2 data-[clickable]:focus-visible:ring-(--ring-color) data-[clickable]:focus-visible:ring-offset-2 data-[clickable]:focus-visible:ring-offset-(--bg-canvas) data-[selected]:bg-(--bg-selected) data-[selected]:border-(--border-selected) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span
      class="relative z-(--z-input-field) inline-flex min-w-0 items-center justify-center gap-(--spacing-xxs)"
    >
      <slot v-if="$slots['default']" />
      <span
        v-else-if="label"
        :data-testid="`${testId}__label`"
        class="truncate"
      >
        {{ label }}
      </span>
      <!-- 24px at medium is the WCAG 2.5.8 minimum for a pointer target; `small` keeps a
           16px control — a justified deviation where the chip itself stays the affordance. -->
      <Tooltip
        v-if="removable"
        :text="removeLabel"
        placement="top"
      >
        <button
          type="button"
          :disabled="disabled"
          :aria-label="removeLabel"
          :data-testid="`${testId}__remove`"
          class="inline-flex shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:pointer-events-none disabled:text-(--text-disabled) data-[size=medium]:size-6 data-[size=small]:size-4"
          :data-size="size"
          @click.stop="onRemove"
        >
          <i
            class="pi pi-times flex shrink-0 items-center size-[14px] data-[size=small]:size-[10px]"
            :data-size="size"
            aria-hidden="true"
            :data-testid="`${testId}__remove-icon`"
          />
        </button>
      </Tooltip>
    </span>
  </span>
</template>
