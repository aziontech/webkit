import { loadMigration } from '../../cli/migrate.js'
import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const PREFIX = '@aziontech/webkit/'
const ICON =
  /(?<![\w-])(?:pi\s+(pi-[a-z0-9]+(?:-[a-z0-9]+)*)|(ai-[a-z0-9]+(?:-[a-z0-9]+)*))(?![\w-])/g

let cached = null
function migration() {
  if (!cached) {
    try {
      cached = loadMigration(6)
    } catch {
      cached = { components: {}, removed: {}, props: {}, icons: {} }
    }
  }
  return cached
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function flatIcons(icons) {
  if (!icons.primeicons && !icons.azionicons) return icons
  const azion = Object.fromEntries(
    Object.entries(icons.azionicons || {}).filter(([, rule]) => typeof rule === 'string')
  )
  return { ...icons.primeicons, ...azion }
}

function iconFindings(text, icons) {
  const out = []
  for (const m of String(text).matchAll(ICON)) {
    const name = m[1] || m[2]
    if (!Object.hasOwn(icons, name)) continue
    const rule = icons[name]
    const next = typeof rule === 'string' ? rule : null
    out.push(m[1] ? { old: `pi ${name}`, next: next && `ai ${next}` } : { old: name, next })
  }
  return out
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Flag a name WebKit 6.0 renamed or removed: an import of a retired component subpath, a renamed prop or value on a WebKit tag, a retired icon class. Reads the same maps `webkit migrate` applies (src/cli/migrations/v6*.json), so running `npx @aziontech/webkit migrate` fixes what this rule reports.'
    },
    schema: [],
    messages: {
      component: "'{{old}}' was renamed in WebKit 6.0 — import '{{next}}'.",
      removed: "'{{old}}' was removed in WebKit 6.0: {{hint}}",
      prop: '{{tag}}: the prop "{{old}}" is "{{next}}" since WebKit 6.0.',
      value: '{{tag}}: {{prop}}="{{old}}" is {{prop}}="{{next}}" since WebKit 6.0.',
      propRemoved: '{{tag}}: the prop "{{old}}" was removed in WebKit 6.0: {{hint}}',
      icon: 'The icon class "{{old}}" is "{{next}}" since WebKit 6.0.',
      iconRemoved: 'The icon class "{{old}}" has no WebKit 6.0 icon; draw your own SVG.'
    }
  },
  create(context) {
    const { components, removed, props, icons } = migration()
    const bindings = new Map()

    function checkSource(node) {
      const source = node?.value
      if (typeof source !== 'string' || !source.startsWith(PREFIX)) return null
      const sub = source.slice(PREFIX.length)
      if (components[sub]) {
        context.report({
          node,
          messageId: 'component',
          data: { old: source, next: `${PREFIX}${components[sub].to}` }
        })
      } else if (removed[sub]) {
        context.report({ node, messageId: 'removed', data: { old: source, hint: removed[sub] } })
      }
      return sub
    }

    function checkIcons(node, text) {
      for (const f of iconFindings(text, flatIcons(icons))) {
        if (f.next) context.report({ node, messageId: 'icon', data: f })
        else context.report({ node, messageId: 'iconRemoved', data: f })
      }
    }

    function checkAttribute(tag, sub, attr) {
      const map = props[sub]
      if (!map) return
      let name
      let value = null
      if (!attr.directive) {
        name = attr.key?.name
        value = attr.value?.value ?? null
      } else if (attr.key?.name?.name === 'bind' && attr.key.argument?.type === 'VIdentifier') {
        name = attr.key.argument.rawName ?? attr.key.argument.name
      } else if (attr.key?.name?.name === 'model' && attr.key.argument?.type === 'VIdentifier') {
        name = attr.key.argument.rawName ?? attr.key.argument.name
      }
      if (!name) return
      const key = Object.hasOwn(map, name)
        ? name
        : Object.hasOwn(map, camel(name))
          ? camel(name)
          : null
      if (!key) return
      const rule = map[key]
      if (typeof rule === 'string') {
        context.report({ node: attr, messageId: 'prop', data: { tag, old: key, next: rule } })
        return
      }
      if (rule.removed) {
        context.report({
          node: attr,
          messageId: 'propRemoved',
          data: { tag, old: key, hint: rule.removed }
        })
        return
      }
      if (rule.to && rule.to !== key) {
        context.report({ node: attr, messageId: 'prop', data: { tag, old: key, next: rule.to } })
        return
      }
      if (rule.values && value !== null && Object.hasOwn(rule.values, value)) {
        context.report({
          node: attr,
          messageId: 'value',
          data: { tag, prop: kebab(key), old: value, next: rule.values[value] }
        })
      }
    }

    const script = {
      ImportDeclaration(node) {
        const sub = checkSource(node.source)
        if (!sub) return
        for (const spec of node.specifiers || []) {
          if (spec.type === 'ImportDefaultSpecifier') bindings.set(spec.local.name, sub)
        }
      },
      ImportExpression: (node) => node.source?.type === 'Literal' && checkSource(node.source),
      ExportNamedDeclaration: (node) => node.source && checkSource(node.source),
      ExportAllDeclaration: (node) => node.source && checkSource(node.source),
      Literal(node) {
        if (typeof node.value === 'string' && !node.value.startsWith(PREFIX))
          checkIcons(node, node.value)
      },
      TemplateElement(node) {
        checkIcons(node, node.value?.cooked ?? '')
      }
    }

    const factory = templateBodyVisitorFactory(context)
    if (!factory) return script

    return factory(
      {
        VElement(node) {
          const raw = node.rawName ?? ''
          const pascal = raw.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())
          const resolved = bindings.get(raw) ?? bindings.get(pascal)
          if (!resolved) return
          for (const attr of node.startTag?.attributes ?? []) checkAttribute(raw, resolved, attr)
        },
        VLiteral(node) {
          checkIcons(node, node.value)
        },
        Literal(node) {
          if (typeof node.value === 'string') checkIcons(node, node.value)
        }
      },
      script
    )
  }
}
