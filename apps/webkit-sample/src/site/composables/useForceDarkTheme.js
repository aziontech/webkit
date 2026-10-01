import { onBeforeUnmount, onMounted } from 'vue'

/**
 * useForceDarkTheme — pins the document root to the dark theme while the calling component is
 * mounted, restoring whatever the user had chosen (light/dark/system) on unmount.
 *
 * The marketing site is dark-only by design (the azion.com look). Both shells that render a
 * `/site` page need this — `SiteLayout` (nav + footer) and any chrome-free variant of the same
 * page — so it lives here rather than duplicated in each one.
 */
export function useForceDarkTheme() {
  let previous = null

  onMounted(() => {
    const root = document.documentElement
    previous = {
      dataTheme: root.getAttribute('data-theme'),
      dark: root.classList.contains('azion-dark'),
      light: root.classList.contains('azion-light')
    }
    root.setAttribute('data-theme', 'dark')
    root.classList.add('azion', 'azion-dark')
    root.classList.remove('azion-light')
  })

  onBeforeUnmount(() => {
    if (!previous) return
    const root = document.documentElement
    if (previous.dataTheme) root.setAttribute('data-theme', previous.dataTheme)
    root.classList.toggle('azion-dark', previous.dark)
    root.classList.toggle('azion-light', previous.light)
  })
}
