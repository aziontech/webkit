// The docs breadcrumb's click, routed in-app.
//
// A crumb is a real anchor — it has to be middle-clickable, ⌘-clickable and copyable like
// every other link in the documentation — so the trail is `href`s, not router `to`s, and
// the plain left click is intercepted here. That is the same split `DocsLayout` makes for
// a rail row (see `followRow`): the modified click stays the browser's, the plain one
// becomes a `router.push` so the SPA stays an SPA instead of reloading the whole app.
//
// It lives in one file because THREE mastheads render the trail — the MDX reading page,
// the Agent Setup index, and an agent's own setup page. Three bindings, one behaviour.
import { useRoute, useRouter } from 'vue-router'

/**
 * A handler for `Breadcrumb`'s `navigate` event.
 *
 * @returns {(event: MouseEvent|KeyboardEvent, href: string) => void}
 */
export function useDocsCrumbNav() {
  const router = useRouter()
  const route = useRoute()

  return (event, href) => {
    // NOT A DESTINATION. `Breadcrumb` gives every crumb without an `href` the placeholder
    // `#` — the docs trail has one, the segment header ("Getting Started"), which titles
    // rows and is not a page. Swallow that click: left alone the browser appends a hash
    // and the shell's scroll container jumps to the top, which reads as a broken link
    // rather than as an inert one.
    if (!href || !href.startsWith('/')) {
      event.preventDefault?.()
      return
    }

    // A modified pointer click belongs to the browser: new tab, new window, middle click.
    // A pick from the collapsed trail's dropdown arrives as a keyboard or synthetic event
    // with no `button`, and that one IS ours to route.
    const pointer = typeof event.button === 'number'
    if (
      pointer &&
      (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    )
      return

    event.preventDefault?.()
    if (route.path !== href) router.push(href)
  }
}
