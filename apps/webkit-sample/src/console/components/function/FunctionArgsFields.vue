<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, ref, watch } from 'vue'

  import { fieldDefault, ITEM_TYPES, parseSchema } from '../../lib/format/args-schema'
  import FieldStack from '../form/FieldStack.vue'

  const args = defineModel('args', { type: String, default: '{}' })

  interface Props {
    schema?: string
    disabled?: boolean
    submitted?: boolean
    testId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    schema: '',
    disabled: false,
    submitted: false,
    testId: 'function-args-fields'
  })

  const VIEWS = [
    { label: 'Fields', value: 'fields' },
    { label: 'JSON', value: 'json' }
  ]
  const view = ref('fields')

  const fields = computed(() => parseSchema(props.schema).fields.filter((field) => !field.raw))

  const hasForm = computed(() => fields.value.length > 0)

  const values = computed(() => {
    try {
      const parsed = JSON.parse(args.value || '{}')
      if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') return {}
      return parsed
    } catch {
      return {}
    }
  })

  const setValue = (field, value) => {
    const next = { ...values.value }
    if (value === undefined || value === '') delete next[field.key]
    else next[field.key] = value
    args.value = JSON.stringify(next, null, 2)
  }

  watch(
    fields,
    (list) => {
      const next = { ...values.value }
      let seeded = false
      for (const field of list) {
        if (next[field.key] !== undefined) continue
        const value = fieldDefault(field)
        if (value === undefined) continue
        next[field.key] = value
        seeded = true
      }
      if (seeded) args.value = JSON.stringify(next, null, 2)
    },
    { immediate: true }
  )

  const valueOf = (field) => values.value[field.key]

  const textOf = (field) => {
    const value = valueOf(field)
    return value === undefined || value === null ? '' : String(value)
  }

  const listOf = (field) => {
    const value = valueOf(field)
    return Array.isArray(value) ? value.join('\n') : ''
  }

  const linesToList = (text, itemType) => {
    const lines = String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (itemType === 'string') return lines
    return lines.map(Number).filter((n) => Number.isFinite(n))
  }

  const setNumber = (field, text) => {
    if (!String(text).trim()) return setValue(field, '')
    const parsed = Number(text)
    if (!Number.isFinite(parsed)) return
    setValue(field, field.type === 'integer' ? Math.trunc(parsed) : parsed)
  }

  const labelOf = (field) => field.title || field.key

  const unansweredBy = (field) => field.required && textOf(field).trim() === ''

  const missing = (field) =>
    props.submitted && unansweredBy(field) ? 'This field is required.' : ''

  const unanswered = computed(() => fields.value.filter(unansweredBy).map((field) => field.key))

  defineExpose({ hasForm, unanswered })

  const itemTypeLabel = (value) =>
    ITEM_TYPES.find((item) => item.value === value)?.label ?? value

  const preview = computed(() => JSON.stringify(values.value, null, 2))
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <SegmentedButton
        v-model="view"
        :options="VIEWS"
        aria-label="Arguments surface"
        :data-testid="`${testId}-view`"
      />
      <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
        {{
          view === 'fields'
            ? 'The arguments this function declares.'
            : 'What this instance posts as `args`.'
        }}
      </p>
    </div>

    <div
      v-show="view === 'fields'"
      class="flex flex-col gap-(--spacing-lg)"
    >
      <FieldStack
        v-for="field in fields"
        :key="field.id"
        :label="labelOf(field)"
        :description="field.description"
        :required="field.required"
        :message="missing(field)"
        message-kind="required"
      >
        <template #default="{ controlId, describedBy }">
          <Switch
            v-if="field.type === 'boolean'"
            :id="controlId"
            :model-value="valueOf(field) === true"
            :disabled="disabled"
            :aria-describedby="describedBy"
            @update:model-value="setValue(field, $event)"
          />
          <Select
            v-else-if="field.type === 'select'"
            :model-value="textOf(field)"
            size="large"
            class="w-full"
            placeholder="Select an option..."
            :disabled="disabled"
            :required="!!missing(field)"
            @update:model-value="setValue(field, $event)"
          >
            <Select.Trigger
              :id="controlId"
              :aria-describedby="describedBy"
            />
            <Select.Content>
              <Select.Option
                v-for="option in field.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </Select.Option>
            </Select.Content>
          </Select>
          <Textarea
            v-else-if="field.type === 'array'"
            :id="controlId"
            :model-value="listOf(field)"
            :rows="3"
            :placeholder="`One ${itemTypeLabel(field.itemType).toLowerCase()} value per line`"
            class="w-full font-code"
            :disabled="disabled"
            :aria-describedby="describedBy"
            @update:model-value="setValue(field, linesToList($event, field.itemType))"
          />
          <InputText key="input-text-1"
            v-else-if="field.type === 'integer' || field.type === 'number'"
            :id="controlId"
            :model-value="textOf(field)"
            size="large"
            inputmode="numeric"
            class="w-full"
            :placeholder="field.minimum !== '' ? `From ${field.minimum}` : 'A number'"
            :disabled="disabled"
            :required="!!missing(field)"
            :aria-describedby="describedBy"
            @update:model-value="setNumber(field, $event)"
          />
          <InputText key="input-text-2"
            v-else
            :id="controlId"
            :model-value="textOf(field)"
            size="large"
            class="w-full"
            autocomplete="off"
            :placeholder="field.pattern || 'A value'"
            :disabled="disabled"
            :required="!!missing(field)"
            :aria-describedby="describedBy"
            @update:model-value="setValue(field, $event)"
          />
        </template>
      </FieldStack>
    </div>

    <div
      v-show="view === 'json'"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <Message
        severity="info"
        size="small"
        label="Preview only. Edit the fields to change these values."
      />
      <CodeBlock
        :tabs="[{ label: 'args', value: 'args', code: preview, language: 'json' }]"
        :data-testid="`${testId}-preview`"
      />
    </div>
  </div>
</template>
