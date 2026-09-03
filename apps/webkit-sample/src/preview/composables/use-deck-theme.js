// THE DECK IS DARK, FOR AS LONG AS ONE OF ITS ROUTES IS MOUNTED.
//
// Same decision the marketing shell makes, for the same reason: the framed language was drawn
// against `--bg-canvas` at #000, and the frame's hairlines and corner ticks are tuned to read on
// it. A deck previewed in the light theme is not a lighter version of this deck — it is a
// different set of contrast decisions, none of which anyone made.
//
// IT IS REF-COUNTED, and that is the whole reason it is a composable instead of two copies of an
// `onMounted`. The deck is two routes (`/preview` and `/preview/present/:slide`), and moving
// between them mounts one before the other has disposed. Two independent copies would have the
// arriving view capture "dark" as the theme to restore, and the leaving view then restore the
// reader's real theme ON TOP of the presentation — a light deck, from a correct-looking pair of
// hooks. One counter, one captured theme: the first holder pins dark, the last one gives back
// exactly what it found, in whichever order the two hooks happen to run.
//
// Cleanup is `onScopeDispose` rather than `onBeforeUnmount`: it fires for any reactive scope, so
// the release also runs if this is ever called inside a detached `effectScope()`.
import { onMounted, onScopeDispose } from 'vue'

/** How many deck routes are currently mounted, and what the reader had before the first one. */
let holders = 0
let previous = null

export function useDeckTheme() {
  // Whether THIS caller is one of the holders. A scope can be disposed before its `onMounted`
  // ever runs (a route left mid-navigation), and a release that never took a hold would drop the
  // count below the truth and hand the theme back while the other route is still showing.
  let held = false

  onMounted(() => {
    held = true
    if (holders++ > 0) return
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

  onScopeDispose(() => {
    if (!held) return
    held = false
    holders -= 1
    if (holders > 0 || !previous) return
    const root = document.documentElement
    if (previous.dataTheme) root.setAttribute('data-theme', previous.dataTheme)
    root.classList.toggle('azion-dark', previous.dark)
    root.classList.toggle('azion-light', previous.light)
    previous = null
  })
}
