import {
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  type Ref,
  toValue
} from 'vue'

import * as en from '../../locales/en'
import { useTranslate } from '../use-translate'
import { useCopyTip, type UseCopyTipReturn } from './composables/use-copy-tip'
import { chipFrom, decorateChips } from './lib/chip'

export type { InlineCodeCopyState } from './composables/use-copy-tip'

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

type ChipListeners = {
  pointerover: (event: globalThis.PointerEvent) => void
  pointerout: (event: globalThis.PointerEvent) => void
  focusin: (event: globalThis.FocusEvent) => void
  focusout: (event: globalThis.FocusEvent) => void
  click: (event: globalThis.MouseEvent) => void
  keydown: (event: globalThis.KeyboardEvent) => void
}

function chipListeners(
  chipOf: (target: globalThis.EventTarget | null) => HTMLElement | null,
  tip: UseCopyTipReturn
): ChipListeners {
  return {
    pointerover: (event) => {
      const chip = chipOf(event.target)
      if (chip) tip.show(chip)
    },
    pointerout: (event) => {
      const chip = chipOf(event.target)
      if (!chip || chipOf(event.relatedTarget) === chip) return
      if (chip === globalThis.document?.activeElement) return
      tip.hide(chip)
    },
    focusin: (event) => {
      const chip = chipOf(event.target)
      if (chip?.hasAttribute('data-command')) tip.show(chip)
    },
    focusout: (event) => {
      const chip = chipOf(event.target)
      if (chip) tip.hide(chip)
    },
    click: (event) => {
      const chip = chipOf(event.target)
      if (chip) void tip.copy(chip)
    },
    keydown: (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const chip = chipOf(event.target)
      if (!chip?.hasAttribute('data-command')) return
      event.preventDefault()
      void tip.copy(chip)
    }
  }
}

export function useInlineCodeCopy(
  root: MaybeRefOrGetter<HTMLElement | null>
): UseInlineCodeCopyReturn {
  const { t } = useTranslate({ copyText: en.copyText })
  const tip = useCopyTip()
  const listeners = chipListeners((target) => chipFrom(toValue(root), target), tip)
  const events = Object.keys(listeners) as (keyof ChipListeners)[]
  let observer: globalThis.MutationObserver | null = null
  let boundEl: HTMLElement | null = null

  const decorate = (): void => {
    const host = toValue(root)
    if (host) decorateChips(host, (value) => t('copyText.copy', { value }))
  }

  const unbind = (): void => {
    for (const name of events)
      boundEl?.removeEventListener(name, listeners[name] as globalThis.EventListener)
    globalThis.removeEventListener('scroll', tip.reanchor, { capture: true })
    globalThis.removeEventListener('resize', tip.reanchor)
    observer?.disconnect()
    observer = null
    boundEl = null
    tip.clearReset()
  }

  onMounted(() => {
    const host = toValue(root)
    if (!host) return
    boundEl = host
    for (const name of events)
      host.addEventListener(name, listeners[name] as globalThis.EventListener)
    globalThis.addEventListener('scroll', tip.reanchor, { passive: true, capture: true })
    globalThis.addEventListener('resize', tip.reanchor, { passive: true })
    decorate()
    observer = new globalThis.MutationObserver(decorate)
    observer.observe(host, { childList: true, subtree: true, characterData: true })
  })

  onScopeDispose(unbind)

  return {
    tipFor: tip.tipFor,
    tipLabel: tip.tipLabel,
    tipLeft: tip.tipLeft,
    tipTop: tip.tipTop,
    announcement: tip.announcement
  }
}
