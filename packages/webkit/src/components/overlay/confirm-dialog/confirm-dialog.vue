<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Dialog from '../dialog/dialog.vue'
  import DialogClose from '../dialog/dialog-close.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogDescription from '../dialog/dialog-description.vue'
  import DialogOverlay from '../dialog/dialog-overlay.vue'
  import DialogPortal from '../dialog/dialog-portal.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import DialogTrigger from '../dialog/dialog-trigger.vue'
  import PanelContent from '../panel/panel-content.vue'
  import PanelFooter from '../panel/panel-footer.vue'
  import PanelHeader from '../panel/panel-header.vue'

  /** Kind of the confirm button: `danger` for a removal or a discard, `primary` for a commit. */
  export type ConfirmDialogKind = 'danger' | 'primary'
  /** Width of the dialog: small for a sentence, medium when the body holds a field or an alert. */
  export type ConfirmDialogSize = 'small' | 'medium'

  defineOptions({
    name: 'ConfirmDialog',
    inheritAttrs: false
  })

  interface Props {
    /** The question or the outcome, as the dialog title. */
    title: string
    /** One sentence that says what happens on confirm. */
    description?: string
    /** Label of the confirm button. Empty uses the locale catalog (`Confirm`). */
    confirmLabel?: string
    /** Label of the cancel button. Empty uses the locale catalog (`Cancel`). */
    cancelLabel?: string
    /** Kind of the confirm button. */
    kind?: ConfirmDialogKind
    /** Width of the dialog. */
    size?: ConfirmDialogSize
    /** Shows a spinner on the confirm button while the action runs. */
    loading?: boolean
    /** Disables the confirm button, for a confirmation that needs input first. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    confirmLabel: '',
    cancelLabel: '',
    kind: 'danger',
    size: 'small',
    loading: false,
    disabled: false
  })

  const open = defineModel<boolean>('open', { default: false })

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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'overlay-confirm-dialog'
  )

  const contentAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const close = () => {
    open.value = false
  }

  const cancel = (event: MouseEvent) => {
    if (props.loading) return
    emit('cancel', event)
    close()
  }

  const confirm = (event: MouseEvent) => {
    if (props.disabled || props.loading) return
    emit('confirm', event)
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    :data-testid="testId"
    :size="size"
    :dismissible="!loading"
  >
    <DialogTrigger v-if="$slots['trigger']">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent v-bind="contentAttrs">
        <PanelHeader class="w-full">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription v-if="description">{{ description }}</DialogDescription>
          <slot />
        </PanelContent>
        <PanelFooter>
          <div
            :data-testid="`${testId}__actions`"
            class="flex w-full flex-col-reverse gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
          >
            <slot
              name="actions"
              :close="close"
            >
              <Button
                :data-testid="`${testId}__cancel`"
                :label="cancelLabel || t('confirmDialog.cancel')"
                kind="transparent"
                size="medium"
                :disabled="loading"
                @click="cancel"
              />
              <Button
                :data-testid="`${testId}__confirm`"
                :label="confirmLabel || t('confirmDialog.confirm')"
                :kind="kind"
                :loading="loading"
                :disabled="disabled"
                size="medium"
                @click="confirm"
              />
            </slot>
          </div>
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
