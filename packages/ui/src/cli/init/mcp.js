import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { loadPackageMap } from '../migrate-package.js'
import { read } from './project-files.js'

export const MCP_SERVER_NAME = 'azion-ui'
const OWN_VERSION = JSON.parse(
  readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')
).version
export const MCP_PACKAGE = `@aziontech/ui-mcp@^${OWN_VERSION.split('.')[0]}`
const MCP_SERVER_ENTRY = {
  command: 'npx',
  args: ['-y', MCP_PACKAGE]
}
const PACKAGE_MAP = loadPackageMap()
const oldNameOf = (table, next) => Object.keys(table || {}).find((old) => table[old] === next)
export const LEGACY_MCP_SERVER_NAME = oldNameOf(PACKAGE_MAP.mcpServer, MCP_SERVER_NAME)
export const LEGACY_MCP_SERVER_ARGS = [
  '-y',
  '-p',
  oldNameOf(PACKAGE_MAP.packages, '@aziontech/ui'),
  oldNameOf(PACKAGE_MAP.bins, 'azion-ui-mcp')
]
const UNPINNED_MCP_SERVER_ARGS = ['-y', '@aziontech/ui-mcp']
const OLD_UNPINNED_MCP_SERVER_ARGS = ['-y', oldNameOf(PACKAGE_MAP.packages, '@aziontech/ui-mcp')]
const OUTDATED_ARGS = [
  LEGACY_MCP_SERVER_ARGS,
  UNPINNED_MCP_SERVER_ARGS,
  OLD_UNPINNED_MCP_SERVER_ARGS
]

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function upgradeLegacyMcp(projectDir) {
  const raw = read(join(projectDir, '.mcp.json'))
  if (!raw) return null
  let config
  try {
    config = JSON.parse(raw)
  } catch {
    return null
  }
  const servers = config?.mcpServers
  const legacyEntry = servers?.[LEGACY_MCP_SERVER_NAME]
  const entry = servers?.[MCP_SERVER_NAME] ?? legacyEntry
  if (!entry) return null
  if (!legacyEntry && !OUTDATED_ARGS.some((args) => same(entry.args, args))) return null
  if (legacyEntry) delete servers[LEGACY_MCP_SERVER_NAME]
  servers[MCP_SERVER_NAME] = { ...entry, ...MCP_SERVER_ENTRY }
  return `${JSON.stringify(config, null, 2)}\n`
}

export function mcpAction(projectDir) {
  const upgradedMcp = upgradeLegacyMcp(projectDir)
  if (upgradedMcp) {
    return {
      type: 'write',
      path: '.mcp.json',
      description: `point the "${MCP_SERVER_NAME}" MCP server at ${MCP_PACKAGE}`,
      content: upgradedMcp
    }
  }
  return {
    type: 'merge-json',
    path: '.mcp.json',
    description: `register the "${MCP_SERVER_NAME}" MCP server`,
    merge: { mcpServers: { [MCP_SERVER_NAME]: MCP_SERVER_ENTRY } }
  }
}
