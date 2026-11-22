<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { useChatMessageContext } from '../composables/use-chat-message-context'
  import ChatMessageReadAloud from '../parts/chat-message-read-aloud.vue'

  defineOptions({
    name: 'ChatMessageActions',
    inheritAttrs: false
  })

  export interface ChatMessageActionsProps {
    /** Accessible name of the action group. Empty uses the locale catalog (`Message actions`). */
    ariaLabel?: string
    /** Shows Read aloud after the slotted actions: it speaks the response with the browser's speech synthesis, turns into Stop while speaking, and is hidden where the browser has none. */
    showReadAloud?: boolean
    /** Text Read aloud speaks. Empty reads the text of the message's `StreamingResponse` content. */
    readAloudText?: string
  }

  const props = withDefaults(defineProps<ChatMessageActionsProps>(), {
    ariaLabel: '',
    showReadAloud: false,
    readAloudText: ''
  })

  defineSlots<{
    /** The icon actions, most used first: `CopyButton`, `ChatMessage.Feedback`, a regenerate `IconButton`, then any app action (Share). */
    default(): unknown
    /** After the actions and Read aloud: the `Sources` pill of the response. */
    trailing?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })
  const { status, contentText } = useChatMessageContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'chat-message-actions'
  )
  const speech = () => props.readAloudText || contentText()
</script>

<template>
  <div
    v-if="status === 'success'"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || t('chatMessage.actions')"
    :data-testid="testId"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-2xs) [&_[data-slot=sources-list]]:ms-(--spacing-sm)"
  >
    <slot />
    <ChatMessageReadAloud
      v-if="showReadAloud"
      :text="speech"
      :data-testid="`${testId}__read-aloud`"
    />
    <slot name="trailing" />
  </div>
</template>
