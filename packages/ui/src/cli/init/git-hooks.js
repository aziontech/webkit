import { spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'

import { read } from './project-files.js'

const HUSKY_COMMENT = '# Lint the source with the webkit rules before every commit.'
const HUSKY_ESLINT = 'npx eslint src --no-error-on-unmatched-pattern'
const HUSKY_STYLELINT = 'npx stylelint "src/**/*.{css,scss,vue}" --allow-empty-input'

export const HUSKY_PRECOMMIT = `${HUSKY_COMMENT}
${HUSKY_ESLINT}
${HUSKY_STYLELINT}
`

export const HUSKY_HOOK_MARKER = HUSKY_STYLELINT

const LEGACY_HUSKY_LINES = new Map([
  ['# Lint with the webkit rules before every commit.', HUSKY_COMMENT],
  ['npx eslint .', HUSKY_ESLINT],
  ['npx stylelint "**/*.{css,scss,vue}"', HUSKY_STYLELINT]
])

export const LEGACY_HUSKY_HOOK_MARKER = 'npx stylelint "**/*.{css,scss,vue}"'

export function upgradeLegacyHook(hook) {
  return hook
    .split('\n')
    .map((line) => LEGACY_HUSKY_LINES.get(line.trim()) ?? line)
    .join('\n')
}

function canonical(path) {
  try {
    return realpathSync(path)
  } catch {
    return path
  }
}

export function gitState(projectDir) {
  const git = (args) => spawnSync('git', args, { cwd: projectDir, encoding: 'utf8' })
  const top = git(['rev-parse', '--show-toplevel'])
  if (top.error) return { available: false, repo: false }
  if (top.status !== 0) return { available: true, repo: false }
  const root = canonical(top.stdout.trim())
  const hooksPath = git(['config', '--get', 'core.hooksPath']).stdout.trim()
  return {
    available: true,
    repo: true,
    root,
    atRoot: root === canonical(projectDir),
    hooksPath,
    huskyActive: /^\.husky(\/|$)/.test(hooksPath)
  }
}

export function huskyBin(projectDir) {
  try {
    const require = createRequire(join(projectDir, '__webkit_resolve__.js'))
    const bin = join(dirname(require.resolve('husky')), 'bin.js')
    return existsSync(bin) ? bin : null
  } catch {
    return null
  }
}

export function wantsGitHooks(projectDir, git = gitState(projectDir)) {
  return git.repo || existsSync(join(projectDir, '.husky/pre-commit'))
}

const advise = (message) => [{ type: 'advise', message }]

function nestedRootAdvice(projectDir, git) {
  const rel = relative(git.root, projectDir).split('\\').join('/')
  return advise(
    `The git root is ${git.root}, above this project, so a plain "prepare": "husky" cannot find ` +
      `.git. Point it at this folder instead: "prepare": "cd ` +
      `${relative(projectDir, git.root).split('\\').join('/') || '.'} && husky ${rel}/.husky", ` +
      `then run your install.`
  )
}

function huskyActions(projectDir, git) {
  if (!git.available) {
    return advise(
      'git was not found, so the pre-commit hook cannot be activated. Install git, then run `npx husky` to activate .husky/pre-commit.'
    )
  }
  if (!git.repo) {
    return advise(
      'This folder is not a git repository yet, so husky cannot activate .husky/pre-commit. After `git init`, run `npx husky` once.'
    )
  }
  if (git.huskyActive) return []
  if (!git.atRoot) return nestedRootAdvice(projectDir, git)
  if (huskyBin(projectDir)) return [{ type: 'activate-hooks' }]
  return advise(
    'Husky pre-commit hook written. Run your package manager install (which runs the "prepare" script) to activate git hooks.'
  )
}

function preCommitAction(projectDir) {
  const existingHook = read(join(projectDir, '.husky/pre-commit'))
  if (
    existingHook &&
    existingHook.includes(LEGACY_HUSKY_HOOK_MARKER) &&
    !existingHook.includes(HUSKY_HOOK_MARKER)
  ) {
    return { type: 'write', path: '.husky/pre-commit', content: upgradeLegacyHook(existingHook) }
  }
  return {
    type: 'append',
    path: '.husky/pre-commit',
    content: HUSKY_PRECOMMIT,
    marker: HUSKY_HOOK_MARKER,
    mode: 0o755
  }
}

const NO_GIT_HOOKS_NOTE =
  'Not a git repository, so no pre-commit hook was added (husky, "prepare", .husky/pre-commit). After `git init`, run `npx @aziontech/webkit init` again to add it.'

function prepareAction(pkg, gitHooks) {
  const existingPrepare = pkg.scripts?.prepare
  if (!gitHooks) return { type: 'advise', message: NO_GIT_HOOKS_NOTE }
  if (existingPrepare && existingPrepare !== 'husky') {
    return {
      type: 'advise',
      message:
        `package.json already has a "prepare" script ("${existingPrepare}") — husky was NOT wired, ` +
        `so .husky/pre-commit will not run. Chain it yourself: "prepare": "${existingPrepare} && husky".`
    }
  }
  return {
    type: 'merge-json',
    path: 'package.json',
    description: 'add the "prepare" script (husky)',
    merge: { scripts: { prepare: 'husky' } }
  }
}

export function gitHookActions(projectDir, pkg, git, gitHooks) {
  const actions = [prepareAction(pkg, gitHooks)]
  if (gitHooks) actions.push(preCommitAction(projectDir), ...huskyActions(projectDir, git))
  return actions
}
