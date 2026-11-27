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
  `src/azion-ui.css does not register ui with Tailwind — component classes will not compile ` +
  `(unstyled UI). Add \`@import './azion-ui.sources.css';\` (6.0: \`@aziontech/ui/styles\` ` +
  `no longer scans Azion UI) and run \`npx @aziontech/ui css\`.`

function importsSources(cssEntry) {
  return Boolean(cssEntry && /@import\b[^\n]*['"]\.\/azion-ui\.sources\.css['"]/.test(cssEntry))
}

function registration(cssEntry) {
  if (!cssEntry) return null
  if (importsSources(cssEntry)) {
    return `src/azion-ui.css registers the Azion UI files this app imports (${SOURCES_FILE})`
  }
  if (/@import\b[^\n]*@aziontech\/ui\/styles\/all/.test(cssEntry)) {
    return 'src/azion-ui.css registers every Azion UI component (@aziontech/ui/styles/all) — the app ships the CSS of all of them; import ./azion-ui.sources.css instead to compile only what it uses'
  }
  if (/@source\b[^\n]*@aziontech\/ui/.test(cssEntry)) {
    return 'src/azion-ui.css registers ui with an explicit @source'
  }
  return null
}

export function sourceRegistrationCheck({ cssEntry, add }) {
  const registered = registration(cssEntry)
  add('azion-ui.css @source', registered ? 'ok' : 'fail', registered || UNREGISTERED)
}

export function sourceExclusionCheck({ cssEntry, add }) {
  if (!cssEntry) return
  const unexcluded = missingExclusions(cssEntry)
  add(
    'azion-ui.css @source not',
    unexcluded.length ? 'warn' : 'ok',
    unexcluded.length
      ? `src/azion-ui.css does not keep ${unexcluded.map((p) => p.slice(3)).join(', ')} out of the ` +
          `Tailwind scan, so the example classes in the AI guidance files compile into your CSS. Add ` +
          `${unexcluded.map((p) => `\`${exclusionLine(p)}\``).join(' ')} (or run \`npx ` +
          `@aziontech/ui init\`).`
      : 'src/azion-ui.css keeps the AI guidance files (.agents, AGENTS.md, .claude, CLAUDE.md) out of the Tailwind scan'
  )
}

function staleDetail(sources) {
  const listed = new Set((sources.current ?? '').split('\n'))
  const missing = sources.content
    .split('\n')
    .filter((l) => l.startsWith('@source') && !listed.has(l))
  return (
    `${SOURCES_FILE} is out of ` +
    `date${missing.length ? ` — ${missing.length} imported Azion UI file(s) are missing, so their components render unstyled` : ''}. ` +
    `Run \`npx @aziontech/ui css\` (the Vite plugin, ${VITE_PLUGIN_SPECIFIER}, keeps it ` +
    `current on every dev and build).`
  )
}

function sourcesState(sources) {
  if (sources.stale) return ['fail', staleDetail(sources)]
  if (sources.resolved) {
    return [
      'ok',
      `${SOURCES_FILE} lists ${sources.files.length} Azion UI file(s) for ${sources.subpaths.length} import(s)`
    ]
  }
  if (sources.subpaths.length) {
    return [
      'warn',
      `@aziontech/ui is not installed, so ${SOURCES_FILE} cannot list the files of ${sources.subpaths.length} import(s). Install, then run \`npx @aziontech/ui css\`.`
    ]
  }
  return ['ok', `${SOURCES_FILE} is current (no Azion UI imports yet)`]
}

function vitePluginCheck(projectDir, add) {
  const viteCfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  if (!viteCfg) return
  const hasPlugin = Boolean(read(join(projectDir, viteCfg))?.includes(VITE_PLUGIN_SPECIFIER))
  add(
    'ui vite plugin',
    hasPlugin ? 'ok' : 'warn',
    hasPlugin
      ? `${viteCfg} runs ${VITE_PLUGIN_SPECIFIER}, so ${SOURCES_FILE} follows your imports`
      : `${viteCfg} does not run ${VITE_PLUGIN_SPECIFIER} — ${SOURCES_FILE} goes stale when you ` +
          `import a new component. Add \`import azionUi from '${VITE_PLUGIN_SPECIFIER}'\` and ` +
          `\`azionUi()\` to plugins.`
  )
}

export function sourcesFileCheck({ projectDir, cssEntry, add }) {
  if (!importsSources(cssEntry)) return
  add('azion-ui css sources', ...sourcesState(planSources(projectDir)))
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
        `Tailwind v4 may not run in the build. Add the plugin (see \`npx @aziontech/ui init ` +
        `--dry-run\`).`
    ]
  }
  return [
    'warn',
    'neither @tailwindcss/vite nor a PostCSS config — Tailwind v4 may not run in the build. Run `npx @aziontech/ui init`.'
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
    `${rawStylesheets.join(', ')} — hex/rgb/hsl values that the Azion UI stylelint rejects, so the pre-commit hook fails. Use theme tokens, or delete a starter template's stylesheet and its import.`
  )
}

export function themeImportCheck({ cssEntry, add }) {
  const themed = Boolean(cssEntry && /@import\b[^\n]*@aziontech\/theme/.test(cssEntry))
  add(
    'theme import',
    themed ? 'ok' : 'fail',
    themed
      ? "src/azion-ui.css imports '@aziontech/theme' (tokens + Tailwind)"
      : "src/azion-ui.css does not `@import '@aziontech/theme'` — no design tokens, so every component renders unstyled. Run `npx @aziontech/ui init`."
  )
}
