// The compiler options of a fresh create-vue app (strict, no unused locals or parameters,
// verbatim module syntax). Copyable files and the component typing fixtures are type-checked
// with vue-tsc under exactly these options, so "it type-checks here" means "it type-checks in
// the app a consumer starts from".

import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_DIR = fileURLToPath(new URL('../..', import.meta.url))
const require = createRequire(import.meta.url)

// create-vue's env.d.ts references `vite/client`, which types asset imports such as `*.svg`.
const VITE_CLIENT_TYPES = join(dirname(require.resolve('vite/package.json')), 'client')

export const CONSUMER_COMPILER_OPTIONS = {
  target: 'ES2022',
  module: 'ESNext',
  moduleResolution: 'bundler',
  lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  jsx: 'preserve',
  strict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  verbatimModuleSyntax: true,
  isolatedModules: true,
  resolveJsonModule: true,
  skipLibCheck: true,
  noEmit: true,
  types: [VITE_CLIENT_TYPES]
}

// create-vue's env.d.ts (`/// <reference types="vite/client" />`): the Vite client types, so
// `import.meta.env` and `?worker` / `?url` imports type-check as they do in the app.
export const CONSUMER_ENV_FILES = [
  join(dirname(require.resolve('vite/package.json', { paths: [PKG_DIR] })), 'client.d.ts')
]

const THEME_DIR = fileURLToPath(new URL('../../../theme', import.meta.url))
const THEME_TYPED_ENTRY = join(THEME_DIR, 'src/tokens/primitives/animations/animate')

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  )

// The theme's JS entry points (`@aziontech/theme/animations`, …) get their declarations from
// the theme's `build:types`, which runs on prepack, so a published theme carries them but a fresh
// checkout does not. Emit them into a temp dir on the same filesystem and rename each file into place: renames are
// atomic, so test files running in parallel never read a half-written declaration.
export function ensureThemeTypes() {
  const dts = `${THEME_TYPED_ENTRY}.d.ts`
  if (existsSync(dts) && statSync(dts).mtimeMs >= statSync(`${THEME_TYPED_ENTRY}.js`).mtimeMs) {
    return
  }
  const scratch = join(THEME_DIR, 'node_modules')
  mkdirSync(scratch, { recursive: true })
  const out = mkdtempSync(join(scratch, '.webkit-dts-'))
  try {
    const vueTsc = join(dirname(require.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
    const run = spawnSync(
      process.execPath,
      [
        vueTsc,
        '-p',
        join(THEME_DIR, 'tsconfig.json'),
        '--declarationMap',
        'false',
        '--outDir',
        out
      ],
      { cwd: THEME_DIR, encoding: 'utf8', timeout: 120_000 }
    )
    if (run.error) throw run.error
    if (run.status !== 0) throw new Error(`theme build:types failed\n${run.stdout}${run.stderr}`)
    for (const file of walk(out).filter((path) => path.endsWith('.d.ts'))) {
      const target = join(THEME_DIR, relative(out, file))
      mkdirSync(dirname(target), { recursive: true })
      renameSync(file, target)
    }
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
}

// Runs vue-tsc over absolute file paths with the consumer options (and no vueCompilerOptions,
// as create-vue writes none) and returns the `error TS` lines, paths relative to the package.
export function consumerTypeErrors(files, overrides = {}) {
  ensureThemeTypes()
  const dir = mkdtempSync(join(tmpdir(), 'webkit-consumer-ts-'))
  try {
    const tsconfig = join(dir, 'tsconfig.json')
    writeFileSync(
      tsconfig,
      JSON.stringify({
        compilerOptions: { ...CONSUMER_COMPILER_OPTIONS, ...overrides },
        files: [...CONSUMER_ENV_FILES, ...files]
      })
    )
    const vueTsc = join(dirname(require.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
    const run = spawnSync(process.execPath, [vueTsc, '-p', tsconfig, '--pretty', 'false'], {
      cwd: PKG_DIR,
      encoding: 'utf8',
      timeout: 240_000
    })
    if (run.error) throw run.error
    return `${run.stdout}${run.stderr}`
      .split('\n')
      .filter((line) => /error TS\d+/.test(line))
      .map((line) => line.replace(PKG_DIR, ''))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
