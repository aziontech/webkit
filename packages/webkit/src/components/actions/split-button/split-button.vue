<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Dropdown from '../../navigation/dropdown'
  import Button from '../button/button.vue'
  import IconButton from '../icon-button/icon-button.vue'

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
    /** Shows a spinner on the primary button and takes the disabled status: both segments are disabled and the menu cannot open while it resolves. */
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
    click: [event: MouseEvent, item: SplitButtonItem | null]
    'item-click': [item: SplitButtonItem]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-split-button'
  )

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
    // Button already suppresses activation while disabled/loading, so the
    // event only reaches here when the primary segment is actionable.
    emit('click', event, selectedItem.value)
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
      :disabled="disabled || loading"
      :data-testid="`${testId}__menu`"
      @select="onSelect"
    >
      <div class="inline-flex w-fit items-stretch">
        <Button
          :label="displayLabel"
          :icon="displayIcon"
          :kind="kind"
          :size="size"
          :disabled="disabled"
          :loading="loading"
          :data-testid="`${testId}__primary`"
          class="rounded-r-none! focus-visible:z-[1]"
          @click="onPrimaryClick"
        />

        <Dropdown.Trigger :data-testid="`${testId}__toggle`">
          <IconButton
            icon="pi pi-chevron-down"
            :ariaLabel="toggleAriaLabel"
            :kind="kind"
            :size="size"
            :disabled="disabled || loading"
            :data-testid="`${testId}__toggle-button`"
            class="rounded-l-none! -ml-px border-l border-[var(--border-default)] focus-visible:z-[1]"
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
