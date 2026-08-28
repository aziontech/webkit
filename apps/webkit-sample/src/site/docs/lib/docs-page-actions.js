import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The docs page's action belt, as one definition every masthead shares.
 *
 * THE PAGE'S ACTIONS ARE A LINE OF METADATA, not a control on the title's line.
 * They lived in a `Copy page` split button beside the h1 — a large outlined
 * control whose menu held the variants (the link, the raw markdown, each
 * assistant by name). Two problems, and the second is the one that decided it:
 * the button competed with the page's own name for the eye, and half of what it
 * offered was one click deep in a menu nobody opens. As entries on the meta line
 * they sit beside the date they qualify, at the quietest register the masthead
 * has, and every one of them is visible at a glance.
 *
 * ONE ENTRY, ONE SENTENCE. Each carries a `tip` because two or three words cannot
 * say what a control will do; the masthead shows it on hover and on focus.
 */

/**
 * Build the page's action belt and its behaviour.
 *
 * @param {() => string} markdown - the page's own markdown, for copy / view.
 * @returns {{ metaActions: import('vue').ComputedRef<object[]>,
 *   onMetaAction: (event: MouseEvent, item: object) => void }}
 */
export function useDocsPageActions(markdown) {
  const router = useRouter()
  const route = useRoute()

  // The copy entry reports back on itself for two seconds — a clipboard write has no
  // other visible outcome, so without it the click looks like nothing happened.
  const copied = ref(false)

  const writeClipboard = async (text) => {
    // `writeText` rejects when the document is not focused (and in browsers that gate
    // the permission), which would otherwise surface as an unhandled rejection and skip
    // the confirmation entirely.
    try {
      await globalThis.navigator?.clipboard?.writeText(text)
    } catch {
      return
    }
    copied.value = true
    globalThis.setTimeout(() => (copied.value = false), 2000)
  }

  // "View" really views it: the markdown is served to a new tab from a blob, so the
  // prototype needs no .md route to show the source of the page it is on.
  const viewMarkdown = () => {
    const blob = new globalThis.Blob([markdown()], { type: 'text/plain' })
    const url = globalThis.URL.createObjectURL(blob)
    globalThis.open(url, '_blank', 'noopener')
    globalThis.setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000)
  }

  /**
   * The meta line's controls, in reading order.
   *
   * THE COPY ENTRY REPORTS BACK THROUGH ITS GLYPH, not its label. The old split button
   * could swap `Copy page` for `Copied` because it sat alone at the end of the title's
   * line, where nothing moved. Here the entry has two neighbours and a rule between each
   * pair: a label that loses 60px for two seconds shoves the rest of the belt left and
   * back again, which reads as a glitch rather than as a confirmation. The check glyph
   * confirms in place, and the entry keeps its measured 147.56px throughout.
   *
   * AN ENTRY THAT POINTS AT THE PAGE YOU ARE ON IS NOT AN ENTRY — `Agent setup` drops
   * itself on `/site/docs/agent-setup`, so the strip never offers a control that would
   * do nothing.
   */
  const metaActions = computed(() =>
    [
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: copied.value ? 'pi pi-check' : 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'markdown',
        label: 'View as Markdown',
        icon: 'pi pi-eye',
        tip: 'Open this page as plain Markdown in a new tab.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/site/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ].filter((action) => action.href !== route.path)
  )

  // Same split the trail and the rail make (see docs-crumb-nav): an in-app destination is a
  // real anchor so it can be middle-clicked, ⌘-clicked and copied — and the plain left click
  // is taken into the router so the SPA stays an SPA. An off-site href is left to the browser.
  const followInternal = (event, href) => {
    if (!href || !href.startsWith('/')) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    if (route.path !== href) router.push(href)
  }

  // DocPageHeader emits (event, item) — event first, per the event-payload convention.
  const onMetaAction = (event, item) => {
    if (item.value === 'copy') return writeClipboard(markdown())
    if (item.value === 'markdown') return viewMarkdown()
    followInternal(event, item.href)
  }

  return { metaActions, onMetaAction }
}
