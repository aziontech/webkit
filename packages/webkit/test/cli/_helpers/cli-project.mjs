import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
export const CLI = join(PKG_ROOT, 'src', 'cli', 'cli.js')

export function makeProject(files = {}, { installWebkit = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-cli-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'demo', version: '1.0.0' }))
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true })
    writeFileSync(join(dir, rel), content)
  }
  if (installWebkit) {
    mkdirSync(join(dir, 'node_modules', '@aziontech'), { recursive: true })
    symlinkSync(PKG_ROOT, join(dir, 'node_modules', '@aziontech', 'webkit'), 'dir')
  }
  return dir
}

export function cleanup(dir) {
  rmSync(dir, { recursive: true, force: true })
}

export function cli(dir, ...args) {
  const env = { ...process.env, NO_COLOR: '1' }
  delete env.FORCE_COLOR
  delete env.WEBKIT_CATALOG_PATH
  const proc = spawnSync(process.execPath, [CLI, ...args], { cwd: dir, encoding: 'utf8', env })
  return { code: proc.status, stdout: proc.stdout, stderr: proc.stderr }
}

export function cliJson(dir, ...args) {
  const r = cli(dir, ...args, '--json')
  return { ...r, json: JSON.parse(r.stdout) }
}
