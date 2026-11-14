<script setup lang="ts" generic="TItem extends RadioCardsItem = RadioCardsItem">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useFieldControl } from '../../../composables/use-field-control'

  defineOptions({
    name: 'RadioCards',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Options rendered as selectable cards; each entry must include `value` and `label`, and may carry extra fields the slots read. */
      items: TItem[]
      /** Disables all options and applies disabled tokens. */
      disabled?: boolean
    }>(),
    {
      disabled: false
    }
  )

  const model = defineModel<TItem['value']>()

  defineSlots<{
    default(props: { item: TItem; selected: boolean }): unknown
    tag(props: { item: TItem; selected: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const dir = useDirection()
  const field = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-radio-cards')

  const groupDisabled = computed(() => field.disabled.value)

  const focusedIndex = ref(0)

  const selectedIndex = computed(() => props.items.findIndex((item) => item.value === model.value))

  function isSelected(item: TItem): boolean {
    return model.value === item.value
  }

  function isItemDisabled(item: TItem | undefined): boolean {
    return groupDisabled.value || Boolean(item?.disabled)
  }

  function optionTabIndex(index: number): number {
    if (isItemDisabled(props.items[index])) return -1
    const selected = selectedIndex.value
    const activeIndex =
      selected >= 0 && !isItemDisabled(props.items[selected])
        ? selected
        : focusedIndex.value >= 0 && !isItemDisabled(props.items[focusedIndex.value])
          ? focusedIndex.value
          : props.items.findIndex((item) => !isItemDisabled(item))
    return index === activeIndex ? 0 : -1
  }

  function select(item: TItem): void {
    if (isItemDisabled(item)) return
    model.value = item.value
  }

  function step(from: number, offset: number): number {
    const count = props.items.length
    let index = from
    for (let i = 0; i < count; i += 1) {
      index = (index + offset + count) % count
      if (!isItemDisabled(props.items[index])) return index
    }
    return from
  }

  function onOptionKeydown(event: globalThis.KeyboardEvent, index: number): void {
    if (isItemDisabled(props.items[index])) return

    let nextIndex = index

    switch (logicalArrowKey(event.key, dir.value)) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = step(index, 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = step(index, -1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(props.items[index])
        return
      case 'Home':
        event.preventDefault()
        nextIndex = step(-1, 1)
        break
      case 'End':
        event.preventDefault()
        nextIndex = step(props.items.length, -1)
        break
      default:
        return
    }

    focusedIndex.value = nextIndex
    select(props.items[nextIndex])
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
    disabled?: boolean
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :id="field.controlId.value"
    role="radiogroup"
    class="flex flex-wrap items-stretch gap-(--spacing-xs) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    :aria-labelledby="field.labelledBy.value"
    :aria-describedby="field.describedBy.value"
    :aria-invalid="field.invalid.value || undefined"
    :aria-required="field.required.value || undefined"
    :data-testid="testId"
    :data-disabled="groupDisabled || null"
    :data-invalid="field.invalid.value || null"
    :aria-disabled="groupDisabled || undefined"
  >
    <div
      v-for="(item, index) in items"
      :key="String(item.value)"
      role="radio"
      class="relative rounded-(--shape-button) border bg-(--bg-surface) border-(--border-muted) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas) focus-within:before:opacity-0 focus-visible:before:opacity-0 has-[:focus-visible]:before:opacity-0 disabled:before:hidden disabled:after:hidden data-[disabled]:before:hidden data-[disabled]:after:hidden has-[:disabled]:before:hidden has-[:disabled]:after:hidden has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden disabled:cursor-not-allowed flex max-w-full shrink-0 cursor-pointer flex-col gap-(--spacing-xxs) px-(--spacing-sm) py-(--spacing-sm) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[selected]:border-(--border-selected) data-[selected]:bg-(--primary-selected) data-[selected]:before:hidden data-[selected]:after:hidden data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
      :data-testid="`${testId}__option`"
      :data-selected="isSelected(item) || null"
      :data-disabled="isItemDisabled(item) || null"
      :aria-checked="isSelected(item)"
      :aria-disabled="(!groupDisabled && item.disabled) || undefined"
      :aria-label="item.ariaLabel || undefined"
      :aria-labelledby="!item.ariaLabel && !$slots['default'] ? `${uid}-label-${index}` : undefined"
      :aria-describedby="
        item.description && !$slots['default'] ? `${uid}-description-${index}` : undefined
      "
      :tabindex="optionTabIndex(index)"
      @click="select(item)"
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
          <div class="flex items-center gap-(--spacing-xxs)">
            <i
              v-if="item.icon"
              :class="item.icon"
              class="text-[length:inherit] leading-none text-(--text-default)"
              aria-hidden="true"
              :data-testid="`${testId}__icon`"
            />
            <span
              :id="`${uid}-label-${index}`"
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
