<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import MarkdownEditor, { type MarkdownEditorMention } from '@aziontech/webkit/markdown-editor'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed } from 'vue'

  export interface TicketDescriptionFieldProps {
    /** The agents the @ menu offers. */
    mentions: MarkdownEditorMention[]
    /** Locks the editor and the attachments while the request runs. */
    disabled?: boolean
    /** Why the description is missing; empty when valid. */
    error?: string
  }

  withDefaults(defineProps<TicketDescriptionFieldProps>(), {
    disabled: false,
    error: ''
  })

  const description = defineModel<string>({ default: '' })
  const attachments = defineModel<File[]>('attachments', { default: () => [] })

  const picker = useFilePicker({ multiple: true })

  const items = computed(() => attachments.value.map((file) => ({ file })))

  const attach = async () => {
    const files = await picker.open()
    if (files.length) attachments.value = [...attachments.value, ...files]
  }

  const remove = (index: number) => {
    attachments.value = attachments.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <SettingsRow
    required
    variant="stacked"
    title="Description"
    description="What the customer asked, in their words where you can. Type @ to mention a teammate."
  >
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <MarkdownEditor
        id="create-ticket-description"
        v-model="description"
        aria-label="Description"
        :mentions="mentions"
        :min-rows="6"
        :disabled="disabled"
        :invalid="Boolean(error)"
        :aria-describedby="error ? 'create-ticket-description-message' : undefined"
        required
      >
        <template #footer>
          <div class="flex min-w-0 flex-1 flex-wrap items-center gap-(--spacing-xs)">
            <IconButton
              icon="az az-paperclip"
              aria-label="Attach files"
              variant="ghost"
              size="medium"
              :disabled="disabled"
              @click="attach"
            />
            <FileTokenGroup
              v-if="items.length"
              :items="items"
              orientation="horizontal"
              :readonly="disabled"
              aria-label="Attachments"
              class="min-w-0 flex-1"
              @remove="(_event, { index }) => remove(index)"
            />
          </div>
        </template>
      </MarkdownEditor>
      <FieldError
        v-if="error"
        id="create-ticket-description-message"
        >{{ error }}</FieldError
      >
    </div>
  </SettingsRow>
</template>
