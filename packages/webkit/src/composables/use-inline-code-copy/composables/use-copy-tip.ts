import { computed, type ComputedRef, onScopeDispose, readonly, type Ref, ref } from 'vue'

import * as en from '../../../locales/en'
import { copyText } from '../../../utils/clipboard'
import { useTranslate } from '../../use-translate'
import { copyShortcut } from '../lib/chip'
import { createTimer, createTipAnchor } from '../lib/tip'

export type InlineCodeCopyState = 'copy' | 'copied' | 'manual'

export interface UseCopyTipReturn {
  tipFor: Readonly<Ref<HTMLElement | null>>
  tipLabel: ComputedRef<string>
  tipLeft: Readonly<Ref<number>>
  tipTop: Readonly<Ref<number>>
  announcement: Readonly<Ref<string>>
  show: (chip: HTMLElement) => void
  hide: (chip: HTMLElement) => void
  copy: (chip: HTMLElement) => Promise<void>
  reanchor: () => void
  clearReset: () => void
}

const FEEDBACK_MS = 1400

export function useCopyTip(): UseCopyTipReturn {
  const { t } = useTranslate({ docProse: en.docProse, kbd: en.kbd, common: en.common })

  const tipFor = ref<HTMLElement | null>(null)
  const state = ref<InlineCodeCopyState>('copy')
  const position = createTipAnchor()
  const announcement = ref('')
  const resetTimer = createTimer()

  const tipLabel = computed(() => {
    if (state.value === 'copied') return t('common.copied')
    if (state.value === 'manual') {
      return t('docProse.copyManually', { shortcut: copyShortcut(t('kbd.ctrl')) })
    }
    return t('common.copy')
  })

  const anchorTip = position.anchor
  const clearReset = resetTimer.clear

  const show = (chip: HTMLElement): void => {
    if (chip === tipFor.value) return
    clearReset()
    state.value = 'copy'
    tipFor.value = chip
    anchorTip(chip)
  }

  const hide = (chip: HTMLElement): void => {
    if (chip !== tipFor.value) return
    clearReset()
    tipFor.value = null
  }

  const copy = async (chip: HTMLElement): Promise<void> => {
    const text = chip.textContent ?? ''
    if (!text) return
    tipFor.value = chip
    anchorTip(chip)
    globalThis.getSelection()?.selectAllChildren(chip)
    state.value = (await copyText(text)) ? 'copied' : 'manual'
    announcement.value = tipLabel.value
    resetTimer.schedule(() => {
      state.value = 'copy'
      announcement.value = ''
    }, FEEDBACK_MS)
  }

  const reanchor = (): void => {
    if (tipFor.value) anchorTip(tipFor.value)
  }

  onScopeDispose(clearReset)

  return {
    tipFor: readonly(tipFor) as Readonly<Ref<HTMLElement | null>>,
    tipLabel,
    tipLeft: position.left,
    tipTop: position.top,
    announcement: readonly(announcement),
    show,
    hide,
    copy,
    reanchor,
    clearReset
  }
}
