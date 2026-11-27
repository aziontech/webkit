<script setup lang="ts">
  import { type FunctionalComponent, inject, renderSlot } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Combobox from '../../combobox/combobox.vue'
  import Field from '../../field/field.vue'
  import FieldDescription from '../../field/field-description/field-description.vue'
  import FieldError from '../../field/field-error/field-error.vue'
  import FieldLabel from '../../field/field-label/field-label.vue'
  import Input from '../../input/input.vue'
  import MultiSelect from '../../multi-select/multi-select.vue'
  import MultiSelectContent from '../../multi-select/multi-select-content/multi-select-content.vue'
  import MultiSelectItem from '../../multi-select/multi-select-item/multi-select-item.vue'
  import MultiSelectTrigger from '../../multi-select/multi-select-trigger/multi-select-trigger.vue'
  import PasswordInput from '../../password-input/password-input.vue'
  import Select from '../../select/select.vue'
  import SelectContent from '../../select/select-content/select-content.vue'
  import SelectItem from '../../select/select-item/select-item.vue'
  import SelectTrigger from '../../select/select-trigger/select-trigger.vue'
  import Switch from '../../switch/switch.vue'
  import Textarea from '../../textarea/textarea.vue'
  import { SchemaFormInjectionKey } from '../injection-key'
  import { listLines, parseNumber, type SchemaFormNode } from '../schema'
  import type { SchemaFormFieldSlotProps } from '../schema-form.vue'

  defineOptions({ name: 'SchemaFormField', inheritAttrs: false })

  defineProps<{ node: SchemaFormNode }>()

  const ctx = inject(SchemaFormInjectionKey)
  if (!ctx) throw new Error('SchemaFormField must be used inside SchemaForm.')
  const {
    testId,
    valueAt,
    setValue,
    setDraft,
    errorOf,
    isDisabled,
    isReadonly,
    onFocusout,
    optionStates,
    searchOptions
  } = ctx
  const { t } = useTranslate({ schemaForm: en.schemaForm })

  const RootSlot: FunctionalComponent<{ name: string; scope: SchemaFormFieldSlotProps }> = (
    slotProps,
    { slots }
  ) => renderSlot(ctx.slots, slotProps.name, { ...slotProps.scope }, slots['default'])

  const setNumber = (node: SchemaFormNode, text: string) => {
    const parsed = parseNumber(text)
    setDraft(node, text, parsed === undefined || Number.isNaN(parsed) ? undefined : parsed)
  }

  const setList = (node: SchemaFormNode, text: string) => {
    const lines = listLines(text)
    const items =
      node.itemType === 'string'
        ? lines
        : lines.map((line) => Number(line)).filter((item) => Number.isFinite(item))
    setDraft(node, text, items.length ? items : undefined)
  }

  const setJson = (node: SchemaFormNode, text: string) => {
    let parsed: unknown
    try {
      parsed = text.trim() ? JSON.parse(text) : undefined
    } catch {
      parsed = undefined
    }
    setDraft(node, text, parsed)
  }

  const setOption = (node: SchemaFormNode, selected: unknown) => {
    const match = node.options.find((option) => String(option) === String(selected))
    setValue(node, match)
  }

  const listAt = (path: string): unknown[] => {
    const current = valueAt(path)
    return Array.isArray(current) ? current : []
  }

  const optionsOf = (node: SchemaFormNode) => optionStates.get(node.path)?.options ?? []

  const comboOptionsOf = (node: SchemaFormNode) =>
    optionsOf(node).map((option) => ({
      value: String(option.value),
      label: option.label,
      description: option.description
    }))

  const setChoice = (node: SchemaFormNode, text: string) => {
    if (!text) {
      setValue(node, undefined)
      return
    }
    const match = optionsOf(node).find((option) => String(option.value) === text)
    const numeric = node.type === 'number' || node.type === 'integer'
    setValue(node, match ? match.value : numeric ? Number(text) : text)
  }

  const optionLabelOf = (node: SchemaFormNode, selected: unknown) =>
    selected === undefined || selected === null
      ? ''
      : (node.optionLabels[String(selected)] ?? String(selected))

  const textOf = (node: SchemaFormNode) => {
    const draft = ctx.draftOf(node.path)
    if (draft !== undefined) return draft
    const current = valueAt(node.path)
    if (current === undefined || current === null) return ''
    if (node.widget === 'list' && Array.isArray(current)) return current.join('\n')
    if (node.widget === 'json') return JSON.stringify(current, null, 2)
    return String(current)
  }

  const numberPlaceholder = (node: SchemaFormNode) =>
    node.schema.minimum !== undefined
      ? t('schemaForm.numberFrom', { min: node.schema.minimum })
      : t('schemaForm.numberPlaceholder')

  const placeholderOf = (node: SchemaFormNode) => {
    if (node.placeholder) return node.placeholder
    if (node.widget === 'select' || node.widget === 'multiselect')
      return t('schemaForm.selectPlaceholder')
    if (node.widget === 'combobox') return t('schemaForm.searchPlaceholder')
    if (node.widget === 'password' && node.writeOnly && !node.required)
      return t('schemaForm.writeOnlyPlaceholder')
    if (node.format === 'date') return t('schemaForm.datePlaceholder')
    if (node.widget === 'list') return t('schemaForm.listPlaceholder')
    if (node.widget === 'json') return t('schemaForm.jsonPlaceholder')
    return node.widget === 'number' ? numberPlaceholder(node) : undefined
  }

  const slotProps = (node: SchemaFormNode): SchemaFormFieldSlotProps => {
    const error = errorOf(node)
    return {
      path: node.path,
      schema: node.schema,
      value: valueAt(node.path),
      setValue: (next: unknown) => setValue(node, next),
      invalid: Boolean(error),
      error,
      required: node.required,
      disabled: isDisabled(node),
      readonly: isReadonly(node)
    }
  }
