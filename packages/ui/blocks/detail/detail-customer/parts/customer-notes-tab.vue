<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import MessageThread from '@aziontech/ui/message-thread'
  import Textarea from '@aziontech/ui/textarea'
  import { computed, ref } from 'vue'

  import type { DetailCustomerNote } from '../detail-customer.vue'

  export interface CustomerNotesTabProps {
    /** Internal notes, oldest first. */
    notes: DetailCustomerNote[]
    /** The customer's name, for the list's accessible name. */
    name?: string
    /** Placeholder notes stand in for the list. */
    loading?: boolean
    /** A note is being saved. */
    saving?: boolean
  }

  const props = withDefaults(defineProps<CustomerNotesTabProps>(), {
    name: '',
    loading: false,
    saving: false
  })

  const emit = defineEmits<{
    'add-note': [event: MouseEvent, text: string]
  }>()

  const draft = defineModel<string>('draft', { default: '' })

  const tried = ref(false)
  const missing = computed(() => tried.value && draft.value.trim() === '')

  const onAdd = (event: MouseEvent) => {
    tried.value = true
    if (draft.value.trim() === '' || props.saving) return
    tried.value = false
    emit('add-note', event, draft.value.trim())
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <MessageThread
      v-if="loading || notes.length"
      :loading="loading"
      timestamp-format="relative"
      :aria-label="name ? `Notes on ${name}` : 'Notes'"
    >
      <MessageThread.Item
        v-for="note in notes"
        :key="note.id"
        type="note"
        from="agent"
        :author="note.author"
        :timestamp="note.at"
      >
        <p
          class="whitespace-pre-line"
          dir="auto"
        >
          {{ note.body }}
        </p>
      </MessageThread.Item>
    </MessageThread>

    <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
      <Field
        class="w-full"
        :invalid="missing"
        :disabled="loading"
      >
        <Field.Label>Add a note</Field.Label>
        <Textarea
          v-model="draft"
          auto-resize
          :min-rows="3"
          dir="auto"
        />
        <Field.Description>Only agents can read notes.</Field.Description>
        <Field.Error v-if="missing">Write the note first.</Field.Error>
      </Field>
      <Button
        label="Add note"
        variant="secondary"
        size="medium"
        :loading="saving"
        loading-label="Saving the note"
        :disabled="loading"
        @click="onAdd"
      />
    </div>
  </div>
</template>
