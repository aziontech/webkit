<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { directionalIconClass } from '../../../utils/directional-icons'
  import DropdownMenu from '../../navigation/dropdown-menu'
  import Button from '../button/button.vue'
  import IconButton from '../icon-button/icon-button.vue'

  export type SplitButtonVariant = 'primary' | 'secondary' | 'outline'
  export type SplitButtonSize = 'small' | 'medium' | 'large'

  export interface SplitButtonItem {
    /** Visible label of the action row. */
    label: string
    /** Identifier emitted with item-click; falls back to the label when omitted. */
    value?: string
    /** Azion icon class for the action's leading icon. */
    icon?: string
    /** Disables the action row. */
    disabled?: boolean
  }

  defineOptions({
    name: 'SplitButton',
    inheritAttrs: false
  })

  export interface SplitButtonProps {
    /** Visible label text on the primary command button. */
    label?: string
    /** Azion icon class for the primary button's leading icon. */
    icon?: string
    /** Actions rendered as rows in the attached overlay menu. */
    items?: SplitButtonItem[]
    /** Visual variant applied to both joined segments. */
    variant?: SplitButtonVariant
    /** Size token; affects height, padding, and typography. */
    size?: SplitButtonSize
    /** Disables both segments and prevents the menu from opening. */
    disabled?: boolean
    /** Shows a spinner on the primary button and takes the disabled status: both segments are disabled and the menu cannot open while it resolves. */
    loading?: boolean
    /** When true, selecting a menu action updates the primary button label and icon to mirror that action and marks it as selected in the menu. */
    updateLabelOnSelect?: boolean
  }

  const props = withDefaults(defineProps<SplitButtonProps>(), {
    label: '',
    icon: '',
    items: () => [],
    variant: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    updateLabelOnSelect: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent, item: SplitButtonItem | null]
    'item-click': [event: MouseEvent | KeyboardEvent, item: SplitButtonItem]
  }>()

  /** Value of the menu action the primary button mirrors when `updateLabelOnSelect` is set (v-model:selected-key); null shows the default label. */
  const selectedValue = defineModel<string | null>('selectedKey', { default: null })

  const attrs = useAttrs()
  const { t } = useTranslate({ splitButton: en.splitButton })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'split-button')

  function optionValue(item: SplitButtonItem): string {
    return item.value ?? item.label
  }

  const actions = computed(() => props.items)

  const selectedItem = computed(() => {
    if (!props.updateLabelOnSelect || selectedValue.value === null) return null
    return actions.value.find((entry) => optionValue(entry) === selectedValue.value) ?? null
  })

  const displayLabel = computed(() => selectedItem.value?.label ?? props.label)

  const displayIcon = computed(() =>
    selectedItem.value ? (selectedItem.value.icon ?? '') : props.icon
  )

  function isItemSelected(item: SplitButtonItem): boolean {
    return props.updateLabelOnSelect && optionValue(item) === selectedValue.value
  }

  const toggleAriaLabel = computed(() =>
    displayLabel.value
      ? t('splitButton.moreActionsFor', { label: displayLabel.value })
      : t('splitButton.moreActions')
  )

  function onPrimaryClick(event: MouseEvent) {
    emit('click', event, selectedItem.value)
  }

  function onSelect(event: MouseEvent | KeyboardEvent, value: string | number) {
    const item = actions.value.find((entry) => optionValue(entry) === String(value))

    if (item) {
      if (props.updateLabelOnSelect) {
        selectedValue.value = optionValue(item)
      }
      emit('item-click', event, item)
    }
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-loading="loading || null"
    class="relative inline-flex w-fit"
  >
    <DropdownMenu
      side="bottom"
      align="end"
      :disabled="disabled || loading"
      :data-testid="`${testId}__menu`"
      @select="onSelect"
    >
      <div class="inline-flex w-fit items-stretch [&_[data-slot=touch-target]]:inset-x-0">
        <Button
          :label="displayLabel"
          :icon="displayIcon"
          :variant="variant"
          :size="size"
          :disabled="disabled"
          :loading="loading"
          :data-testid="`${testId}__primary`"
          class="rounded-e-none! focus-visible:z-1"
          @click="onPrimaryClick"
        />

        <DropdownMenu.Trigger :data-testid="`${testId}__toggle`">
          <IconButton
            icon="az az-chevron-down"
            :ariaLabel="toggleAriaLabel"
            :variant="variant"
            :size="size"
            :disabled="disabled || loading"
            :data-testid="`${testId}__toggle-button`"
            class="rounded-s-none! -ms-px border-s border-(--border-default) focus-visible:z-1"
          />
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Group>
        <DropdownMenu.Item
          v-for="(item, index) in actions"
          :key="`${optionValue(item)}-${index}`"
          :value="optionValue(item)"
          :label="item.label"
          :disabled="item.disabled"
          :selected="isItemSelected(item)"
          :data-testid="`${testId}__item-${index}`"
        >
          <template
            v-if="item.icon"
            #leading
          >
            <i
              :class="[item.icon, directionalIconClass(item.icon)]"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu>
  </div>
</template>
