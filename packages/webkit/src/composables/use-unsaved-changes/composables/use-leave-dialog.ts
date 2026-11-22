import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue'

import * as en from '../../../locales/en'
import { useTranslate } from '../../use-translate'
import type { UnsavedChangesDialogProps } from '../use-unsaved-changes'

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

async function saveAndLeave(
  onSave: (() => unknown) | undefined,
  saving: Ref<boolean>,
  isDirty: ComputedRef<boolean>,
  settle: (allowed: boolean) => void
): Promise<void> {
  if (!onSave || saving.value) return
  saving.value = true
  try {
    await onSave()
  } catch {
    saving.value = false
    return
  }
  saving.value = false
  if (!isDirty.value) settle(true)
}

export function useLeaveDialog(
  isDirty: ComputedRef<boolean>,
  enabled: () => boolean,
  savable: ComputedRef<boolean>,
  discard: () => void,
  onSave?: () => unknown
): UseLeaveDialogReturn {
  const { t } = useTranslate({ unsavedChanges: en.unsavedChanges })
  const open = ref(false)
  const saving = ref(false)
  let release: ((allowed: boolean) => void) | null = null

  const settle = (allowed: boolean) => {
    const resolve = release
    release = null
    open.value = false
    resolve?.(allowed)
  }

  const confirmLeave = () => {
    if (!enabled() || !isDirty.value) return Promise.resolve(true)
    release?.(false)
    open.value = true
    return new Promise<boolean>((resolve) => {
      release = resolve
    })
  }

  const keepEditing = () => {
    if (!saving.value) settle(false)
  }

  return {
    saving: readonly(saving),
    confirmLeave,
    keepEditing,
    discardAndLeave: () => {
      if (saving.value) return
      discard()
      settle(true)
    },
    saveAndLeave: () => saveAndLeave(onSave, saving, isDirty, settle),
    dialogProps: computed<UnsavedChangesDialogProps>(() => ({
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
    })),
    labels: computed(() => ({
      keepEditing: t('unsavedChanges.keepEditing'),
      discard: t('unsavedChanges.discard'),
      save: t('unsavedChanges.save')
    })),
    cancel: () => release?.(false)
  }
}
