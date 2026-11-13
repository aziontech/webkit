<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'

  defineOptions({
    name: 'Reasoning',
    inheritAttrs: false
  })

  interface Props {
    /** The model is still reasoning: the label reads `Thinking` and pulses; when it turns false the label shows how long it took. */
    streaming?: boolean
    /** Seconds the reasoning took, when the server reports it. Without it the component measures from `streaming` turning on to turning off. */
    duration?: number
    /** Controlled open state. Use with `v-model:open`. */
    open?: boolean
    /** Initial open state when uncontrolled; collapsed is the default in a chat, where the response is the main content. */
    defaultOpen?: boolean
    /** Offers `Skip thinking` while streaming, for a model that can answer before it finishes reasoning. */
    skippable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    streaming: false,
    duration: undefined,
    open: undefined,
    defaultOpen: false,
    skippable: false
  })

  const emit = defineEmits<{
    /** The reasoning was expanded or collapsed. */
    'update:open': [value: boolean]
    /** The reader asked for the response now; the owner stops the reasoning and sets `streaming` to false. */
    skip: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The reasoning trace: short narration, steps, inline code for identifiers. It stays as it was once thinking ends. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ reasoning: en.reasoning })
  const uid = useId()
  const panelId = `${uid}-panel`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-reasoning'
  )

  const openProp = computed(() => props.open)
  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => emit('update:open', value)
  })

  function toggle(): void {
    isOpen.set(!isOpen.value)
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
        class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        @click="toggle"
      >
        <i
          :data-streaming="streaming || null"
          class="pi pi-sparkles data-[streaming]:animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span :data-testid="`${testId}__label`">{{ label }}</span>
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="pi pi-chevron-down text-body-xs transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </button>
      <Button
        v-if="skippable && streaming"
        :label="t('reasoning.skip')"
        kind="transparent"
        size="small"
        :data-testid="`${testId}__skip`"
        @click="(event: MouseEvent) => emit('skip', event)"
      />
    </div>
    <div
      v-show="isOpen"
      :id="panelId"
      :data-testid="`${testId}__content`"
      class="flex flex-col gap-(--spacing-xs) border-s-2 border-(--border-default) ps-(--spacing-sm) text-body-sm text-(--text-muted)"
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
