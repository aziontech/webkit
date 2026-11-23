<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import Field from '../../input/field/field.vue'
  import FieldError from '../../input/field/field-error/field-error.vue'
  import Input from '../../input/input/input.vue'
  import Textarea from '../../input/textarea/textarea.vue'
  import AgentQuestionHeading from '../agent-question/parts/agent-question-heading.vue'

  export type ToolApprovalStatus = 'pending' | 'approved' | 'denied' | 'expired'
  export type ToolApprovalVariant = 'primary' | 'danger'

  defineOptions({
    name: 'ToolApproval',
    inheritAttrs: false
  })

  export interface ToolApprovalProps {
    /** The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code. */
    title: string
    /** One or two sentences on what will happen and to what; backticks render as code. */
    description?: string
    /** `pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text. */
    status?: ToolApprovalStatus
    /** `danger` for an action that cannot be undone: the approve button turns destructive. */
    variant?: ToolApprovalVariant
    /** A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing. */
    confirmationPhrase?: string
    /** Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`). */
    approveLabel?: string
    /** Text of the deny button. Empty uses the locale catalog (`Deny`). */
    denyLabel?: string
    /** A decision is being sent; both buttons are inert and Approve shows its loading state. */
    loading?: boolean
    /** Lets the reader edit the call's input in a code field before approving; the edit comes back through `v-model` and `approve`. */
    editable?: boolean
    /** The edited input cannot be used (it does not parse): the field shows an error and Approve stays disabled. Only with `editable`. */
    invalid?: boolean
  }

  const props = withDefaults(defineProps<ToolApprovalProps>(), {
    description: '',
    status: 'pending',
    variant: 'primary',
    confirmationPhrase: '',
    approveLabel: '',
    denyLabel: '',
    loading: false,
    editable: false,
    invalid: false
  })

  const emit = defineEmits<{
    /** The reader authorized the action; `input` is the call's input as approved (the edit with `editable`). */
    approve: [event: MouseEvent, input: string]
    /** The reader refused it; the assistant acknowledges in the conversation. */
    deny: [event: MouseEvent]
  }>()

  /** The call's input as text (its arguments, usually formatted JSON); the reader edits it with `editable`. */
  const model = defineModel<string>({ default: '' })

  const slots = defineSlots<{
    /** What exactly will run: a `CodeBlock` with the command, or `KeyValueList` with the parameters. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ toolApproval: en.toolApproval })
  const uid = useId()
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`
  const phraseId = `${uid}-phrase`
  const argumentsId = `${uid}-arguments`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'tool-approval'
  )
  const rootEl = ref<HTMLElement | null>(null)
  const headingEl = ref<InstanceType<typeof AgentQuestionHeading> | null>(null)
  const typed = ref<string>('')
  const phraseMismatch = computed<boolean>(() => {
    const value = typed.value.trim()
    return (
      !!props.confirmationPhrase &&
      value.length >= props.confirmationPhrase.length &&
      value !== props.confirmationPhrase
    )
  })
  const confirmLabelParts = computed<string[]>(() =>
    t('toolApproval.confirmLabel', { phrase: '\u0000' }).split('\u0000')
  )
  const confirmed = computed<boolean>(
    () =>
      (!props.confirmationPhrase || typed.value.trim() === props.confirmationPhrase) &&
      !(props.editable && props.invalid)
  )
  const argumentsInvalid = computed<boolean>(() => props.invalid && props.status === 'pending')
  const resolvedLabel = computed<string>(() => {
    if (props.status === 'approved') return t('toolApproval.approved')
    if (props.status === 'denied') return t('toolApproval.denied')
    if (props.status === 'expired') return t('toolApproval.expired')
    return ''
  })
  const resolvedSeverity = computed(() => {
    if (props.status === 'approved') return 'success' as const
    if (props.status === 'denied') return 'warning' as const
    return 'neutral' as const
  })

  watch(
    () => props.status,
    (status, previous) => {
      if (status === 'pending') typed.value = ''
      if (previous !== 'pending' || status === 'pending' || typeof document === 'undefined') return
      const active = document.activeElement
      const focusWasInside = !active || active === document.body || !!rootEl.value?.contains(active)
      if (focusWasInside) void nextTick(focus)
    }
  )

  function approve(event: MouseEvent): void {
    if (props.loading || props.status !== 'pending' || !confirmed.value) return
    emit('approve', event, model.value)
  }

  function deny(event: MouseEvent): void {
    if (props.loading || props.status !== 'pending') return
    emit('deny', event)
  }

  function focus(): void {
    headingEl.value?.focus()
  }

  defineExpose({ focus })

  const ROOT_CLASS =
    'flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) ' +
    'data-[variant=danger]:data-[status=pending]:border-(--danger-border)'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="group"
    :aria-labelledby="titleId"
    :aria-describedby="description ? descriptionId : undefined"
    :data-testid="testId"
    :data-status="status"
    :data-variant="variant"
    :class="ROOT_CLASS"
  >
    <div class="flex items-start gap-(--spacing-sm)">
      <i
        :data-variant="variant"
        class="az az-shield mt-0.5 shrink-0 text-(--text-muted) data-[variant=danger]:text-(--danger-mark)"
        aria-hidden="true"
      />
      <AgentQuestionHeading
        ref="headingEl"
        :title-id="titleId"
        :description-id="descriptionId"
        :title="title"
        :description="description"
        :test-id="testId"
        title-class="[overflow-wrap:anywhere]"
      />
    </div>
    <div
      v-if="slots.default"
      :data-testid="`${testId}__details`"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <slot />
    </div>
    <Field
      v-if="editable"
      :invalid="argumentsInvalid"
      :disabled="loading && status === 'pending'"
      :data-testid="`${testId}__arguments`"
    >
      <label
        :for="argumentsId"
        class="text-label-sm text-(--text-default)"
      >
        {{ t('toolApproval.arguments') }}
      </label>
      <Textarea
        :id="argumentsId"
        v-model="model"
        dir="ltr"
        spellcheck="false"
        autocomplete="off"
        wrap="off"
        monospace
        auto-resize
        :min-rows="3"
        :max-rows="12"
        :readonly="status !== 'pending'"
        :data-testid="`${testId}__arguments-input`"
        class="w-full"
      />
      <FieldError
        v-if="argumentsInvalid"
        :data-testid="`${testId}__arguments-error`"
      >
        {{ t('toolApproval.invalidArguments') }}
      </FieldError>
    </Field>
    <template v-if="status === 'pending'">
      <Field
        v-if="confirmationPhrase"
        :invalid="phraseMismatch"
        :disabled="loading"
      >
        <label
          :for="phraseId"
          class="text-label-sm text-(--text-default)"
        >
          {{ confirmLabelParts[0]
          }}<code
            dir="ltr"
            class="rounded-(--shape-control) bg-(--bg-surface-raised) px-1 py-px text-label-code-sm text-(--text-default) [overflow-wrap:anywhere]"
            :data-testid="`${testId}__phrase-text`"
            >{{ confirmationPhrase }}</code
          >{{ confirmLabelParts[1] }}
        </label>
        <Input
          :id="phraseId"
          v-model="typed"
          autocomplete="off"
          autocapitalize="off"
          :spellcheck="false"
          :disabled="loading"
          :data-testid="`${testId}__phrase`"
        />
        <FieldError
          v-if="phraseMismatch"
          :data-testid="`${testId}__phrase-error`"
        >
          {{ t('toolApproval.phraseMismatch', { phrase: confirmationPhrase }) }}
        </FieldError>
      </Field>
      <div class="flex flex-wrap justify-end gap-(--spacing-xs)">
        <Button
          :label="denyLabel || t('toolApproval.deny')"
          variant="outline"
          size="medium"
          :disabled="loading"
          :data-testid="`${testId}__deny`"
          @click="deny"
        />
        <Button
          :label="approveLabel || t('toolApproval.approve')"
          :variant="variant"
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
