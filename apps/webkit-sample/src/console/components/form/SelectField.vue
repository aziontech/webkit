<script setup>
  // A labelled Select — the `Field*` triad (Label ↔ control ↔ HelperText) around the
  // Select COMPOUND rather than around webkit's `FieldSelect`.
  //
  // WHY NOT FieldSelect. `FieldSelect` renders the trigger through `Select` but does
  // not forward `display-value`, so it can only show the raw `modelValue`. Every
  // select in this console stores a CODE and shows a NAME — country `br` → "Brazil",
  // theme `system` → "System" — so a pre-seeded FieldSelect renders "br" until the
  // user opens it and picks the same option again. Until webkit forwards that prop,
  // a labelled select has to compose the parts itself.
  //
  // The a11y wiring is the part that must not be hand-rolled twice, which is why this
  // exists once instead of at five call sites: the `<label for>` points at
  // `Select.Trigger`'s id (labelling the wrapper labels nothing — the trigger is the
  // control), and the helper is tied to the trigger with `aria-describedby`.
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import { computed, useId } from 'vue'

  const props = defineProps({
    // Text rendered inside the Label. When empty, the label row is omitted.
    label: { type: String, default: '' },
    // Options rendered in the dropdown: `{ label, value }`.
    options: { type: Array, default: () => [] },
    // Placeholder shown on the trigger when nothing is selected.
    placeholder: { type: String, default: 'Select an option...' },
    // Auxiliary line under the control. When empty, the helper row is omitted.
    helperText: { type: String, default: '' },
    // Trigger height: small=28px, medium=32px, large=40px.
    size: { type: String, default: 'large' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false }
  })

  const model = defineModel({ type: [String, Number], default: '' })

  const id = useId()
  const helperId = computed(() => `${id}-helper`)
  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))

  // Same precedence webkit's Field* components use: a disabled field's helper is the
  // padlock line, an invalid one is red, a required one amber, otherwise muted.
  const helperKind = computed(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  // Stored value → visible label. This is the whole reason the compound is composed
  // by hand rather than delegated to FieldSelect.
  const displayValue = (value) =>
    props.options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xs)">
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="id"
    />
    <Select
      v-model="model"
      :size="size"
      :disabled="disabled"
      :required="required"
      :invalid="invalid"
      :placeholder="placeholder"
      :display-value="displayValue"
      class="w-full"
    >
      <Select.Trigger
        :id="id"
        :aria-describedby="describedBy"
      />
      <Select.Content>
        <Select.Option
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Option>
      </Select.Content>
    </Select>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
    />
  </div>
</template>
