const ICON_PAIR = /(?<![\w-])pi(\s+)(pi-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g

const ICON_TOKEN = /(?<![\w-])pi-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g

const AZION_PAIR = /(?<![\w-])(ai-color|ai-cor|ai)(\s+|\.)(ai-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g

const AZION_TOKEN = /(?<![\w-])ai-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g

const COLOR_BASE = /(?<![\w-])(ai-color|ai-cor)(?![\w-])/g

const nextName = (name) => `az-${name.slice(3)}`

function migrateAzionIcons(source, icons, { fromMajor, declaredMajor }) {
  const { base = {}, azionicons = {}, color = {} } = icons
  const changes = []
  const warnings = []
  if (!source.includes('ai-')) return { source, changes, warnings }
  let out = source.replace(AZION_PAIR, (all, from, glue, name) => {
    const to = base[from]
    if (!to) return all
    if (from !== 'ai') {
      const next = color[name] || nextName(name)
      changes.push(`${from} ${name} → ${to} ${next}`)
      return `${to}${glue}${next}`
    }
    const rule = azionicons[name]
    let next = typeof rule === 'string' ? rule : nextName(name)
    if (rule && typeof rule === 'object') {
      if (fromMajor != null && fromMajor < rule.before) next = rule.to
      else if (declaredMajor == null || declaredMajor < rule.before) {
        warnings.push(
          `Azion icon ai ${name}: ${rule.note}; write ${to} ${rule.to} if it is the brand mark`
        )
      }
    }
    changes.push(`ai ${name} → ${to} ${next}`)
    return `${to}${glue}${next}`
  })
  out = out.replace(COLOR_BASE, (from) => {
    if (!base[from]) return from
    changes.push(`${from} → ${base[from]}`)
    return base[from]
  })
  for (const [name] of out.matchAll(AZION_TOKEN)) {
    const rule = name in azionicons ? azionicons[name] : color[name]
    if (typeof rule !== 'string') continue
    warnings.push(
      `Azion icon class ${name} outside an "ai ${name}" pair: rewrite it to ${rule} by hand`
    )
  }
  return { source: out, changes, warnings }
}

export function migrateIcons(source, icons = {}, { fromMajor = null, declaredMajor = null } = {}) {
  const azion = migrateAzionIcons(source, icons, { fromMajor, declaredMajor })
  const primeicons = icons.primeicons || {}
  const changes = [...azion.changes]
  const warnings = [...azion.warnings]
  const done = () => ({
    source: out,
    changes: [...new Set(changes)],
    warnings: [...new Set(warnings)]
  })
  let out = azion.source
  if (!out.includes('pi-')) return done()
  out = out.replace(ICON_PAIR, (all, space, name) => {
    const rule = primeicons[name]
    if (typeof rule !== 'string') return all
    changes.push(`pi ${name} → az ${rule}`)
    return `az${space}${rule}`
  })
  for (const [name] of out.matchAll(ICON_TOKEN)) {
    const rule = primeicons[name]
    if (!rule) continue
    warnings.push(
      typeof rule === 'string'
        ? `PrimeIcons class ${name} outside a "pi ${name}" pair: rewrite it to az ${rule} by hand`
        : `PrimeIcons class ${name} has no Azion icon: ${rule.removed}`
    )
  }
  return done()
}
