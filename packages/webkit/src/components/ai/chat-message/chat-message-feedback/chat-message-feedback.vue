<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import type { ChatMessageFeedbackValue } from '../injection-key'

  export type { ChatMessageFeedbackValue }

  defineOptions({
    name: 'ChatMessageFeedback',
    inheritAttrs: false
  })

  export interface ChatMessageFeedbackProps {
    /** The choice is being sent; both thumbs are inert and the status line reads `Submitting feedback`. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<ChatMessageFeedbackProps>(), {
    loading: false
  })

  const model = defineModel<ChatMessageFeedbackValue | null>({ default: null })

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-chat-message-feedback'
  )
  const submitted = computed<boolean>(() => model.value !== null && !props.loading)
  const statusText = computed<string>(() => {
    if (props.loading) return t('chatMessage.feedbackSubmitting')
    if (submitted.value) return t('chatMessage.feedbackSubmitted')
    return ''
  })

  function choose(value: ChatMessageFeedbackValue): void {
    if (props.loading || model.value !== null) return
    model.value = value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="t('chatMessage.feedback')"
    :data-testid="testId"
    :data-value="model ?? undefined"
    :data-loading="loading || null"
    class="inline-flex items-center gap-(--spacing-2xs)"
  >
    <Tooltip :content="t('chatMessage.helpful')">
      <IconButton
        :icon="model === 'up' ? 'ai ai-thumbs-up-fill' : 'ai ai-thumbs-up'"
        :ariaLabel="t('chatMessage.helpful')"
        :aria-pressed="model === 'up' ? 'true' : 'false'"
        :disabled="model === 'down'"
        :loading="loading && model === 'up'"
        variant="ghost"
        size="small"
        :data-testid="`${testId}__up`"
        @click="choose('up')"
      />
    </Tooltip>
    <Tooltip :content="t('chatMessage.notHelpful')">
      <IconButton
        :icon="model === 'down' ? 'ai ai-thumbs-down-fill' : 'ai ai-thumbs-down'"
        :ariaLabel="t('chatMessage.notHelpful')"
        :aria-pressed="model === 'down' ? 'true' : 'false'"
        :disabled="model === 'up'"
        :loading="loading && model === 'down'"
        variant="ghost"
        size="small"
        :data-testid="`${testId}__down`"
        @click="choose('down')"
      />
    </Tooltip>
    <span
      role="status"
      :data-testid="`${testId}__status`"
      class="ps-(--spacing-xs) text-body-xs text-(--text-muted)"
    >
      {{ statusText }}
    </span>
  </div>
</template>
