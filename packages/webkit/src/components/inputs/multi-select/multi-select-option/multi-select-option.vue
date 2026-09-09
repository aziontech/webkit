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
    class="flex h-8 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[selected]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
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
    <!-- One leading column for the whole list, after the checkbox: options with a glyph
         set a marker attribute, and a has() rule on the options group then shows the box
         on EVERY option, so a mixed list keeps one label edge. A list with no icons at
         all reserves nothing and pays no indent. -->
    <span
      :data-leading="$slots['left'] || icon ? '' : undefined"
      :data-testid="`${testId}__leading`"
      class="hidden size-4 shrink-0 items-center justify-center overflow-hidden group-has-[[data-leading]]/options:flex"
    >
      <slot
        v-if="$slots['left']"
        name="left"
      />
      <i
        v-else-if="icon"
        :class="[icon, 'text-(--text-default)']"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </span>
    <span class="flex-1 truncate text-left">
      <slot />
    </span>
    <slot
      v-if="$slots['tag']"
      name="tag"
    />
  </div>
</template>
