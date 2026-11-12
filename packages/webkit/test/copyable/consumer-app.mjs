// The compiler options of a fresh create-vue app (strict, no unused locals or parameters,
// verbatim module syntax). Copyable files and the component typing fixtures are type-checked
// with vue-tsc under exactly these options, so "it type-checks here" means "it type-checks in
// the app a consumer starts from".

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_DIR = fileURLToPath(new URL('../..', import.meta.url))
const require = createRequire(import.meta.url)

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
  noEmit: true
}

// create-vue's env.d.ts (`/// <reference types="vite/client" />`): the Vite client types, so
// `import.meta.env` and `?worker` / `?url` imports type-check as they do in the app.
export const CONSUMER_ENV_FILES = [
  join(dirname(require.resolve('vite/package.json', { paths: [PKG_DIR] })), 'client.d.ts')
]

// Runs vue-tsc over absolute file paths with the consumer options (and no vueCompilerOptions,
// as create-vue writes none) and returns the `error TS` lines, paths relative to the package.
export function consumerTypeErrors(files) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-consumer-ts-'))
  try {
    const tsconfig = join(dir, 'tsconfig.json')
    writeFileSync(
      tsconfig,
      JSON.stringify({
        compilerOptions: CONSUMER_COMPILER_OPTIONS,
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
