<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'

  defineOptions({
    name: 'Reasoning',
    inheritAttrs: false
  })

  export interface ReasoningProps {
    /** The model is still reasoning: the label reads `Thinking` and pulses; when it turns false the label shows how long it took. */
    streaming?: boolean
    /** Seconds the reasoning took, when the server reports it. Without it the component measures from `streaming` turning on to turning off. */
    duration?: number
    /** Initial open state when uncontrolled; collapsed is the default in a chat, where the response is the main content. */
    defaultOpen?: boolean
    /** Offers `Skip thinking` while streaming, for a model that can answer before it finishes reasoning. */
    skippable?: boolean
  }

  const props = withDefaults(defineProps<ReasoningProps>(), {
    streaming: false,
    duration: undefined,
    defaultOpen: false,
    skippable: false
  })

  const emit = defineEmits<{
    /** The reader asked for the response now; the owner stops the reasoning and sets `streaming` to false. */
    skip: [event: MouseEvent]
  }>()

  /** Controlled open state. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    /** The reasoning trace: short narration, steps, inline code for identifiers. It stays as it was once thinking ends. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ reasoning: en.reasoning })
  const uid = useId()
  const panelId = `${uid}-panel`

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'reasoning')

  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)

  function toggle(): void {
    open.value = !isOpen.value
  }

  const startedAt = ref<number | null>(props.streaming ? Date.now() : null)
  const measured = ref<number | null>(null)

  watch(
    () => props.streaming,
    (now) => {
      if (now) {
        startedAt.value = Date.now()
        measured.value = null
      } else if (startedAt.value !== null) {
        measured.value = Math.max(1, Math.round((Date.now() - startedAt.value) / 1000))
        startedAt.value = null
      }
    }
  )

  const seconds = computed<number | null>(() =>
    props.duration !== undefined ? Math.max(1, Math.round(props.duration)) : measured.value
  )
  const label = computed<string>(() => {
    if (props.streaming) return t('reasoning.thinking')
    if (seconds.value === null) return t('reasoning.thoughtBriefly')
    return t('reasoning.thought', { count: seconds.value })
  })

  const TRIGGER_CLASS =
    'inline-flex min-h-8 w-fit items-center gap-(--spacing-xs) rounded-full text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance pointer-coarse:min-h-10 ' +
    'motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-streaming="streaming || null"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <button
        type="button"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        :data-testid="`${testId}__trigger`"
        :class="TRIGGER_CLASS"
        @click="toggle"
      >
        <i
          :data-streaming="streaming || null"
          class="az az-sparkles data-[streaming]:animate-status-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span :data-testid="`${testId}__label`">{{ label }}</span>
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="az az-chevron-down text-body-xs transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </button>
      <Button
        v-if="skippable && streaming"
        :label="t('reasoning.skip')"
        variant="ghost"
        size="small"
        :data-testid="`${testId}__skip`"
        @click="(event: MouseEvent) => emit('skip', event)"
      />
    </div>
    <div
      v-show="isOpen"
      :id="panelId"
      :data-testid="`${testId}__content`"
      class="flex flex-col gap-(--spacing-xs) ms-(--spacing-xs) border-s border-(--border-default) ps-(--spacing-md) text-body-md text-(--text-muted)"
    >
      <slot />
    </div>
    <span
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ streaming ? '' : label }}
    </span>
  </div>
</template>
