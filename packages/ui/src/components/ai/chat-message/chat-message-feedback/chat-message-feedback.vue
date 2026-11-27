<script setup lang="ts">
  import { computed, defineAsyncComponent, h, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import type { ChatMessageFeedbackValue } from '../injection-key'
  import { feedbackIcon } from '../lib/feedback-icon'

  export type { ChatMessageFeedbackValue }

  defineOptions({
    name: 'ChatMessageFeedback',
    inheritAttrs: false
  })

  export interface ChatMessageFeedbackProps {
    /** The choice is being sent: the Feedback button shows a spinner and the hidden status line reads `Submitting feedback`. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<ChatMessageFeedbackProps>(), {
    loading: false
  })

  const model = defineModel<ChatMessageFeedbackValue | null>({ default: null })

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'chat-message-feedback'
  )
  const statusText = computed<string>(() => {
    if (props.loading) return t('chatMessage.feedbackSubmitting')
    if (model.value !== null) return t('chatMessage.feedbackThanks')
    return ''
  })

  const ChatMessageFeedbackMenu = defineAsyncComponent({
    loader: () => import('../parts/chat-message-feedback-menu.vue'),
    loadingComponent: {
      inheritAttrs: false,
      render: () =>
        h(IconButton, {
          icon: feedbackIcon(model.value),
          ariaLabel: t('chatMessage.feedback'),
          variant: 'ghost',
          size: 'medium',
          disabled: true
        })
    },
    delay: 0
  })

  function choose(value: ChatMessageFeedbackValue): void {
    if (props.loading) return
    model.value = model.value === value ? null : value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-value="model ?? undefined"
    :data-loading="loading || null"
    class="inline-flex items-center"
  >
    <ChatMessageFeedbackMenu
      :feedback="model"
      :loading="loading"
      :data-testid="testId"
      @select="
        (_event: MouseEvent | KeyboardEvent, value: ChatMessageFeedbackValue) => choose(value)
      "
    />
    <span
      role="status"
      :data-testid="`${testId}__status`"
      class="sr-only"
    >
      {{ statusText }}
    </span>
  </div>
</template>
