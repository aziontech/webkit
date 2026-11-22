<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import {
    fieldTypeLabel,
    fieldTypes,
    itemTypeLabel,
    itemTypes,
    linesToList,
    listToLines,
    resetForType
  } from '../lib/function-editor'

  export interface FunctionFieldSettingsProps {
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list the row belongs to. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionFieldSettingsProps>()

  const field = defineModel<FunctionEditorField>('field', { required: true })
</script>

<template>
  <Item.List>
    <SettingsRow
      stackable
      title="Name"
      description="The key in the arguments object, and what the service reads."
    >
      <div class="contents font-code">
        <Input
          :id="formId + '-key-' + field.id"
          v-model="field.key"
          size="medium"
          placeholder="cookie_name"
          autocomplete="off"
          :spellcheck="false"
          class="w-full"
          aria-label="Name"
          :invalid="!!fields.keyError(field)"
          :aria-describedby="fields.keyError(field) ? formId + '-message-' + field.id : undefined"
          @blur="fields.touch(field.id)"
        />
      </div>
      <FieldError
        v-if="fields.keyError(field)"
        :id="formId + '-message-' + field.id"
        >{{ fields.keyError(field) }}</FieldError
      >
    </SettingsRow>
    <SettingsRow
      stackable
      title="Type"
      description="What the field accepts, and the control the form renders."
    >
      <Select
        v-model="field.type"
        size="medium"
        class="w-full"
        :display-value="fieldTypeLabel"
        @update:model-value="resetForType(field)"
      >
        <Select.Trigger aria-label="Type" />
        <Select.Content>
          <Select.Item
            v-for="option in fieldTypes"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Item>
        </Select.Content>
      </Select>
    </SettingsRow>
    <SettingsRow
      stackable
      title="Label"
      description="How the field is named in the form. Falls back to the key."
    >
      <Input
        v-model="field.title"
        size="medium"
        :placeholder="field.key || 'Max Age (seconds)'"
        autocomplete="off"
        class="w-full"
        aria-label="Label"
      />
    </SettingsRow>
    <SettingsRow
      stackable
      title="Description"
      description="The guidance under the field."
    >
      <Input
        v-model="field.description"
        size="medium"
        placeholder="What this argument does"
        autocomplete="off"
        class="w-full"
        aria-label="Description"
      />
    </SettingsRow>
    <SettingsRow
      title="Required"
      description="The form refuses to save without it."
      variant="compact"
    >
      <Switch
        v-model="field.required"
        aria-label="Required"
      />
    </SettingsRow>
    <Item size="small">
      <div
        class="flex w-full gap-(--spacing-sm)"
        :class="field.type === 'array' ? 'flex-col items-stretch' : 'items-center'"
      >
        <Item.Content>
          <Item.Title>Default</Item.Title>
          <Item.Description>Seeds the arguments an instance starts from.</Item.Description>
        </Item.Content>
        <div
          class="flex"
          :class="
            field.type === 'boolean'
              ? 'justify-end'
              : field.type === 'array'
                ? 'w-full'
                : 'max-w-(--container-3xs) flex-1 justify-end'
          "
        >
          <Item.Actions class="w-full">
            <Switch
              v-if="field.type === 'boolean'"
              v-model="field.default"
              aria-label="Default"
            />
            <div
              v-else
              class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
            >
              <Select
                v-if="field.type === 'select'"
                v-model="field.default"
                size="medium"
                class="w-full"
                placeholder="No default"
                :disabled="field.options.length === 0"
              >
                <Select.Trigger aria-label="Default" />
                <Select.Content>
                  <Select.Item
                    v-for="option in field.options"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </Select.Item>
                </Select.Content>
              </Select>
              <div
                v-else-if="field.type === 'array'"
                class="contents font-code"
              >
                <Textarea
                  :model-value="listToLines(field.default)"
                  :rows="3"
                  placeholder="One value per line"
                  class="w-full"
                  aria-label="Default"
                  @update:model-value="field.default = linesToList($event)"
                />
              </div>
              <div
                v-else
                class="contents font-code"
              >
                <Input
                  v-model="field.default"
                  size="medium"
                  :inputmode="
                    field.type === 'integer' || field.type === 'number' ? 'numeric' : undefined
                  "
                  placeholder="No default"
                  autocomplete="off"
                  class="w-full"
                  aria-label="Default"
                />
              </div>
            </div>
          </Item.Actions>
        </div>
      </div>
    </Item>
    <SettingsRow
      stackable
      v-if="field.type === 'string'"
      title="Minimum length"
    >
      <Input
        v-model="field.minLength"
        size="medium"
        inputmode="numeric"
        placeholder="No minimum"
        class="w-full"
        aria-label="Minimum length"
      />
    </SettingsRow>
    <SettingsRow
      stackable
      key="settings-row-2"
      v-if="field.type === 'string'"
      title="Maximum length"
    >
      <Input
        v-model="field.maxLength"
        size="medium"
        inputmode="numeric"
        placeholder="No maximum"
        class="w-full"
        aria-label="Maximum length"
      />
    </SettingsRow>
    <SettingsRow
      key="settings-row-3"
      v-if="field.type === 'string'"
      title="Pattern"
      description="A regular expression the value has to match."
      variant="stacked"
    >
      <div class="contents font-code">
        <Input
          v-model="field.pattern"
          size="medium"
          placeholder="^[a-z0-9_-]+$"
          autocomplete="off"
          :spellcheck="false"
          class="w-full"
          aria-label="Pattern"
        />
      </div>
    </SettingsRow>
    <SettingsRow
      stackable
      key="settings-row-4"
      v-if="field.type === 'integer' || field.type === 'number'"
      title="Minimum"
    >
      <Input
        v-model="field.minimum"
        size="medium"
        inputmode="numeric"
        placeholder="No minimum"
        class="w-full"
        aria-label="Minimum"
      />
    </SettingsRow>
    <SettingsRow
      stackable
      key="settings-row-5"
      v-if="field.type === 'integer' || field.type === 'number'"
      title="Maximum"
    >
      <Input
        v-model="field.maximum"
        size="medium"
        inputmode="numeric"
        placeholder="No maximum"
        class="w-full"
        aria-label="Maximum"
      />
    </SettingsRow>
    <SettingsRow
      key="settings-row-6"
      v-if="field.type === 'select'"
      title="Choices"
      description="One per line. These are the values the form offers."
      variant="stacked"
    >
      <div class="contents font-code">
        <Textarea
          :model-value="listToLines(field.options)"
          :rows="3"
          placeholder="webp&#10;avif&#10;jpeg"
          class="w-full"
          aria-label="Choices"
          @update:model-value="field.options = linesToList($event)"
        />
      </div>
    </SettingsRow>
    <SettingsRow
      stackable
      key="settings-row-7"
      v-if="field.type === 'array'"
      title="List of"
      description="The type of every value in the list."
    >
      <Select
        v-model="field.itemType"
        size="medium"
        class="w-full"
        :display-value="itemTypeLabel"
      >
        <Select.Trigger aria-label="List of" />
        <Select.Content>
          <Select.Item
            v-for="option in itemTypes"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Item>
        </Select.Content>
      </Select>
    </SettingsRow>
  </Item.List>
</template>
