<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../actions/button/button.vue'
  import Field from '../../inputs/field/field.vue'
  import FieldError from '../../inputs/field/field-error/field-error.vue'
  import FieldLabel from '../../inputs/field/field-label/field-label.vue'
  import FieldLegend from '../../inputs/field/field-legend/field-legend.vue'
  import FieldSet from '../../inputs/field/field-set/field-set.vue'
  import RadioGroup from '../../inputs/radio-group/radio-group.vue'
  import RadioGroupItem from '../../inputs/radio-group/radio-group-item/radio-group-item.vue'
  import Textarea from '../../inputs/textarea/textarea.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogDescription from '../../overlay/dialog/dialog-description.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import PanelContent from '../../overlay/panel/panel-content.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  export interface FeedbackReasonDialogReason {
    value: string
    label: string
  }

  export interface FeedbackReasonDialogPayload {
    reason: string
    details: string
  }

  defineOptions({
    name: 'FeedbackReasonDialog',
    inheritAttrs: false
  })

  export interface FeedbackReasonDialogProps {
    /** Reasons offered, in order. Empty uses the catalog's five: inaccurate, not helpful, did not follow the request, unsafe or harmful, other. */
    reasons?: FeedbackReasonDialogReason[]
    /** The feedback is being sent: Send feedback shows a spinner and the form is locked. */
    loading?: boolean
    /** Dialog title. Empty uses the locale catalog (`What went wrong?`). */
    title?: string
    /** Initial open state when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<FeedbackReasonDialogProps>(), {
    reasons: () => [],
    loading: false,
    title: '',
    defaultOpen: false
  })

  /** Whether the dialog is open. Supports v-model:open; omit for uncontrolled, seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })
  const open = computed<boolean>({
    get: () => openModel.value ?? props.defaultOpen,
    set: (next) => {
      if (next !== open.value) openModel.value = next
    }
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, payload: FeedbackReasonDialogPayload]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ feedbackReasonDialog: en.feedbackReasonDialog })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-feedback-reason-dialog'
  )

  const options = computed<FeedbackReasonDialogReason[]>(() =>
    props.reasons.length
      ? props.reasons
      : (['inaccurate', 'notHelpful', 'ignoredRequest', 'unsafe', 'other'] as const).map(
          (value) => ({ value, label: t(`feedbackReasonDialog.${value}`) })
        )
  )

  const reason = ref<string>('')
  const details = ref<string>('')
  const missing = ref<boolean>(false)

  watch(open, (now) => {
    if (!now) return
    reason.value = ''
    details.value = ''
    missing.value = false
  })

  watch(reason, () => {
    missing.value = false
  })

  const send = async (event: SubmitEvent): Promise<void> => {
    if (props.loading) return
    if (!reason.value) {
      missing.value = true
      await nextTick()
      globalThis.document
        ?.getElementById(`${uid}-reasons`)
        ?.querySelector<HTMLInputElement>('input[type="radio"]')
        ?.focus()
      return
    }
    emit('submit', event, { reason: reason.value, details: details.value.trim() })
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
    :data-testid="testId"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ title || t('feedbackReasonDialog.title') }}</DialogTitle>
          <DialogDescription>{{ t('feedbackReasonDialog.description') }}</DialogDescription>
        </div>
      </PanelHeader>
      <form
        novalidate
        class="flex min-h-0 flex-1 flex-col"
        :data-testid="`${testId}__form`"
        @submit.prevent="send"
      >
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-lg)">
            <FieldSet
              :aria-describedby="missing ? `${uid}-error` : undefined"
              :disabled="loading"
            >
              <FieldLegend kind="label">{{ t('feedbackReasonDialog.reason') }}</FieldLegend>
              <RadioGroup
                :id="`${uid}-reasons`"
                v-model="reason"
                :name="`${uid}-reason`"
                :invalid="missing"
                :disabled="loading"
              >
                <RadioGroupItem
                  v-for="option in options"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</RadioGroupItem
                >
              </RadioGroup>
              <FieldError
                v-if="missing"
                :id="`${uid}-error`"
                >{{ t('feedbackReasonDialog.required') }}</FieldError
              >
            </FieldSet>
            <Field :disabled="loading">
              <FieldLabel>{{ t('feedbackReasonDialog.details') }}</FieldLabel>
              <Textarea
                v-model="details"
                :placeholder="t('feedbackReasonDialog.detailsPlaceholder')"
                :data-testid="`${testId}__details`"
              />
            </Field>
          </div>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            type="button"
            :label="t('feedbackReasonDialog.cancel')"
            kind="outlined"
            :disabled="loading"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            type="submit"
            :label="t('feedbackReasonDialog.send')"
            kind="primary"
            :loading="loading"
          />
        </PanelFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
