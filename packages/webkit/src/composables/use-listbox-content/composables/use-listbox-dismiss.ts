import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  type Ref,
  toValue,
  watch
} from 'vue'

export interface UseListboxDismissOptions {
  open: MaybeRefOrGetter<boolean>
  setOpen: (value: boolean) => void
  root: Ref<globalThis.HTMLElement | null>
  triggerEl: Ref<globalThis.HTMLElement | null>
  onOpened: () => Promise<void>
  focusBack: () => void
}

export function useListboxDismiss(options: UseListboxDismissOptions): void {
  const { root, triggerEl, setOpen } = options
  const isOpen = () => toValue(options.open)

  const onDocumentPointerdown = (event: globalThis.PointerEvent) => {
    if (!isOpen()) return
    const el = root.value
    const target = event.target as globalThis.Node | null
    if (!el || !target) return
    if (el.contains(target)) return
    if (triggerEl.value?.contains(target)) return
    setOpen(false)
  }

  const listen = () => document.addEventListener('pointerdown', onDocumentPointerdown, true)
  const unlisten = () => document.removeEventListener('pointerdown', onDocumentPointerdown, true)

  const onClosed = async () => {
    const hadFocus = !!root.value?.contains(document.activeElement)
    unlisten()
    if (!hadFocus) return
    await nextTick()
    options.focusBack()
  }

  watch(
    () => isOpen(),
    async (next) => {
      if (!next) return onClosed()
      await nextTick()
      await options.onOpened()
      listen()
    }
  )

  onMounted(() => {
    if (isOpen()) listen()
  })

  onScopeDispose(unlisten)
}
