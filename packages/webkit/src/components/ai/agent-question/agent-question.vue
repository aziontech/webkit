<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import Input from '../../input/input/input.vue'
  import RadioGroup from '../../input/radio-group/radio-group.vue'
  import MarkdownInline from '../lib/markdown-inline'
  import { parseInline } from '../lib/parse-markdown'

  defineOptions({
    name: 'AgentQuestion',
    inheritAttrs: false
  })

  export type AgentQuestionType = 'choice' | 'text' | 'confirm'
  export type AgentQuestionStatus =
    'pending' | 'running' | 'success' | 'error' | 'canceled' | 'skipped'

  export interface AgentQuestionOption {
    /** Answer written to the model when the option is picked. */
    value: string
    /** Text of the option. */
    label: string
    /** One-line explanation under the label, only when the label alone does not say what happens. */
    description?: string
    /** Disables this option only. */
    disabled?: boolean
  }

  export interface AgentQuestionProps {
    /** The question the agent asks, ending with a question mark. Backticks render as code. */
    title: string
    /** One or two sentences on why the agent asks or what it does with the answer; backticks render as code. */
    description?: string
    /** The answer control: `choice` lists `options` as radios, `text` shows a one-line field, `confirm` shows No and Yes buttons. */
    type?: AgentQuestionType
    /** The answers of a `choice` question: `{ value, label, description?, disabled? }`. Ignored by the other types. */
    options?: AgentQuestionOption[]
    /** Short example shown in the empty field of a `text` question. */
    placeholder?: string
    /** `pending` asks; `running` sends the answer; `success`, `skipped` and `canceled` replace the controls with the outcome; `error` asks again. */
    status?: AgentQuestionStatus
    /** Why the last answer was not accepted, shown under the controls. Empty with `status="error"` uses the locale catalog. */
    error?: string
    /** Offers Skip, for a question the agent can go on without. */
    skippable?: boolean
    /** Text of the submit button (Yes on a `confirm` question). Empty uses the locale catalog (`Submit`, `Yes`). */
    submitLabel?: string
    /** Text of the No button of a `confirm` question. Empty uses the locale catalog (`No`). */
    declineLabel?: string
    /** Text of the Skip button. Empty uses the locale catalog (`Skip`). */
    skipLabel?: string
  }

  const props = withDefaults(defineProps<AgentQuestionProps>(), {
    description: '',
    type: 'choice',
    options: () => [],
    placeholder: '',
    status: 'pending',
    error: '',
    skippable: false,
    submitLabel: '',
    declineLabel: '',
    skipLabel: ''
  })

  const emit = defineEmits<{
    /** The reader answered; `value` is the picked option's value, the typed text, or `yes` / `no`. */
    submit: [event: Event, value: string]
    /** The reader skipped the question; the agent goes on without an answer. */
    skip: [event: MouseEvent]
  }>()

  /** The answer: the picked option's value, the typed text, or `yes` / `no` on a `confirm` question. */
  const model = defineModel<string>({ default: '' })

  const slots = defineSlots<{
    /** Context the reader needs to answer, between the question and the control: a `CodeBlock`, a `KeyValueList`. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ agentQuestion: en.agentQuestion })
  const uid = useId()
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`
  const errorId = `${uid}-error`

  const rootEl = ref<HTMLElement | null>(null)
  const headingEl = ref<HTMLElement | null>(null)
  const formEl = ref<HTMLFormElement | null>(null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'agent-question'
  )
  const titleNodes = computed(() => parseInline(props.title))
  const descriptionNodes = computed(() => parseInline(props.description))
  const asking = computed<boolean>(
    () => props.status === 'pending' || props.status === 'running' || props.status === 'error'
  )
  const running = computed<boolean>(() => props.status === 'running')
  const filled = computed<boolean>(() => model.value.trim() !== '')
  const yesLabel = computed<string>(() => props.submitLabel || t('agentQuestion.yes'))
  const noLabel = computed<string>(() => props.declineLabel || t('agentQuestion.no'))
  const errorText = computed<string>(() =>
    props.status === 'error' ? props.error || t('agentQuestion.error') : ''
  )
  const groupDescribedBy = computed<string | undefined>(() => {
    const ids: string[] = []
    if (props.description) ids.push(descriptionId)
    if (props.type === 'confirm' && errorText.value) ids.push(errorId)
    return ids.length ? ids.join(' ') : undefined
  })
  const answerText = computed<string>(() => {
    if (props.type === 'confirm') {
      if (model.value === 'yes') return yesLabel.value
      if (model.value === 'no') return noLabel.value
    }
    if (props.type === 'choice') {
      const option = props.options.find((item) => item.value === model.value)
      if (option) return option.label
    }
    return model.value
  })
  const outcomeLabel = computed<string>(() => {
    if (props.status === 'success') {
      return answerText.value.trim()
        ? t('agentQuestion.answered', { answer: `\u2068${answerText.value}\u2069` })
        : t('agentQuestion.answeredWithoutValue')
    }
    if (props.status === 'skipped') return t('agentQuestion.skipped')
    if (props.status === 'canceled') return t('agentQuestion.canceled')
    return ''
  })
  const outcomeSeverity = computed(() =>
    props.status === 'success' ? ('success' as const) : ('neutral' as const)
  )

  watch(
    () => props.status,
    async () => {
      if (typeof document === 'undefined') return
      const held = formEl.value?.contains(document.activeElement) ?? false
      if (!held) return
      await nextTick()
      const active = document.activeElement as HTMLButtonElement | HTMLInputElement | null
      if (
        !active ||
        active === document.body ||
        !rootEl.value?.contains(active) ||
        active.disabled
      ) {
        focus()
      }
    },
    { flush: 'pre' }
  )

  function onSubmit(event: Event): void {
    if (running.value || !asking.value || !filled.value) return
    emit('submit', event, model.value)
  }

  function onConfirm(event: MouseEvent, value: 'yes' | 'no'): void {
    if (running.value || !asking.value) return
    model.value = value
    emit('submit', event, value)
  }

  function onSkip(event: MouseEvent): void {
    if (running.value || !asking.value) return
    emit('skip', event)
  }

  function focus(): void {
    headingEl.value?.focus()
  }

  defineExpose({
    /** Moves focus to the question heading. */
    focus
  })
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="group"
    :aria-labelledby="titleId"
    :aria-describedby="groupDescribedBy"
    :aria-busy="running || undefined"
    :data-testid="testId"
    :data-status="status"
    :data-type="type"
    class="flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
  >
    <div class="flex items-start gap-(--spacing-sm)">
      <i
        class="az az-circle-help mt-0.5 shrink-0 text-(--text-muted)"
        aria-hidden="true"
      />
      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
        <h3
          :id="titleId"
          ref="headingEl"
          tabindex="-1"
          :data-testid="`${testId}__title`"
          class="m-0 text-heading-2xs text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
    <form
      v-if="asking"
      ref="formEl"
      novalidate
      class="flex flex-col gap-(--spacing-sm)"
      @submit.prevent="onSubmit"
    >
      <RadioGroup
        v-if="type === 'choice'"
        v-model="model"
        :options="options"
        :disabled="running"
        :invalid="Boolean(errorText)"
        :aria-labelledby="titleId"
        :aria-describedby="errorText ? errorId : undefined"
      >
        <template #option="{ option }">
          <bdi>{{ option.label }}</bdi>
        </template>
      </RadioGroup>
      <Input
        v-else-if="type === 'text'"
        v-model="model"
        :placeholder="placeholder"
        :disabled="running"
        :invalid="Boolean(errorText)"
        autocomplete="off"
        :aria-labelledby="titleId"
        :aria-describedby="errorText ? errorId : undefined"
      />
      <p
        v-if="errorText"
        :id="errorId"
        :data-testid="`${testId}__error`"
        class="m-0 text-body-sm text-(--text-danger)"
      >
        {{ errorText }}
      </p>
      <div class="flex flex-wrap justify-end gap-(--spacing-xs)">
        <Button
          v-if="skippable"
          key="skip"
          type="button"
          :label="skipLabel || t('agentQuestion.skip')"
          variant="ghost"
          size="medium"
          :disabled="running"
          :data-testid="`${testId}__skip`"
          @click="onSkip"
        />
        <template v-if="type === 'confirm'">
          <Button
            type="button"
            :label="noLabel"
            variant="outline"
            size="medium"
            :disabled="running && model !== 'no'"
            :loading="running && model === 'no'"
            :data-testid="`${testId}__decline`"
            @click="onConfirm($event, 'no')"
          />
          <Button
            key="yes"
            type="button"
            :label="yesLabel"
            variant="primary"
            size="medium"
            :disabled="running && model !== 'yes'"
            :loading="running && model === 'yes'"
            :data-testid="`${testId}__submit`"
            @click="onConfirm($event, 'yes')"
          />
        </template>
        <Button
          v-else
          key="submit"
          type="submit"
          :label="submitLabel || t('agentQuestion.submit')"
          variant="primary"
          size="medium"
          :disabled="!filled && !running"
          :loading="running"
          :data-testid="`${testId}__submit`"
        />
      </div>
    </form>
    <StatusIndicator
      v-else
      :severity="outcomeSeverity"
      :label="outcomeLabel"
      :data-testid="`${testId}__outcome`"
    />
    <span
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__announcer`"
    >
      {{ outcomeLabel || errorText }}
    </span>
  </div>
</template>
