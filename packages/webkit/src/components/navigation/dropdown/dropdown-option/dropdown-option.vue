<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownOption',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    leading(): unknown
    trailing(): unknown
  }>()

  interface Props {
    /** Identifier emitted on the root select event when this option is activated. */
    value: string | number
    /** Plain-text label; falls back to the default slot when omitted. */
    label?: string
    /** Optional keyboard-shortcut hint rendered on the trailing side. Mutually exclusive with the trailing slot. */
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
      v-if="$slots['leading']"
      :data-testid="`${testId}__leading`"
      class="flex shrink-0 items-center"
    >
      <slot name="leading" />
    </span>

    <span class="flex-1 truncate text-left">
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="$slots['trailing'] && !hasCommand"
      :data-testid="`${testId}__trailing`"
      class="flex shrink-0 items-center"
    >
      <slot name="trailing" />
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
