export const STRING_MESSAGES = {
  'hardcoded-ui-string':
    "Literal UI string in a template attribute (aria-label, title, placeholder, label…). Read it from the locale catalog: `useLocale().t('<component>.<key>')` with the key added to src/i18n/messages/en.ts and every other locale.",
  'hardcoded-default-string':
    "Prop default is an English UI string. Default the prop to '' and fall back to the locale catalog (`props.x || t('<component>.<key>')`), so the prop still wins."
}

const COMPONENT_VUE = /^packages\/webkit\/src\/components\/.+\.vue$/

const PROPER_NOUNS = new Set(['Azion'])

const ATTRIBUTE =
  /(?<=\s)(aria-label|aria-description|aria-roledescription|aria-valuetext|aria-placeholder|title|placeholder|alt|label|text|description|[a-z][a-zA-Z]*(?:Label|Title|Placeholder|Text|Description)|[a-z][a-z-]*-(?:label|title|placeholder|text|description))="([^"]*)"/g

const TEXT_PROP = /(label|title|placeholder|text|description|caption|message|heading)$/i

export const appliesToBuiltInStrings = (rel) => COMPONENT_VUE.test(rel)

const isUiText = (value) => {
  const text = value.trim()
  if (!/[A-Za-z]{2,}/.test(text)) return false
  if (PROPER_NOUNS.has(text)) return false
  if (/^(pi|ai) /.test(text)) return false
  return true
}

function templateOf(content) {
  const start = content.indexOf('<template')
  return start === -1 ? '' : content.slice(start)
}

function defaultsBlocks(content) {
  const blocks = []
  const re = /withDefaults\s*\(/g
  let match
  while ((match = re.exec(content))) {
    let depth = 1
    let i = match.index + match[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth += 1
      else if (content[i] === ')') depth -= 1
      i += 1
    }
    blocks.push(content.slice(match.index, i))
  }
  return blocks
}

export function scanBuiltInStrings(content) {
  const found = []
  for (const m of templateOf(content).matchAll(ATTRIBUTE)) {
    if (isUiText(m[2])) found.push('hardcoded-ui-string')
  }
  for (const block of defaultsBlocks(content)) {
    for (const m of block.matchAll(/\n\s*([A-Za-z]\w*)\s*:\s*'([^'\n]*)'/g)) {
      if (TEXT_PROP.test(m[1]) && isUiText(m[2])) found.push('hardcoded-default-string')
    }
  }
  return found
}
