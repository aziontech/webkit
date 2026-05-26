<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { selectableBlockCardClasses } from '../presets/interactive-states'

  defineOptions({
    name: 'BoxGridSelection',
    inheritAttrs: false
  })

  export interface BoxGridSelectionItem {
    value: string | number
    label: string
    icon?: string
    description?: string
    ariaLabel?: string
  }

  interface Props {
    /** Currently selected item value (v-model). */
    modelValue?: string | number
    /** Options rendered as selectable cards; each entry must include `value` and `label`. */
    items: BoxGridSelectionItem[]
    /** Disables all options and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    disabled: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  defineSlots<{
    default(props: { item: BoxGridSelectionItem; selected: boolean }): unknown
    tag(props: { item: BoxGridSelectionItem; selected: boolean }): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-box-grid-selection'
  )

  const focusedIndex = ref(0)

  const selectedIndex = computed(() =>
    props.items.findIndex((item) => item.value === props.modelValue)
  )

  const rootClasses = computed(() =>
    cn(
      'flex flex-wrap items-stretch gap-[var(--spacing-xs)]',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      attrs.class
    )
  )

  const optionClasses = cn(
    selectableBlockCardClasses,
    'flex shrink-0 cursor-pointer flex-col gap-[var(--spacing-xxs)]',
    'px-[var(--spacing-sm)] py-[var(--spacing-sm)]',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'data-[selected]:border-[var(--border-selected)] data-[selected]:bg-[var(--primary-selected)]',
    'data-[selected]:before:hidden data-[selected]:after:hidden',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
  )

  const labelRowClasses = 'flex items-center gap-[var(--spacing-xxs)]'

  function isSelected(item: BoxGridSelectionItem): boolean {
    return props.modelValue === item.value
  }

  function optionTabIndex(index: number): number {
    if (props.disabled) return -1
    const activeIndex = selectedIndex.value >= 0 ? selectedIndex.value : focusedIndex.value
    return index === activeIndex ? 0 : -1
  }

  function select(value: string | number): void {
    if (props.disabled) return
    emit('update:modelValue', value)
  }

  function focusOption(index: number): void {
    if (props.disabled) return
    const clamped = Math.max(0, Math.min(index, props.items.length - 1))
    focusedIndex.value = clamped
  }

  function onOptionKeydown(event: globalThis.KeyboardEvent, index: number): void {
    if (props.disabled) return

    const lastIndex = props.items.length - 1
    let nextIndex = index

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = index >= lastIndex ? 0 : index + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = index <= 0 ? lastIndex : index - 1
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(props.items[index].value)
        return
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = lastIndex
        break
      default:
        return
    }

    focusOption(nextIndex)
    select(props.items[nextIndex].value)
    const target = event.currentTarget as HTMLElement | null
    target?.parentElement?.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus()
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="radiogroup"
    :class="rootClasses"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :aria-disabled="disabled || undefined"
  >
    <div
      v-for="(item, index) in items"
      :key="String(item.value)"
      role="radio"
      :class="optionClasses"
      :data-testid="`${testId}__option`"
      :data-selected="isSelected(item) || null"
      :data-disabled="disabled || null"
      :aria-checked="isSelected(item)"
      :aria-label="item.ariaLabel ?? item.label"
      :tabindex="optionTabIndex(index)"
      @click="select(item.value)"
      @keydown="onOptionKeydown($event, index)"
    >
      <slot
        name="default"
        :item="item"
        :selected="isSelected(item)"
      >
        <div
          class="flex flex-col gap-[var(--spacing-xxs)]"
          :data-testid="`${testId}__content`"
        >
          <div :class="labelRowClasses">
            <i
              v-if="item.icon"
              :class="item.icon"
              class="text-[length:inherit] leading-none text-[var(--text-default)]"
              aria-hidden="true"
              :data-testid="`${testId}__icon`"
            />
            <span
              class="text-body-sm text-[var(--text-default)]"
              :data-testid="`${testId}__label`"
            >
              {{ item.label }}
            </span>
          </div>
          <p
            v-if="item.description"
            class="text-body-xs text-[var(--text-muted)]"
            :data-testid="`${testId}__description`"
          >
            {{ item.description }}
          </p>
          <slot
            name="tag"
            :item="item"
            :selected="isSelected(item)"
          />
        </div>
      </slot>
    </div>
  </div>
</template>
