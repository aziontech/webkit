<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import FileDropzone from '@aziontech/ui/file-dropzone'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'
  import MultiSelect from '@aziontech/ui/multi-select'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { useFilePicker } from '@aziontech/ui/use-file-picker'
  import { computed, ref, useId } from 'vue'

  import type {
    DetailTicketAgent,
    DetailTicketDraft,
    DetailTicketReplyMode,
    DetailTicketRequester,
    DetailTicketResponse,
    DetailTicketSendPayload
  } from '../detail-ticket.vue'
  import ComposerFooter from './composer-footer.vue'

  export interface TicketComposerProps {
    /** The customer a reply goes to. */
    requester?: DetailTicketRequester
    /** Teammates to mention and copy. */
    agents: DetailTicketAgent[]
    /** Saved replies Insert response offers. */
    responses: DetailTicketResponse[]
    /** The ticket is solved: the composer offers Reopen instead. */
    solved?: boolean
    /** The composer cannot be used yet (the ticket is loading). */
    disabled?: boolean
    /** The draft is being sent. */
    sending?: boolean
    /** Why the last send failed. */
    sendError?: string
  }

  const props = withDefaults(defineProps<TicketComposerProps>(), {
    requester: undefined,
    solved: false,
    disabled: false,
    sending: false,
    sendError: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, payload: DetailTicketSendPayload]
    reopen: [event: MouseEvent]
  }>()

  const draft = defineModel<DetailTicketDraft>('draft', { required: true })

  const noteId = useId()
  const titleId = useId()
  const picker = useFilePicker({ multiple: true })
  const lastStatus = ref<DetailTicketSendPayload['status']>('')
  const extraAddresses = ref<string[]>([])

  const patch = (change: Partial<DetailTicketDraft>) => {
    draft.value = { ...draft.value, ...change }
  }

  const modes = [
    { label: 'Reply', value: 'reply' },
    { label: 'Internal note', value: 'note' }
  ]

  const mode = computed<DetailTicketReplyMode>({
    get: () => draft.value.mode,
    set: (value) => patch({ mode: value ?? 'reply' })
  })
  const cc = computed<string[]>({
    get: () => draft.value.cc,
    set: (value) => patch({ cc: value })
  })
  const body = computed<string>({
    get: () => draft.value.body,
    set: (value) => patch({ body: value })
  })

  const isNote = computed(() => draft.value.mode === 'note')
  const empty = computed(() => !draft.value.body.trim() && !draft.value.files.length)
  const busy = computed(() => props.disabled || props.sending)
  const mentions = computed(() =>
    props.agents.map((agent) => ({
      value: agent.handle,
      label: agent.name,
      description: agent.email
    }))
  )
  const addresses = computed(() => [
    ...new Set([...props.agents.map((agent) => agent.email), ...extraAddresses.value, ...cc.value])
  ])

  const addAddress = (_event: MouseEvent | KeyboardEvent, value: string) => {
    extraAddresses.value = [...extraAddresses.value, value]
    cc.value = [...cc.value, value]
  }

  const addFiles = (files: File[]) => {
    if (files.length) patch({ files: [...draft.value.files, ...files] })
  }

  const attach = async () => addFiles(await picker.open())

  const removeFile = (_event: MouseEvent, index: number) =>
    patch({ files: draft.value.files.filter((_, position) => position !== index) })

  const insert = (_event: MouseEvent | KeyboardEvent, response: DetailTicketResponse) =>
    patch({
      body: draft.value.body.trim() ? `${draft.value.body}\n\n${response.body}` : response.body
    })

  const send = (event: MouseEvent | KeyboardEvent, status: DetailTicketSendPayload['status']) => {
    lastStatus.value = status
    emit('send', event, { ...draft.value, status: isNote.value ? '' : status })
  }
</script>

<template>
  <section
    class="flex min-w-0 flex-col gap-(--spacing-sm)"
    :aria-labelledby="titleId"
  >
    <h2
      :id="titleId"
      class="sr-only"
    >
      {{ isNote ? 'Internal note' : 'Reply' }}
    </h2>

    <div
      v-if="solved"
      class="flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
    >
      <p class="text-body-md text-(--text-muted)">
        This ticket is solved. Reopen it to reply to the customer or add a note.
      </p>
      <Button
        label="Reopen"
        icon="az az-lock-open"
        variant="outline"
        size="medium"
        @click="(event: MouseEvent) => emit('reopen', event)"
      />
    </div>

    <div
      v-else
      class="relative flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) data-[mode=note]:border-(--warning-border)"
      :data-mode="draft.mode"
      :aria-busy="sending || undefined"
    >
      <div class="flex flex-wrap items-center gap-(--spacing-sm)">
        <ToggleGroup
          v-model="mode"
          :options="modes"
          size="small"
          aria-label="Message type"
          :disabled="busy"
        />
        <p
          v-if="isNote"
          :id="noteId"
          class="flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          <i
            class="az az-lock text-(--warning-mark)"
            aria-hidden="true"
          />
          Only your team can see internal notes.
        </p>
      </div>

      <div
        v-if="!isNote && requester"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <p class="min-w-0 truncate text-body-sm text-(--text-default)">
          <span class="text-(--text-muted)">To: </span>
          <bdi>{{ requester.name }}</bdi>
          <span
            class="text-(--text-muted)"
            dir="ltr"
          >
            &lt;{{ requester.email }}&gt;</span
          >
        </p>
        <Field orientation="responsive">
          <Field.Label>Cc</Field.Label>
          <MultiSelect
            v-model="cc"
            variant="chips"
            :chip-limit="3"
            searchable
            allow-custom
            placeholder="Add people to copy"
            :disabled="busy"
            @create="addAddress"
          >
            <MultiSelect.Trigger />
            <MultiSelect.Content>
              <MultiSelect.Item
                v-for="address in addresses"
                :key="address"
                :value="address"
                >{{ address }}</MultiSelect.Item
              >
            </MultiSelect.Content>
          </MultiSelect>
        </Field>
      </div>

      <Alert
        v-if="sendError"
        severity="danger"
        size="small"
        :label="sendError"
        action-label="Retry"
        @action="(event: MouseEvent) => send(event, lastStatus)"
      />

      <MarkdownEditor
        v-model="body"
        :aria-label="isNote ? 'Internal note' : 'Reply to the customer'"
        :aria-describedby="isNote ? noteId : undefined"
        :placeholder="isNote ? 'Write a note for your team, @ to mention' : 'Write a reply'"
        :mentions="mentions"
        :readonly="sending"
        :disabled="disabled"
        :min-rows="5"
      >
        <template #footer>
          <ComposerFooter
            :mode="draft.mode"
            :files="draft.files"
            :responses="responses"
            :empty="empty"
            :sending="sending"
            :disabled="disabled"
            @attach="attach"
            @insert="insert"
            @remove-file="removeFile"
            @send="send"
          />
        </template>
      </MarkdownEditor>

      <FileDropzone
        variant="overlay"
        title="Drop files to attach them"
        :disabled="busy"
        @drop="(_event, files) => addFiles(files)"
      />
    </div>
  </section>
</template>
