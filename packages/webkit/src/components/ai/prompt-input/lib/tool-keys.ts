import type { PromptInputMenuOption } from '../types'

export function enabledTools(
  tools: ReadonlyArray<PromptInputMenuOption>,
  keys: ReadonlyArray<string>
): PromptInputMenuOption[] {
  return tools.filter((tool) => keys.includes(tool.value))
}

export function toggleTool(
  tools: ReadonlyArray<PromptInputMenuOption>,
  keys: ReadonlyArray<string>,
  value: string
): string[] {
  const next = keys.includes(value) ? keys.filter((item) => item !== value) : [...keys, value]
  return tools.map((tool) => tool.value).filter((item) => next.includes(item))
}
