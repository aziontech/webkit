const WEBKIT_PREFIX = '@aziontech/webkit/'

const MENU_ENTRIES = new Set([
  'menu',
  'menu-root',
  'menu-group',
  'menu-sub',
  'menu-sub-trigger',
  'menu-sub-content',
  'menu-back',
  'menu-item'
])

const PAGE_CHROME = new Set(['page-header', 'page-tabs'])

const MENU_HOST = /^sidebar(?:-|$)/

const PAGE_PATH = /(?:^|\/)(?:views|pages)\//

const SECTIONED_RESOURCE = /(?:^|\/)blocks\/platform\/detail\/sectioned-resource\//

const MARKER = /\/\*\s*webkit-local-navigation\s*\*\/|<!--\s*webkit-local-navigation\s*-->/

function entryOf(source) {
  if (typeof source !== 'string' || !source.startsWith(WEBKIT_PREFIX)) return null
  return source.slice(WEBKIT_PREFIX.length)
}

function filenameOf(context) {
  const name =
    context.filename ?? (typeof context.getFilename === 'function' ? context.getFilename() : '')
  return String(name || '').replace(/\\/g, '/')
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a page body (a file under views/ or pages/, or one that imports PageHeader or PageTabs, and no Sidebar) imports Menu: a free in-page Menu repeats the rail or the page tabs. Local navigation inside a tab is the platform/detail/sectioned-resource block.'
    },
    schema: [],
    messages: {
      pageMenu:
        "'{{source}}' in a page body: a screen shows one navigation per level (rail, page tabs, at most one local navigation), and a free Menu in the page repeats their destinations. Drop it and reach these pages through the rail or the resource's PageTabs; when a tab holds more than 7 sibling pages, use the `platform/detail/sectioned-resource` block (rule `webkit-navigation-levels`). An intended local navigation carries the `webkit-local-navigation` marker comment."
    }
  },
  create(context) {
    const filename = filenameOf(context)
    if (SECTIONED_RESOURCE.test(filename)) return {}
    const text = (context.sourceCode ?? context.getSourceCode()).text
    if (MARKER.test(text)) return {}

    const menuImports = []
    let pageChrome = PAGE_PATH.test(filename)
    let hosted = false

    return {
      ImportDeclaration(node) {
        const entry = entryOf(node.source.value)
        if (!entry) return
        if (PAGE_CHROME.has(entry)) pageChrome = true
        if (MENU_HOST.test(entry)) hosted = true
        if (MENU_ENTRIES.has(entry)) menuImports.push(node)
      },
      'Program:exit'() {
        if (!pageChrome || hosted || menuImports.length === 0) return
        const [first] = menuImports
        context.report({
          node: first.source,
          messageId: 'pageMenu',
          data: { source: first.source.value }
        })
      }
    }
  }
}
