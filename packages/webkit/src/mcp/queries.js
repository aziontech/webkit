import { LAYOUT_CLASS_FAMILIES, nonLayoutClasses } from '../eslint-plugin/layout-classes.js'

const NOT_AVAILABLE = {
  ok: false,
  available: false,
  message:
    '@aziontech/webkit is not installed in this project (or its catalog.json is not resolvable). ' +
    'Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH to its catalog.json.'
}

export function pascalCase(subpath) {
  const last = String(subpath).split('/').pop() || ''
  return last
    .split('-')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
}

function subpathOf(catalog, importPath) {
  const prefix = catalog.prefix
  const s = String(importPath || '')
  return s.startsWith(prefix) ? s.slice(prefix.length) : s
}

function componentCard(catalog, name) {
  const e = catalog.getEntry(name)
  if (!e) return null
  return {
    name,
    category: e.category ?? null,
    structure: e.structure ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    binding: pascalCase(name)
  }
}

export function listComponents(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wanted = category ? String(category).toLowerCase() : null
  const components = catalog.subpaths
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .filter((sub) => !wanted || (catalog.getEntry(sub)?.category || '').toLowerCase() === wanted)
    .map((sub) => componentCard(catalog, sub))
    .sort((a, b) => a.name.localeCompare(b.name))
  return {
    ok: true,
    available: true,
    version: catalog.version,
    count: components.length,
    ...(wanted ? { category: wanted } : {}),
    components
  }
}

export function listCategories(catalog) {
  if (!catalog.available) return NOT_AVAILABLE
  const cats = new Set()
  for (const sub of catalog.subpaths) {
    const c = catalog.getEntry(sub)?.category
    if (c) cats.add(c)
  }
  return { ok: true, available: true, categories: [...cats].sort() }
}

export function listTokens(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const tokens = catalog.tokens || { cssVars: [], typography: [], groups: {} }
  const groupNames = Object.keys(tokens.groups)

  if (category != null && String(category).length) {
    const key = String(category).toLowerCase().trim()
    if (key === 'animations' || key === 'animation' || key === 'animate' || key === 'motion') {
      return {
        ok: true,
        available: true,
        found: true,
        category: 'animations',
        tokens: (tokens.animations || []).map((name) => ({
          class: `animate-${name}`,
          ...(tokens.animationGuide?.[name] || {})
        })),
        hint: 'Every motion-bearing class pairs with a motion-reduce: fallback (e.g. `animate-slide-in-left motion-reduce:animate-none`). Panel/drawer open-close wraps the v-if region in a Vue Transition with enter-active-class / leave-active-class.'
      }
    }
    const group = tokens.groups[key]
    if (!group) {
      return {
        ok: false,
        available: true,
        found: false,
        category: key,
        groups: [...groupNames, 'animations'],
        message: `No token group "${key}". Available groups: ${groupNames.join(', ')}, animations.`
      }
    }
    return { ok: true, available: true, found: true, category: key, tokens: group }
  }

  return {
    ok: true,
    available: true,
    groups: [
      ...groupNames.map((name) => ({ name, count: tokens.groups[name].length })),
      { name: 'animations', count: (tokens.animations || []).length }
    ],
    typography: tokens.typography,
    vocabulary: catalog.vocabulary || null,
    hint: 'Call list_tokens with a category (e.g. "primary", "bg", "text", "spacing", "radius", "shadow", "animations") for that group — "animations" returns each animate-* class with its timing and when to use it.'
  }
}

export function getComponent(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding: pascalCase(key),
    kind: e.kind,
    category: e.category ?? null,
    structure: e.structure ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    compoundRoot: e.compoundRoot ?? false,
    subcomponents: e.subcomponents ?? [],
    parent: e.parent ?? null,
    rootOf: e.rootOf ?? null,
    purpose: e.purpose ?? null,
    setup: e.setup ?? null,
    useWhen: e.useWhen ?? [],
    avoidWhen: e.avoidWhen ?? [],
    related: e.related ?? [],
    bestPractices: e.bestPractices ?? [],
    props: e.props ?? [],
    events: e.events ?? [],
    slots: e.slots ?? [],
    examples: e.examples ?? [],
    allowedClasses: allowedClassesFor(e)
  }
}

