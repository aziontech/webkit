import { join } from 'node:path'

import { exclusionLine, missingExclusions, planSources, SOURCES_FILE } from '../css-sources.js'
import {
  firstExisting,
  POSTCSS_CONFIG_CANDIDATES,
  read,
  usesTailwindVitePlugin,
  VITE_CONFIG_CANDIDATES
} from '../init/project-files.js'
import { rawColourStylesheets, VITE_PLUGIN_SPECIFIER } from '../init/styles.js'

const UNREGISTERED =
  `src/webkit.css does not register webkit with Tailwind — component classes will not compile ` +
  `(unstyled UI). Add \`@import './webkit.sources.css';\` (6.0: \`@aziontech/webkit/styles\` ` +
  `no longer scans WebKit) and run \`npx @aziontech/webkit css\`.`

function importsSources(cssEntry) {
  return Boolean(cssEntry && /@import\b[^\n]*['"]\.\/webkit\.sources\.css['"]/.test(cssEntry))
}

function registration(cssEntry) {
  if (!cssEntry) return null
  if (importsSources(cssEntry)) {
    return `src/webkit.css registers the WebKit files this app imports (${SOURCES_FILE})`
  }
  if (/@import\b[^\n]*@aziontech\/webkit\/styles\/all/.test(cssEntry)) {
    return 'src/webkit.css registers every WebKit component (@aziontech/webkit/styles/all) — the app ships the CSS of all of them; import ./webkit.sources.css instead to compile only what it uses'
  }
  if (/@source\b[^\n]*@aziontech\/webkit/.test(cssEntry)) {
    return 'src/webkit.css registers webkit with an explicit @source'
  }
  return null
}

export function sourceRegistrationCheck({ cssEntry, add }) {
  const registered = registration(cssEntry)
  add('webkit.css @source', registered ? 'ok' : 'fail', registered || UNREGISTERED)
}

export function sourceExclusionCheck({ cssEntry, add }) {
  if (!cssEntry) return
  const unexcluded = missingExclusions(cssEntry)
  add(
    'webkit.css @source not',
    unexcluded.length ? 'warn' : 'ok',
    unexcluded.length
      ? `src/webkit.css does not keep ${unexcluded.map((p) => p.slice(3)).join(', ')} out of the ` +
          `Tailwind scan, so the example classes in the AI guidance files compile into your CSS. Add ` +
          `${unexcluded.map((p) => `\`${exclusionLine(p)}\``).join(' ')} (or run \`npx ` +
          `@aziontech/webkit init\`).`
      : 'src/webkit.css keeps the AI guidance files (.claude, CLAUDE.md, AGENTS.md) out of the Tailwind scan'
  )
}

function staleDetail(sources) {
  const listed = new Set((sources.current ?? '').split('\n'))
  const missing = sources.content
    .split('\n')
    .filter((l) => l.startsWith('@source') && !listed.has(l))
  return (
    `${SOURCES_FILE} is out of ` +
    `date${missing.length ? ` — ${missing.length} imported WebKit file(s) are missing, so their components render unstyled` : ''}. ` +
    `Run \`npx @aziontech/webkit css\` (the Vite plugin, ${VITE_PLUGIN_SPECIFIER}, keeps it ` +
    `current on every dev and build).`
  )
}

function sourcesState(sources) {
  if (sources.stale) return ['fail', staleDetail(sources)]
  if (sources.resolved) {
    return [
      'ok',
      `${SOURCES_FILE} lists ${sources.files.length} WebKit file(s) for ${sources.subpaths.length} import(s)`
    ]
  }
  if (sources.subpaths.length) {
    return [
      'warn',
      `@aziontech/webkit is not installed, so ${SOURCES_FILE} cannot list the files of ${sources.subpaths.length} import(s). Install, then run \`npx @aziontech/webkit css\`.`
    ]
  }
  return ['ok', `${SOURCES_FILE} is current (no WebKit imports yet)`]
}

function vitePluginCheck(projectDir, add) {
  const viteCfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  if (!viteCfg) return
  const hasPlugin = Boolean(read(join(projectDir, viteCfg))?.includes(VITE_PLUGIN_SPECIFIER))
  add(
    'webkit vite plugin',
    hasPlugin ? 'ok' : 'warn',
    hasPlugin
      ? `${viteCfg} runs ${VITE_PLUGIN_SPECIFIER}, so ${SOURCES_FILE} follows your imports`
      : `${viteCfg} does not run ${VITE_PLUGIN_SPECIFIER} — ${SOURCES_FILE} goes stale when you ` +
          `import a new component. Add \`import webkit from '${VITE_PLUGIN_SPECIFIER}'\` and ` +
          `\`webkit()\` to plugins.`
  )
}

export function sourcesFileCheck({ projectDir, cssEntry, add }) {
  if (!importsSources(cssEntry)) return
  add('webkit css sources', ...sourcesState(planSources(projectDir)))
  vitePluginCheck(projectDir, add)
}

function tailwindBuildState(projectDir) {
  const postcssCfg = firstExisting(projectDir, POSTCSS_CONFIG_CANDIDATES)
  const runsTailwind = Boolean(
    postcssCfg && read(join(projectDir, postcssCfg))?.includes('@tailwindcss/postcss')
  )
  if (usesTailwindVitePlugin(projectDir)) {
    return runsTailwind
      ? [
          'warn',
          `Tailwind runs through @tailwindcss/vite and ${postcssCfg} adds @tailwindcss/postcss too — Tailwind is processed twice. Remove @tailwindcss/postcss from ${postcssCfg}.`
        ]
      : ['ok', 'Tailwind runs through @tailwindcss/vite (no PostCSS config needed)']
  }
  if (runsTailwind) return ['ok', `Tailwind runs through PostCSS (${postcssCfg})`]
  if (postcssCfg) {
    return [
      'warn',
      `${postcssCfg} does not load @tailwindcss/postcss and @tailwindcss/vite is not installed — ` +
        `Tailwind v4 may not run in the build. Add the plugin (see \`npx @aziontech/webkit init ` +
        `--dry-run\`).`
    ]
  }
  return [
    'warn',
    'neither @tailwindcss/vite nor a PostCSS config — Tailwind v4 may not run in the build. Run `npx @aziontech/webkit init`.'
  ]
}

export function tailwindBuildCheck({ projectDir, add }) {
  add('tailwind build', ...tailwindBuildState(projectDir))
}

export function rawColoursCheck({ projectDir, add }) {
  const rawStylesheets = rawColourStylesheets(projectDir)
  if (!rawStylesheets.length) return
  add(
    'raw colours in styles',
    'warn',
    `${rawStylesheets.join(', ')} — hex/rgb/hsl values that the webkit stylelint rejects, so the pre-commit hook fails. Use theme tokens, or delete a starter template's stylesheet and its import.`
  )
}

export function themeImportCheck({ cssEntry, add }) {
  const themed = Boolean(cssEntry && /@import\b[^\n]*@aziontech\/theme/.test(cssEntry))
  add(
    'theme import',
    themed ? 'ok' : 'fail',
    themed
      ? "src/webkit.css imports '@aziontech/theme' (tokens + Tailwind)"
      : "src/webkit.css does not `@import '@aziontech/theme'` — no design tokens, so every component renders unstyled. Run `npx @aziontech/webkit init`."
  )
}
