import { isChartPaletteClass } from '../../eslint-plugin/lib/chart-palette.js'
import { LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from '../../eslint-plugin/lib/layout-classes.js'
import { NOT_AVAILABLE, subpathOf } from '../lib/results.js'
import { pascalCase } from '../lib/text.js'
import { getComponent } from './components.js'

const EMPTY_DEFAULTS = new Set(['', '—', "''", '[]', '{}'])

const scalar = (t) => /^('.*'|string|number|boolean)/.test(String(t || '').trim())

const isRequired = (p) => ['true', 'yes'].includes(String(p.required).toLowerCase())

const TYPE_DEFAULTS = { boolean: true, number: 0 }

function literalDefault(p) {
  const d = String(p.default ?? '').trim()
  if (!EMPTY_DEFAULTS.has(d)) return d.replace(/^'|'$/g, '')
  const t = String(p.type || '').trim()
  if (/^'/.test(t)) return t.split('|')[0].trim().replace(/^'|'$/g, '')
  return Object.hasOwn(TYPE_DEFAULTS, t) ? TYPE_DEFAULTS[t] : 'text'
}

function nonScalarLiteral(t) {
  if (/\[\]\s*$|^Array\s*<|^readonly\s/.test(t)) return '[]'
  if (/=>|\bFunction\b/.test(t)) return '() => {}'
  return '{}'
}

function exampleAttr(p) {
  const t = String(p.type || '').trim()
  if (t === 'boolean') {
    const v = literalDefault(p)
    return v === true || v === 'true' ? p.name : null
  }
  if (t === 'number') return `:${p.name}="${literalDefault(p)}"`
  if (scalar(t)) return `${p.name}="${literalDefault(p)}"`
  return `:${p.name}="${nonScalarLiteral(t)}"`
}

function exampleProps(props) {
  const required = props.filter(isRequired)
  const leading = props.filter((p) => !isRequired(p) && scalar(p.type))
  const chosen = [...required, ...leading].slice(0, Math.max(required.length, 2)).slice(0, 3)
  return chosen.map((p) => ({ name: p.name, attr: exampleAttr(p) }))
}

function exampleFromStory(comp) {
  const [example] = comp.examples
  return {
    ok: true,
    available: true,
    found: true,
    name: comp.name,
    binding: comp.binding,
    source: `example ${example.name}`,
    sfc: example.sfc,
    otherExamples: comp.examples.slice(1).map((ex) => ex.name),
    note: 'Taken from the component examples (the same SFC the docs site shows). get_component returns every example.'
  }
}

function compoundNote(comp) {
  if (!comp.compoundRoot) return undefined
  const subs = comp.subcomponents ?? []
  const more = subs.length > 3 ? ', ...' : ''
  return `${comp.name} is a compound root — sub-components (${subs.slice(0, 3).join(', ')}${more}) compose inside it.`
}

function generatedExample(catalog, comp) {
  const tree = comp.treeShakeableImport
  const binding = pascalCase(subpathOf(catalog, tree))
  const importLine = `import ${binding} from '${tree}'`
  const attrs = exampleProps(comp.props)
    .map((p) => p.attr)
    .filter(Boolean)
  const hasDefaultSlot = comp.slots.some((s) => s.name === 'default' || s.name === '—' || !s.name)
  const openTag = attrs.length ? `<${binding} ${attrs.join(' ')}` : `<${binding}`
  const tag = hasDefaultSlot ? `${openTag}>${binding} content</${binding}>` : `${openTag} />`
  return {
    ok: true,
    available: true,
    found: true,
    name: comp.name,
    binding,
    import: importLine,
    sfc: `<script setup>\n${importLine}\n</script>\n\n<template>\n  ${tag}\n</template>\n`,
    note: compoundNote(comp)
  }
}

export function getUsageExample(catalog, name, { fromStory = true } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const comp = getComponent(catalog, name)
  if (!comp.found) return comp
  return fromStory && comp.examples.length
    ? exampleFromStory(comp)
    : generatedExample(catalog, comp)
}

function webkitImportProblem(catalog, raw) {
  const prefix = catalog.prefix
  const sub = raw === catalog.bare ? '' : raw.slice(prefix.length)
  const denied = catalog.deniedPrefixes.find((p) => raw.startsWith(p))
  if (denied) {
    return {
      kind: 'import',
      severity: 'error',
      import: raw,
      message: `Denied import path (private internals): starts with "${denied}". Use a published export.`,
      suggestions: catalog.suggestSubpaths(sub)
    }
  }
  if (catalog.has(sub)) return null
  const nearest = catalog.nearestPublishedPrefix(sub)
  return {
    kind: 'import',
    severity: 'error',
    import: raw,
    message: `Unknown webkit export "${raw}".`,
    nearestPublishedPrefix: nearest ? `${prefix}${nearest}` : null,
    suggestions: catalog.suggestSubpaths(sub)
  }
}

function importProblems(catalog, importPath) {
  if (importPath == null || !String(importPath).length) return []
  const raw = String(importPath).trim()
  if (raw !== catalog.bare && !raw.startsWith(catalog.prefix)) {
    return [
      {
        kind: 'import',
        severity: 'info',
        import: raw,
        message: `Not a @aziontech/webkit import — nothing to validate against the catalog.`
      }
    ]
  }
  const problem = webkitImportProblem(catalog, raw)
  return problem ? [problem] : []
}

const given = (value) => value != null && String(value).length > 0

function styleProblems(catalog, component, classes) {
  if (!given(component) || !given(classes)) return []
  const key = String(component).trim()
  const entry = catalog.getEntry(key)
  if (!entry || entry.styleSeam) return []
  const rejected = nonLayoutClasses(classes).filter((cls) => !isChartPaletteClass(cls))
  if (!rejected.length) return []
  return [
    {
      kind: 'style-override',
      severity: 'error',
      component: key,
      classes: rejected,
      allowed: [...LAYOUT_CLASS_FAMILIES],
      message:
        `Classes ${rejected.join(' ')} override the webkit component "${key}". Only layout utilities ` +
        `(${LAYOUT_CLASS_FAMILIES.join(', ')}) may go on its tag; move the rest to a wrapper element.`
    }
  ]
}

function tokenProblems(catalog, classes) {
  if (!given(classes)) return []
  const str = String(classes)
  return catalog.tokenRules
    .filter((rule) => rule.re.test(str))
    .map((rule) => ({ kind: 'token', severity: 'error', ruleId: rule.id, message: rule.message }))
}

export function validateUsage(catalog, { import: importPath, classes, component } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const problems = [
    ...importProblems(catalog, importPath),
    ...styleProblems(catalog, component, classes),
    ...tokenProblems(catalog, classes)
  ]
  return { ok: problems.length === 0, available: true, problems }
}