</script>

<template>
  <Field
    :data-path="node.path"
    :data-widget="node.widget"
    :data-testid="`${testId}__field`"
    :required="node.required"
    :invalid="Boolean(errorOf(node))"
    :disabled="isDisabled(node)"
    @focusout="onFocusout(node, $event)"
  >
    <FieldLabel>{{ node.label }}</FieldLabel>
    <RootSlot
      :name="`field:${node.path}`"
      :scope="slotProps(node)"
    >
      <Switch
        v-if="node.widget === 'switch'"
        :model-value="valueAt(node.path) === true"
        :disabled="isDisabled(node) || isReadonly(node)"
        @update:model-value="setValue(node, $event)"
      />
      <Combobox
        v-else-if="node.widget === 'combobox'"
        :model-value="valueAt(node.path) === undefined ? '' : String(valueAt(node.path))"
        :options="comboOptionsOf(node)"
        :loading="optionStates.get(node.path)?.loading ?? false"
        :filter="false"
        :allow-custom="false"
        :clearable="!node.required && !isReadonly(node)"
        :empty-title="optionStates.get(node.path)?.failed ? t('schemaForm.optionsError') : ''"
        size="large"
        class="w-full"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        @update:model-value="setChoice(node, $event)"
        @search="searchOptions(node, $event)"
      />
      <MultiSelect
        v-else-if="node.widget === 'multiselect'"
        :model-value="listAt(node.path)"
        size="large"
        class="w-full"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        @update:model-value="setValue(node, $event.length ? $event : undefined)"
      >
        <MultiSelectTrigger />
        <MultiSelectContent>
          <MultiSelectItem
            v-for="option in optionsOf(node)"
            :key="String(option.value)"
            :value="option.value"
            >{{ option.label || option.value }}</MultiSelectItem
          >
        </MultiSelectContent>
      </MultiSelect>
      <PasswordInput
        v-else-if="node.widget === 'password'"
        key="password"
        :model-value="textOf(node)"
        class="w-full"
        :autocomplete="node.writeOnly ? 'new-password' : 'current-password'"
        :max-length="node.schema.maxLength"
        :placeholder="placeholderOf(node) ?? ''"
        :readonly="isReadonly(node)"
        @update:model-value="setValue(node, $event)"
      />
      <Select
        v-else-if="node.widget === 'select'"
        :model-value="valueAt(node.path) === undefined ? undefined : String(valueAt(node.path))"
        size="large"
        class="w-full"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        :display-value="(selected: unknown) => optionLabelOf(node, selected)"
        @update:model-value="setOption(node, $event)"
      >
        <SelectTrigger />
        <SelectContent>
          <SelectItem
            v-for="option in node.options"
            :key="String(option)"
            :value="String(option)"
          >
            {{ optionLabelOf(node, option) }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        v-else-if="node.widget === 'textarea'"
        key="textarea"
        :model-value="textOf(node)"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        :rows="4"
        class="w-full"
        @update:model-value="setValue(node, $event)"
      />
      <Textarea
        v-else-if="node.widget === 'list' || node.widget === 'json'"
        key="code"
        :model-value="textOf(node)"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        :rows="node.widget === 'json' ? 5 : 3"
        spellcheck="false"
        monospace
        class="w-full"
        @update:model-value="node.widget === 'list' ? setList(node, $event) : setJson(node, $event)"
      />
      <Input
        v-else-if="node.widget === 'number'"
        key="number"
        :model-value="textOf(node)"
        size="large"
        class="w-full"
        :inputmode="node.type === 'integer' ? 'numeric' : 'decimal'"
        autocomplete="off"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        @update:model-value="setNumber(node, $event)"
      />
      <Input
        v-else
        key="text"
        :model-value="textOf(node)"
        size="large"
        class="w-full"
        autocomplete="off"
        :type="node.format === 'email' ? 'email' : 'text'"
        :inputmode="node.format === 'uri' || node.format === 'url' ? 'url' : undefined"
        :max-length="node.schema.maxLength"
        :placeholder="placeholderOf(node)"
        :readonly="isReadonly(node)"
        @update:model-value="setValue(node, $event)"
      />
    </RootSlot>
    <FieldError
      v-if="errorOf(node)"
      :data-testid="`${testId}__error`"
      >{{ errorOf(node) }}</FieldError
    >
    <FieldDescription v-else-if="node.description">{{ node.description }}</FieldDescription>
  </Field>
</template>
