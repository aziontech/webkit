<script setup lang="ts" generic="TItem extends RadioCardsItem = RadioCardsItem">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'RadioCards',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Currently selected item value (v-model); update:modelValue sends it typed as the items' value. */
      modelValue?: RadioCardsItem['value']
      /** Options rendered as selectable cards; each entry must include `value` and `label`, and may carry extra fields the slots read. */
      items: TItem[]
      /** Disables all options and applies disabled tokens. */
      disabled?: boolean
    }>(),
    {
      modelValue: undefined,
      disabled: false
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: TItem['value']]
  }>()

  defineSlots<{
    default(props: { item: TItem; selected: boolean }): unknown
    tag(props: { item: TItem; selected: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const dir = useDirection()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-radio-cards')

  const focusedIndex = ref(0)

  const selectedIndex = computed(() =>
    props.items.findIndex((item) => item.value === props.modelValue)
  )

  const rootClasses = computed(() =>
    cn(
      'flex flex-wrap items-stretch gap-(--spacing-xs)',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      attrs.class
    )
  )

  const optionClasses = cn(
    'relative rounded-(--shape-button) border',
    'bg-(--bg-surface) border-(--border-muted)',
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:bg-(--bg-hover) before:opacity-0 before:content-['']",
    'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
    "after:bg-(--bg-active) after:opacity-0 after:content-['']",
    'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
    'hover:before:opacity-100 active:after:opacity-100',
    'motion-reduce:before:transition-none motion-reduce:after:transition-none',
    'has-[:focus-visible]:outline-none',
    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color)',
    'has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas)',
    'focus-within:before:opacity-0',
    'focus-visible:before:opacity-0',
    'has-[:focus-visible]:before:opacity-0',
    'disabled:before:hidden disabled:after:hidden',
    'data-[disabled]:before:hidden data-[disabled]:after:hidden',
    'has-[:disabled]:before:hidden has-[:disabled]:after:hidden',
    'has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden',
    'disabled:cursor-not-allowed',
    'data-[disabled]:cursor-not-allowed',
    'flex max-w-full shrink-0 cursor-pointer flex-col gap-(--spacing-xxs)',
    'px-(--spacing-sm) py-(--spacing-sm)',
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
    'data-[selected]:border-(--border-selected) data-[selected]:bg-(--primary-selected)',
    'data-[selected]:before:hidden data-[selected]:after:hidden',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
  )

  const labelRowClasses = 'flex items-center gap-(--spacing-xxs)'

  function isSelected(item: TItem): boolean {
    return props.modelValue === item.value
  }

  function optionTabIndex(index: number): number {
    if (props.disabled) return -1
    const activeIndex = selectedIndex.value >= 0 ? selectedIndex.value : focusedIndex.value
    return index === activeIndex ? 0 : -1
  }

  function select(value: TItem['value']): void {
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

    switch (logicalArrowKey(event.key, dir.value)) {
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

<script lang="ts">
  export interface RadioCardsItem {
    value: string | number
    label: string
    icon?: string
    description?: string
    ariaLabel?: string
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
      :aria-describedby="
        item.description && !$slots['default'] ? `${uid}-description-${index}` : undefined
      "
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
          class="flex flex-col gap-(--spacing-xxs)"
          :data-testid="`${testId}__content`"
        >
          <div :class="labelRowClasses">
            <i
              v-if="item.icon"
              :class="item.icon"
              class="text-[length:inherit] leading-none text-(--text-default)"
              aria-hidden="true"
              :data-testid="`${testId}__icon`"
            />
            <span
              class="text-body-sm text-(--text-default)"
              :data-testid="`${testId}__label`"
            >
              {{ item.label }}
            </span>
          </div>
          <p
            v-if="item.description"
            :id="`${uid}-description-${index}`"
            class="text-body-xs text-(--text-muted)"
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
