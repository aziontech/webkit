import { loadMigration } from '../../cli/migrate.js'
import { loadPackageMap } from '../../cli/migrate-package.js'
import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const PREFIX = '@aziontech/ui/'
const ICON =
  /(?<![\w-])(?:pi\s+(pi-[a-z0-9]+(?:-[a-z0-9]+)*)|(ai-color|ai-cor|ai)\s+(ai-[a-z0-9]+(?:-[a-z0-9]+)*))(?![\w-])/g

let cached = null
function migration() {
  if (!cached) {
    try {
      cached = { ...loadMigration(6), packages: loadPackageMap().packages || {} }
    } catch {
      cached = { components: {}, removed: {}, props: {}, icons: {}, packages: {} }
    }
  }
  return cached
}

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function iconFindings(text, icons) {
  const { base = {}, azionicons = {}, color = {}, primeicons = {} } = icons
  const out = []
  for (const m of String(text).matchAll(ICON)) {
    if (m[1]) {
      if (!Object.hasOwn(primeicons, m[1])) continue
      const rule = primeicons[m[1]]
      out.push({ old: `pi ${m[1]}`, next: typeof rule === 'string' ? `az ${rule}` : null })
      continue
    }
    const [, , from, name] = m
    if (!base[from]) continue
    const rule = from === 'ai' ? azionicons[name] : color[name]
    const next = typeof rule === 'string' ? rule : `az-${name.slice(3)}`
    out.push({ old: `${from} ${name}`, next: `${base[from]} ${next}` })
  }
  return out
}

const BOUND_DIRECTIVES = new Set(['bind', 'model'])

function attributeName(attr) {
  if (!attr.directive) return { name: attr.key?.name, value: attr.value?.value ?? null }
  const directive = attr.key?.name?.name
  const argument = attr.key?.argument
  if (BOUND_DIRECTIVES.has(directive) && argument?.type === 'VIdentifier') {
    return { name: argument.rawName ?? argument.name, value: null }
  }
  return { name: undefined, value: null }
}

function mapKey(map, name) {
  if (Object.hasOwn(map, name)) return name
  return Object.hasOwn(map, camel(name)) ? camel(name) : null
}

function propFinding(tag, key, rule, value) {
  if (typeof rule === 'string') return { messageId: 'prop', data: { tag, old: key, next: rule } }
  if (rule.removed) return { messageId: 'propRemoved', data: { tag, old: key, hint: rule.removed } }
  if (rule.to && rule.to !== key) {
    return { messageId: 'prop', data: { tag, old: key, next: rule.to } }
  }
  if (rule.values && value !== null && Object.hasOwn(rule.values, value)) {
    return {
      messageId: 'value',
      data: { tag, prop: kebab(key), old: value, next: rule.values[value] }
    }
  }
  return null
}

function checkAttribute(context, props, tag, sub, attr) {
  const map = props[sub]
  if (!map) return
  const { name, value } = attributeName(attr)
  if (!name) return
  const key = mapKey(map, name)
  if (!key) return
  const finding = propFinding(tag, key, map[key], value)
  if (finding) context.report({ node: attr, ...finding })
}

function oldPackage(source, packages) {
  return Object.keys(packages)
    .sort((a, b) => b.length - a.length)
    .find((name) => source === name || source.startsWith(`${name}/`))
}

function checkSource(context, { components, removed, packages = {} }, node) {
  const source = node?.value
  if (typeof source !== 'string') return null
  const old = oldPackage(source, packages)
  if (old) {
    const next = `${packages[old]}${source.slice(old.length)}`
    context.report({ node, messageId: 'package', data: { old: source, next } })
    return null
  }
  if (!source.startsWith(PREFIX)) return null
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

function checkIcons(context, icons, node, text) {
  for (const f of iconFindings(text, icons)) {
    if (f.next) context.report({ node, messageId: 'icon', data: f })
    else context.report({ node, messageId: 'iconRemoved', data: f })
  }
}

function scriptVisitors(context, maps, bindings) {
  const source = (node) => checkSource(context, maps, node)
  const icons = (node, text) => checkIcons(context, maps.icons, node, text)
  return {
    ImportDeclaration(node) {
      const sub = source(node.source)
      if (!sub) return
      for (const spec of node.specifiers || []) {
        if (spec.type === 'ImportDefaultSpecifier') bindings.set(spec.local.name, sub)
      }
    },
    ImportExpression: (node) => node.source?.type === 'Literal' && source(node.source),
    ExportNamedDeclaration: (node) => node.source && source(node.source),
    ExportAllDeclaration: (node) => node.source && source(node.source),
    Literal(node) {
      if (typeof node.value === 'string' && !node.value.startsWith(PREFIX)) icons(node, node.value)
    },
    TemplateElement(node) {
      icons(node, node.value?.cooked ?? '')
    }
  }
}

function templateVisitors(context, maps, bindings) {
  const icons = (node, text) => checkIcons(context, maps.icons, node, text)
  return {
    VElement(node) {
      const raw = node.rawName ?? ''
      const pascal = raw.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())
      const resolved = bindings.get(raw) ?? bindings.get(pascal)
      if (!resolved) return
      for (const attr of node.startTag?.attributes ?? []) {
        checkAttribute(context, maps.props, raw, resolved, attr)
      }
    },
    VLiteral(node) {
      icons(node, node.value)
    },
    Literal(node) {
      if (typeof node.value === 'string') icons(node, node.value)
    }
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Flag a name Azion UI 6.0 renamed or removed: an import of the old package name, of a retired component subpath, a ' +
        'renamed prop or value on an Azion UI tag, a retired icon class. Reads the same maps ' +
        '`azion-ui migrate` applies (src/cli/migrations/v6*.json), so running `npx ' +
        '@aziontech/ui migrate` fixes what this rule reports.'
    },
    schema: [],
    messages: {
      package:
        "'{{old}}' is the old package name: Azion UI 6.0 ships as @aziontech/ui. Import '{{next}}' and run `npx @aziontech/ui migrate v6`.",
      component: "'{{old}}' was renamed in Azion UI 6.0 — import '{{next}}'.",
      removed: "'{{old}}' was removed in Azion UI 6.0: {{hint}}",
      prop: '{{tag}}: the prop "{{old}}" is "{{next}}" since Azion UI 6.0.',
      value: '{{tag}}: {{prop}}="{{old}}" is {{prop}}="{{next}}" since Azion UI 6.0.',
      propRemoved: '{{tag}}: the prop "{{old}}" was removed in Azion UI 6.0: {{hint}}',
      icon: 'The icon class "{{old}}" is "{{next}}" since Azion UI 6.0.',
      iconRemoved: 'The icon class "{{old}}" has no Azion UI 6.0 icon; draw your own SVG.'
    }
  },
  create(context) {
    const maps = migration()
    const bindings = new Map()
    const script = scriptVisitors(context, maps, bindings)
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return script
    return factory(templateVisitors(context, maps, bindings), script)
  }
}