function allowedClassesFor(entry) {
  if (entry.styleSeam) {
    return { any: true, note: 'Built to be personalized (style seam): any class is accepted.' }
  }
  return {
    any: false,
    families: [...LAYOUT_CLASS_FAMILIES],
    note: 'Only these layout utilities may go on the component tag. Anything else goes on a wrapper element or inside its slots.'
  }
}

export function getBestPractices(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    purpose: e.purpose ?? null,
    setup: e.setup ?? null,
    useWhen: e.useWhen ?? [],
    avoidWhen: e.avoidWhen ?? [],
    related: e.related ?? [],
    bestPractices: e.bestPractices ?? []
  }
}

export function getImport(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }

  const hasLeanRoot = e.treeShakeableImport != null
  const tree = e.treeShakeableImport ?? e.import
  const binding = pascalCase(subpathOf(catalog, tree))
  const result = {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding,
    import: `import ${binding} from '${tree}'`,
    importPath: tree,
    treeShakeable: hasLeanRoot
  }

  if (e.compoundRoot) {
    const subs = e.subcomponents ?? []
    const subExample = subs[0] ?? `${catalog.prefix}name-part`
    if (hasLeanRoot && tree !== e.import) {
      const compoundBinding = pascalCase(key)
      result.compoundAlternative = {
        import: `import ${compoundBinding} from '${e.import}'`,
        importPath: e.import,
        binding: compoundBinding,
        note:
          `The compound import (${e.import}) attaches every sub-component for dot-notation ` +
          `(${compoundBinding}.Row, …), but it is NOT tree-shakeable — it retains all ` +
          `sub-components even when you render only the root. Prefer the -root import above ` +
          `for the smallest bundle; use the compound when you want the dot-notation ergonomics.`,
        subcomponents: subs
      }
      result.note =
        `${key} is a compound root. The tree-shakeable root import (above) is preferred; ` +
        `import sub-components individually (e.g. ${subExample}) to keep the bundle minimal.`
    } else {
      result.subcomponents = subs
      result.note =
        `${key} owns sub-components (e.g. ${subExample}). The import above is already the lean ` +
        `root; import each sub-component from its own subpath as needed.`
    }
  }

  return result
}

function scoreMatch(name, entry, query) {
  const q = query.toLowerCase().trim()
  if (!q) return 0
  const n = name.toLowerCase()
  const c = (entry.category || '').toLowerCase()
  const words = q.split(/[\s/_-]+/).filter(Boolean)
  const prose = [entry.purpose || '', ...(entry.useWhen || [])].join(' ').toLowerCase()

  let score = 0
  if (n === q) score += 100
  if (n.includes(q)) score += 40
  if (q.includes(n) && n.length >= 3) score += 30
  if (c && (c === q || q.includes(c))) score += 10
  for (const w of words) {
    if (w.length < 2) continue
    if (n === w) score += 25
    else if (n.includes(w)) score += 15
    else if (w.includes(n) && n.length >= 3) score += 12
    if (c.includes(w)) score += 4
    if (w.length >= 3 && prose.includes(w)) score += 6
  }
  return score
}

export function searchComponents(catalog, query) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(query || '')
  const ranked = catalog.subpaths
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => {
      const e = catalog.getEntry(sub)
      return { sub, score: scoreMatch(sub, e, q) }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
    .slice(0, 10)
    .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score }))

  return { ok: true, available: true, query: q, count: ranked.length, matches: ranked }
}

