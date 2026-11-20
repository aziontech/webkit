import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import * as en from '../../locales/en'
import { copyText } from '../../utils/clipboard'
import { useTranslate } from '../use-translate'

export type InlineCodeCopyState = 'copy' | 'copied' | 'manual'

export interface UseInlineCodeCopyReturn {
  /** The chip the copy tooltip points at, or null when no tooltip shows. */
  tipFor: Readonly<Ref<HTMLElement | null>>
  /** The tooltip text: Copy, Copied, or the keyboard shortcut when the clipboard is refused. */
  tipLabel: ComputedRef<string>
  /** Viewport x of the chip's center, in pixels. */
  tipLeft: Readonly<Ref<number>>
  /** Viewport y of the chip's top edge, in pixels. */
  tipTop: Readonly<Ref<number>>
  /** Text for a polite live region: what the last copy did, cleared after the feedback window. */
  announcement: Readonly<Ref<string>>
}

const FEEDBACK_MS = 1400

export function useInlineCodeCopy(
  root: MaybeRefOrGetter<HTMLElement | null>
): UseInlineCodeCopyReturn {
  const { t } = useTranslate({
    docProse: en.docProse,
    copyText: en.copyText,
    kbd: en.kbd,
    common: en.common
  })

  const tipFor = ref<HTMLElement | null>(null)
  const state = ref<InlineCodeCopyState>('copy')
  const tipLeft = ref(0)
  const tipTop = ref(0)
  const announcement = ref('')
  let resetTimer: ReturnType<typeof globalThis.setTimeout> | null = null
  let observer: globalThis.MutationObserver | null = null
  let boundEl: HTMLElement | null = null

  const copyShortcut = (): string =>
    typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent || '')
      ? '⌘C'
      : `${t('kbd.ctrl')}+C`

  const tipLabel = computed(() =>
    state.value === 'copied'
      ? t('common.copied')
      : state.value === 'manual'
        ? t('docProse.copyManually', { shortcut: copyShortcut() })
        : t('common.copy')
  )

  const chipFrom = (target: globalThis.EventTarget | null): HTMLElement | null => {
    const host = toValue(root)
    const node = target instanceof globalThis.Element ? target : null
    const chip = node?.closest('code') as HTMLElement | null
    if (!chip || !host?.contains(chip) || chip.closest('pre') || chip.closest('a')) return null
    if (chip.closest('[data-code-copy]') !== host) return null
    if (chip.dataset['testid'] || chip.childElementCount > 0) return null
    return chip
  }

  const decorate = (): void => {
    const host = toValue(root)
    if (!host) return
    for (const chip of host.querySelectorAll<HTMLElement>('code[data-command]')) {
      if (chip !== chipFrom(chip)) continue
      const value = chip.textContent ?? ''
      if (chip.getAttribute('role') !== 'button') chip.setAttribute('role', 'button')
      if (chip.getAttribute('tabindex') !== '0') chip.setAttribute('tabindex', '0')
      const label = t('copyText.copy', { value })
      if (chip.getAttribute('aria-label') !== label) chip.setAttribute('aria-label', label)
    }
  }

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
    clearReset()
    resetTimer = globalThis.setTimeout(() => {
      state.value = 'copy'
      announcement.value = ''
      resetTimer = null
    }, FEEDBACK_MS)
  }

  const onOver = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (chip) show(chip)
  }

  const onOut = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (!chip || chipFrom(event.relatedTarget) === chip) return
    if (chip === globalThis.document?.activeElement) return
    hide(chip)
  }

  const onFocusin = (event: globalThis.FocusEvent): void => {
    const chip = chipFrom(event.target)
    if (chip?.hasAttribute('data-command')) show(chip)
  }

  const onFocusout = (event: globalThis.FocusEvent): void => {
    const chip = chipFrom(event.target)
    if (chip) hide(chip)
  }

  const onClick = (event: globalThis.MouseEvent): void => {
    const chip = chipFrom(event.target)
    if (chip) void copy(chip)
  }

  const onKeydown = (event: globalThis.KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const chip = chipFrom(event.target)
    if (!chip?.hasAttribute('data-command')) return
    event.preventDefault()
    void copy(chip)
  }

  const reanchor = (): void => {
    if (tipFor.value) anchorTip(tipFor.value)
  }

  const unbind = (): void => {
    const host = boundEl
    host?.removeEventListener('pointerover', onOver)
    host?.removeEventListener('pointerout', onOut)
    host?.removeEventListener('focusin', onFocusin)
    host?.removeEventListener('focusout', onFocusout)
    host?.removeEventListener('click', onClick)
    host?.removeEventListener('keydown', onKeydown)
    globalThis.removeEventListener('scroll', reanchor, { capture: true })
    globalThis.removeEventListener('resize', reanchor)
    observer?.disconnect()
    observer = null
    boundEl = null
    clearReset()
  }

  onMounted(() => {
    const host = toValue(root)
    if (!host) return
    boundEl = host
    host.addEventListener('pointerover', onOver)
    host.addEventListener('pointerout', onOut)
    host.addEventListener('focusin', onFocusin)
    host.addEventListener('focusout', onFocusout)
    host.addEventListener('click', onClick)
    host.addEventListener('keydown', onKeydown)
    globalThis.addEventListener('scroll', reanchor, { passive: true, capture: true })
    globalThis.addEventListener('resize', reanchor, { passive: true })
    decorate()
    observer = new globalThis.MutationObserver(decorate)
    observer.observe(host, { childList: true, subtree: true, characterData: true })
  })

  onScopeDispose(unbind)

  return {
    tipFor: readonly(tipFor) as Readonly<Ref<HTMLElement | null>>,
    tipLabel,
    tipLeft: readonly(tipLeft),
    tipTop: readonly(tipTop),
    announcement: readonly(announcement)
  }
}
