<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Message from '@aziontech/webkit/message'
  import ResizablePanelRoot from '@aziontech/webkit/resizable-panel-root'
  import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
  import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, ref, watch } from 'vue'

  import { DRAG_ROW_CLASS, GRIP_CLASS, useDragReorder } from '../../lib/behavior/drag-reorder'
  import { MORPH_COLLAPSE } from '../../lib/behavior/list-morph'
  import {
    applyFormDefaults,
    blankField,
    EMPTY_SCHEMA,
    FIELD_TYPES,
    fieldDefault,
    fieldsFromArgs,
    FORM_JSON_SCHEMA,
    ITEM_TYPES,
    keyError,
    parseSchema,
    serializeSchema
  } from '../../lib/format/args-schema'
  import FieldRow from '../form/FieldRow.vue'
  import MonacoEditor from '../monaco-editor/monaco-editor.vue'

  const schema = defineModel('schema', { type: String, default: '' })
  const args = defineModel('args', { type: String, default: '{}' })

  interface Props {
    disabled?: boolean
    testId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    testId: 'function-args-form'
  })

  const fields = ref([])
  const schemaError = ref('')
  const kept = ref({ extras: {}, extraRequired: [] })
  const expanded = ref(new Set())
  const schemaWidth = ref(420)
  const schemaCollapsed = ref(false)

  let pushedSchema = null
  let pushedArgs = null

  const readArgs = () => {
    try {
      const value = JSON.parse(args.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const toRowDefault = (field, value) => {
    if (field.type === 'boolean') return value === true
    if (field.type === 'array') return Array.isArray(value) ? value.map(String) : []
    if (value === undefined || value === null) return ''
    if (typeof value === 'object') return field.default
    return String(value)
  }

  watch(
    schema,
    (text) => {
      if (text === pushedSchema) return
      const result = parseSchema(text)
      schemaError.value = result.error
      if (!result.ok) return
      kept.value = { extras: result.extras, extraRequired: result.extraRequired }
      fields.value = result.fields
      expanded.value = new Set()
    },
    { immediate: true }
  )

  watch(
    fields,
    () => {
      if (!schema.value.trim()) return

      if (schemaError.value) return

      const text = serializeSchema(fields.value, kept.value)
      if (text !== schema.value) {
        pushedSchema = text
        schema.value = text
      }

      const current = readArgs()
      if (!current) return
      const next = JSON.stringify(applyFormDefaults(current, fields.value), null, 2)
      if (next !== args.value) {
        pushedArgs = next
        args.value = next
      }
    },
    { deep: true }
  )

  watch(args, (text) => {
    if (text === pushedArgs) return
    const values = readArgs()
    if (!values) return
    for (const field of fields.value) {
      const key = String(field.key ?? '').trim()
      if (!key || field.raw) continue
      const current = fieldDefault(field)
      const incoming = values[key]
      if (JSON.stringify(current ?? null) === JSON.stringify(incoming ?? null)) continue
      field.default = toRowDefault(field, incoming)
    }
  })

  const CLEAN_SCHEMA = JSON.stringify(EMPTY_SCHEMA, null, 2)
  const schemaText = computed({
    get: () => schema.value || CLEAN_SCHEMA,
    set: (value) => {
      schema.value = value
    }
  })

  const fieldTypeLabel = (type) =>
    FIELD_TYPES.find((option) => option.value === type)?.label ?? type

  const errors = computed(() =>
    Object.fromEntries(
      fields.value.map((field) => [field.id, keyError(field.key, fields.value, field.id)])
    )
  )

  const invalid = computed(() => Object.values(errors.value).some(Boolean))
  defineExpose({ invalid })

  const locked = computed(() => props.disabled || !!schemaError.value)

  const schemaMessage = computed(() => {
    if (!schemaError.value) return ''
    if (!fields.value.length) return `${schemaError.value} Correct the schema to build the form.`
    return `${schemaError.value} The fields are the last ones read from the schema, and stay locked until it is valid.`
  })

  const touched = ref(new Set())
  const touch = (id) => {
    touched.value = new Set(touched.value).add(id)
  }

  const visibleError = (field) => {
    const error = errors.value[field.id]
    if (!error) return ''
    if (String(field.key ?? '').trim()) return error
    return touched.value.has(field.id) ? error : ''
  }

  const isExpanded = (id) => expanded.value.has(id)

  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }

  const open = (id) => {
    expanded.value = new Set(expanded.value).add(id)
  }

  const startForm = () => {
    const seeded = fieldsFromArgs(readArgs() ?? {})
    if (seeded.length) {
      const text = serializeSchema(seeded, kept.value)
      pushedSchema = text
      schema.value = text
      fields.value = seeded
      expanded.value = new Set()
      return
    }

    const text = JSON.stringify(EMPTY_SCHEMA, null, 2)
    pushedSchema = text
    schema.value = text
    appendField()
  }

  const removeForm = () => {
    schema.value = ''
    fields.value = []
    schemaError.value = ''
    kept.value = { extras: {}, extraRequired: [] }
  }

  const appendField = async () => {
    const field = blankField()
    fields.value.push(field)
    open(field.id)
    await nextTick()
    globalThis.document?.getElementById(`${props.testId}-key-${field.id}`)?.focus()
  }

  const addField = () => (schema.value.trim() ? appendField() : startForm())

  const removeField = (index) => {
    const [removed] = fields.value.splice(index, 1)
    if (!removed) return
    const next = new Set(expanded.value)
    next.delete(removed.id)
    expanded.value = next
  }

  const duplicateField = (index) => {
    const source = fields.value[index]
    if (!source) return
    const copy = { ...blankField(), ...source, id: blankField().id, key: '' }
    fields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }

  const onTypeChange = (field) => {
    const blank = blankField()
    for (const constraint of ['minLength', 'maxLength', 'pattern', 'minimum', 'maximum']) {
      field[constraint] = blank[constraint]
    }
    if (field.type !== 'select') field.options = []
    if (field.type === 'boolean') field.default = false
    else if (field.type === 'array') field.default = []
    else if (typeof field.default !== 'string') field.default = ''
  }

  const linesToList = (text) =>
    String(text)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

  const listToLines = (list) => (Array.isArray(list) ? list.join('\n') : '')

  const { canMove, isDragging, isDropTarget, onDragStart, onDragEnter, onDragEnd, drop, move } =
    useDragReorder(() => fields.value, { enabled: () => !locked.value })

  const summary = (field) => {
    if (field.raw) return 'Edited in the schema'
    const parts = [fieldTypeLabel(field.type)]
    if (field.type === 'array') {
      parts[0] = `List of ${ITEM_TYPES.find((item) => item.value === field.itemType)?.label ?? field.itemType}`
    }
    return parts.join(' · ')
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">
        {{ fields.length }} {{ fields.length === 1 ? 'field' : 'fields' }}
      </span>

      <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <Button
          label="Add field"
          kind="outlined"
          size="medium"
          icon="pi pi-plus"
          :disabled="locked"
          :data-testid="`${testId}-add-field`"
          @click="addField"
        />
        <Button
          label="Remove form"
          kind="outlined"
          size="medium"
          icon="pi pi-times"
          :disabled="disabled"
          :data-testid="`${testId}-remove-form`"
          @click="removeForm"
        />
      </div>
    </div>

    <ResizablePanelRoot
      class="min-h-0 flex-1 overflow-hidden"
      aria-label="Argument form"
    >
      <ResizablePanelPane
        v-model:basis="schemaWidth"
        v-model:collapsed="schemaCollapsed"
        collapsible
        :min="280"
        :max="720"
        aria-label="Schema"
        class="bg-(--bg-surface)"
      >
        <MonacoEditor
          v-model="schemaText"
          fill
          flush
          pad-line-numbers
          size="small"
          language="json"
          path="function.form.json"
          :json-schema="FORM_JSON_SCHEMA"
          :invalid="!!schemaError"
          :disabled="disabled"
          aria-label="Argument form schema, as JSON"
          :data-testid="`${testId}-schema`"
        />
      </ResizablePanelPane>

      <ResizablePanelHandle aria-label="Resize the schema" />

      <ResizablePanelPane aria-label="Fields">
        <div
          v-if="fields.length === 0 && !schemaError"
          class="flex min-h-0 flex-1 p-(--spacing-sm)"
        >
          <EmptyState
            bordered
            icon="pi pi-plus-circle"
            title="This form has no fields"
            description="Add the first argument the function reads."
            class="min-h-0 flex-1"
          >
            <template #actions>
              <Button
                label="Add field"
                kind="secondary"
                size="medium"
                icon="pi pi-plus"
                :disabled="disabled"
                :data-testid="`${testId}-add-first-field`"
                @click="startForm"
              />
              <Link
                label="Read about function arguments"
                size="medium"
                href="https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/"
                target="_blank"
              />
            </template>
          </EmptyState>
        </div>

        <div
          v-else
          class="min-h-0 flex-1 overflow-auto p-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--save-bar-inset,0rem))]"
        >
          <div class="layout-column-form mx-auto flex min-w-0 flex-col gap-(--spacing-sm)">
            <Message
              v-if="schemaMessage"
              severity="warning"
              :label="schemaMessage"
              :data-testid="`${testId}-schema-message`"
            />

            <CardBox
              v-if="fields.length"
              :padded="false"
            >
              <template #content>
                <Item.List>
                  <TransitionGroup
                    tag="div"
                    v-bind="MORPH_COLLAPSE"
                    class="relative flex w-full flex-col *:data-[slot=item]:rounded-none *:data-[slot=item]:border-b-(--border-muted) [&>[data-slot=item]:last-child]:border-b-transparent"
                  >
                    <Item
                      v-for="(field, index) in fields"
                      :key="field.id"
                      size="small"
                      data-drag-row
                      :data-dragging="isDragging(index) || null"
                      :data-drop="isDropTarget(index) || null"
                      :class="['flex-col flex-nowrap items-stretch gap-0 px-0!', DRAG_ROW_CLASS]"
                      @dragenter.prevent="onDragEnter(index)"
                      @dragover.prevent
                      @drop="drop(index)"
                    >
                      <div
                        class="flex w-full min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md)"
                      >
                        <div
                          :class="[GRIP_CLASS, 'size-6']"
                          :draggable="canMove(index) && !locked"
                          :aria-disabled="!canMove(index) || locked || undefined"
                          role="button"
                          tabindex="0"
                          :aria-label="`Reorder ${field.key || 'this field'}`"
                          @dragstart="onDragStart(index, $event)"
                          @dragend="onDragEnd"
                          @keydown.up.prevent="move(index, -1)"
                          @keydown.down.prevent="move(index, 1)"
                        >
                          <i
                            class="pi pi-bars text-label-sm"
                            aria-hidden="true"
                          />
                        </div>

                        <Item.Content class="min-w-0 flex-row items-baseline gap-(--spacing-xs)">
                          <Item.Title
                            class="truncate font-code text-label-code-sm"
                            :class="field.key ? '' : 'text-(--text-muted)'"
                          >
                            {{ field.key || 'Unnamed field' }}
                          </Item.Title>
                          <Item.Description class="shrink-0">{{ summary(field) }}</Item.Description>
                        </Item.Content>

                        <Item.Actions class="shrink-0 gap-(--spacing-xs)">
                          <Tag
                            v-if="field.required"
                            key="required"
                            label="Required"
                            severity="info"
                            size="small"
                          />
                          <Tag
                            v-if="visibleError(field)"
                            key="invalid"
                            label="Needs a name"
                            severity="warning"
                            size="small"
                          />
                          <Tooltip text="Duplicate this field">
                            <IconButton
                              icon="pi pi-clone"
                              kind="outlined"
                              size="small"
                              :disabled="locked || !!field.raw"
                              :aria-label="`Duplicate ${field.key || 'this field'}`"
                              @click="duplicateField(index)"
                            />
                          </Tooltip>
                          <Tooltip text="Remove this field">
                            <IconButton
                              icon="pi pi-trash"
                              kind="outlined"
                              size="small"
                              :disabled="locked"
                              :aria-label="`Remove ${field.key || 'this field'}`"
                              :data-testid="`${testId}-remove-${index}`"
                              @click="removeField(index)"
                            />
                          </Tooltip>
                          <IconButton
                            :icon="isExpanded(field.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                            kind="outlined"
                            size="small"
                            :aria-expanded="isExpanded(field.id)"
                            :aria-controls="`${testId}-body-${field.id}`"
                            :aria-label="`${isExpanded(field.id) ? 'Hide' : 'Show'} the settings for ${field.key || 'this field'}`"
                            :data-testid="`${testId}-toggle-${index}`"
                            @click="toggle(field.id)"
                          />
                        </Item.Actions>
                      </div>

                      <div
                        :id="`${testId}-body-${field.id}`"
                        class="grid transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        :class="isExpanded(field.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                      >
                        <div class="overflow-hidden">
                          <Message
                            v-if="field.raw"
                            severity="info"
                            class="mx-(--spacing-md) mt-(--spacing-xs)"
                            :label="`\`${field.key}\` uses JSON Schema this builder does not draw as a row. It is kept exactly as written, and edited in the schema.`"
                          />

                          <Item.List
                            v-else
                            class="mt-(--spacing-xs) border-t border-(--border-muted)"
                          >
                            <FieldRow
                              title="Name"
                              description="The key in the arguments object, and what the function reads."
                              :message="visibleError(field)"
                              message-kind="required"
                            >
                              <template #default="{ messageId }">
                                <InputText
                                  :id="`${testId}-key-${field.id}`"
                                  v-model="field.key"
                                  size="medium"
                                  placeholder="cookie_name"
                                  autocomplete="off"
                                  spellcheck="false"
                                  class="w-full font-code"
                                  aria-label="Name"
                                  :invalid="!!visibleError(field)"
                                  :aria-describedby="messageId"
                                  :disabled="locked"
                                  @blur="touch(field.id)"
                                />
                              </template>
                            </FieldRow>

                            <FieldRow
                              title="Type"
                              description="What the field accepts, and the control the form renders."
                            >
                              <Select
                                v-model="field.type"
                                size="medium"
                                class="w-full"
                                :disabled="locked"
                                :display-value="(value) => fieldTypeLabel(value)"
                                @update:model-value="onTypeChange(field)"
                              >
                                <Select.Trigger aria-label="Type" />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in FIELD_TYPES"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                            </FieldRow>

                            <FieldRow
                              title="Label"
                              description="How the field is named in the form. Falls back to the key."
                            >
                              <InputText
                                v-model="field.title"
                                size="medium"
                                :placeholder="field.key || 'Max Age (seconds)'"
                                autocomplete="off"
                                class="w-full"
                                aria-label="Label"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Description"
                              description="The guidance under the field."
                            >
                              <InputText
                                v-model="field.description"
                                size="medium"
                                placeholder="What this argument does"
                                autocomplete="off"
                                class="w-full"
                                aria-label="Description"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Required"
                              description="The form refuses to save without it."
                              kind="compact"
                            >
                              <Switch
                                v-model="field.required"
                                aria-label="Required"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              title="Default"
                              description="Seeds default_args, and what an instance starts from."
                              :kind="
                                field.type === 'boolean'
                                  ? 'compact'
                                  : field.type === 'array'
                                    ? 'wide'
                                    : 'field'
                              "
                            >
                              <Switch
                                v-if="field.type === 'boolean'"
                                v-model="field.default"
                                aria-label="Default"
                                :disabled="locked"
                              />
                              <Select
                                v-else-if="field.type === 'select'"
                                v-model="field.default"
                                size="medium"
                                class="w-full"
                                placeholder="No default"
                                :disabled="locked || field.options.length === 0"
                              >
                                <Select.Trigger aria-label="Default" />
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
                                :model-value="listToLines(field.default)"
                                :rows="3"
                                placeholder="One value per line"
                                class="w-full font-code"
                                aria-label="Default"
                                :disabled="locked"
                                @update:model-value="field.default = linesToList($event)"
                              />
                              <InputText
                                v-else
                                v-model="field.default"
                                size="medium"
                                :inputmode="
                                  field.type === 'integer' || field.type === 'number'
                                    ? 'numeric'
                                    : undefined
                                "
                                placeholder="No default"
                                autocomplete="off"
                                class="w-full font-code"
                                aria-label="Default"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'string'"
                              key="min-length"
                              title="Minimum length"
                            >
                              <InputText
                                v-model="field.minLength"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No minimum"
                                class="w-full"
                                aria-label="Minimum length"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'string'"
                              key="max-length"
                              title="Maximum length"
                            >
                              <InputText
                                v-model="field.maxLength"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No maximum"
                                class="w-full"
                                aria-label="Maximum length"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'string'"
                              key="pattern"
                              title="Pattern"
                              description="A regular expression the value has to match."
                              kind="wide"
                            >
                              <InputText
                                v-model="field.pattern"
                                size="medium"
                                placeholder="^[a-z0-9_-]+$"
                                autocomplete="off"
                                spellcheck="false"
                                class="w-full font-code"
                                aria-label="Pattern"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'integer' || field.type === 'number'"
                              key="minimum"
                              title="Minimum"
                            >
                              <InputText
                                v-model="field.minimum"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No minimum"
                                class="w-full"
                                aria-label="Minimum"
                                :disabled="locked"
                              />
                            </FieldRow>
                            <FieldRow
                              v-if="field.type === 'integer' || field.type === 'number'"
                              key="maximum"
                              title="Maximum"
                            >
                              <InputText
                                v-model="field.maximum"
                                size="medium"
                                inputmode="numeric"
                                placeholder="No maximum"
                                class="w-full"
                                aria-label="Maximum"
                                :disabled="locked"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'select'"
                              key="choices"
                              title="Choices"
                              description="One per line. These are the values the form offers."
                              kind="wide"
                            >
                              <Textarea
                                :model-value="listToLines(field.options)"
                                :rows="3"
                                placeholder="webp&#10;avif&#10;jpeg"
                                class="w-full font-code"
                                aria-label="Choices"
                                :disabled="locked"
                                @update:model-value="field.options = linesToList($event)"
                              />
                            </FieldRow>

                            <FieldRow
                              v-if="field.type === 'array'"
                              key="item-type"
                              title="List of"
                              description="The type of every value in the list."
                            >
                              <Select
                                v-model="field.itemType"
                                size="medium"
                                class="w-full"
                                :disabled="locked"
                                :display-value="
                                  (value) =>
                                    ITEM_TYPES.find((item) => item.value === value)?.label ?? value
                                "
                              >
                                <Select.Trigger aria-label="List of" />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in ITEM_TYPES"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                            </FieldRow>
                          </Item.List>
                        </div>
                      </div>
                    </Item>
                  </TransitionGroup>
                </Item.List>
              </template>
            </CardBox>
          </div>
        </div>
      </ResizablePanelPane>
    </ResizablePanelRoot>
  </div>
</template>
