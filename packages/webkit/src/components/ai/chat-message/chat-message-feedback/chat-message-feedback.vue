<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import type { ChatMessageFeedbackValue } from '../injection-key'

  export type { ChatMessageFeedbackValue }

  defineOptions({
    name: 'ChatMessageFeedback',
    inheritAttrs: false
  })

  export interface ChatMessageFeedbackProps {
    /** The choice is being sent: the chosen thumb shows a spinner and the hidden status line reads `Submitting feedback`. */
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

  function choose(value: ChatMessageFeedbackValue): void {
    if (props.loading) return
    model.value = model.value === value ? null : value
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
    <Tooltip
      v-if="model !== 'down'"
      :content="t('chatMessage.goodResponse')"
    >
      <IconButton
        :icon="model === 'up' ? 'az az-thumbs-up-fill' : 'az az-thumbs-up'"
        :ariaLabel="t('chatMessage.goodResponse')"
        :aria-pressed="model === 'up' ? 'true' : 'false'"
        :loading="loading && model === 'up'"
        variant="ghost"
        size="medium"
        :data-testid="`${testId}__up`"
        @click="choose('up')"
      />
    </Tooltip>
    <Tooltip
      key="tooltip-2"
      v-if="model !== 'up'"
      :content="t('chatMessage.badResponse')"
    >
      <IconButton
        :icon="model === 'down' ? 'az az-thumbs-down-fill' : 'az az-thumbs-down'"
        :ariaLabel="t('chatMessage.badResponse')"
        :aria-pressed="model === 'down' ? 'true' : 'false'"
        :loading="loading && model === 'down'"
        variant="ghost"
        size="medium"
        :data-testid="`${testId}__down`"
        @click="choose('down')"
      />
    </Tooltip>
    <span
      role="status"
      :data-testid="`${testId}__status`"
      class="sr-only"
    >
      {{ statusText }}
    </span>
  </div>
</template>
