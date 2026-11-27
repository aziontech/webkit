import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { BUILD_OUTPUT_DIRS, read } from './project-files.js'
import { fingerprint, rawColourStylesheets } from './styles.js'

const STARTER_STYLESHEETS = [
  {
    from: 'create-vite',
    specifier: './style.css',
    files: {
      'src/style.css': [
        '02fb08272a1d4747',
        '0f29d4c90c7a4926',
        '15877ce57b486ea7',
        '6ca1092afaa18583',
        '7f76c00cc590b832',
        'a7999da7bebc5519',
        'f96b2ff1e5661fb6'
      ]
    }
  },
  {
    from: 'create-vue',
    specifier: './assets/main.css',
    files: {
      'src/assets/main.css': ['03b7adab212b10f5', 'abd78dde8ddb0a4d'],
      'src/assets/base.css': ['237fb2ce404c4510', '424c9a4bc7e76dd5']
    }
  }
]

const REFERENCE_EXTENSIONS = /\.(vue|[cm]?[jt]sx?|html|css|scss)$/

function referencedElsewhere(projectDir, needle, skip) {
  const fileMatches = (child) =>
    REFERENCE_EXTENSIONS.test(child) &&
    !skip.includes(child) &&
    (read(join(projectDir, child)) || '').includes(needle)
  const walk = (rel) => {
    let entries = []
    try {
      entries = readdirSync(join(projectDir, rel || '.'), { withFileTypes: true })
    } catch {
      return false
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || BUILD_OUTPUT_DIRS.includes(entry.name)) continue
      const child = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory() ? walk(child) : fileMatches(child)) return true
    }
    return false
  }
  return walk('')
}

function importLine(src, specifier) {
  const escaped = specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^[ \\t]*import\\s+['"]${escaped}['"];?[ \\t]*$`, 'm').exec(src)?.[0]
}

function matchStarter(projectDir, entry, src, starter) {
  const line = importLine(src, starter.specifier)
  if (!line) return null
  const files = Object.keys(starter.files).filter((rel) => existsSync(join(projectDir, rel)))
  if (!files.includes(Object.keys(starter.files)[0])) return null
  const pristine = files.every((rel) =>
    starter.files[rel].includes(fingerprint(read(join(projectDir, rel)) || ''))
  )
  const needle = starter.specifier.replace(/^\.\//, '')
  const used = referencedElsewhere(projectDir, needle, [entry, ...files])
  return { ...starter, entry, line, files, untouched: pristine && !used, used }
}

function starterStylesheet(projectDir, entry) {
  if (!entry) return null
  const src = read(join(projectDir, entry)) || ''
  for (const starter of STARTER_STYLESHEETS) {
    const found = matchStarter(projectDir, entry, src, starter)
    if (found) return found
  }
  return null
}

function keptReason(starter) {
  if (starter.untouched) {
    return 'it is the untouched starter, but --no-entry keeps init out of your entry'
  }
  return starter.used ? 'another file imports it too' : 'you changed it'
}

function keptStarterAdvice(starter, entry) {
  return {
    type: 'advise',
    message:
      `${starter.files.join(' and ')} (the ${starter.from} starter stylesheet, imported in ` +
      `${entry}) was left in place because ${keptReason(starter)}. Its global rules (body margin and colours, ` +
      `#app width) fight the Azion UI theme: delete ${starter.files.length === 1 ? 'it' : 'them'} ` +
      `and the \`${starter.line.trim()}\` line when you no longer need them.`
  }
}

function rawColourAdvice(rawStylesheets, gitHooks) {
  const one = rawStylesheets.length === 1
  return {
    type: 'advise',
    message:
      `${rawStylesheets.join(', ')} ${one ? 'uses' : 'use'} raw colours ` +
      `(hex, rgb or hsl — a starter template's stylesheet usually does), so the Azion UI ` +
      `stylelint${gitHooks ? ' in the pre-commit hook' : ''} rejects ` +
      `${one ? 'it' : 'them'}. Replace the values with theme tokens ` +
      `(var(--bg-canvas), var(--text-default)…), or delete the starter stylesheet and its import.`
  }
}

export function starterActions(projectDir, entry, { wireEntry, gitHooks }) {
  const actions = []
  const starter = starterStylesheet(projectDir, entry)
  const removesStarter = Boolean(starter?.untouched && wireEntry)
  if (removesStarter) {
    actions.push({
      type: 'remove-starter',
      path: entry,
      line: starter.line,
      files: starter.files,
      replacement: "import './azion-ui.css'"
    })
  } else if (starter) {
    actions.push(keptStarterAdvice(starter, entry))
  }
  const rawStylesheets = rawColourStylesheets(projectDir).filter(
    (rel) => !(removesStarter && starter.files.includes(rel))
  )
  if (rawStylesheets.length) actions.push(rawColourAdvice(rawStylesheets, gitHooks))
  return actions
}