function componentSuggestion(catalog, need) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const search = searchComponents(catalog, q)
  if (search.matches.length > 0) {
    const [best, ...rest] = search.matches
    return {
      ok: true,
      available: true,
      need: q,
      found: true,
      best,
      alternatives: rest.slice(0, 3)
    }
  }
  const fuzzy = catalog
    .suggestSubpaths(q.toLowerCase().replace(/\s+/g, '-'))
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => componentCard(catalog, sub))
  return {
    ok: true,
    available: true,
    need: q,
    found: false,
    best: fuzzy[0] ?? null,
    alternatives: fuzzy.slice(1, 4),
    message: fuzzy.length
      ? `No strong match for "${q}". Closest names by spelling:`
      : `No component matches "${q}". Try listComponents or searchComponents with a broader term.`
  }
}

function exampleProps(props) {
  const scalar = (t) => /^('.*'|string|number|boolean)/.test(String(t || '').trim())
  const literalDefault = (p) => {
    const d = String(p.default ?? '').trim()
    if (d && d !== '—' && d !== "''" && d !== '[]' && d !== '{}') return d.replace(/^'|'$/g, '')
    const t = String(p.type || '').trim()
    if (/^'/.test(t)) return t.split('|')[0].trim().replace(/^'|'$/g, '')
    if (t === 'boolean') return true
    if (t === 'number') return 0
    return 'text'
  }

  const isRequired = (p) => ['true', 'yes'].includes(String(p.required).toLowerCase())

  const required = props.filter(isRequired)
  const leading = props.filter((p) => !isRequired(p) && scalar(p.type))
  const chosen = [...required, ...leading].slice(0, Math.max(required.length, 2)).slice(0, 3)

  return chosen.map((p) => {
    const t = String(p.type || '').trim()
    if (t === 'boolean') {
      const v = literalDefault(p)
      const on = v === true || v === 'true'
      return { name: p.name, attr: on ? p.name : null }
    }
    if (t === 'number') return { name: p.name, attr: `:${p.name}="${literalDefault(p)}"` }
    if (scalar(t)) {
      return { name: p.name, attr: `${p.name}="${literalDefault(p)}"` }
    }
    const isArray = /\[\]\s*$|^Array\s*<|^readonly\s/.test(t)
    const isFn = /=>|\bFunction\b/.test(t)
    const literal = isArray ? '[]' : isFn ? '() => {}' : '{}'
    return { name: p.name, attr: `:${p.name}="${literal}"` }
  })
}

export function getUsageExample(catalog, name, { fromStory = true } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const comp = getComponent(catalog, name)
  if (!comp.found) return comp

  if (fromStory && comp.examples.length) {
    const [example] = comp.examples
    return {
      ok: true,
      available: true,
      found: true,
      name: comp.name,
      binding: comp.binding,
      source: `story ${example.name}`,
      sfc: example.sfc,
      otherExamples: comp.examples.slice(1).map((ex) => ex.name),
      note: 'Taken from the component story (the same SFC as Storybook "Show code"). get_component returns every example.'
    }
  }

  const tree = comp.treeShakeableImport
  const binding = pascalCase(subpathOf(catalog, tree))
  const importLine = `import ${binding} from '${tree}'`

  const attrs = exampleProps(comp.props)
    .map((p) => p.attr)
    .filter(Boolean)
  const hasDefaultSlot = comp.slots.some((s) => s.name === 'default' || s.name === '—' || !s.name)
  const openTag = attrs.length ? `<${binding} ${attrs.join(' ')}` : `<${binding}`

  let tag
  if (hasDefaultSlot) {
    tag = `${openTag}>${binding} content</${binding}>`
  } else {
    tag = `${openTag} />`
  }

  const sfc = `<script setup>\n${importLine}\n</script>\n\n<template>\n  ${tag}\n</template>\n`

  return {
    ok: true,
    available: true,
    found: true,
    name: comp.name,
    binding,
    import: importLine,
    sfc,
    note: comp.compoundRoot
      ? `${comp.name} is a compound root — sub-components (${(comp.subcomponents ?? [])
          .slice(0, 3)
          .join(', ')}${(comp.subcomponents ?? []).length > 3 ? ', ...' : ''}) compose inside it.`
      : undefined
  }
}

export function validateUsage(catalog, { import: importPath, classes, component } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const problems = []

  if (importPath != null && String(importPath).length) {
    const raw = String(importPath).trim()
    const bare = catalog.bare
    const prefix = catalog.prefix
    const isWebkit = raw === bare || raw.startsWith(prefix)
    if (!isWebkit) {
      problems.push({
        kind: 'import',
        severity: 'info',
        import: raw,
        message: `Not a @aziontech/webkit import — nothing to validate against the catalog.`
      })
    } else {
      const sub = raw === bare ? '' : raw.slice(prefix.length)
      const denied = catalog.deniedPrefixes.find((p) => raw.startsWith(p))
      if (denied) {
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Denied import path (private internals): starts with "${denied}". Use a published export.`,
          suggestions: catalog.suggestSubpaths(sub)
        })
      } else if (!catalog.has(sub)) {
        const nearest = catalog.nearestPublishedPrefix(sub)
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Unknown webkit export "${raw}".`,
          nearestPublishedPrefix: nearest ? `${prefix}${nearest}` : null,
          suggestions: catalog.suggestSubpaths(sub)
        })
      }
    }
  }

  if (component != null && String(component).length && classes != null && String(classes).length) {
    const key = String(component).trim()
    const entry = catalog.getEntry(key)
    if (entry && !entry.styleSeam) {
      const rejected = nonLayoutClasses(classes)
      if (rejected.length) {
        problems.push({
          kind: 'style-override',
          severity: 'error',
          component: key,
          classes: rejected,
          allowed: [...LAYOUT_CLASS_FAMILIES],
          message: `Classes ${rejected.join(' ')} override the webkit component "${key}". Only layout utilities (${LAYOUT_CLASS_FAMILIES.join(', ')}) may go on its tag; move the rest to a wrapper element.`
        })
      }
    }
  }

  if (classes != null && String(classes).length) {
    const str = String(classes)
    for (const rule of catalog.tokenRules) {
      if (rule.re.test(str)) {
        problems.push({
          kind: 'token',
          severity: 'error',
          ruleId: rule.id,
          message: rule.message
        })
      }
    }
  }

  return { ok: problems.length === 0, available: true, problems }
}

