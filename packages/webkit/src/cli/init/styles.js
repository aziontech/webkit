import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  exclusionLine,
  missingExclusions,
  planSources,
  SOURCE_EXCLUSIONS,
  SOURCES_FILE,
  SOURCES_IMPORT
} from '../css-sources.js'
import { BUILD_OUTPUT_DIRS, firstExisting, read, VITE_CONFIG_CANDIDATES } from './project-files.js'

export function styleEntryContent() {
  return `/* @aziontech/webkit design-system styles. Import this once from your app entry. */
@import '@aziontech/theme';

/* The Azion fonts (Rubik, Roboto Mono, Noto Sans Arabic), shipped inside @aziontech/theme.
   Delete this line if your app hosts its own font files. */
@import '@aziontech/theme/fonts.css';

/* The base rules WebKit components share. */
@import '@aziontech/webkit/styles';

/* The WebKit files this app imports, so Tailwind compiles only the classes they use. The
   Vite plugin (@aziontech/webkit/vite-plugin) rewrites it when your imports change; without
   Vite, run \`npx @aziontech/webkit css\` after adding or removing a WebKit import. */
${SOURCES_IMPORT}

/* The AI guidance files are full of example classes that are not your UI: keep them out of the scan. */
${SOURCE_EXCLUSIONS.map(exclusionLine).join('\n')}

/* Text rendering. The type ladder is drawn at these settings, so they are the design
   system's default — and they live here, in your file, so you can change them. */
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
`
}

export const fingerprint = (text) =>
  createHash('sha256').update(text.replace(/\r\n/g, '\n').trimEnd()).digest('hex').slice(0, 16)

const EARLIER_STYLE_ENTRIES = [
  '42d5b05127616e6d',
  '3c498ad1699cc895',
  '04b3cbca9b8c78fa',
  '014e7a73f539943e',
  'f0c58d451b181d7f',
  'c45ab2a0f76cc676'
]

const STYLE_ENTRY = 'src/webkit.css'

function registersWebkit(css) {
  return (
    /@import\b[^\n]*['"]\.\/webkit\.sources\.css['"]/.test(css) ||
    /@import\b[^\n]*@aziontech\/webkit\/styles\/all/.test(css) ||
    /@source\b[^\n]*@aziontech\/webkit/.test(css)
  )
}

function patchStyleEntry(css) {
  const lines = css.split('\n')
  const added = []
  const lastImport = () => lines.findLastIndex((line) => /^\s*@import\b/.test(line))
  if (!registersWebkit(css)) {
    const styles = lines.findIndex((line) =>
      /^\s*@import\b[^\n]*@aziontech\/webkit\/styles['"]/.test(line)
    )
    lines.splice((styles >= 0 ? styles : lastImport()) + 1, 0, SOURCES_IMPORT)
    added.push(SOURCES_IMPORT)
  }
  const exclusions = missingExclusions(css).map(exclusionLine)
  if (exclusions.length) {
    const sources = lines.findIndex((line) => line.includes("'./webkit.sources.css'"))
    lines.splice((sources >= 0 ? sources : lastImport()) + 1, 0, ...exclusions)
    added.push(...exclusions)
  }
  return { css: lines.join('\n'), added }
}

function styleEntryAction(projectDir) {
  const content = styleEntryContent()
  const current = read(join(projectDir, STYLE_ENTRY))
  const unchanged = { type: 'write', path: STYLE_ENTRY, content, skipIfExists: true }
  if (current == null || fingerprint(current) === fingerprint(content)) return unchanged
  if (EARLIER_STYLE_ENTRIES.includes(fingerprint(current))) {
    return {
      type: 'write',
      path: STYLE_ENTRY,
      content,
      note: 'the untouched template of an earlier WebKit, replaced with the 6.0 one'
    }
  }
  const { css, added } = patchStyleEntry(current)
  if (!added.length) return unchanged
  return {
    type: 'write',
    path: STYLE_ENTRY,
    content: css,
    note: `edited by hand, so only added ${added.join(' ')}`
  }
}

export const VITE_PLUGIN_SPECIFIER = '@aziontech/webkit/vite-plugin'
const VITE_PLUGIN_IMPORT = `import webkit from '${VITE_PLUGIN_SPECIFIER}'`

export function patchViteConfig(src) {
  if (src.includes(VITE_PLUGIN_SPECIFIER)) return src
  const plugins = /\bplugins\s*:\s*\[(\s*)/.exec(src)
  if (!plugins) return null
  const space = plugins[1]
  const at = plugins.index + plugins[0].length
  const inserted = space.includes('\n') ? `webkit(),${space}` : 'webkit(), '
  const withPlugin = `${src.slice(0, at)}${inserted}${src.slice(at)}`
  const imports = [...withPlugin.matchAll(/^import\b[^;]*?['"][^'"\n]+['"];?[ \t]*$/gm)]
  const last = imports.at(-1)
  if (!last) return `${VITE_PLUGIN_IMPORT}\n${withPlugin}`
  const end = last.index + last[0].length
  return `${withPlugin.slice(0, end)}\n${VITE_PLUGIN_IMPORT}${withPlugin.slice(end)}`
}

function vitePluginActions(projectDir) {
  const cfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  if (!cfg) {
    return [
      {
        type: 'advise',
        message:
          `No Vite config found. Run \`npx @aziontech/webkit css\` after you add or remove a WebKit ` +
          `import: it rewrites ${SOURCES_FILE}, the list of WebKit files Tailwind compiles (doctor and ` +
          `check fail when it is stale).`
      }
    ]
  }
  const src = read(join(projectDir, cfg)) || ''
  const patched = patchViteConfig(src)
  if (patched === src) return []
  if (patched === null) {
    return [
      {
        type: 'advise',
        message: `Add the WebKit plugin to ${cfg} so ${SOURCES_FILE} follows your imports:\n${VITE_PLUGIN_IMPORT}\n// plugins: [webkit(), …]`
      }
    ]
  }
  return [
    {
      type: 'write',
      path: cfg,
      description: `add the WebKit Vite plugin (${VITE_PLUGIN_SPECIFIER})`,
      content: patched
    }
  ]
}

export function styleActions(projectDir) {
  return [
    styleEntryAction(projectDir),
    { type: 'write', path: SOURCES_FILE, content: planSources(projectDir).content },
    ...vitePluginActions(projectDir)
  ]
}

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/

export function rawColourStylesheets(projectDir) {
  const found = []
  const walk = (rel) => {
    let entries = []
    try {
      entries = readdirSync(join(projectDir, rel), { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const child = `${rel}/${entry.name}`
      if (entry.name.startsWith('.') || BUILD_OUTPUT_DIRS.includes(entry.name)) continue
      if (entry.isDirectory()) walk(child)
      else if (/\.(css|scss)$/.test(entry.name) && child !== 'src/webkit.css') {
        if (RAW_COLOUR.test(read(join(projectDir, child)) || '')) found.push(child)
      }
    }
  }
  walk('src')
  return found.sort()
}
