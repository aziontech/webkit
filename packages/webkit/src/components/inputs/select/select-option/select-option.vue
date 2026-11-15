<script setup lang="ts">
  import { computed, inject, onMounted, onUpdated, ref, useAttrs } from 'vue'

  import { SelectInjectionKey } from '../injection-key'

  defineOptions({
    name: 'SelectOption',
    inheritAttrs: false
  })

  export interface SelectOptionProps {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** Azion icon class for the leading decorative icon. */
    icon?: string
    /** Disables this single option; does not affect the parent select. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<SelectOptionProps>(), {
    icon: '',
    disabled: false
  })

  defineSlots<{
    default(): unknown
    leading(): unknown
    tag(): unknown
  }>()

  const ctx = inject(SelectInjectionKey)
  if (!ctx) {
    throw new Error('SelectOption must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-select-option'
  )

  const labelEl = ref<globalThis.HTMLElement | null>(null)
  const recordLabel = () => ctx.registerLabel(props.value, labelEl.value?.textContent?.trim() ?? '')
  onMounted(recordLabel)
  onUpdated(recordLabel)

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
    class="flex h-8 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[selected]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span
      :data-leading="$slots['leading'] || icon ? '' : undefined"
      :data-testid="`${testId}__leading`"
      class="hidden size-4 shrink-0 items-center justify-center overflow-hidden group-has-[[data-leading]]/options:flex"
    >
      <slot
        v-if="$slots['leading']"
        name="leading"
      />
      <i
        v-else-if="icon"
        :class="[icon, 'text-(--text-default)']"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </span>
    <span
      ref="labelEl"
      class="flex-1 truncate text-start"
    >
      <slot />
    </span>
    <slot
      v-if="$slots['tag']"
      name="tag"
    />
    <i
      v-if="selected"
      class="ai ai-check shrink-0 text-(--text-default)"
      aria-hidden="true"
      :data-testid="`${testId}__check`"
    />
  </div>
</template>