const SYNONYM_GROUPS = [
  [
    'login',
    'log in',
    'sign in',
    'signin',
    'entrar',
    'acessar',
    'acessar conta',
    'auth',
    'authentication',
    'autenticação',
    'logar'
  ],
  [
    'signup',
    'sign up',
    'register',
    'registration',
    'create account',
    'cadastro',
    'cadastrar',
    'criar conta',
    'registrar'
  ],
  [
    'reset password',
    'forgot password',
    'esqueci a senha',
    'redefinir senha',
    'recover password',
    'recuperar senha'
  ],
  [
    'verify email',
    'check inbox',
    'confirm email',
    'verificar e-mail',
    'confirmar e-mail',
    'email verification'
  ],
  ['settings', 'preferences', 'configuration', 'configurações', 'configuracoes', 'ajustes'],
  ['account settings', 'account', 'profile', 'conta', 'perfil'],
  ['list', 'listing', 'index', 'table', 'lista', 'listagem', 'tabela'],
  ['create', 'new', 'add', 'criar', 'novo', 'nova', 'adicionar', 'creation'],
  ['delete', 'remove', 'destroy', 'excluir', 'apagar', 'remover'],
  ['onboarding', 'first access', 'welcome', 'get started', 'primeiro acesso', 'boas-vindas'],
  ['billing', 'payment', 'invoice', 'plan', 'pagamento', 'cobrança', 'fatura', 'plano'],
  ['users', 'members', 'team', 'usuários', 'membros', 'time', 'equipe'],
  ['editor', 'code', 'function', 'código', 'função'],
  ['metrics', 'dashboard', 'observability', 'analytics', 'métricas', 'painel'],
  ['header', 'top bar', 'navbar', 'cabeçalho'],
  ['shell', 'layout', 'frame', 'app shell', 'estrutura']
]

