import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

import { parse } from 'vue/compiler-sfc'

const WEIGHTS = {
  props: 0.25,
  behaviour: 0.3,
  classes: 0.2,
  structure: 0.05,
  purpose: 0.1,
  name: 0.1
}
export const COPY_AT = 0.35
const CHECK_AT = 0.28

const FEATURES = {
  'link-or-button': /\bisAnchor\b|\bisLink\b|'a' : 'button'|<a[\s\S]*v-if[\s\S]*<button/,
  spinner: /\bSpinner\b/,
  'inert-state': /isInert|data-inert/,
  noopener: /noopener/,
  'focus-ring': /focus-visible:ring/,
  'touch-target': /touch-target|pointer-coarse/,
  'directional-icon': /directionalIconClass|isDirectionalIcon/,
  'hover-layer': /hover:before:opacity/
}

const STOP = new Set(
  'a an the and or of to in on for with by is it its as at be use when that this from into than one are not no but only so can'.split(
    ' '
  )
)

function listComponents(pkgDir) {
  const exportsMap = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')).exports
  const components = new Map()
  const seen = new Set()
  for (const [key, target] of Object.entries(exportsMap)) {
    const file = typeof target === 'string' ? target : target?.default || target?.import
    if (!file || !/^\.\/[a-z0-9-]+$/.test(key)) continue
    let abs = resolve(pkgDir, file)
    if (abs.endsWith('index.ts')) abs = join(dirname(abs), basename(dirname(abs)) + '.vue')
    if (!abs.endsWith('.vue') || !existsSync(abs) || seen.has(abs)) continue
    seen.add(abs)
    components.set(key.slice(2), abs)
  }
  return components
}

function propNames(script) {
  const named = script.match(/interface\s+\w*Props\s*\{([\s\S]*?)\n\s*\}/)
  const body = named ? named[1] : (script.match(/defineProps<\{([\s\S]*?)\}>\(\)/) || [])[1] || ''
  return new Set([...body.matchAll(/^\s*([a-zA-Z]\w*)\??\s*:/gm)].map((m) => m[1]))
}

function imports(script, file, nameByFile) {
  const out = new Set()
  for (const [, spec] of script.matchAll(/import\s+\w+\s+from\s+'([^']+)'/g)) {
    if (spec.startsWith('@aziontech/ui/')) out.add(spec.split('/').pop())
    else if (spec.startsWith('.')) {
      let abs = resolve(dirname(file), spec)
      if (!abs.endsWith('.vue')) abs = join(abs, basename(abs) + '.vue')
      const name = nameByFile.get(abs)
      if (name) out.add(name)
    }
  }
  return out
}

const PRIVATE_DIR = /\/src\/(components\/.+\/(parts|lib|composables)|composables)\//
export const FAMILY_SIZE = 8

function resolveModule(abs) {
  for (const candidate of [
    abs,
    `${abs}.ts`,
    `${abs}.vue`,
    join(abs, 'index.ts'),
    join(abs, basename(abs) + '.ts')
  ])
    if (existsSync(candidate) && !candidate.endsWith('/')) return candidate
  return null
}

function privateModules(script, file, nameByFile) {
  const out = new Set()
  for (const [, spec] of script.matchAll(/from\s+'(\.[^']+)'/g)) {
    const found = resolveModule(resolve(dirname(file), spec))
    if (found && !nameByFile.has(found) && PRIVATE_DIR.test(found)) out.add(found)
  }
  return out
}

function splitClasses(text, into) {
  for (const c of text.split(/\s+/)) if (c) into.add(c)
}

