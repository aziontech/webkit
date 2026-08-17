<script setup>
  // THE INSTANCE'S ARGUMENTS, AS THE FORM THE FUNCTION DECLARED.
  //
  // This is the OTHER half of the Form Builder. The function's page BUILDS the schema
  // (./FunctionArgsForm.vue); this renders it — so whoever instances the function on an
  // application answers named fields with their own guidance and validation instead of
  // typing raw JSON into an editor.
  //
  // Both go through the same vocabulary (../../lib/format/args-schema.js): the builder
  // writes `azion_form` out of rows, this reads the same `azion_form` back into
  // controls. A field the builder cannot draw is a field this does not render either,
  // which is the point of them sharing one translation.
  //
  // ── THE JSON IS A PREVIEW, NOT A SECOND EDITOR ──
  //
  // On the FUNCTION, the JSON and the fields are two ways of writing one document and
  // both of them write. Here they are not: the function has already declared what its
  // arguments are, and the instance's job is to ANSWER them. A second, editable JSON
  // surface would let an instance invent a key the function never reads and silently
  // disagree with the form beside it.
  //
  // So the toggle shows the same values as JSON, read-only, and says so. It is there
  // because `args` is what the endpoint actually receives and a reader debugging an
  // instance wants to see the body — not because it is another way in.
  //
  // ── AND WHEN THE FUNCTION HAS NO FORM ──
  //
  // Then there is nothing to render, and the arguments stay what they have always been:
  // JSON the reader writes. The host keeps that editor for exactly that case; this
  // component renders only when there is a form to render.
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

  /** The instance's `args`, as text — the same model the host posts. */
  const args = defineModel('args', { type: String, default: '{}' })

  const props = defineProps({
    /** The function's `azion_form`, as text. Empty = the function declares no form. */
    schema: { type: String, default: '' },
    /** Locks every control while the host's save is in flight. */
    disabled: { type: Boolean, default: false },
    /** Marks unanswered required fields, once the host has tried to submit. */
    submitted: { type: Boolean, default: false },
    testId: { type: String, default: 'function-args-fields' }
  })

  const VIEWS = [
    { label: 'Fields', value: 'fields' },
    { label: 'JSON', value: 'json' }
  ]
  const view = ref('fields')

  /** The fields the function declares, in the order its schema lists them. */
  const fields = computed(() => parseSchema(props.schema).fields.filter((field) => !field.raw))

  /** Whether there is a form to render at all — the host's fallback hinges on this. */
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

  /** Write one answer back into `args`, keeping every key the form does not own. */
  const setValue = (field, value) => {
    const next = { ...values.value }
    if (value === undefined || value === '') delete next[field.key]
    else next[field.key] = value
    args.value = JSON.stringify(next, null, 2)
  }

  /**
   * THE DEFAULTS ARE WRITTEN IN, NOT FALLEN BACK TO.
   *
   * A field whose value is only *displayed* from the schema's `default` reads as
   * answered and posts as absent — and clearing such a field is worse: the key is
   * deleted, the control shows the default again, and the JSON beside it now says
   * something the fields do not. On a surface whose whole promise is "populate the
   * fields, check the JSON", the two disagreeing is the one thing it cannot do.
   *
   * So every default the schema declares is written into `args` once per schema, and
   * `valueOf` reads `args` and nothing else. The fields, the preview and the body that
   * gets posted are then one document: clearing a field empties it and keeps it empty,
   * the preview loses the key, and `unanswered` (below) can see that it is unanswered.
   *
   * Keys already present are left alone — the host seeds `default_args` when a function
   * is selected, and those are the instance's starting answers, not ours to overwrite.
   */
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

  /** The value on screen — what `args` holds, which is what will be posted. */
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

  /** A number field writes a NUMBER, not the text of one — the endpoint takes JSON. */
  const setNumber = (field, text) => {
    if (!String(text).trim()) return setValue(field, '')
    const parsed = Number(text)
    if (!Number.isFinite(parsed)) return
    setValue(field, field.type === 'integer' ? Math.trunc(parsed) : parsed)
  }

  const labelOf = (field) => field.title || field.key

  /** Required and not answered. The one judgement; the two readings of it are below. */
  const unansweredBy = (field) => field.required && textOf(field).trim() === ''

  /** Unanswered and required — amber, and only once the reader has tried to save. */
  const missing = (field) =>
    props.submitted && unansweredBy(field) ? 'This field is required.' : ''

  /**
   * The required fields still unanswered — what the HOST's save consults.
   *
   * The amber messages above are only a reading of this list, so they cannot be the
   * whole of it: a form that says "This field is required." and then saves anyway has
   * told the reader something it did not mean. The host blocks on this and the fields
   * say which ones (see the `validate` in the pages that render this component).
   */
  const unanswered = computed(() => fields.value.filter(unansweredBy).map((field) => field.key))

  defineExpose({ hasForm, unanswered })

  const itemTypeLabel = (value) =>
    ITEM_TYPES.find((item) => item.value === value)?.label ?? value

  // What the endpoint receives, formatted — the preview, and nothing the reader types into.
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

    <!-- THE FIELDS. `v-show`, so a reader who flips to the JSON and back does not lose
         the caret they were in the middle of. -->
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

    <!-- THE PREVIEW. It says what it is BEFORE the reader tries to type in it — a
         read-only editor that only announces itself once you click is a small trap. -->
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
