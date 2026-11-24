export type ParsedJsonObject = { value: Record<string, unknown> } | { message: string }

export function parseJsonObject(text: string): ParsedJsonObject {
  try {
    const parsed: unknown = JSON.parse(text || '{}')
    if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object')
      return { message: 'The arguments must be a JSON object.' }
    return { value: parsed as Record<string, unknown> }
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'This is not valid JSON.' }
  }
}
