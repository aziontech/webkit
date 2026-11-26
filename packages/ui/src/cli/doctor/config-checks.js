import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { readJsonStrict } from '../apply.js'
import { LEGACY_MCP_SERVER_ARGS, LEGACY_MCP_SERVER_NAME, MCP_SERVER_NAME } from '../init/mcp.js'
import { readText, resolveCatalog } from './project.js'

function catalogVersion(catalogPath) {
  try {
    return JSON.parse(readFileSync(catalogPath, 'utf8')).azionUiVersion || null
  } catch {
    return null
  }
}

export function catalogCheck({ projectDir, add }) {
  const catalogPath = resolveCatalog(projectDir)
  if (!catalogPath) {
    add(
      'Azion UI catalog',
      'fail',
      'not resolvable — lint rules are DISABLED. Install @aziontech/ui, or set AZION_UI_CATALOG_PATH.'
    )
    return
  }
  const version = catalogVersion(catalogPath)
  add('Azion UI catalog', 'ok', `resolved${version ? ` (ui ${version})` : ''}`)
}

export function eslintConfigCheck({ eslintCfg, add }) {
  add(
    'eslint config',
    eslintCfg ? 'ok' : 'fail',
    eslintCfg || 'no eslint config found — run `npx @aziontech/ui init`.'
  )
}

export function stylelintConfigCheck({ stylelintCfg, pkg, add }) {
  if (stylelintCfg) {
    add('stylelint config', 'ok', stylelintCfg)
    return
  }
  if (pkg && pkg.stylelint) {
    add('stylelint config', 'ok', 'package.json#stylelint')
    return
  }
  add('stylelint config', 'fail', 'no stylelint config found — run `npx @aziontech/ui init`.')
}

function mcpServerState(mcpPath) {
  const servers = readJsonStrict(mcpPath)?.mcpServers
  const legacy = servers?.[LEGACY_MCP_SERVER_NAME]
  const server = servers?.[MCP_SERVER_NAME]
  if (legacy || JSON.stringify(server?.args) === JSON.stringify(LEGACY_MCP_SERVER_ARGS)) {
    const name = legacy ? LEGACY_MCP_SERVER_NAME : MCP_SERVER_NAME
    return [
      'fail',
      `"${name}" runs ${LEGACY_MCP_SERVER_ARGS[2]}, renamed to @aziontech/ui in v6 — run ` +
        '`npx @aziontech/ui migrate v6` or re-run `npx @aziontech/ui init` to point it at @aziontech/ui-mcp.'
    ]
  }
  if (server) return ['ok', `"${MCP_SERVER_NAME}" registered`]
  return ['fail', `.mcp.json has no "${MCP_SERVER_NAME}" server.`]
}

export function mcpCheck({ projectDir, add }) {
  const mcpPath = join(projectDir, '.mcp.json')
  if (!existsSync(mcpPath)) {
    add('mcp server', 'fail', 'no .mcp.json — the Azion UI MCP is not registered.')
    return
  }
  try {
    add('mcp server', ...mcpServerState(mcpPath))
  } catch (err) {
    add('mcp server', 'fail', err.message)
  }
}

const ignoresDist = (text) => /(^|[\s'"/*])dist(\/|['"\s]|$)/m.test(text)

export function buildOutputCheck({ projectDir, eslintCfg, eslintText, stylelintCfg, add }) {
  const stylelintIgnore = readText(projectDir, '.stylelintignore')
  const stylelintText = readText(projectDir, stylelintCfg)
  const eslintIgnores = ignoresDist(eslintText)
  const stylelintIgnores =
    ignoresDist(stylelintIgnore) || /ignoreFiles[\s\S]*dist/.test(stylelintText)
  if (eslintIgnores && stylelintIgnores) {
    add('build output ignored', 'ok', 'eslint and stylelint skip dist/')
    return
  }
  const problems = []
  if (!eslintIgnores) {
    problems.push(
      `${eslintCfg || 'the eslint config'} does not ignore dist/ — add \`{ ignores: ['**/dist/'] }\` first in the config, or lint reports the compiled bundle.`
    )
  }
  if (!stylelintIgnores) {
    problems.push(
      'stylelint does not ignore dist/ — add `dist/` to .stylelintignore, or it lints the compiled CSS (hundreds of errors).'
    )
  }
  add('build output ignored', 'warn', problems.join('\n'))
}

export function lintPluginCheck({ eslintCfg, eslintText, add }) {
  const plugged = /@aziontech\/ui\/eslint-plugin/.test(eslintText)
  add(
    'lint plugin',
    plugged ? 'ok' : 'fail',
    plugged
      ? `${eslintCfg} loads @aziontech/ui/eslint-plugin`
      : `${eslintCfg || 'the eslint config'} does not load @aziontech/ui/eslint-plugin — the design-system rules do not run. Merge the preset \`npx @aziontech/ui init --dry-run\` prints.`
  )
}
