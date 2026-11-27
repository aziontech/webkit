#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import Module, { createRequire } from 'node:module'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const PKG_DIR = resolve(SCRIPT_DIR, '..')

export const MAX_SFC_ANYS = 16

const GENERATED = /^(?:__VLS_\w+|\$event)$/

const require = createRequire(import.meta.url)
const vueTscRequire = createRequire(require.resolve('vue-tsc/package.json'))
const coreRequire = createRequire(
  createRequire(require.resolve('type-coverage/package.json')).resolve(
    'type-coverage-core/package.json'
  )
)

function vueTypeScript(ts, vueOptions) {
  const { proxyCreateProgram } = vueTscRequire('@volar/typescript')
  const { createVueLanguagePlugin } = vueTscRequire('@vue/language-core')
  const proxied = proxyCreateProgram(ts, ts.createProgram, (proxyTs, options) => ({
    languagePlugins: [createVueLanguagePlugin(proxyTs, options.options, vueOptions, (id) => id)]
  }))
  const createProgram = (rootNames, options, host, oldProgram) =>
    Array.isArray(rootNames)
      ? proxied({ rootNames, options, host: host ?? ts.createCompilerHost(options), oldProgram })
      : proxied(rootNames)
  return { ...ts, createProgram }
}

function loadCoverage(vueTs) {
  const load = Module._load
  Module._load = function (request, parent, ...rest) {
    if (request === 'typescript' && parent?.filename?.includes('type-coverage-core')) return vueTs
    return load.call(this, request, parent, ...rest)
  }
  try {
    return coreRequire('type-coverage-core')
  } finally {
    Module._load = load
  }
}

function sourceMapper(ts, options, vueOptions) {
  const { createVueLanguagePlugin } = vueTscRequire('@vue/language-core')
  const { createLanguage } = createRequire(vueTscRequire.resolve('@volar/typescript'))(
    '@volar/language-core'
  )
  const plugin = createVueLanguagePlugin(ts, options, vueOptions, (id) => id)
  const language = createLanguage([plugin], new Map(), (id) => {
    language.scripts.set(id, ts.ScriptSnapshot.fromString(readFileSync(id, 'utf8')), 'vue')
  })
  return (sourceFile, line, character) => {
    const script = language.scripts.get(sourceFile.fileName)
    const service = plugin.typescript.getServiceScript(script.generated.root)
    const lead = sourceFile.text.length - service.code.snapshot.getLength()
    const offset = sourceFile.getPositionOfLineAndCharacter(line, character) - lead
    for (const [source, mapping] of language.maps
      .get(service.code, script)
      .toSourceLocation(offset))
      if (mapping.data.verification || mapping.data.semantic) return source
    return null
  }
}

export function sfcAnys(pkgDir = PKG_DIR) {
  const ts = vueTscRequire('typescript')
  const { createParsedCommandLine } = vueTscRequire('@vue/language-core')
  const tsconfig = resolve(pkgDir, 'tsconfig.json')
  const { vueOptions } = createParsedCommandLine(ts, ts.sys, tsconfig)
  const parsed = ts.getParsedCommandLineOfConfigFile(
    tsconfig,
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
    undefined,
    undefined,
    [{ extension: 'vue', isMixedContent: true, scriptKind: ts.ScriptKind.Deferred }]
  )
  const { lintSync } = loadCoverage(vueTypeScript(ts, vueOptions))
  const { anys, program } = lintSync(parsed.options, parsed.fileNames, {
    absolutePath: true,
    strict: false
  })
  const toSource = sourceMapper(ts, parsed.options, vueOptions)
  const found = []
  for (const any of anys) {
    if (!any.file.endsWith('.vue') || GENERATED.test(any.text)) continue
    const sourceFile = program.getSourceFile(any.file)
    const at = sourceFile && toSource(sourceFile, any.line, any.character)
    if (at === null || at === undefined) continue
    const line = readFileSync(any.file, 'utf8').slice(0, at).split('\n').length
    found.push({ file: relative(pkgDir, any.file), line, text: any.text })
  }
  return found.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

function main(args) {
  const found = sfcAnys()
  if (args.includes('--detail'))
    for (const any of found) console.log(`  ${any.file}:${any.line}  ${any.text}`)
  if (found.length > MAX_SFC_ANYS) {
    console.error(
      `✖ ${found.length} identifiers typed any in component SFCs, more than the ${MAX_SFC_ANYS} allowed. ` +
        'Type the new one (run with --detail to list them); the limit only goes down (audit-6 A6-292).'
    )
    return 1
  }
  const lower =
    found.length < MAX_SFC_ANYS ? ` Lower MAX_SFC_ANYS to ${found.length} in this script.` : ''
  console.log(
    `✓ ${found.length} identifiers typed any in component SFC scripts and templates (limit ${MAX_SFC_ANYS}).${lower}`
  )
  return 0
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main(process.argv.slice(2)))
}
