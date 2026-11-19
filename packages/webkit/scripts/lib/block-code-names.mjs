const STRING_OR_COMMENT =
  /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g
const BOUND_ATTRIBUTE = /(\s(?::|@|#|v-)[\w:.\-[\]]*\s*=\s*)("[^"]*"|'[^']*')/g

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function nameMatcher(names) {
  return names.length ? new RegExp(`\\b(${names.map(escape).join('|')})\\b`, 'g') : null
}

function stringsOnly(code) {
  return (code.match(STRING_OR_COMMENT) || []).join('\n')
}

function scriptText(code) {
  return stringsOnly(code.replace(/^\s*import\s[\s\S]*?\sfrom\s+['"][^'"]+['"];?\s*$/gm, ''))
}

function templateText(markup, tags) {
  let out = markup.replace(/<!--[\s\S]*?-->/g, '')
  if (tags) out = out.replace(new RegExp(`</?(${tags})\\b`, 'g'), '<')
  return out.replace(
    BOUND_ATTRIBUTE,
    (_, head, value) => `${head}"${stringsOnly(value.slice(1, -1)).replace(/"/g, ' ')}"`
  )
}

export function sfcUserText(sfc, names = []) {
  const tags = names.map(escape).join('|')
  const parts = []
  const rest = String(sfc).replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, (_, code) => {
    parts.push(scriptText(code))
    return ''
  })
  parts.push(templateText(rest, tags))
  return parts.join('\n')
}

export function proseUserText(markdown, names = []) {
  return String(markdown)
    .replace(/^# .*$/m, '')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) =>
      sfcUserText(`<script>${code}</script>${code}`, names)
    )
}

function find(text, matcher) {
  return [...new Set([...String(text).matchAll(matcher)].map((m) => m[1]))]
}

export function checkBlockCodeNames(blocks) {
  const all = [
    ...new Set(
      Object.values(blocks)
        .map((p) => p.name)
        .filter(Boolean)
    )
  ]
  const errors = []
  for (const [id, p] of Object.entries(blocks)) {
    const own = new Set((p.variants || []).map((v) => v.name))
    const names = all.filter((n) => !own.has(n))
    const matcher = nameMatcher(names)
    if (!matcher) continue
    const report = (where, text) => {
      for (const name of find(text, matcher))
        errors.push(
          `blocks/${id}/${where}: the block code name "${name}" is in text a person reads; write the plain word (e.g. "Billing", not "AccountBilling")`
        )
    }
    report(p.source?.split('/').pop() ?? 'primary', sfcUserText(p.sfc, all))
    for (const v of p.variants || []) {
      report(v.file.split(`blocks/${id}/`).pop(), sfcUserText(v.sfc, all))
      report(`block.json (${v.name} summary)`, v.summary)
    }
    for (const [file, text] of Object.entries(p.files || {}))
      report(file, file.endsWith('.vue') ? sfcUserText(text, all) : scriptText(text))
    report('block.json summary', p.summary)
    report('block.json intents', (p.intents || []).join('\n'))
    if (p.guidelines) report('guidelines.md', proseUserText(p.guidelines, all))
  }
  return errors
}
