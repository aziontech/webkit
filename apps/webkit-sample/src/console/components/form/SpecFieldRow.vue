<script setup>
  // ONE spec field, rendered as a row.
  //
  // The resource descriptors (../../lib/create-resources.js) describe a form as data: a
  // field is a label, a control kind, a line of guidance and a validation rule. This is the
  // one place that turns such a field into UI — the FieldRow that carries its name, its
  // guidance and its message, plus the single control the `kind` asks for.
  //
  // ── WHY IT IS A COMPONENT ──
  //
  // The switch below was written inline in the create page, TWICE (once for the open bands
  // and once for the Advanced band), and a settings page rendering the same descriptors
  // would have made four copies of it. Every copy is a place where one control gains a
  // `disabled`, an `aria-describedby` or an `autocomplete` the others do not — which is
  // exactly the drift the descriptors exist to prevent. One row, one switch, every page
  // that renders a spec.
  //
  // The row owns the name, the guidance and the message; each branch here is one element
  // wired to the same three things — the model, its aria-label, and the message it is
  // currently showing.
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed } from 'vue'

  import FieldRow from './FieldRow.vue'

  const props = defineProps({
    /** The field descriptor from `../../lib/create-resources.js`. */
    field: { type: Object, required: true },
    /** The message under the control. Empty = nothing rendered. */
    message: { type: String, default: '' },
    /** `required` (amber), `invalid` (red) or `helper` (neutral). */
    messageKind: { type: String, default: 'helper' },
    /** Locks the control while the page's request is in flight. */
    disabled: { type: Boolean, default: false },
    /**
     * Namespaces a radio group's `name` so two pages rendering the same field on one
     * document cannot capture each other's clicks.
     */
    namePrefix: { type: String, default: '' }
  })

  const model = defineModel({ default: '' })

  // How much room the control needs — the one thing FieldRow asks. A textarea, a PEM
  // block, a newline-separated list and a radio group cannot work in a 256px cell, so
  // their rows stack; a switch is fixed-size and sits hard right; everything else is a
  // field that fills the cell.
  const rowKind = computed(() => {
    if (props.field.kind === 'switch') return 'compact'
    if (['textarea', 'code', 'list', 'radio'].includes(props.field.kind)) return 'wide'
    return 'field'
  })

  // ── A SWITCH THAT CARRIES A VALUE ──
  //
  // `switch-select` is one row holding two decisions in order: whether the thing is
  // configured at all, and then how. Its model is `{ active, value }` rather than two
  // fields, because they are one answer — a WAF threat family that is not inspected has no
  // sensitivity, and a second row would ask for one anyway (see ../../lib/create-resources.js
  // § WAF RULES).
  //
  // The switch is PINNED to the row's right edge and never moves — it is the one control
  // every row of the group has, so a column of families reads as one line of toggles, and a
  // toggle that slid sideways as its own select came and went would break that line on
  // exactly the rows the reader just touched. The select opens to its left, inside the same
  // capped cell, so it ends where every other control on the page ends.
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

  // A field's standing guidance lives in the row's description, where it costs no vertical
  // space; the message under the control is the error only.
  const guidance = computed(() => props.field.helper ?? props.field.description ?? '')

  // Select formats its trigger through `displayValue`, and without one it prints the raw
  // model value — so a select holding an API value would read `lets_encrypt` instead of the
  // sentence its option list carries.
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

      <!-- `code` and `list` are both textareas; what differs is the face (a PEM block and
           a function body are read as code) and how the value is posted (one entry per
           line becomes an array). -->
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

      <!-- A radio group is a group, so it gets a real fieldset/legend of its own: the
           row's title names the decision, and the legend is what a screen reader
           announces before the options. -->
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

      <!-- The switch decides whether this is configured at all; the select is what it
           carries, and it is absent — not disabled — while the switch is off, because there
           is nothing to answer yet. The two are named separately ("SQL injection" and "SQL
           injection sensitivity") so neither depends on the row's title to be understood. -->
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
        :disabled="disabled"
      />
    </template>
  </FieldRow>
</template>
