<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Field from '../../inputs/field/field.vue'
  import FieldError from '../../inputs/field/field-error/field-error.vue'
  import FieldLabel from '../../inputs/field/field-label/field-label.vue'
  import FieldLegend from '../../inputs/field/field-legend/field-legend.vue'
  import FieldSet from '../../inputs/field/field-set/field-set.vue'
  import RadioButton from '../../inputs/radio-button/radio-button.vue'
  import Textarea from '../../inputs/textarea/textarea.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogClose from '../../overlay/dialog/dialog-close.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogDescription from '../../overlay/dialog/dialog-description.vue'
  import DialogOverlay from '../../overlay/dialog/dialog-overlay.vue'
  import DialogPortal from '../../overlay/dialog/dialog-portal.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import PanelContent from '../../overlay/panel/panel-content.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  export interface FeedbackReason {
    value: string
    label: string
  }

  export interface FeedbackReasonPayload {
    reason: string
    details: string
  }

  defineOptions({
    name: 'FeedbackReasonDialog',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Reasons offered, in order. Empty uses the catalog's five: inaccurate, not helpful, did not follow the request, unsafe or harmful, other. */
      reasons?: FeedbackReason[]
      /** The feedback is being sent: Send feedback shows a spinner and the form is locked. */
      loading?: boolean
      /** Dialog title. Empty uses the locale catalog (`What went wrong?`). */
      title?: string
    }>(),
    {
      reasons: () => [],
      loading: false,
      title: ''
    }
  )

  const open = defineModel<boolean>('open', { default: false })

  const emit = defineEmits<{
    submit: [payload: FeedbackReasonPayload]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ feedbackReason: en.feedbackReason })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-feedback-reason-dialog'
  )

  const options = computed<FeedbackReason[]>(() =>
    props.reasons.length
      ? props.reasons
      : (['inaccurate', 'notHelpful', 'ignoredRequest', 'unsafe', 'other'] as const).map(
          (value) => ({ value, label: t(`feedbackReason.${value}`) })
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

  const send = async (): Promise<void> => {
    if (props.loading) return
    if (!reason.value) {
      missing.value = true
      await nextTick()
      globalThis.document?.getElementById(`${uid}-${options.value[0]?.value}`)?.focus()
      return
    }
    emit('submit', { reason: reason.value, details: details.value.trim() })
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
    :data-testid="testId"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DialogTitle>{{ title || t('feedbackReason.title') }}</DialogTitle>
            <DialogDescription>{{ t('feedbackReason.description') }}</DialogDescription>
          </div>
          <DialogClose />
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
                <FieldLegend kind="label">{{ t('feedbackReason.reason') }}</FieldLegend>
                <div class="flex flex-col gap-(--spacing-sm)">
                  <Field
                    v-for="option in options"
                    :key="option.value"
                    orientation="horizontal"
                    :invalid="missing"
                    :disabled="loading"
                  >
                    <RadioButton
                      v-model="reason"
                      :value="option.value"
                      :name="`${uid}-reason`"
                      :input-id="`${uid}-${option.value}`"
                    />
                    <FieldLabel :for="`${uid}-${option.value}`">{{ option.label }}</FieldLabel>
                  </Field>
                </div>
                <FieldError
                  v-if="missing"
                  :id="`${uid}-error`"
                  >{{ t('feedbackReason.required') }}</FieldError
                >
              </FieldSet>
              <Field :disabled="loading">
                <FieldLabel>{{ t('feedbackReason.details') }}</FieldLabel>
                <Textarea
                  v-model="details"
                  :placeholder="t('feedbackReason.detailsPlaceholder')"
                  :data-testid="`${testId}__details`"
                />
              </Field>
            </div>
          </PanelContent>
          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              :label="t('feedbackReason.cancel')"
              kind="outlined"
              :disabled="loading"
              @click="open = false"
            />
            <Button
              class="w-full md:w-auto"
              type="submit"
              :label="t('feedbackReason.send')"
              kind="primary"
              :loading="loading"
            />
          </PanelFooter>
        </form>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
