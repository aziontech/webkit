import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

import { gitState, LEGACY_HUSKY_HOOK_MARKER, wantsGitHooks } from '../init/git-hooks.js'
import { read } from '../init/project-files.js'

function gitRootDir(projectDir, git) {
  if (git.repo && git.root) return git.root
  let dir = projectDir
  for (;;) {
    if (existsSync(join(dir, '.git'))) return dir
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

function readPackage(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

const LINT_STAGED_FILES = [
  '.lintstagedrc',
  '.lintstagedrc.json',
  '.lintstagedrc.yaml',
  '.lintstagedrc.yml',
  '.lintstagedrc.mjs',
  '.lintstagedrc.cjs',
  '.lintstagedrc.js',
  'lint-staged.config.mjs',
  'lint-staged.config.cjs',
  'lint-staged.config.js'
]

function lintStagedRunsStylelint(dir, dirPkg) {
  if (dirPkg?.['lint-staged'] && /stylelint/.test(JSON.stringify(dirPkg['lint-staged']))) {
    return true
  }
  return LINT_STAGED_FILES.some((file) => /stylelint/.test(read(join(dir, file)) || ''))
}

function hookLints(dir, dirPkg, hook) {
  if (!hook) return false
  if (/stylelint/.test(hook)) return true
  return /lint-staged/.test(hook) && lintStagedRunsStylelint(dir, dirPkg)
}

const runsHusky = (prepare) => typeof prepare === 'string' && /\bhusky\b/.test(prepare)

function prepareCheck(hooks) {
  const { pkg, root, rootPkg, where } = hooks
  const prepare = pkg?.scripts?.prepare
  const rootPrepare = rootPkg?.scripts?.prepare
  if (runsHusky(prepare)) return ['ok', `scripts.prepare = ${prepare}`]
  if (runsHusky(rootPrepare)) {
    return ['ok', `${where(root)}package.json scripts.prepare = ${rootPrepare}`]
  }
  return ['warn', 'missing scripts.prepare="husky" — git hooks will not activate on install.']
}

function lintingHook({ projectDir, pkg, root, rootPkg }) {
  const candidates = [{ dir: projectDir, pkg }]
  if (root && root !== projectDir) candidates.push({ dir: root, pkg: rootPkg })
  return candidates
    .map((c) => ({ ...c, hook: read(join(c.dir, '.husky/pre-commit')) }))
    .find((c) => hookLints(c.dir, c.pkg, c.hook))
}

function preCommitCheck(hooks, found) {
  if (!found) return ['warn', 'no .husky/pre-commit lint block — commits are not linted locally.']
  const prefix = hooks.where(found.dir)
  if (found.hook.includes(LEGACY_HUSKY_HOOK_MARKER)) {
    return [
      'warn',
      `${prefix}.husky/pre-commit lints the whole tree, build output included (\`npx ` +
        `stylelint "**/*…"\`), so the first commit after a build fails on compiled CSS — re-run ` +
        `\`npx @aziontech/webkit init\` to lint \`src/\` only.`
    ]
  }
  return ['ok', `${prefix}.husky/pre-commit lints on commit`]
}

function activeHooksDetail(git) {
  if (!git.available) return 'git was not found — the pre-commit hook cannot run.'
  if (!git.repo) {
    return 'not a git repository — the pre-commit hook cannot run. After `git init`, run `npx husky` once to activate it.'
  }
  if (git.huskyActive) return `core.hooksPath = ${git.hooksPath}`
  return (
    `the pre-commit hook is not active (core.hooksPath is ` +
    `${git.hooksPath ? `"${git.hooksPath}"` : 'unset'}) — run \`npx husky\` once (husky skips ` +
    `activation when the install runs before \`git init\`).`
  )
}

function checkGitHooks(projectDir, pkg, git, add) {
  const root = gitRootDir(projectDir, git)
  const rootPkg = root && root !== projectDir ? readPackage(root) : null
  const where = (dir) => {
    const rel = relative(projectDir, dir).split('\\').join('/')
    return rel ? `${rel}/` : ''
  }
  const hooks = { projectDir, pkg, root, rootPkg, where }
  add('husky prepare script', ...prepareCheck(hooks))
  const found = lintingHook(hooks)
  add('pre-commit hook', ...preCommitCheck(hooks, found))
  if (found) add('git hooks', git.huskyActive ? 'ok' : 'warn', activeHooksDetail(git))
}

export function gitHooksCheck({ projectDir, pkg, add }) {
  const git = gitState(projectDir)
  if (wantsGitHooks(projectDir, git) || pkg?.scripts?.prepare === 'husky') {
    checkGitHooks(projectDir, pkg, git, add)
    return
  }
  add(
    'git hooks',
    'ok',
    'not a git repository, so init added no pre-commit hook. After `git init`, run `npx @aziontech/webkit init` again to add it.'
  )
}
