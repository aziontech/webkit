<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import type { MarkdownEditorMention } from '@aziontech/webkit/markdown-editor'
  import PriorityTag from '@aziontech/webkit/priority-tag'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import { channelOptions, priorityOptions, typeOptions } from './create-ticket.ticket-form'
  import type {
    CreateTicketChannel,
    CreateTicketPriority,
    CreateTicketType
  } from './create-ticket.vue'
  import TicketDescriptionField from './create-ticket-ticket-description-field.vue'

  export interface TicketRequestBandProps {
    /** The agents the description's @ menu offers. */
    mentions: MarkdownEditorMention[]
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** The messages a submit found, empty for a valid field. */
    errors: { subject: string; description: string }
  }

  withDefaults(defineProps<TicketRequestBandProps>(), {
    disabled: false
  })

  const subject = defineModel<string>('subject', { default: '' })
  const description = defineModel<string>('description', { default: '' })
  const attachments = defineModel<File[]>('attachments', { default: () => [] })
  const channel = defineModel<CreateTicketChannel | ''>('channel', { default: '' })
  const type = defineModel<CreateTicketType | ''>('type', { default: '' })
  const priority = defineModel<CreateTicketPriority | ''>('priority', { default: '' })

  const { t } = useLocale()
</script>

<template>
  <SettingsGroup
    label="Request"
    hint="What the customer needs, in the words the team will read first."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            required
            stackable
            title="Subject"
            description="One line that says what is wrong or what is needed."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Input
                v-model="subject"
                size="large"
                class="w-full"
                aria-label="Subject"
                autocomplete="off"
                required
                :disabled="disabled"
                :invalid="Boolean(errors.subject)"
                :aria-describedby="errors.subject ? 'create-ticket-subject-message' : undefined"
              />
              <FieldError
                v-if="errors.subject"
                id="create-ticket-subject-message"
                >{{ errors.subject }}</FieldError
              >
            </div>
          </SettingsRow>
          <TicketDescriptionField
            v-model="description"
            v-model:attachments="attachments"
            :mentions="mentions"
            :disabled="disabled"
            :error="errors.description"
          />
          <SettingsRow
            stackable
            title="Channel"
            description="How the request reached the team."
          >
            <Select
              v-model="channel"
              size="large"
              placeholder="Select a channel"
              aria-label="Channel"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in channelOptions"
                  :key="option.value"
                  :value="option.value"
                  :icon="option.icon"
                  >{{ option.value }}</Select.Item
                >
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Type"
            description="Incidents and problems open the incident workflow."
          >
            <Select
              v-model="type"
              size="large"
              placeholder="Select a type"
              aria-label="Type"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in typeOptions"
                  :key="option"
                  :value="option"
                  >{{ option }}</Select.Item
                >
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Priority"
            description="Sets the response target. Urgent pages the on-call agent."
          >
            <Select
              v-model="priority"
              size="large"
              placeholder="Select a priority"
              aria-label="Priority"
              :display-value="(value) => (value ? t(`priorityTag.${value}`) : '')"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in priorityOptions"
                  :key="option"
                  :value="option"
                  ><PriorityTag :priority="option"
                /></Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
