import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const WEBKIT_PREFIX = '@aziontech/webkit/'

const MENU_ENTRIES = new Set([
  'sidebar-menu',
  'sidebar-menu-root',
  'sidebar-menu-group',
  'sidebar-menu-sub',
  'sidebar-menu-sub-trigger',
  'sidebar-menu-sub-content',
  'sidebar-menu-back',
  'sidebar-menu-item'
])

const PAGE_CHROME = new Set(['page-header', 'page-tabs'])

const MENU_HOST = /^(?:sidebar|console-layout|doc-layout|app-layout)(?:-|$)/

const PAGE_PATH = /(?:^|\/)(?:views|pages)\//

function entryOf(source) {
  if (typeof source !== 'string' || !source.startsWith(WEBKIT_PREFIX)) return null
  return source.slice(WEBKIT_PREFIX.length)
}

function filenameOf(context) {
  const name =
    context.filename ?? (typeof context.getFilename === 'function' ? context.getFilename() : '')
  return String(name || '').replace(/\\/g, '/')
}

function bindingOf(rawName) {
  const base = String(rawName || '').split('.')[0]
  if (!base.includes('-')) return base
  return base
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function localNames(node) {
  return node.specifiers
    .filter((specifier) => specifier.type === 'ImportDefaultSpecifier')
    .map((specifier) => specifier.local.name)
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a page body (a file under views/ or pages/, or one that imports PageHeader or PageTabs) renders a Menu outside a navigation host (Sidebar, ConsoleLayout, DocLayout, AppLayout): page navigation lives in the rail, and a page has only its PageTabs.'
    },
    schema: [],
    messages: {
      pageMenu:
        "'{{source}}' in a page body: page navigation lives in the rail (two levels at most), and a page has only its PageTabs, so a Menu in the page repeats their destinations. Drop it: list the pages in the rail, or show a resource's pages as its PageTabs (at most 7, related pages as sections of one tab) (rule `webkit-navigation-levels`)."
    }
  },
  create(context) {
    const filename = filenameOf(context)
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    const menuImports = []
    const menuNames = new Set()
    const hostNames = new Set()
    let pageChrome = PAGE_PATH.test(filename)

    const report = (node, source) =>
      context.report({ node, messageId: 'pageMenu', data: { source } })

    const scriptVisitor = {
      ImportDeclaration(node) {
        const entry = entryOf(node.source.value)
        if (!entry) return
        if (PAGE_CHROME.has(entry)) pageChrome = true
        if (MENU_HOST.test(entry)) for (const name of localNames(node)) hostNames.add(name)
        if (MENU_ENTRIES.has(entry)) {
          menuImports.push(node)
          for (const name of localNames(node)) menuNames.add(name)
        }
      },
      'Program:exit'() {
        if (sourceCode.ast.templateBody) return
        if (!pageChrome || menuImports.length === 0) return
        const [first] = menuImports
        report(first.source, first.source.value)
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor

    const menuSource = (name) =>
      menuImports.find((node) => localNames(node).includes(name))?.source.value ??
      WEBKIT_PREFIX + 'sidebar-menu'

    return factory(
      {
        VElement(node) {
          if (!pageChrome) return
          const name = bindingOf(node.rawName)
          if (!menuNames.has(name)) return
          for (
            let parent = node.parent;
            parent && parent.type === 'VElement';
            parent = parent.parent
          ) {
            const parentName = bindingOf(parent.rawName)
            if (hostNames.has(parentName) || menuNames.has(parentName)) return
          }
          report(node.startTag, menuSource(name))
        }
      },
      scriptVisitor
    )
  }
}
