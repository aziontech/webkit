<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs, watch } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownOption',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    left(): unknown
    right(): unknown
  }>()

  interface Props {
    /** Identifier emitted on the root select event when this option is activated. */
    value: string | number
    /** Plain-text label; falls back to the default slot when omitted. */
    label?: string
    /**
     * Keyboard-shortcut hint rendered on the right side. The root dropdown
     * registers a window listener that matches the shortcut and emits
     * `select` for this option. Mutually exclusive with the right slot.
     */
    command?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the option as currently selected (background + checkmark). */
    selected?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    command: '',
    disabled: false,
    selected: false
  })

  const attrs = useAttrs()
  const ctx = useDropdownContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__option`
  )

  const hasCommand = computed(() => props.command.length > 0)

  function activate(event: globalThis.MouseEvent | globalThis.KeyboardEvent) {
    if (props.disabled) return
    ctx.selectOption(props.value, event)
  }

  function onClick(event: globalThis.MouseEvent) {
    activate(event)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(event)
    }
  }

  let unregisterCommand: (() => void) | null = null

  watch(
    () => [props.command, props.disabled] as const,
    ([command, disabled]) => {
      unregisterCommand?.()
      unregisterCommand = null
      if (command && !disabled) {
        unregisterCommand = ctx.registerCommand(command, (event) => activate(event))
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    unregisterCommand?.()
  })
</script>

<template>
  <div
    v-bind="attrs"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    :aria-current="selected ? 'true' : undefined"
    :data-testid="testId"
    :data-selected="selected || null"
    :data-disabled="disabled || null"
    class="flex h-8 min-h-8 cursor-pointer select-none items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)] outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[selected]:bg-[var(--bg-selected)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)]"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span
      v-if="$slots['left']"
      :data-testid="`${testId}__left`"
      class="flex shrink-0 items-center"
    >
      <slot name="left" />
    </span>

    <span class="flex-1 truncate text-left">
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="$slots['right'] && !hasCommand"
      :data-testid="`${testId}__right`"
      class="flex shrink-0 items-center"
    >
      <slot name="right" />
    </span>

    <span
      v-else-if="hasCommand"
      :data-testid="`${testId}__command`"
      class="flex shrink-0 items-center text-label-sm text-[var(--text-muted)]"
    >
      {{ command }}
    </span>
  </div>
</template>
