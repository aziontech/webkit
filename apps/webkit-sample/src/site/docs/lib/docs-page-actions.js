import { computed, ref } from 'vue'

/**
 * The "Copy page" split button, as one definition both docs pages share.
 *
 * The control is a SPLIT because it is a split: the primary segment does the one
 * thing almost everyone wants (put the page on the clipboard), and the menu holds
 * the variants — the link, the raw markdown, and handing the page to each
 * assistant by name. Naming the vendors is the point of that list: "Open in AI"
 * makes the reader guess which one, while "Open in Claude" is a decision they can
 * make at a glance.
 *
 * Each assistant entry builds its own search URL from the page's address, which is
 * how the published docs' own "open in" actions work — the assistant fetches the
 * page itself, so nothing has to be pasted and the prompt is the same every time.
 *
 * The glyph is `pi pi-external-link` for all five rather than each vendor's mark:
 * @aziontech/icons ships brand glyphs for the frameworks and for Google, but not
 * for ChatGPT, Claude, Perplexity or Grok, and half a row of real marks beside
 * half a row of fallbacks reads worse than one honest verb glyph. Add the marks to
 * the icon library and they can all become brands together.
 */

/** What each assistant is handed: the page's address plus what to do with it. */
const ask = (pageUrl) => `Read ${pageUrl} and help me get started building on Azion.`

/**
 * Build the page-action model and its behaviour.
 *
 * @param {() => string} markdown - the page's own markdown, for copy / view.
 * @returns {{ actions: object[], copied: import('vue').Ref<boolean>,
 *   label: import('vue').ComputedRef<string>, icon: import('vue').ComputedRef<string>,
 *   copyPage: () => void, onPageAction: (event: MouseEvent, item: object) => void }}
 */
export function useDocsPageActions(markdown) {
  const pageUrl = () => globalThis.location?.href ?? 'https://www.azion.com/en/documentation/'

  const actions = [
    { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-file' },
    {
      value: 'google',
      label: 'Open in Google AI',
      icon: 'pi pi-external-link',
      url: () => `https://www.google.com/search?udm=50&q=${encodeURIComponent(ask(pageUrl()))}`
    },
    {
      value: 'perplexity',
      label: 'Open in Perplexity',
      icon: 'pi pi-external-link',
      url: () => `https://www.perplexity.ai/search?q=${encodeURIComponent(ask(pageUrl()))}`
    },
    {
      value: 'claude',
      label: 'Open in Claude',
      icon: 'pi pi-external-link',
      url: () => `https://claude.ai/new?q=${encodeURIComponent(ask(pageUrl()))}`
    },
    {
      value: 'chatgpt',
      label: 'Open in ChatGPT',
      icon: 'pi pi-external-link',
      url: () => `https://chatgpt.com/?q=${encodeURIComponent(ask(pageUrl()))}`
    },
    {
      value: 'grok',
      label: 'Open in Grok',
      icon: 'pi pi-external-link',
      url: () => `https://grok.com/?q=${encodeURIComponent(ask(pageUrl()))}`
    }
  ]

  // The primary segment reports back on itself for two seconds — a clipboard write has
  // no other visible outcome, so without it the click looks like nothing happened.
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

  const copyPage = () => writeClipboard(markdown())

  // "View" really views it: the markdown is served to a new tab from a blob, so the
  // prototype needs no .md route to show the source of the page it is on.
  const viewMarkdown = () => {
    const blob = new globalThis.Blob([markdown()], { type: 'text/plain' })
    const url = globalThis.URL.createObjectURL(blob)
    globalThis.open(url, '_blank', 'noopener')
    globalThis.setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000)
  }

  // SplitButton emits (event, item) — event first, per the event-payload convention.
  const onPageAction = (event, item) => {
    const action = actions.find((entry) => entry.value === item.value)
    if (!action) return
    if (action.url) return globalThis.open(action.url(), '_blank', 'noopener')
    if (action.value === 'link') return writeClipboard(pageUrl())
    if (action.value === 'markdown') return viewMarkdown()
  }

  return {
    actions,
    copied,
    label: computed(() => (copied.value ? 'Copied' : 'Copy page')),
    icon: computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy')),
    copyPage,
    onPageAction
  }
}