function walkTemplate(ast) {
  const tags = []
  const classes = new Set()
  const attrs = new Set()
  const visit = (node) => {
    if (node.type === 1) {
      tags.push(/^[A-Z]/.test(node.tag) || node.tag === 'component' ? 'X' : node.tag)
      for (const p of node.props || []) {
        let name = p.name
        if (p.type === 7) {
          if (p.arg?.content) name = (p.name === 'on' ? '@' : '') + p.arg.content
          else name = p.name === 'bind' ? 'v-bind' : ''
        }
        if (name && !/^(class|data-testid|key)$/.test(name)) attrs.add(name)
        if (p.type === 6 && p.name === 'class' && p.value) splitClasses(p.value.content, classes)
        if (p.type === 7 && p.arg?.content === 'class' && p.exp) {
          for (const [, lit] of p.exp.content.matchAll(/'([^']*)'/g)) splitClasses(lit, classes)
        }
      }
    }
    for (const child of node.children || []) visit(child)
    for (const branch of node.branches || []) visit(branch)
  }
  visit(ast)
  return { tags, classes, attrs }
}

const CLASS_CONSTANT = /const [A-Z0-9_]*CLASS\b[^=\n]*=((?:\s*(?:'[^'\n]*'|"[^"\n]*")\s*\+?)+)/g
const STRING_PIECE = /'([^'\n]*)'|"([^"\n]*)"/g

function scriptClasses(script) {
  const out = new Set()
  for (const [, lit] of script.matchAll(/'([^'\n]{40,})'/g)) {
    if (/\b(flex|inline-flex|rounded|bg-|text-|data-\[)/.test(lit)) splitClasses(lit, out)
  }
  for (const [, body] of script.matchAll(CLASS_CONSTANT)) {
    for (const [, single, double] of body.matchAll(STRING_PIECE))
      splitClasses(single ?? double, out)
  }
  return out
}

export const baseUtility = (c) => c.replace(/^(?:[^:[\]]+(?:\[[^\]]*\])?[^:]*:)+/, '')

