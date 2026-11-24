<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { UseFunctionFieldsReturn } from '../composables/use-function-fields'
  import type { FunctionEditorField } from '../edit-function.vue'
  import { fieldName, summary } from '../lib/function-editor'
  import FunctionFieldSettings from './function-field-settings.vue'

  export interface FunctionFieldItemProps {
    /** Position of the field in the list. */
    index: number
    /** How many fields the list holds. */
    count: number
    /** Prefix of the ids inside the argument form. */
    formId: string
    /** The field list the item belongs to. */
    fields: UseFunctionFieldsReturn
  }

  defineProps<FunctionFieldItemProps>()

  const field = defineModel<FunctionEditorField>('field', { required: true })

  const FIELD_BODY_CLASS =
    'grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance ' +
    'data-[state=open]:grid-rows-[1fr] ' +
    'motion-reduce:transition-none'
</script>

<template>
  <Item size="small">
    <div class="flex w-full flex-col items-stretch">
      <div
        class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-xs) px-(--spacing-md)"
        data-slot="field-header"
      >
        <div
          class="flex shrink-0 items-center"
          role="group"
          :aria-label="'Order of ' + fieldName(field)"
        >
          <IconButton
            :id="`${formId}-up-${field.id}`"
            icon="az az-arrow-up"
            variant="ghost"
            size="small"
            :disabled="index === 0"
            :aria-label="'Move ' + fieldName(field) + ' up'"
            @click="fields.move(index, -1)"
          />
          <IconButton
            :id="`${formId}-down-${field.id}`"
            icon="az az-arrow-down"
            variant="ghost"
            size="small"
            :disabled="index === count - 1"
            :aria-label="'Move ' + fieldName(field) + ' down'"
            @click="fields.move(index, 1)"
          />
        </div>
        <Item.Content class="min-w-32">
          <div class="flex min-w-0 flex-row items-baseline gap-(--spacing-xs)">
            <Item.Title class="min-w-0">
              <span
                :data-empty="!field.key || null"
                class="truncate font-code text-label-code-sm data-empty:text-(--text-muted)"
              >
                {{ field.key || 'Unnamed field' }}
              </span>
            </Item.Title>
            <div class="hidden min-w-0 md:block">
              <Item.Description>
                <span class="block truncate">{{ summary(field) }}</span>
              </Item.Description>
            </div>
          </div>
        </Item.Content>
        <Item.Actions class="ms-auto shrink-0">
          <Tag
            v-if="field.required"
            key="required"
            label="Required"
            severity="info"
            size="small"
          />
          <Tag
            v-if="fields.keyError(field)"
            key="needs-name"
            label="Needs a name"
            severity="warning"
            size="small"
          />
          <Tooltip content="Duplicate this field">
            <IconButton
              icon="az az-copy"
              variant="outline"
              size="small"
              :aria-label="'Duplicate ' + (field.key || 'this field')"
              @click="fields.duplicateField(index)"
            />
          </Tooltip>
          <Tooltip content="Remove this field">
            <IconButton
              icon="az az-trash"
              variant="outline"
              size="small"
              :aria-label="'Remove ' + (field.key || 'this field')"
              @click="fields.removeField(index)"
            />
          </Tooltip>
          <IconButton
            :icon="fields.isExpanded(field.id) ? 'az az-chevron-up' : 'az az-chevron-down'"
            variant="outline"
            size="small"
            :aria-expanded="fields.isExpanded(field.id)"
            :aria-controls="formId + '-body-' + field.id"
            :aria-label="
              (fields.isExpanded(field.id) ? 'Hide' : 'Show') +
              ' the settings for ' +
              (field.key || 'this field')
            "
            @click="fields.toggle(field.id)"
          />
        </Item.Actions>
      </div>
      <div
        :id="formId + '-body-' + field.id"
        :data-state="fields.isExpanded(field.id) ? 'open' : 'closed'"
        :class="FIELD_BODY_CLASS"
      >
        <div class="overflow-hidden">
          <div class="mt-(--spacing-xs) border-t border-(--border-muted)">
            <FunctionFieldSettings
              v-model:field="field"
              :form-id="formId"
              :fields="fields"
            />
          </div>
        </div>
      </div>
    </div>
  </Item>
</template>
