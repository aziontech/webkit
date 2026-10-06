<script setup lang="ts">
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputPassword from '@aziontech/webkit/input-password'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed } from 'vue'

  import FieldRow from './FieldRow.vue'

  interface Props {
    field: Record<string, unknown>
    message?: string
    messageKind?: string
    disabled?: boolean
    namePrefix?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    message: '',
    messageKind: 'helper',
    disabled: false,
    namePrefix: ''
  })

  const model = defineModel({ default: '' })

  const rowKind = computed(() => {
    if (props.field.kind === 'switch') return 'compact'
    if (['textarea', 'code', 'list', 'radio'].includes(props.field.kind)) return 'wide'
    return 'field'
  })

  const active = computed({
    get: () => model.value?.active === true,
    set: (next) => {
      model.value = { ...model.value, active: next }
    }
  })

  const carried = computed({
    get: () => model.value?.value ?? '',
    set: (next) => {
      model.value = { ...model.value, value: next }
    }
  })

  const guidance = computed(() => props.field.helper ?? props.field.description ?? '')

  const displayValue = (value) =>
    props.field.options?.find((option) => option.value === value)?.label ?? ''

  const showRequired = computed(() => props.messageKind === 'required' && !!props.message)
  const showInvalid = computed(() => props.messageKind === 'invalid')
</script>

<template>
  <FieldRow
    :title="field.label"
    :description="guidance"
    :kind="rowKind"
    :message="message"
    :message-kind="messageKind"
    :level="field.level ?? (field.parent ? 1 : 0)"
  >
    <template #default="{ messageId }">
      <InputText
        v-if="field.kind === 'text'"
        v-model="model"
        size="large"
        class="w-full"
        :aria-label="field.label"
        :placeholder="field.placeholder"
        autocomplete="off"
        :required="showRequired"
        :invalid="showInvalid"
        :aria-describedby="messageId"
        :readonly="field.readonly === true"
        :disabled="disabled"
      />

      <InputPassword
        v-else-if="field.kind === 'secret'"
        v-model="model"
        :aria-label="field.label"
        :placeholder="field.placeholder"
        autocomplete="off"
        :required="showRequired"
        :invalid="showInvalid"
        :aria-describedby="messageId"
        :disabled="disabled"
      />

      <InputNumber
        v-else-if="field.kind === 'number'"
        v-model="model"
        size="large"
        class="w-full"
        :aria-label="field.label"
        :min="field.min"
        :max="field.max"
        :invalid="showInvalid"
        :aria-describedby="messageId"
        :disabled="disabled"
      />

      <Textarea
        v-else-if="['textarea', 'code', 'list'].includes(field.kind)"
        v-model="model"
        class="w-full"
        :class="field.kind === 'code' ? 'font-(family-name:--font-code) text-body-sm' : ''"
        :rows="field.kind === 'code' ? 12 : 5"
        :aria-label="field.label"
        :placeholder="field.placeholder"
        :required="showRequired"
        :invalid="showInvalid"
        :aria-describedby="messageId"
        :disabled="disabled"
      />

      <Select
        v-else-if="field.kind === 'select'"
        v-model="model"
        size="large"
        :placeholder="field.placeholder || 'Select an option'"
        :required="showRequired"
        :invalid="showInvalid"
        :display-value="displayValue"
        :disabled="disabled"
      >
        <Select.Trigger
          class="w-full"
          :aria-label="field.label"
          :aria-describedby="messageId"
        />
        <Select.Content>
          <Select.Option
            v-for="option in field.options"
            :key="String(option.value)"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>

      <fieldset
        v-else-if="field.kind === 'radio'"
        class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
      >
        <legend class="sr-only">{{ field.label }}</legend>
        <FieldRadioBlock
          v-for="option in field.options"
          :key="String(option.value)"
          v-model="model"
          :value="option.value"
          :name="`${namePrefix}-${field.id}`"
          :label="option.label"
          :description="option.description"
          :disabled="disabled"
        />
      </fieldset>

      <div
        v-else-if="field.kind === 'switch-select'"
        class="flex w-full min-w-0 items-center justify-end gap-(--spacing-sm)"
      >
        <Select
          v-if="active"
          v-model="carried"
          size="large"
          class="min-w-0 flex-1"
          :placeholder="field.placeholder || 'Select an option'"
          :display-value="displayValue"
          :disabled="disabled"
        >
          <Select.Trigger
            class="w-full"
            :aria-label="`${field.label} ${(field.valueLabel ?? 'value').toLowerCase()}`"
            :aria-describedby="messageId"
          />
          <Select.Content>
            <Select.Option
              v-for="option in field.options"
              :key="String(option.value)"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>

        <Switch
          v-model="active"
          :aria-label="field.label"
          :disabled="disabled"
        />
      </div>

      <Switch
        v-else
        v-model="model"
        :aria-label="field.label"
        :disabled="disabled || field.readonly === true"
      />
    </template>
  </FieldRow>
</template>
