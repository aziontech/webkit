<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import MarkdownInline from '../_lib/markdown-inline'
  import { parseInline } from '../_lib/parse-markdown'

  export type ActionConfirmationState = 'pending' | 'approved' | 'denied' | 'expired'
  export type ActionConfirmationKind = 'default' | 'danger'

  defineOptions({
    name: 'ActionConfirmation',
    inheritAttrs: false
  })

  interface Props {
    /** The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code. */
    title: string
    /** One or two sentences on what will happen and to what; backticks render as code. */
    description?: string
    /** `pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text. */
    state?: ActionConfirmationState
    /** `danger` for an action that cannot be undone: the approve button turns destructive. */
    kind?: ActionConfirmationKind
    /** A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing. */
    confirmationPhrase?: string
    /** Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`). */
    approveLabel?: string
    /** Text of the deny button. Empty uses the locale catalog (`Deny`). */
    denyLabel?: string
    /** A decision is being sent; both buttons are inert and Approve shows its loading state. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    state: 'pending',
    kind: 'default',
    confirmationPhrase: '',
    approveLabel: '',
    denyLabel: '',
    loading: false
  })

  const emit = defineEmits<{
    /** The reader authorized the action. */
    approve: []
    /** The reader refused it; the assistant acknowledges in the conversation. */
    deny: []
  }>()

  const slots = defineSlots<{
    /** What exactly will run: a `CodeBlock` with the command, or `KeyValuePairs` with the parameters. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ actionConfirmation: en.actionConfirmation })
  const uid = useId()
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`
  const phraseId = `${uid}-phrase`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-action-confirmation'
  )
  const heading = ref<HTMLElement | null>(null)
  const typed = ref<string>('')
  const titleNodes = computed(() => parseInline(props.title))
  const descriptionNodes = computed(() => parseInline(props.description))
  const confirmed = computed<boolean>(
    () => !props.confirmationPhrase || typed.value.trim() === props.confirmationPhrase
  )
  const resolvedLabel = computed<string>(() => {
    if (props.state === 'approved') return t('actionConfirmation.approved')
    if (props.state === 'denied') return t('actionConfirmation.denied')
    if (props.state === 'expired') return t('actionConfirmation.expired')
    return ''
  })
  const resolvedSeverity = computed(() => {
    if (props.state === 'approved') return 'success' as const
    if (props.state === 'denied') return 'warning' as const
    return 'neutral' as const
  })

  watch(
    () => props.state,
    (state) => {
      if (state === 'pending') typed.value = ''
    }
  )

  function approve(): void {
    if (props.loading || props.state !== 'pending' || !confirmed.value) return
    emit('approve')
  }

  function deny(): void {
    if (props.loading || props.state !== 'pending') return
    emit('deny')
  }

  function focus(): void {
    heading.value?.focus()
  }

  defineExpose({ focus })
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-labelledby="titleId"
    :aria-describedby="description ? descriptionId : undefined"
    :data-testid="testId"
    :data-status="state"
    :data-kind="kind"
    class="flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) data-[kind=danger]:data-[status=pending]:border-(--danger-border)"
  >
    <div class="flex items-start gap-(--spacing-sm)">
      <i
        :data-kind="kind"
        class="pi pi-shield mt-0.5 shrink-0 text-(--text-muted) data-[kind=danger]:text-(--danger-contrast)"
        aria-hidden="true"
      />
      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <h3
          :id="titleId"
          ref="heading"
          tabindex="-1"
          :data-testid="`${testId}__title`"
          class="m-0 text-heading-xxs text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >
          <MarkdownInline :nodes="titleNodes" />
        </h3>
        <p
          v-if="description"
          :id="descriptionId"
          class="m-0 text-body-sm text-(--text-muted)"
        >
          <MarkdownInline :nodes="descriptionNodes" />
        </p>
      </div>
    </div>
    <div
      v-if="slots.default"
      :data-testid="`${testId}__details`"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <slot />
    </div>
    <template v-if="state === 'pending'">
      <div
        v-if="confirmationPhrase"
        class="flex flex-col gap-(--spacing-xxs)"
      >
        <label
          :for="phraseId"
          class="text-label-sm text-(--text-default)"
        >
          {{ t('actionConfirmation.confirmLabel', { phrase: confirmationPhrase }) }}
        </label>
        <input
          :id="phraseId"
          v-model="typed"
          type="text"
          autocomplete="off"
          spellcheck="false"
          :disabled="loading"
          :data-testid="`${testId}__phrase`"
          class="h-8 w-full rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) disabled:bg-(--bg-disabled)"
        />
      </div>
      <div class="flex flex-wrap justify-end gap-(--spacing-xs)">
        <Button
          :label="denyLabel || t('actionConfirmation.deny')"
          kind="outlined"
          size="medium"
          :disabled="loading"
          :data-testid="`${testId}__deny`"
          @click="deny"
        />
        <Button
          :label="approveLabel || t('actionConfirmation.approve')"
          :kind="kind === 'danger' ? 'danger' : 'primary'"
          size="medium"
          :disabled="!confirmed"
          :loading="loading"
          :data-testid="`${testId}__approve`"
          @click="approve"
        />
      </div>
    </template>
    <StatusIndicator
      v-else
      :severity="resolvedSeverity"
      :label="resolvedLabel"
      :data-testid="`${testId}__outcome`"
    />
    <span
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__announcer`"
    >
      {{ resolvedLabel }}
    </span>
  </div>
</template>
