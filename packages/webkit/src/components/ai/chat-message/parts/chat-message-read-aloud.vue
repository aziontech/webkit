<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { LazyTooltip } from '../lib/lazy-overlays'

  defineOptions({
    name: 'ChatMessageReadAloud',
    inheritAttrs: false
  })

  export interface ChatMessageReadAloudProps {
    /** Reads the text to speak at the moment the reader presses the control. */
    text: () => string
  }

  const props = defineProps<ChatMessageReadAloudProps>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ chatMessage: en.chatMessage })

  const supported = ref(false)
  const speaking = ref(false)
  let utterance: SpeechSynthesisUtterance | null = null

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'chat-message-read-aloud'
  })
  const label = computed<string>(() =>
    speaking.value ? t('chatMessage.stopReading') : t('chatMessage.readAloud')
  )

  function finish(): void {
    speaking.value = false
    utterance = null
  }

  function stop(): void {
    if (!utterance) return
    utterance.onend = null
    utterance.onerror = null
    window.speechSynthesis.cancel()
    finish()
  }

  function speak(): void {
    const text = props.text()
    if (!text) return
    window.speechSynthesis.cancel()
    const next = new SpeechSynthesisUtterance(text)
    next.lang = locale.value
    next.onend = finish
    next.onerror = finish
    utterance = next
    speaking.value = true
    window.speechSynthesis.speak(next)
  }

  function onClick(): void {
    if (speaking.value) stop()
    else speak()
  }

  onMounted(() => {
    supported.value = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function'
  })

  onScopeDispose(stop)
</script>

<template>
  <LazyTooltip
    v-if="supported"
    :content="label"
  >
    <IconButton
      v-bind="$attrs"
      :icon="speaking ? 'az az-circle-stop' : 'az az-volume-up'"
      :aria-label="label"
      :data-testid="testId"
      :data-speaking="speaking || null"
      variant="ghost"
      size="medium"
      @click="onClick"
    />
  </LazyTooltip>
</template>
