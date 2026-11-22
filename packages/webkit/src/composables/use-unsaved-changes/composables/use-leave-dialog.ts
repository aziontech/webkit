import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue'

import * as en from '../../../locales/en'
import { useTranslate } from '../../use-translate'
import { createLeaveGate } from '../lib/leave-gate'
import type { UnsavedChangesDialogProps } from '../use-unsaved-changes'

export interface UseLeaveDialogOptions {
  isDirty: ComputedRef<boolean>
  enabled: () => boolean
  savable: ComputedRef<boolean>
  discard: () => void
  onSave?: () => unknown
}

export interface UseLeaveDialogReturn {
  saving: Readonly<Ref<boolean>>
  confirmLeave: () => Promise<boolean>
  dialogProps: ComputedRef<UnsavedChangesDialogProps>
  labels: ComputedRef<{ keepEditing: string; discard: string; save: string }>
  keepEditing: () => void
  discardAndLeave: () => void
  saveAndLeave: () => Promise<void>
  cancel: () => void
}

async function saved(onSave: () => unknown): Promise<boolean> {
  try {
    await onSave()
    return true
  } catch {
    return false
  }
}

export function useLeaveDialog(options: UseLeaveDialogOptions): UseLeaveDialogReturn {
  const { t } = useTranslate({ unsavedChanges: en.unsavedChanges })
  const { isDirty, savable } = options
  const open = ref(false)
  const saving = ref(false)
  const { request, settle, cancel } = createLeaveGate(open)

  const confirmLeave = () =>
    !options.enabled() || !isDirty.value ? Promise.resolve(true) : request()

  const keepEditing = () => {
    if (!saving.value) settle(false)
  }

  const discardAndLeave = () => {
    if (saving.value) return
    options.discard()
    settle(true)
  }

  const saveAndLeave = async () => {
    if (!options.onSave || saving.value) return
    saving.value = true
    const ok = await saved(options.onSave)
    saving.value = false
    if (ok && !isDirty.value) settle(true)
  }

  const dialogProps = computed<UnsavedChangesDialogProps>(() => ({
    open: open.value,
    title: t('unsavedChanges.title'),
    description: savable.value
      ? t('unsavedChanges.descriptionSavable')
      : t('unsavedChanges.description'),
    variant: 'danger',
    loading: saving.value,
    'onUpdate:open': (next: boolean) => {
      if (!next) keepEditing()
    }
  }))

  const labels = computed(() => ({
    keepEditing: t('unsavedChanges.keepEditing'),
    discard: t('unsavedChanges.discard'),
    save: t('unsavedChanges.save')
  }))

  return {
    saving: readonly(saving),
    confirmLeave,
    dialogProps,
    labels,
    keepEditing,
    discardAndLeave,
    saveAndLeave,
    cancel
  }
}
