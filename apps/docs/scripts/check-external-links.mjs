import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(APP, 'dist')
const CONFIGS = ['lychee.toml', 'lychee-bot-blocked.toml']

for (const config of CONFIGS) {
  const run = spawnSync(
    'lychee',
    ['--config', config, '--root-dir', DIST, '--no-progress', 'dist/**/*.html'],
    { cwd: APP, stdio: 'inherit' }
  )
  if (run.error) {
    console.error(`check-external-links: lychee is not on PATH (${run.error.message})`)
    process.exit(1)
  }
  if (run.status !== 0) process.exit(run.status ?? 1)
}
console.log('check-external-links: every external link resolves.')
