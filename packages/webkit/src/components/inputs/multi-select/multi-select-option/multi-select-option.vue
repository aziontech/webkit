<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Checkbox from '../../checkbox/checkbox.vue'
  import { multiSelectContextKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectOption',
    inheritAttrs: false
  })

  interface Props {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** PrimeIcons class for the leading decorative icon. */
    icon?: string
    /** Disables this single option; does not affect the parent multi-select. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: '',
    disabled: false
  })

  defineSlots<{
    default(): unknown
    left(): unknown
    tag(): unknown
  }>()

  const ctx = inject(multiSelectContextKey)
  if (!ctx) {
    throw new Error('MultiSelectOption must be used inside MultiSelect.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-option'
  )

  const selected = computed(() => ctx.isSelected(props.value))

  const onClick = () => {
    if (props.disabled) return
    ctx.toggleValue(props.value)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.toggleValue(props.value)
    }
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="option"
    tabindex="-1"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-selected="selected || null"
    :data-disabled="disabled || null"
    :class="attrs.class"
    class="flex h-8 cursor-pointer select-none items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)] outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[selected]:bg-[var(--bg-selected)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <Checkbox
      :model-value="selected"
      binary
      class="pointer-events-none"
      aria-hidden="true"
      :tabindex="-1"
      :data-testid="`${testId}__indicator`"
    />
    <slot
      v-if="$slots['left']"
      name="left"
    />
    <i
      v-else-if="icon"
      :class="[icon, 'flex shrink-0 items-center text-[var(--text-default)]']"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span class="flex-1 truncate text-left">
      <slot />
    </span>
    <slot
      v-if="$slots['tag']"
      name="tag"
    />
  </div>
</template>
