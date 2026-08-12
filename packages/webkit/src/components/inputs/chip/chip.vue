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
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'filled',
    size: 'medium',
    removable: false,
    clickable: false
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent, label: string]
    click: [event: MouseEvent | KeyboardEvent, label: string]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-chip')

  // One string for the remove control's tooltip AND its accessible name, so what a
  // pointer user is shown and what a screen-reader user hears cannot drift. Naming the
  // subject matters most in a row of chips, where four identical "Remove" controls sit
  // side by side: `label` is what tells them apart.
  const removeLabel = computed(() => (props.label ? `Remove ${props.label}` : 'Remove'))

  // Presence is the CONSUMER's call: emit and stop. The previous build faded itself to
  // opacity 0 and only then emitted, which made a chip that survives its own removal
  // impossible — a filter bar where dropping a value leaves the field behind as an
  // `outlined` offer kept an instance that was invisible forever. That fade also had to
  // be an inline `style="transition: opacity …"`, and an inline style beats every class,
  // so it silently discarded any `transition-*` a consumer put on the root.
  function onRemove(event: MouseEvent) {
    emit('remove', event, props.label)
  }

  function onClick(event: MouseEvent) {
    if (!props.clickable) {
      return
    }

    emit('click', event, props.label)
  }

  function onKeydown(event: KeyboardEvent) {
    // Only the chip root drives activation; keys originating in the remove button are ignored.
    if (!props.clickable || event.target !== event.currentTarget) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Synthesise a REAL DOM click rather than emitting directly. A native <button>
      // does this, and anything wrapping the chip relies on it: an overlay trigger
      // (Popover.Trigger, Dropdown.Trigger) opens on the DOM click that bubbles out of
      // its child, so a chip that only emitted a Vue event worked with the mouse and did
      // nothing from the keyboard — which ruled the chip out as a trigger, including for
      // the `dashed` "add one" affordance it is meant to serve. The dispatched click runs
      // `onClick`, so `click` is still emitted exactly once.
      ;(event.currentTarget as globalThis.HTMLElement).click()
    }
  }
</script>

<template>
  <!-- ALL THREE KINDS SHARE ONE FILL — `--bg-surface` — and differ only in ELEVATION
       (`filled` carries `--shadow-sm`) and, for `dashed`, the dash. The fill used to be
       the distinction: `filled` was `--bg-surface-raised` and the other two were
       transparent. That never shipped as designed on two counts. The raised token is the
       SAME value as `--bg-surface` in the light theme, so the applied/available contrast
       it was meant to carry existed in dark only; and the class was written
       `bg-(--bg-surface-raised )` — the stray space terminates the Tailwind candidate, so
       it compiled to nothing at all (verified against the v4 compiler) and every `filled`
       chip was in fact transparent, in both themes, with only its shadow to tell it from
       an `outlined` one. Giving every kind the real surface is what makes a chip read as a
       raised object against `--bg-canvas` at all; the shadow then does the one job it was
       always doing alone. -->
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-removable="removable || null"
    :data-clickable="clickable || null"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :class="attrs.class"
    class="relative inline-flex w-fit items-center justify-center overflow-hidden rounded-full border border-solid border-(--border-default) bg-(--bg-surface) text-(--text-default) leading-none transition-[color,background-color,border-color,box-shadow] duration-fast-02 ease-productive-entrance motion-reduce:transition-none text-label-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance motion-reduce:before:transition-none data-[kind=filled]:shadow-(--shadow-sm) data-[kind=dashed]:border-dashed data-[size=small]:h-6 data-[size=small]:px-(--spacing-xs) data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-sm) data-[size=small]:data-[removable]:pr-(--spacing-xxs) data-[size=medium]:data-[removable]:pr-(--spacing-xxs) data-[clickable]:cursor-pointer data-[clickable]:hover:border-(--border-strong) data-[clickable]:hover:before:opacity-100 data-[clickable]:active:before:opacity-100 data-[clickable]:active:border-(--border-strong) data-[clickable]:focus-visible:outline-none data-[clickable]:focus-visible:ring-2 data-[clickable]:focus-visible:ring-(--ring-color) data-[clickable]:focus-visible:ring-offset-2 data-[clickable]:focus-visible:ring-offset-(--bg-canvas)"
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
      <!-- 24px at medium is the WCAG 2.5.8 minimum for a pointer target; the previous
           14px glyph met neither that nor the visual weight of the boxes around it.
           `small` keeps a 16px control — a justified deviation for a 24px token, where
           the chip itself stays the visible affordance. -->
      <Tooltip
        v-if="removable"
        :text="removeLabel"
        placement="top"
      >
        <button
          type="button"
          :aria-label="removeLabel"
          :data-testid="`${testId}__remove`"
          class="inline-flex shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[size=medium]:size-6 data-[size=small]:size-4"
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
