<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useSelectSearch } from '../../../composables/use-select-search'
  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputText from '../input-text/input-text.vue'
  import Label from '../label/label.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'

  defineOptions({
    name: 'FieldSelect',
    inheritAttrs: false
  })

  export type FieldSelectSize = 'small' | 'medium' | 'large'
  export type FieldSelectValue = string | number | unknown[] | undefined
  export interface FieldSelectOption {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** Human-readable label rendered inside the option. */
    label: string
    /** Disables this individual option. */
    disabled?: boolean
  }

  interface Props {
    /** Options rendered inside the dropdown. When empty, no options render. */
    options?: FieldSelectOption[]
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder shown on the trigger when nothing is selected. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Size forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: FieldSelectSize
    /** Switches the component to multi-select; modelValue becomes an array. */
    multiple?: boolean
    /** Disables the select; a supplied helperText switches to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the select read-only; value is visible but the dropdown is locked. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets aria-required on the trigger. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border/ring tokens. */
    invalid?: boolean
    /** id for the trigger; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** Adds a search box that filters the options as you type; applies to the options prop, not the default slot. */
    searchable?: boolean
    /** Placeholder of the search box when searchable. */
    searchPlaceholder?: string
    /** Shown in the list when searchable and no option matches. */
    searchEmptyLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    label: '',
    placeholder: '',
    helperText: '',
    size: 'medium',
    multiple: false,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    searchable: false,
    searchPlaceholder: 'Search',
    searchEmptyLabel: 'No results found'
  })

  const modelValue = defineModel<FieldSelectValue>({ default: undefined })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-select'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  // The field never writes copy of its own. No `helperText` means no helper row — while
  // disabled as much as anywhere else: a field that goes disabled for the length of a
  // request would otherwise grow a padlock line the screen never asked for, in the one
  // moment it has nothing to say. Disabling is already legible from the field's own
  // treatment, and a caller who wants a reason passes one (it renders with the lock).
  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))

  const keyOf = (value: unknown) => String(value)

  const togglePicked = (key: string) => {
    const option = props.options.find((o) => keyOf(o.value) === key)
    if (!option) return
    if (!props.multiple) {
      modelValue.value = option.value as FieldSelectValue
      return
    }
    const current = Array.isArray(modelValue.value) ? [...modelValue.value] : []
    const index = current.indexOf(option.value)
    if (index === -1) current.push(option.value)
    else current.splice(index, 1)
    modelValue.value = current
  }

  const {
    open,
    query,
    filtered,
    activeKey,
    activeIndex,
    searchId,
    optionId,
    setActive,
    onTriggerKeydown,
    onContentKeydown,
    onSearchKeydown
  } = useSelectSearch({
    items: () =>
      props.options.map((o) => ({ key: keyOf(o.value), text: o.label, disabled: o.disabled })),
    selectedKeys: () => {
      const current = modelValue.value
      if (Array.isArray(current)) return current.map(keyOf)
      return current === undefined ? [] : [keyOf(current)]
    },
    idPrefix: generatedId,
    triggerId: resolvedInputId,
    multiple: () => props.multiple,
    onPick: togglePicked
  })

  const visibleOptions = computed(() => {
    if (!props.searchable) return props.options
    const keys = new Set(filtered.value.map((item) => item.key))
    return props.options.filter((o) => keys.has(keyOf(o.value)))
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    class="flex flex-col gap-(--spacing-xs) w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <Select
      v-model="modelValue"
      v-model:open="open"
      :multiple="multiple"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :data-testid="`${testId}__select`"
    >
      <SelectTrigger
        :id="resolvedInputId"
        :aria-describedby="describedBy"
        :data-testid="`${testId}__trigger`"
        @keydown="searchable && onTriggerKeydown($event)"
      />
      <SelectContent
        :data-testid="`${testId}__content`"
        @keydown="searchable && onContentKeydown($event)"
      >
        <template
          v-if="searchable"
          #search
        >
          <InputText
            :id="searchId"
            v-model="query"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder || 'Search'"
            :aria-activedescendant="activeKey ? optionId(activeKey) : undefined"
            autocomplete="off"
            :data-testid="`${testId}__search`"
            @keydown="onSearchKeydown"
          >
            <template #iconLeft>
              <i class="pi pi-search" />
            </template>
          </InputText>
        </template>
        <slot>
          <SelectOption
            v-for="(option, index) in visibleOptions"
            :id="searchable ? optionId(keyOf(option.value)) : undefined"
            :key="keyOf(option.value)"
            :value="option.value"
            :disabled="option.disabled"
            :data-active="(searchable && index === activeIndex) || null"
            :data-testid="`${testId}__option`"
            class="data-[active]:bg-(--bg-hover)"
            @mousemove="searchable && setActive(index)"
          >
            {{ option.label }}
          </SelectOption>
          <p
            v-if="searchable && visibleOptions.length === 0"
            role="status"
            :data-testid="`${testId}__search-empty`"
            class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
          >
            {{ searchEmptyLabel }}
          </p>
        </slot>
      </SelectContent>
    </Select>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>