function shingles(tags, k = 3) {
  const out = new Set()
  for (let i = 0; i + k <= tags.length; i++) out.add(tags.slice(i, i + k).join('>'))
  if (tags.length && tags.length < k) out.add(tags.join('>'))
  return out
}

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/`[^`]*`/g, ' ')
    .match(/[a-z]{3,}/g)
    ?.filter((w) => !STOP.has(w)) || []

function purposeWords(pkgDir, name) {
  const file = join(pkgDir, 'catalog/components', name + '.json')
  if (!existsSync(file)) return []
  const entry = JSON.parse(readFileSync(file, 'utf8'))
  return tokenize([entry.purpose || '', ...(entry.useWhen || [])].join(' '))
}

export function describe(name, file, src, { nameByFile = new Map(), words = [], root = '' } = {}) {
  const { descriptor } = parse(src, { filename: file })
  const script = descriptor.scriptSetup?.content || descriptor.script?.content || ''
  const tpl = descriptor.template?.ast
    ? walkTemplate(descriptor.template.ast)
    : { tags: [], classes: new Set(), attrs: new Set() }
  const behaviour = new Set(tpl.attrs)
  for (const [feature, re] of Object.entries(FEATURES))
    if (re.test(src)) behaviour.add('feat:' + feature)
  return {
    name,
    file: root ? relative(root, file) : file,
    props: propNames(script),
    behaviour,
    classes: new Set([...tpl.classes, ...scriptClasses(script)].map(baseUtility)),
    structure: shingles(tpl.tags),
    imports: imports(script, file, nameByFile),
    modules: privateModules(script, file, nameByFile),
    words,
    head: name.split('-').pop()
  }
}

export function describeAll(pkgDir, root) {
  const components = listComponents(pkgDir)
  const nameByFile = new Map([...components].map(([n, f]) => [f, n]))
  const all = [...components].map(([name, file]) =>
    describe(name, file, readFileSync(file, 'utf8'), {
      nameByFile,
      words: purposeWords(pkgDir, name),
      root
    })
  )
  weighWords(all)
  const weights = weighSets(all)
  const moduleUsers = new Map()
  for (const c of all) for (const m of c.modules) moduleUsers.set(m, (moduleUsers.get(m) || 0) + 1)
  for (const c of all) {
    c.weights = weights
    c.moduleUsers = moduleUsers
  }
  return all
}

function weighWords(all) {
  const df = new Map()
  for (const c of all) for (const w of new Set(c.words)) df.set(w, (df.get(w) || 0) + 1)
  for (const c of all) {
    const tf = new Map()
    for (const w of c.words) tf.set(w, (tf.get(w) || 0) + 1)
    c.vec = new Map([...tf].map(([w, n]) => [w, n * Math.log(all.length / df.get(w))]))
    c.norm = Math.sqrt([...c.vec.values()].reduce((s, v) => s + v * v, 0)) || 1
  }
}

const PRIOR = { props: 2, behaviour: 3, classes: 8, structure: 2 }

const SET_SIGNALS = ['props', 'behaviour', 'classes', 'structure']

export const jaccard = (a, b, prior = 0, weight = () => 1) => {
  if (!a.size && !b.size) return 0
  let shared = 0
  let union = 0
  for (const x of a) {
    const w = weight(x)
    union += w
    if (b.has(x)) shared += w
  }
  for (const x of b) if (!a.has(x)) union += weight(x)
  return shared / (union + prior)
}

function weighSets(all) {
  const weights = {}
  for (const signal of SET_SIGNALS) {
    const df = new Map()
    for (const c of all) for (const x of c[signal]) df.set(x, (df.get(x) || 0) + 1)
    const idf = new Map([...df].map(([x, n]) => [x, Math.log((all.length + 1) / n)]))
    const mean = [...idf.values()].reduce((t, v) => t + v, 0) / (idf.size || 1)
    weights[signal] = { weight: (x) => idf.get(x) ?? mean, unit: mean }
  }
  return weights
}

function cosine(a, b) {
  if (!a.vec || !b.vec) return 0
  let dot = 0
  for (const [w, v] of a.vec) if (b.vec.has(w)) dot += v * b.vec.get(w)
  return dot / (a.norm * b.norm)
}

export const pairKey = (a, b) => [a, b].sort().join('::')

function setSignal(a, b, signal) {
  const w = a.weights?.[signal]
  if (!w) return jaccard(a[signal], b[signal], PRIOR[signal])
  return jaccard(a[signal], b[signal], PRIOR[signal] * w.unit, w.weight)
}

export function compare(a, b) {
  const signals = {
    props: setSignal(a, b, 'props'),
    behaviour: setSignal(a, b, 'behaviour'),
    classes: setSignal(a, b, 'classes'),
    structure: setSignal(a, b, 'structure'),
    purpose: cosine(a, b),
    name: a.head === b.head ? 1 : 0
  }
  const score = Object.entries(WEIGHTS).reduce((t, [k, w]) => t + w * signals[k], 0)
  const shared = [...(a.modules || [])].filter(
    (m) => b.modules?.has(m) && (a.moduleUsers?.get(m) ?? 0) <= FAMILY_SIZE
  )
  const reuse = a.imports.has(b.name) || b.imports.has(a.name) || shared.length > 0
  let verdict = 'distinct'
  if (score >= COPY_AT) verdict = reuse ? 'reuse' : 'copy'
  else if (score >= CHECK_AT && !reuse) verdict = 'check'
  return {
    key: pairKey(a.name, b.name),
    a: a.name,
    b: b.name,
    score,
    signals,
    reuse,
    sharedModules: shared,
    verdict,
    sharedProps: [...a.props].filter((p) => b.props.has(p)),
    sharedBehaviour: [...a.behaviour].filter((x) => x.startsWith('feat:') && b.behaviour.has(x))
  }
}

export function comparePairs(all) {
  const pairs = []
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const r = compare(all[i], all[j])
      if (r.verdict !== 'distinct') pairs.push(r)
    }
  return pairs.sort((x, y) => y.score - x.score)
}
