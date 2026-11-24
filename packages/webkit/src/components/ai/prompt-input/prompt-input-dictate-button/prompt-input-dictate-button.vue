<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'

  defineOptions({
    name: 'PromptInputDictateButton',
    inheritAttrs: false
  })

  /** Who turns speech into text: the browser's speech recognition, or the app. */
  export type PromptInputDictateTranscriber = 'browser' | 'app'

  export interface PromptInputDictateButtonProps {
    /** Accessible name while idle. Empty uses the locale catalog (`Dictate`). */
    ariaLabel?: string
    /** Language to listen in, a BCP 47 tag. Empty uses the provider locale. */
    lang?: string
    /** `browser` uses the Web Speech API and hides the control where it is missing; `app` only toggles `listening` and the app writes the text. */
    transcriber?: PromptInputDictateTranscriber
  }

  const props = withDefaults(defineProps<PromptInputDictateButtonProps>(), {
    ariaLabel: '',
    lang: '',
    transcriber: 'browser'
  })

  /** Whether dictation is on. */
  const listening = defineModel<boolean>('listening', { default: false })

  interface RecognitionAlternative {
    transcript: string
  }
  interface RecognitionResult {
    isFinal: boolean
    readonly length: number
    [index: number]: RecognitionAlternative
  }
  interface RecognitionResultEvent {
    resultIndex: number
    results: { readonly length: number; [index: number]: RecognitionResult }
  }
  interface Recognition {
    lang: string
    continuous: boolean
    interimResults: boolean
    onresult: ((event: RecognitionResultEvent) => void) | null
    onerror: ((event: { error: string }) => void) | null
    onend: (() => void) | null
    start: () => void
    stop: () => void
    abort: () => void
  }
  type RecognitionConstructor = new () => Recognition

  const attrs = useAttrs()
  const { t, locale } = useLocale({ promptInput: en.promptInput })
  const { disabled, voiceActive, getText, setText } = usePromptInputContext()

  const engine = ref<RecognitionConstructor | null>(null)
  const status = ref<string>('')
  let recognition: Recognition | null = null
  let base = ''
  let finals = ''
  let failure = ''

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-dictate-button'
  )
  const available = computed<boolean>(() => props.transcriber === 'app' || !!engine.value)

  const isRecognitionConstructor = (value: unknown): value is RecognitionConstructor =>
    typeof value === 'function'

  onMounted(() => {
    const found: unknown =
      Reflect.get(window, 'SpeechRecognition') ?? Reflect.get(window, 'webkitSpeechRecognition')
    engine.value = isRecognitionConstructor(found) ? found : null
  })

  function write(interim: string): void {
    const spoken = `${finals}${interim}`.trim()
    setText(spoken ? `${base}${spoken}` : base.trimEnd())
  }

  function begin(): void {
    status.value = t('promptInput.listening')
    if (props.transcriber === 'app' || !engine.value) return
    const text = getText()
    base = text && !/\s$/.test(text) ? `${text} ` : text
    finals = ''
    failure = ''
    recognition = new engine.value()
    recognition.lang = props.lang || locale.value
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (event) => {
      let interim = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]!
        if (result.isFinal) finals += `${result[0]!.transcript} `
        else interim += result[0]!.transcript
      }
      write(interim)
    }
    recognition.onerror = (event) => {
      failure =
        event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? t('promptInput.dictationBlocked')
          : event.error === 'no-speech' || event.error === 'aborted'
            ? ''
            : t('promptInput.dictationFailed')
    }
    recognition.onend = () => {
      recognition = null
      write('')
      listening.value = false
      status.value = failure || t('promptInput.dictationEnded')
    }
    try {
      recognition.start()
    } catch {
      recognition = null
      listening.value = false
      status.value = t('promptInput.dictationFailed')
    }
  }

  function end(): void {
    if (recognition) {
      recognition.stop()
      return
    }
    status.value = t('promptInput.dictationEnded')
  }

  watch(listening, (on) => (on ? begin() : end()))
  watch(
    () => disabled.value || voiceActive.value,
    (off) => {
      if (off && listening.value) listening.value = false
    }
  )

  onScopeDispose(() => {
    if (!recognition) return
    recognition.onend = null
    recognition.abort()
    recognition = null
  })
</script>

<template>
  <template v-if="available">
    <IconButton
      v-bind="$attrs"
      :icon="voiceActive ? 'az az-microphone-off' : listening ? 'az az-stop' : 'az az-microphone'"
      :variant="voiceActive || listening ? 'secondary' : 'ghost'"
      size="medium"
      :ariaLabel="listening ? t('promptInput.dictateStop') : ariaLabel || t('promptInput.dictate')"
      :disabled="disabled || voiceActive"
      :data-testid="testId"
      :data-listening="listening || null"
      @click="listening = !listening"
    />
    <span
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
      >{{ status }}</span
    >
  </template>
</template>
