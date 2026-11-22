import { LEGACY_MARKER, listBundle } from './bundle.js'
import {
  eslintFlatConfig,
  lintConfigActions,
  postcssAction,
  postcssConfig,
  STYLELINT_CONTENT,
  STYLELINT_IGNORE
} from './init/configs.js'
import {
  DEP_VERSION,
  DEP_VERSIONS,
  depActions,
  DEV_DEPS,
  ICONS_DEP,
  RUNTIME_DEPS,
  STYLE_DEV_DEPS
} from './init/deps.js'
import { entryActions } from './init/entry.js'
import {
  gitHookActions,
  gitState,
  HUSKY_PRECOMMIT,
  upgradeLegacyHook,
  wantsGitHooks
} from './init/git-hooks.js'
import { mcpAction } from './init/mcp.js'
import {
  ENTRY_CANDIDATES,
  firstExisting,
  readPackage,
  usesTailwindVitePlugin
} from './init/project-files.js'
import { starterActions } from './init/starter.js'
import { styleActions, styleEntryContent } from './init/styles.js'
import { planSync } from './sync.js'

const CLAUDE_BUNDLE = listBundle()

export const CLAUDE_FRAGMENT_MARKER = LEGACY_MARKER

export function planInit(projectDir, opts = {}) {
  const severity = opts.recommended ? 'recommended' : 'strict'
  const icons = opts.icons !== false
  const wireEntry = opts.wireEntry !== false

  const pkg = readPackage(projectDir)
  const git = gitState(projectDir)
  const gitHooks = wantsGitHooks(projectDir, git)
  const entry = firstExisting(projectDir, ENTRY_CANDIDATES)

  return [
    ...depActions(projectDir, pkg, { icons, gitHooks }),
    postcssAction(projectDir, usesTailwindVitePlugin(projectDir)),
    ...styleActions(projectDir),
    ...lintConfigActions(projectDir, severity),
    mcpAction(projectDir),
    ...gitHookActions(projectDir, pkg, git, gitHooks),
    ...starterActions(projectDir, entry, { wireEntry, gitHooks }),
    ...planSync(projectDir).actions,
    ...entryActions(projectDir, entry, { icons, wireEntry })
  ]
}

export {
  gitState,
  HUSKY_HOOK_MARKER,
  huskyBin,
  LEGACY_HUSKY_HOOK_MARKER
} from './init/git-hooks.js'
export { MCP_SERVER_NAME } from './init/mcp.js'
export {
  BUILD_OUTPUT_DIRS,
  ESLINT_CONFIG_CANDIDATES,
  firstExisting,
  STYLELINT_CONFIG_CANDIDATES
} from './init/project-files.js'
export { patchViteConfig } from './init/styles.js'

export const _internals = {
  RUNTIME_DEPS,
  ICONS_DEP,
  DEV_DEPS,
  STYLE_DEV_DEPS,
  DEP_VERSION,
  DEP_VERSIONS,
  CLAUDE_BUNDLE,
  eslintFlatConfig,
  postcssConfig,
  usesTailwindVitePlugin,
  styleEntryContent,
  STYLELINT_CONTENT,
  STYLELINT_IGNORE,
  HUSKY_PRECOMMIT,
  upgradeLegacyHook
}