const SCREEN_WORDS = [
  'page',
  'screen',
  'tela',
  'página',
  'pagina',
  'view',
  'flow',
  'fluxo',
  'form',
  'formulário'
]

const MARKETING_WORDS = [
  'landing',
  'marketing',
  'site',
  'hero',
  'pricing',
  'testimonial',
  'testimonials',
  'newsletter',
  'faq',
  'footer',
  'banner',
  'band',
  'section',
  'cta',
  'call to action',
  'case study',
  'blog',
  'careers'
]

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasPhrase(haystack, phrase) {
  const h = ` ${haystack} `
  return h.includes(` ${phrase} `)
}

function expandQuery(query) {
  const q = normalize(query)
  const phrases = new Set([q])
  for (const group of SYNONYM_GROUPS) {
    const normalized = group.map(normalize)
    if (normalized.some((term) => hasPhrase(q, term))) normalized.forEach((t) => phrases.add(t))
  }
  return { q, phrases: [...phrases].filter(Boolean) }
}

function patternCard(id, p, score) {
  return {
    id,
    name: p.name,
    summary: p.summary,
    intents: p.intents || [],
    components: p.components || [],
    skills: p.skills || [],
    ...(p.steps ? { steps: p.steps } : {}),
    variants: (p.variants || []).map((v) => v.name),
    story: p.story,
    ...(score != null ? { score } : {})
  }
}

function scorePattern(id, p, { q, phrases }) {
  const intents = (p.intents || []).map(normalize)
  const nameText = normalize(`${id} ${p.name}`)
  const components = normalize((p.components || []).join(' '))
  const summary = normalize(p.summary)
  const words = q.split(' ').filter((w) => w.length >= 3)
  let score = 0
  for (const phrase of phrases) {
    const weight = phrase === q ? 1 : 0.8
    if (intents.includes(phrase)) score += 100 * weight
    else if (
      intents.some((i) => hasPhrase(i, phrase) || (phrase.length >= 4 && hasPhrase(phrase, i)))
    )
      score += 60 * weight
    if (hasPhrase(nameText, phrase)) score += 40 * weight
  }
  for (const w of words) {
    if (intents.some((i) => hasPhrase(i, w))) score += 12
    if (hasPhrase(nameText, w)) score += 10
    if (hasPhrase(components, w)) score += 4
    if (hasPhrase(summary, w)) score += 2
  }
  return Math.round(score)
}

