<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import Input from '../../input/input/input.vue'
  import Dialog from '../dialog/dialog.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogDescription from '../dialog/dialog-description.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import DialogTrigger from '../dialog/dialog-trigger.vue'
  import PanelBody from '../panel/panel-body.vue'
  import PanelFooter from '../panel/panel-footer.vue'
  import PanelHeader from '../panel/panel-header.vue'

  /** Kind of the confirm button: `danger` for a removal or a discard, `primary` for a commit. */
  export type ConfirmDialogVariant = 'danger' | 'primary'
  /** Width of the dialog: small for a sentence, medium when the body holds a field or an alert. */
  export type ConfirmDialogSize = 'small' | 'medium'

  defineOptions({
    name: 'ConfirmDialog',
    inheritAttrs: false
  })

  export interface ConfirmDialogProps {
    /** The question or the outcome, as the dialog title. */
    title: string
    /** One sentence that says what happens on confirm. */
    description?: string
    /** Label of the confirm button. Empty uses the locale catalog (`Confirm`). */
    confirmLabel?: string
    /** Label of the cancel button. Empty uses the locale catalog (`Cancel`). */
    cancelLabel?: string
    /** Kind of the confirm button. */
    variant?: ConfirmDialogVariant
    /** Width of the dialog. */
    size?: ConfirmDialogSize
    /** Shows a spinner on the confirm button while the action runs. */
    loading?: boolean
    /** Disables the confirm button, for a confirmation that needs input first. */
    disabled?: boolean
    /** A phrase the reader must type, exactly and with the same case, before confirm enables; usually the resource name. Empty asks for no typing. */
    confirmationPhrase?: string
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    description: '',
    confirmLabel: '',
    cancelLabel: '',
    variant: 'danger',
    size: 'medium',
    loading: false,
    disabled: false,
    confirmationPhrase: '',
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the dialog starts at defaultOpen. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  const emit = defineEmits<{
    confirm: [event: MouseEvent]
    cancel: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The control that opens the dialog. */
    trigger(): unknown
    /** Body content under the description: a field, an alert. */
    default(): unknown
    /** Replaces the Cancel and confirm buttons; receives a close function. */
    actions(props: { close: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ confirmDialog: en.confirmDialog })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'confirm-dialog')

  const contentAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const phraseId = `${useId()}-phrase`
  const mismatchId = `${phraseId}-mismatch`
  const typed = ref('')
  const mismatch = ref(false)
  const confirmEl = ref<{ $el: HTMLElement } | null>(null)

  const phraseLabel = computed(() => {
    const [before = '', after = ''] = t('confirmDialog.typeToConfirm').split('{phrase}')
    return { before, after }
  })

  const mismatchMessage = computed(() =>
    t('confirmDialog.phraseMismatch').replace('{phrase}', props.confirmationPhrase)
  )
  const phraseMatches = computed(
    () => !props.confirmationPhrase || typed.value.trim() === props.confirmationPhrase
  )
  const confirmDisabled = computed(() => props.disabled || !phraseMatches.value)

  watch(
    () => [open.value, props.confirmationPhrase],
    () => {
      typed.value = ''
      mismatch.value = false
    }
  )

  watch(typed, () => {
    mismatch.value = false
  })

  const onPhraseKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.isComposing) return
    event.preventDefault()
    if (props.loading) return
    if (!phraseMatches.value) {
      mismatch.value = typed.value.trim().length > 0
      return
    }
    if (confirmDisabled.value) return
    confirmEl.value?.$el.click()
  }

  const close = () => {
    open.value = false
  }

  const cancel = (event: MouseEvent) => {
    if (props.loading) return
    emit('cancel', event)
    close()
  }

  const confirm = (event: MouseEvent) => {
    if (confirmDisabled.value || props.loading) return
    emit('confirm', event)
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    :default-open="defaultOpen"
    :data-testid="testId"
    :size="size"
    :dismissible="!loading"
    :closable="false"
  >
    <DialogTrigger
      :data-testid="`${testId}__trigger`"
      v-if="$slots['trigger']"
    >
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      :data-testid="`${testId}__panel`"
      v-bind="contentAttrs"
      role="alertdialog"
    >
      <PanelHeader class="w-full">
        <DialogTitle :data-testid="`${testId}__title`">{{ title }}</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <DialogDescription
          :data-testid="`${testId}__description`"
          v-if="description"
          >{{ description }}</DialogDescription
        >
        <slot />
        <div
          v-if="confirmationPhrase"
          class="mt-(--spacing-md) flex flex-col gap-(--spacing-xs) first:mt-0"
        >
          <p
            :id="phraseId"
            class="m-0 text-body-sm text-(--text-default)"
          >
            {{ phraseLabel.before
            }}<code
              :data-testid="`${testId}__phrase-text`"
              class="text-label-code-sm"
              >{{ confirmationPhrase }}</code
            >{{ phraseLabel.after }}
          </p>
          <Input
            v-model="typed"
            :data-testid="`${testId}__phrase`"
            :aria-labelledby="phraseId"
            :aria-describedby="mismatch ? mismatchId : undefined"
            :invalid="mismatch"
            :disabled="loading"
            :spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            size="large"
            class="w-full"
            data-autofocus
            @keydown="onPhraseKeydown"
          />
          <p
            v-if="mismatch"
            :id="mismatchId"
            :data-testid="`${testId}__mismatch`"
            role="alert"
            class="m-0 text-body-sm text-(--text-danger)"
          >
            {{ mismatchMessage }}
          </p>
        </div>
      </PanelBody>
      <PanelFooter>
        <div
          :data-testid="`${testId}__actions`"
          class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
        >
          <slot
            name="actions"
            :close="close"
          >
            <Button
              :data-testid="`${testId}__cancel`"
              :data-autofocus="confirmationPhrase ? undefined : ''"
              :label="cancelLabel || t('confirmDialog.cancel')"
              variant="ghost"
              size="medium"
              :disabled="loading"
              @click="cancel"
            />
            <Button
              ref="confirmEl"
              :data-testid="`${testId}__confirm`"
              :label="confirmLabel || t('confirmDialog.confirm')"
              :variant="variant"
              :loading="loading"
              :disabled="confirmDisabled"
              size="medium"
              @click="confirm"
            />
          </slot>
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
