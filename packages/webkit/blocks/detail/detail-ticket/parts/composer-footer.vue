<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type {
    DetailTicketReplyMode,
    DetailTicketResponse,
    DetailTicketSendPayload
  } from '../detail-ticket.vue'

  export interface ComposerFooterProps {
    /** Reply to the customer or internal note. */
    mode: DetailTicketReplyMode
    /** Files attached to the draft. */
    files: File[]
    /** Saved replies Insert response offers. */
    responses: DetailTicketResponse[]
    /** The draft holds nothing to send. */
    empty: boolean
    /** The draft is being sent. */
    sending: boolean
    /** The composer cannot be used yet. */
    disabled: boolean
  }

  const props = defineProps<ComposerFooterProps>()

  const emit = defineEmits<{
    attach: [event: MouseEvent]
    insert: [event: MouseEvent | KeyboardEvent, response: DetailTicketResponse]
    'remove-file': [event: MouseEvent, index: number]
    send: [event: MouseEvent | KeyboardEvent, status: DetailTicketSendPayload['status']]
  }>()

  const sendItems: SplitButtonItem[] = [
    { label: 'Send and set Pending', value: 'Pending', icon: 'az az-clock' },
    { label: 'Send and set Solved', value: 'Solved', icon: 'az az-circle-check' }
  ]

  const tokens = computed(() => props.files.map((file) => ({ file })))
  const busy = computed(() => props.disabled || props.sending)

  const onInsert = (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    const response = props.responses.find((entry) => entry.key === value)
    if (response) emit('insert', event, response)
  }

  const onSendItem = (event: MouseEvent | KeyboardEvent, item: SplitButtonItem) =>
    emit('send', event, item.value === 'Solved' ? 'Solved' : 'Pending')
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <FileTokenGroup
      v-if="tokens.length"
      :items="tokens"
      orientation="horizontal"
      :readonly="busy"
      aria-label="Attached files"
      @remove="(event, payload) => emit('remove-file', event, payload.index)"
    />
    <div class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <Tooltip content="Attach files">
        <IconButton
          icon="az az-paperclip"
          variant="ghost"
          size="medium"
          aria-label="Attach files"
          :disabled="busy"
          @click="(event: MouseEvent) => emit('attach', event)"
        />
      </Tooltip>
      <DropdownMenuRoot
        side="top"
        align="start"
        :disabled="busy || !responses.length"
        @select="onInsert"
      >
        <DropdownMenuTrigger>
          <Button
            label="Insert response"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="ghost"
            size="medium"
            :disabled="busy || !responses.length"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="response in responses"
          :key="response.key"
          :value="response.key"
          :label="response.label"
        />
      </DropdownMenuRoot>
      <div class="ms-auto flex shrink-0 items-center">
        <SplitButton
          v-if="mode === 'reply'"
          label="Send"
          icon="az az-send"
          :items="sendItems"
          size="medium"
          :loading="sending"
          :disabled="disabled || empty"
          @click="(event: MouseEvent) => emit('send', event, '')"
          @item-click="onSendItem"
        />
        <Button
          v-else
          label="Add note"
          icon="az az-lock"
          variant="secondary"
          size="medium"
          :loading="sending"
          loading-label="Adding the note"
          :disabled="disabled || empty"
          disabled-reason="Write the note first."
          @click="(event: MouseEvent) => emit('send', event, '')"
        />
      </div>
    </div>
  </div>
</template>
