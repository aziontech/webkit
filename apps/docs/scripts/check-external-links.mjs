import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = resolve(APP, '../..')
const DIST = resolve(APP, 'dist')
const CONFIGS = ['lychee.toml', 'lychee-bot-blocked.toml']
const SOURCE_LINK =
  /https:\/\/github\.com\/aziontech\/webkit\/(?:blob|tree)\/([0-9a-f]{40})\/([^"'#?\s<>)]+)/g
const SOURCE_EXCLUDE = '^https://github\\.com/aziontech/webkit/(blob|tree)/[0-9a-f]{40}/'

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(path)
    return entry.name.endsWith('.html') ? [path] : []
  })
}

function existsAt(ref, path) {
  const run = spawnSync('git', ['cat-file', '-e', `${ref}:${path}`], { cwd: REPO })
  if (run.status === 0) return true
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: REPO, encoding: 'utf8' })
  if (head.stdout?.trim() === ref) return false
  return spawnSync('git', ['cat-file', '-e', `HEAD:${path}`], { cwd: REPO }).status === 0
}

const sourceLinks = new Map()
for (const file of htmlFiles(DIST)) {
  for (const [, ref, path] of readFileSync(file, 'utf8').matchAll(SOURCE_LINK)) {
    const clean = decodeURIComponent(path).replace(/\/$/, '')
    sourceLinks.set(`${ref}:${clean}`, { ref, path: clean })
  }
}
const missing = [...sourceLinks.values()].filter(({ ref, path }) => !existsAt(ref, path))
if (missing.length) {
  for (const { ref, path } of missing) console.error(`[missing] ${path} (at ${ref.slice(0, 9)})`)
  console.error(
    `check-external-links: ${missing.length} source link(s) point at no file in the repository.`
  )
  process.exit(1)
}
console.log(
  `check-external-links: ${sourceLinks.size} source links point at files in the repository.`
)

for (const config of CONFIGS) {
  const run = spawnSync(
    'lychee',
    [
      '--config',
      config,
      '--root-dir',
      DIST,
      '--no-progress',
      '--exclude',
      SOURCE_EXCLUDE,
      'dist/**/*.html'
    ],
    { cwd: APP, stdio: 'inherit' }
  )
  if (run.error) {
    console.error(`check-external-links: lychee is not on PATH (${run.error.message})`)
    process.exit(1)
  }
  if (run.status !== 0) process.exit(run.status ?? 1)
}
console.log('check-external-links: every external link resolves.')
