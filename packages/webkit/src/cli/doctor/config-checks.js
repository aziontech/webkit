import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { readJsonStrict } from '../apply.js'
import { LEGACY_MCP_SERVER_ARGS, MCP_SERVER_NAME } from '../init/mcp.js'
import { readText, resolveCatalog } from './project.js'

function catalogVersion(catalogPath) {
  try {
    return JSON.parse(readFileSync(catalogPath, 'utf8')).webkitVersion || null
  } catch {
    return null
  }
}

export function catalogCheck({ projectDir, add }) {
  const catalogPath = resolveCatalog(projectDir)
  if (!catalogPath) {
    add(
      'webkit catalog',
      'fail',
      'not resolvable — lint rules are DISABLED. Install @aziontech/webkit, or set WEBKIT_CATALOG_PATH.'
    )
    return
  }
  const version = catalogVersion(catalogPath)
  add('webkit catalog', 'ok', `resolved${version ? ` (webkit ${version})` : ''}`)
}

export function eslintConfigCheck({ eslintCfg, add }) {
  add(
    'eslint config',
    eslintCfg ? 'ok' : 'fail',
    eslintCfg || 'no eslint config found — run `npx @aziontech/webkit init`.'
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
  add('stylelint config', 'fail', 'no stylelint config found — run `npx @aziontech/webkit init`.')
}

function mcpServerState(mcpPath) {
  const server = readJsonStrict(mcpPath)?.mcpServers?.[MCP_SERVER_NAME]
  if (JSON.stringify(server?.args) === JSON.stringify(LEGACY_MCP_SERVER_ARGS)) {
    return [
      'fail',
      `"${MCP_SERVER_NAME}" runs the webkit-mcp bin of @aziontech/webkit, removed in v6 — re-run \`npx @aziontech/webkit init\` to point it at @aziontech/webkit-mcp.`
    ]
  }
  if (server) return ['ok', `"${MCP_SERVER_NAME}" registered`]
  return ['fail', `.mcp.json has no "${MCP_SERVER_NAME}" server.`]
}

export function mcpCheck({ projectDir, add }) {
  const mcpPath = join(projectDir, '.mcp.json')
  if (!existsSync(mcpPath)) {
    add('mcp server', 'fail', 'no .mcp.json — the webkit MCP is not registered.')
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
  const plugged = /@aziontech\/webkit\/eslint-plugin/.test(eslintText)
  add(
    'lint plugin',
    plugged ? 'ok' : 'fail',
    plugged
      ? `${eslintCfg} loads @aziontech/webkit/eslint-plugin`
      : `${eslintCfg || 'the eslint config'} does not load @aziontech/webkit/eslint-plugin — the design-system rules do not run. Merge the preset \`npx @aziontech/webkit init --dry-run\` prints.`
  )
}
