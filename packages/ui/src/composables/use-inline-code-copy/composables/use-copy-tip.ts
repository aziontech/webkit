import { computed, type ComputedRef, onScopeDispose, readonly, type Ref, ref } from 'vue'

import { copyText } from '../../../utils/clipboard'
import { type UseTranslateReturn } from '../../use-translate'
import { copyShortcut } from '../lib/chip'

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

function tipText(state: InlineCodeCopyState, t: UseTranslateReturn['t']): string {
  if (state === 'copied') return t('common.copied')
  if (state === 'manual')
    return t('docProse.copyManually', { shortcut: copyShortcut(t('kbd.ctrl')) })
  return t('common.copy')
}

export function useCopyTip(t: UseTranslateReturn['t']): UseCopyTipReturn {
  const tipFor = ref<HTMLElement | null>(null)
  const state = ref<InlineCodeCopyState>('copy')
  const tipLeft = ref(0)
  const tipTop = ref(0)
  const announcement = ref('')
  let resetTimer: ReturnType<typeof globalThis.setTimeout> | null = null

  const tipLabel = computed(() => tipText(state.value, t))

  const anchorTip = (chip: HTMLElement): void => {
    const rect = chip.getBoundingClientRect()
    tipLeft.value = rect.left + rect.width / 2
    tipTop.value = rect.top
  }

  const clearReset = (): void => {
    if (resetTimer !== null) globalThis.clearTimeout(resetTimer)
    resetTimer = null
  }

  const show = (chip: HTMLElement): void => {
    if (chip === tipFor.value) return
    clearReset()
    state.value = 'copy'
    tipFor.value = chip
    anchorTip(chip)
  }

  const copy = async (chip: HTMLElement): Promise<void> => {
    const text = chip.textContent ?? ''
    if (!text) return
    tipFor.value = chip
    anchorTip(chip)
    globalThis.getSelection()?.selectAllChildren(chip)
    state.value = (await copyText(text)) ? 'copied' : 'manual'
    announcement.value = tipLabel.value
    clearReset()
    resetTimer = globalThis.setTimeout(() => {
      state.value = 'copy'
      announcement.value = ''
      resetTimer = null
    }, FEEDBACK_MS)
  }

  onScopeDispose(clearReset)

  return {
    tipFor: readonly(tipFor) as Readonly<Ref<HTMLElement | null>>,
    tipLabel,
    tipLeft: readonly(tipLeft),
    tipTop: readonly(tipTop),
    announcement: readonly(announcement),
    show,
    hide: (chip: HTMLElement): void => {
      if (chip !== tipFor.value) return
      clearReset()
      tipFor.value = null
    },
    copy,
    reanchor: (): void => {
      if (tipFor.value) anchorTip(tipFor.value)
    },
    clearReset
  }
}
