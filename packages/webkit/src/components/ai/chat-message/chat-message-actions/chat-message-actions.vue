<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import { useChatMessageContext } from '../composables/use-chat-message-context'

  defineOptions({
    name: 'ChatMessageActions',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name of the action group. Empty uses the locale catalog (`Message actions`). */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: ''
  })

  defineSlots<{
    /** Up to five icon actions, most used first: `CopyButton`, a regenerate `IconButton`, `ChatMessage.Feedback`. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })
  const { state } = useChatMessageContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-chat-message-actions'
  )
</script>

<template>
  <div
    v-if="state === 'complete'"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || t('chatMessage.actions')"
    :data-testid="testId"
    class="flex flex-wrap items-center gap-(--spacing-xxs)"
  >
    <slot />
  </div>
</template>
