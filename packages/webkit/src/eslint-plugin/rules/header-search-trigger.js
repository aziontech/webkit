import { templateBodyVisitorFactory } from '../util.js'

const HEADER = new Set(['GlobalHeader', 'global-header'])
const TRIGGER = new Set(['SearchTrigger', 'search-trigger'])
const NAVIGATION = new Set([
  'GlobalHeader.Nav',
  'global-header.nav',
  'NavigationMenu',
  'navigation-menu',
  'Sidebar',
  'sidebar'
])
const ICON_BUTTONS = new Set(['IconButton', 'icon-button', 'Button', 'button'])
const SHORTCUT = /\b(?:meta|control)\+k\b/i

function staticAttr(element, name) {
  for (const attr of element?.startTag?.attributes ?? []) {
    if (!attr.directive && attr.key?.name === name) return attr.value?.value ?? ''
  }
  return null
}

function* descendants(node) {
  for (const child of node?.children ?? []) {
    if (child.type !== 'VElement') continue
    yield child
    yield* descendants(child)
  }
}

function templateRoot(node) {
  let current = node
  while (current.parent && current.parent.type === 'VElement') current = current.parent
  return current
}

function insideHeader(node) {
  for (
    let current = node.parent;
    current && current.type === 'VElement';
    current = current.parent
  ) {
    if (HEADER.has(current.rawName)) return true
  }
  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Every app header offers search through SearchTrigger: flag a GlobalHeader that carries navigation (GlobalHeader.Nav, NavigationMenu or a Sidebar in the same template) without a SearchTrigger, a hand-rolled ⌘K field (aria-keyshortcuts Meta+K / Control+K on anything but SearchTrigger), and a bare magnifier button inside a GlobalHeader.'
    },
    schema: [],
    messages: {
      missing:
        'This app header has navigation but no search. Add <SearchTrigger collapsible @open="open = true" /> (import SearchTrigger from \'@aziontech/webkit/search-trigger\') first in GlobalHeader.Right, wire it to a <Command v-model:open="open">, and wrap the header in an @container. Focused task headers (sign-in, create flows) have no navigation and are not checked.',
      handRolled:
        'Hand-rolled ⌘K search field. Use <SearchTrigger> (@aziontech/webkit/search-trigger): it draws the field, the OS-aware keycap, aria-keyshortcuts, the narrow fold, and binds ⌘K / Ctrl K.',
      bareIcon:
        'A magnifier button in a header is the folded SearchTrigger. Use <SearchTrigger collapsible> so the field, its ⌘K / Ctrl K keycap and the shortcut come with it.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}

    return factory({
      VElement(node) {
        const raw = node.rawName ?? ''

        if (!TRIGGER.has(raw)) {
          const keys = staticAttr(node, 'aria-keyshortcuts')
          if (keys && SHORTCUT.test(keys)) {
            context.report({ node: node.startTag, messageId: 'handRolled' })
            return
          }
        }

        if (ICON_BUTTONS.has(raw) && /\bpi-search\b/.test(staticAttr(node, 'icon') ?? '')) {
          if (insideHeader(node)) context.report({ node: node.startTag, messageId: 'bareIcon' })
          return
        }

        if (!HEADER.has(raw)) return
        const root = templateRoot(node)
        const everything = [...descendants(root)]
        const navigates =
          [...descendants(node)].some((el) => NAVIGATION.has(el.rawName)) ||
          everything.some((el) => el.rawName === 'Sidebar' || el.rawName === 'sidebar')
        if (!navigates) return
        if (everything.some((el) => TRIGGER.has(el.rawName))) return
        context.report({ node: node.startTag, messageId: 'missing' })
      }
    })
  }
}
