<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Dropdown from '../../navigation/dropdown'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type SplitButtonKind = 'primary' | 'secondary' | 'outlined'
  export type SplitButtonSize = 'small' | 'medium' | 'large'

  export interface SplitButtonItem {
    /** Visible label of the action row. */
    label: string
    /** Identifier emitted with item-click; falls back to the label when omitted. */
    value?: string
    /** PrimeIcons class for the action's leading icon. */
    icon?: string
    /** Disables the action row. */
    disabled?: boolean
  }

  defineOptions({
    name: 'SplitButton',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label text on the primary command button. */
    label?: string
    /** PrimeIcons class for the primary button's leading icon. */
    icon?: string
    /** Actions rendered as rows in the attached overlay menu. */
    model?: SplitButtonItem[]
    /** Visual variant applied to both joined segments. */
    kind?: SplitButtonKind
    /** Size token; affects height, padding, and typography. */
    size?: SplitButtonSize
    /** Disables both segments and prevents the menu from opening. */
    disabled?: boolean
    /** Shows a spinner on the primary button and disables its activation. */
    loading?: boolean
    /** When true, selecting a menu action updates the primary button label and icon to mirror that action and marks it as selected in the menu. */
    updateLabelOnSelect?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    icon: '',
    model: () => [],
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    updateLabelOnSelect: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
    'item-click': [item: SplitButtonItem]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-split-button'
  )

  const isInactive = computed(() => props.disabled || props.loading)

  const spinnerSizeClass = computed(() => (props.size === 'large' ? 'size-4' : 'size-3'))

  function optionValue(item: SplitButtonItem): string {
    return item.value ?? item.label
  }

  /** Value of the menu action mirrored by the primary segment; only set while updateLabelOnSelect is on. */
  const selectedValue = ref<string | null>(null)

  const selectedItem = computed(() => {
    if (!props.updateLabelOnSelect || selectedValue.value === null) return null
    return props.model.find((entry) => optionValue(entry) === selectedValue.value) ?? null
  })

  const displayLabel = computed(() => selectedItem.value?.label ?? props.label)

  const displayIcon = computed(() =>
    selectedItem.value ? (selectedItem.value.icon ?? '') : props.icon
  )

  function isItemSelected(item: SplitButtonItem): boolean {
    return props.updateLabelOnSelect && optionValue(item) === selectedValue.value
  }

  const toggleAriaLabel = computed(() =>
    displayLabel.value ? `${displayLabel.value} — more actions` : 'More actions'
  )

  function onPrimaryClick(event: MouseEvent) {
    if (isInactive.value) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }

  function onSelect(payload: { value: string | number }) {
    const item = props.model.find((entry) => optionValue(entry) === String(payload.value))

    if (item) {
      if (props.updateLabelOnSelect) {
        selectedValue.value = optionValue(item)
      }
      emit('item-click', item)
    }
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-loading="loading || null"
    class="relative inline-flex w-fit"
  >
    <Dropdown
      placement="bottom-end"
      :disabled="disabled"
      :data-testid="`${testId}__menu`"
      @select="onSelect"
    >
      <div class="inline-flex w-fit items-stretch">
        <button
          type="button"
          :disabled="disabled"
          :aria-busy="loading || undefined"
          :aria-disabled="isInactive || undefined"
          :data-kind="disabled ? null : kind"
          :data-size="size"
          :data-loading="loading || null"
          :data-testid="`${testId}__primary`"
          class="relative inline-flex items-center justify-center whitespace-nowrap rounded-l-[var(--shape-button)] transition-colors duration-150 ease-out motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none focus-visible:z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[kind=primary]:bg-[var(--primary)] data-[kind=primary]:text-[var(--primary-contrast)] data-[kind=primary]:before:bg-[var(--bg-hover)] data-[kind=primary]:after:bg-[var(--bg-active)] data-[kind=secondary]:bg-[var(--secondary)] data-[kind=secondary]:text-[var(--secondary-contrast)] data-[kind=secondary]:before:bg-[var(--bg-hover)] data-[kind=secondary]:after:bg-[var(--bg-active)] data-[kind=outlined]:border data-[kind=outlined]:border-r-0 data-[kind=outlined]:border-[var(--border-default)] data-[kind=outlined]:bg-[var(--bg-surface)] data-[kind=outlined]:text-[var(--text-default)] data-[kind=outlined]:before:bg-[var(--bg-mask)] data-[kind=outlined]:after:bg-[var(--bg-active)] data-[size=large]:h-10 data-[size=large]:px-[var(--spacing-md)] data-[size=large]:text-button-lg data-[size=medium]:h-8 data-[size=medium]:px-[var(--spacing-sm)] data-[size=medium]:text-button-md data-[size=small]:h-7 data-[size=small]:px-[var(--spacing-xs)] data-[size=small]:text-button-md data-[loading]:cursor-loading disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)] disabled:before:hidden disabled:after:hidden"
          @click="onPrimaryClick"
        >
          <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
            <Spinner
              v-if="loading"
              :class="spinnerSizeClass"
              :data-testid="`${testId}__loading`"
            />
            <i
              v-else-if="displayIcon"
              :class="displayIcon"
              class="shrink-0 text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            <span v-if="displayLabel">{{ displayLabel }}</span>
          </span>
        </button>

        <Dropdown.Trigger
          :data-kind="disabled ? null : kind"
          :data-size="size"
          :aria-label="toggleAriaLabel"
          :data-testid="`${testId}__toggle`"
          class="relative items-center justify-center -ml-px rounded-r-[var(--shape-button)] border-l border-[var(--border-default)] transition-colors duration-150 ease-out motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 data-[state=open]:before:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none focus-visible:z-[1] data-[kind=primary]:bg-[var(--primary)] data-[kind=primary]:text-[var(--primary-contrast)] data-[kind=primary]:before:bg-[var(--bg-hover)] data-[kind=primary]:after:bg-[var(--bg-active)] data-[kind=secondary]:bg-[var(--secondary)] data-[kind=secondary]:text-[var(--secondary-contrast)] data-[kind=secondary]:before:bg-[var(--bg-hover)] data-[kind=secondary]:after:bg-[var(--bg-active)] data-[kind=outlined]:border data-[kind=outlined]:border-[var(--border-default)] data-[kind=outlined]:bg-[var(--bg-surface)] data-[kind=outlined]:text-[var(--text-default)] data-[kind=outlined]:before:bg-[var(--bg-mask)] data-[kind=outlined]:after:bg-[var(--bg-active)] data-[size=large]:px-[var(--spacing-sm)] data-[size=large]:text-button-lg data-[size=medium]:px-[var(--spacing-xs)] data-[size=medium]:text-button-md data-[size=small]:px-[var(--spacing-xs)] data-[size=small]:text-button-md data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:opacity-100 data-[disabled]:before:hidden data-[disabled]:after:hidden"
        >
          <i
            class="pi pi-chevron-down relative z-[1] shrink-0 text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </Dropdown.Trigger>
      </div>

      <Dropdown.Group>
        <Dropdown.Option
          v-for="(item, index) in model"
          :key="`${optionValue(item)}-${index}`"
          :value="optionValue(item)"
          :label="item.label"
          :disabled="item.disabled"
          :selected="isItemSelected(item)"
          :data-testid="`${testId}__item-${index}`"
        >
          <template
            v-if="item.icon"
            #left
          >
            <i
              :class="item.icon"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </template>
        </Dropdown.Option>
      </Dropdown.Group>
    </Dropdown>
  </div>
</template>
