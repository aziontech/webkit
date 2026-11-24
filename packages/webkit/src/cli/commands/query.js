import { formatSearch, formatView, runSearch, runView } from '../query.js'
import { catalogFor, resolveWebkit } from '../source.js'
import { err, json, out } from './output.js'

function printView(result, parsed) {
  if (parsed.json) {
    json(result)
    return result.ok ? 0 : 1
  }
  if (!result.ok) {
    err(`${result.error}\n`)
    if (result.suggestions?.length) err(`Did you mean: ${result.suggestions.join(', ')}?\n`)
    return 1
  }
  out(formatView(result))
  return 0
}

export function runQuery(projectDir, command, parsed) {
  const query = parsed.args.join(' ').trim()
  if (!query) {
    err(`Usage: npx @aziontech/webkit ${command} <${command === 'view' ? 'id' : 'query'}>\n`)
    return 1
  }
  const catalog = catalogFor(resolveWebkit(projectDir))
  if (command === 'search') {
    const result = runSearch(catalog, query)
    if (parsed.json) json(result)
    else out(formatSearch(result))
    return 0
  }
  const result = runView(catalog, query, { variant: parsed.variant, example: parsed.example })
  return printView(result, parsed)
}