export function searchPatterns(catalog, query) {
  if (!catalog.available) return NOT_AVAILABLE
  const entries = Object.entries(catalog.patterns || {})
  const raw = String(query || '').trim()
  if (!raw) {
    return {
      ok: true,
      available: true,
      query: raw,
      count: entries.length,
      matches: entries.map(([id, p]) => patternCard(id, p))
    }
  }
  const expanded = expandQuery(raw)
  const matches = entries
    .map(([id, p]) => ({ id, p, score: scorePattern(id, p, expanded) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map((r) => patternCard(r.id, r.p, r.score))
  return {
    ok: true,
    available: true,
    query: raw,
    count: matches.length,
    matches,
    hint: matches.length
      ? 'Call get_pattern with the best id, copy its SFC and change only the content (copy, data, handlers). Keep the components, their order and the classes.'
      : 'No pattern matches. Build from components: suggest_component, then get_component.'
  }
}

export function getPattern(catalog, id, { variant } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const patterns = catalog.patterns || {}
  const key = String(id || '').trim()
  let resolved = patterns[key] ? key : null
  if (!resolved) {
    const n = normalize(key)
    resolved =
      Object.keys(patterns).find((pid) => normalize(pid.split('/').pop()) === n) ||
      Object.keys(patterns).find((pid) => normalize(patterns[pid].name) === n) ||
      null
  }
  if (!resolved) {
    const search = searchPatterns(catalog, key)
    return {
      ok: false,
      available: true,
      found: false,
      id: key,
      suggestions: (search.matches || []).slice(0, 3).map((m) => m.id),
      message: `No pattern "${key}". Use search_patterns to find one by intent.`
    }
  }
  const p = patterns[resolved]
  const chosen = variant ? (p.variants || []).find((v) => v.name === variant) : null
  if (variant && !chosen) {
    return {
      ok: false,
      available: true,
      found: false,
      id: resolved,
      variants: [p.primary, ...(p.variants || []).map((v) => v.name)],
      message: `Pattern "${resolved}" has no variant "${variant}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    id: resolved,
    name: p.name,
    summary: p.summary,
    intents: p.intents || [],
    ...(p.steps ? { steps: p.steps } : {}),
    components: p.components || [],
    imports: p.imports || [],
    skills: p.skills || [],
    story: p.story,
    variant: chosen ? chosen.name : p.primary,
    sfc: chosen ? chosen.sfc : p.sfc,
    variants: [
      { name: p.primary, summary: 'primary' },
      ...(p.variants || []).map((v) => ({ name: v.name, summary: v.summary }))
    ],
    howToUse:
      'Copy this SFC as the starting point of the screen and change only the content (copy, data, handlers, routes). Keep the components, their order, the props and the classes: they are the reviewed Azion layout. Pass `variant` to get another state of the same screen. Follow the listed skills.'
  }
}

function sectionSuggestion(catalog, need) {
  const q = normalize(need)
  const words = q.split(' ').filter((w) => w.length >= 3 && !SCREEN_WORDS.includes(w))
  const ranked = catalog.subpaths
    .filter((sub) => sub.startsWith('sections/') && catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => {
      const e = catalog.getEntry(sub)
      const name = normalize(sub.replace(/^sections\//, ''))
      const prose = normalize([e.purpose || '', ...(e.useWhen || [])].join(' '))
      let score = 0
      for (const w of words) {
        if (hasPhrase(name, w)) score += 20
        else if (name.includes(w)) score += 10
        if (hasPhrase(prose, w)) score += 3
      }
      return { sub, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
  return ranked
}

export function suggestComponent(catalog, need) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const nq = normalize(q)
  const component = componentSuggestion(catalog, q)

  const isMarketing = MARKETING_WORDS.some((w) => hasPhrase(nq, normalize(w)))
  if (isMarketing) {
    const sections = sectionSuggestion(catalog, q)
    if (sections.length) {
      const [best, ...rest] = sections
      return {
        ...component,
        recommendation: 'section',
        best: { ...componentCard(catalog, best.sub), score: best.score },
        alternatives: rest
          .slice(0, 3)
          .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score })),
        found: true,
        hint: 'A marketing band is a page section: import it from its sections/ subpath, bind it with v-bind="section.props" and place it inside SectionContainer and SectionGap (rule webkit-sections).'
      }
    }
  }

  const patterns = searchPatterns(catalog, q)
  const topPattern = patterns.matches?.[0]
  const screenIntent = SCREEN_WORDS.some((w) => hasPhrase(nq, normalize(w)))
  const exactComponent = component.best && normalize(component.best.name) === nq
  if (
    topPattern &&
    (screenIntent ? topPattern.score >= 25 : topPattern.score >= 60 && !exactComponent)
  ) {
    return {
      ok: true,
      available: true,
      need: q,
      found: true,
      recommendation: 'pattern',
      pattern: topPattern,
      patternAlternatives: patterns.matches.slice(1, 3),
      hint: `This is a screen: start from the pattern. Call get_pattern("${topPattern.id}") and copy its SFC; use the components below only for pieces the pattern does not cover.`,
      best: component.best,
      alternatives: component.alternatives
    }
  }
  return { ...component, recommendation: 'component' }
}
