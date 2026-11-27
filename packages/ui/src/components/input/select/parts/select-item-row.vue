<script setup lang="ts">
  import { computed, onMounted, onUpdated, ref, useAttrs } from 'vue'

  import type { SelectRootContext } from '../../../../composables/use-select-root'

  defineOptions({
    name: 'SelectItemRow',
    inheritAttrs: false
  })

  export interface SelectItemRowProps {
    /** Context of the select root the row belongs to. */
    ctx: SelectRootContext
    /** Test id of the row; its inner parts derive theirs from it. */
    testId: string
    /** Stable value that identifies this row in the selection. */
    value: unknown
    /** Azion icon class for the leading decorative icon. */
    icon?: string
    /** Disables this single row. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<SelectItemRowProps>(), {
    icon: '',
    disabled: false
  })

  defineSlots<{
    default(): unknown
    /** Selection indicator before the leading adornment; without it a selected row ends with a check. */
    indicator(): unknown
    leading(): unknown
    tag(): unknown
  }>()

  const attrs = useAttrs()

  const selected = computed(() => props.ctx.isSelected(props.value))

  const labelEl = ref<globalThis.HTMLElement | null>(null)
  const recordLabel = () =>
    props.ctx.registerLabel(props.value, labelEl.value?.textContent?.trim() ?? '')
  onMounted(recordLabel)
  onUpdated(recordLabel)

  const onClick = () => {
    if (!props.disabled) props.ctx.toggleValue(props.value)
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      props.ctx.toggleValue(props.value)
    }
  }

  const ROOT_CLASS =
    'flex h-8 pointer-coarse:min-h-11 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
    'data-[selected]:bg-(--bg-selected) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
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
    :class="[ROOT_CLASS, attrs.class]"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot name="indicator" />
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
      v-if="selected && !$slots['indicator']"
      class="az az-check shrink-0 text-(--text-default)"
      aria-hidden="true"
      :data-testid="`${testId}__check`"
    />
  </div>
</template>
