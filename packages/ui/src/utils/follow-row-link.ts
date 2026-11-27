export const followRowLink = (event: MouseEvent): void => {
  const target = event.target as Element | null
  if (!target || target.closest('a, button')) return
  if (window.getSelection()?.toString()) return
  const link = (event.currentTarget as Element | null)?.querySelector('a[href]')
  link?.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey
    })
  )
}
