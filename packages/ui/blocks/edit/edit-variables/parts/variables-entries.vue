<script setup lang="ts">
  import AttributeEditor from '@aziontech/ui/attribute-editor'
  import Button from '@aziontech/ui/button'
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import FieldError from '@aziontech/ui/field-error'
  import IconButton from '@aziontech/ui/icon-button'
  import InputGroupAddon from '@aziontech/ui/input-group-addon'
  import InputGroupInput from '@aziontech/ui/input-group-input'
  import InputGroupRoot from '@aziontech/ui/input-group-root'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Textarea from '@aziontech/ui/textarea'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import Tooltip from '@aziontech/ui/tooltip'

  import { useVariablesFormContext, type VariablesEntry } from '../composables/use-variables-form'
  import { SECRET_MASK } from '../lib/variables-rows'

  export interface VariablesEntriesProps {
    /** One saved variable is being edited: no import tools, at most one row. */
    editing?: boolean
    /** The edited variable is a saved secret: its Secret checkbox is locked. */
    secretLocked?: boolean
  }

  withDefaults(defineProps<VariablesEntriesProps>(), { editing: false, secretLocked: false })

  defineSlots<{
    /** Tools placed before Upload. */
    toolbar(): unknown
    /** Content placed above the rows in the Form view. */
    panel(): unknown
  }>()

  const {
    formId,
    entries,
    view,
    jsonText,
    jsonError,
    submitted,
    noVariables,
    canAdd,
    createEntry,
    keyError,
    valueError,
    setKey,
    pasteIntoKey,
    pickEnvFile
  } = useVariablesFormContext()

  const SECRET_HINT =
    'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'
  const VIEW_OPTIONS = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]

  const fieldId = (entry: VariablesEntry, part: string) => `${formId}-${part}-${entry.id}`
  const messageId = (entry: VariablesEntry, part: string) => `${fieldId(entry, part)}-message`
  const secretTooltip = (entry: VariablesEntry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry: VariablesEntry) =>
    entry.secret ? 'Unmark as secret' : 'Mark as secret'
</script>

<template>
  <SettingsGroup
    label="Variables"
    hint="Store values your services read at runtime. Add one row per variable, or import a .env file."
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div
        v-if="!editing"
        class="flex items-center gap-(--spacing-xs) self-end"
      >
        <slot name="toolbar" />
        <Button
          label="Upload"
          icon="az az-upload"
          variant="outline"
          size="medium"
          @click="pickEnvFile"
        />
        <ToggleGroup
          v-model="view"
          :options="VIEW_OPTIONS"
          aria-label="Variables view"
          size="medium"
        />
      </div>

      <template v-if="view === 'Form'">
        <slot name="panel" />
        <AttributeEditor
          v-model:items="entries"
          :new-item="createEntry"
          :min-items="1"
          :limit="editing ? 1 : undefined"
          :add-disabled="!canAdd"
          add-button-label="Add variable"
          remove-button-label="Remove variable"
          aria-label="Variables"
        >
          <template #row="{ index, remove, removable, removeLabel }">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <Field>
                <InputGroupRoot
                  size="large"
                  required
                  :invalid="!!keyError(entries[index])"
                >
                  <InputGroupAddon>
                    <span class="inline-block w-20">
                      <Field.Label :for="fieldId(entries[index], 'key')">Key</Field.Label>
                    </span>
                  </InputGroupAddon>
                  <InputGroupInput
                    :id="fieldId(entries[index], 'key')"
                    :model-value="entries[index].key"
                    placeholder="MY_VARIABLE"
                    autocomplete="off"
                    spellcheck="false"
                    :invalid="!!keyError(entries[index])"
                    :aria-describedby="
                      keyError(entries[index]) ? messageId(entries[index], 'key') : undefined
                    "
                    @update:model-value="(value) => setKey(entries[index], value)"
                    @paste="pasteIntoKey($event, index)"
                  />
                  <Tooltip
                    v-if="removable"
                    content="Remove variable"
                  >
                    <IconButton
                      icon="az az-trash"
                      variant="outline"
                      size="large"
                      :aria-label="removeLabel"
                      @click="remove"
                    />
                  </Tooltip>
                </InputGroupRoot>
              </Field>

              <Field>
                <InputGroupRoot
                  size="large"
                  required
                  :invalid="!!valueError(entries[index])"
                >
                  <InputGroupAddon>
                    <span class="inline-block w-20">
                      <Field.Label :for="fieldId(entries[index], 'value')">Value</Field.Label>
                    </span>
                  </InputGroupAddon>
                  <InputGroupInput
                    :id="fieldId(entries[index], 'value')"
                    v-model="entries[index].value"
                    :type="entries[index].secret && !entries[index].visible ? 'password' : 'text'"
                    :placeholder="entries[index].secret ? SECRET_MASK : 'my-variable-value'"
                    autocomplete="off"
                    spellcheck="false"
                    :invalid="!!valueError(entries[index])"
                    :aria-describedby="
                      valueError(entries[index]) ? messageId(entries[index], 'value') : undefined
                    "
                  />
                  <Tooltip
                    v-if="entries[index].secret"
                    :content="entries[index].visible ? 'Hide value' : 'Show value'"
                  >
                    <IconButton
                      :icon="entries[index].visible ? 'az az-eye-off' : 'az az-eye'"
                      variant="outline"
                      size="large"
                      :aria-label="entries[index].visible ? 'Hide value' : 'Show value'"
                      :aria-pressed="entries[index].visible"
                      @click="entries[index].visible = !entries[index].visible"
                    />
                  </Tooltip>
                  <InputGroupAddon>
                    <Tooltip :content="secretTooltip(entries[index])">
                      <Field
                        orientation="horizontal"
                        :disabled="secretLocked"
                      >
                        <Field.Label :for="fieldId(entries[index], 'secret')">Secret</Field.Label>
                        <Checkbox
                          v-model="entries[index].secret"
                          :id="fieldId(entries[index], 'secret')"
                          :aria-label="secretAriaLabel(entries[index])"
                        />
                      </Field>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroupRoot>
              </Field>
            </div>

            <FieldError
              v-if="keyError(entries[index])"
              key="key-error"
              :id="messageId(entries[index], 'key')"
              >{{ keyError(entries[index])?.message }}</FieldError
            >
            <FieldError
              v-if="valueError(entries[index])"
              key="value-error"
              :id="messageId(entries[index], 'value')"
              >{{ valueError(entries[index])?.message }}</FieldError
            >
          </template>
          <template #limit>Edit one variable at a time.</template>
          <template #info>
            <FieldDescription v-if="!editing"
              >Paste JSON or .env contents into an empty key field to create one row per
              variable.</FieldDescription
            >
          </template>
        </AttributeEditor>
      </template>

      <template v-else>
        <Textarea
          v-model="jsonText"
          aria-label="Variables JSON"
          :invalid="!!jsonError"
          :aria-describedby="jsonError ? formId + '-json-message' : undefined"
        />
        <FieldDescription>
          Use a JSON object format, for example:
          <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
        </FieldDescription>
        <FieldError
          v-if="jsonError"
          :id="formId + '-json-message'"
          >{{ jsonError }}</FieldError
        >
      </template>

      <FieldDescription>{{ SECRET_HINT }}</FieldDescription>
      <FieldError v-if="submitted && noVariables">Add at least one variable.</FieldError>
    </div>
  </SettingsGroup>
</template>
