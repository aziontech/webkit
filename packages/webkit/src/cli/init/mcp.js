import { join } from 'node:path'

import { read } from './project-files.js'

export const MCP_SERVER_NAME = 'webkit'
const MCP_SERVER_ENTRY = {
  command: 'npx',
  args: ['-y', '@aziontech/webkit-mcp']
}
export const LEGACY_MCP_SERVER_ARGS = ['-y', '-p', '@aziontech/webkit', 'webkit-mcp']

function upgradeLegacyMcp(projectDir) {
  const raw = read(join(projectDir, '.mcp.json'))
  if (!raw) return null
  let config
  try {
    config = JSON.parse(raw)
  } catch {
    return null
  }
  const entry = config?.mcpServers?.[MCP_SERVER_NAME]
  if (JSON.stringify(entry?.args) !== JSON.stringify(LEGACY_MCP_SERVER_ARGS)) return null
  config.mcpServers[MCP_SERVER_NAME] = { ...entry, ...MCP_SERVER_ENTRY }
  return `${JSON.stringify(config, null, 2)}\n`
}

export function mcpAction(projectDir) {
  const upgradedMcp = upgradeLegacyMcp(projectDir)
  if (upgradedMcp) {
    return {
      type: 'write',
      path: '.mcp.json',
      description: `point the "${MCP_SERVER_NAME}" MCP server at @aziontech/webkit-mcp`,
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
