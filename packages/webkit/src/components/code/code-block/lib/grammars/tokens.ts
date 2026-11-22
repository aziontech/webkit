import type { CodeBlockHighlightToken, CodeBlockHighlightTokenType } from '../highlight-code'

export const pushToken = (
  tokens: CodeBlockHighlightToken[],
  text: string,
  type: CodeBlockHighlightTokenType
) => {
  if (!text) {
    return
  }

  const last = tokens[tokens.length - 1]

  if (last && last.type === type) {
    last.text += text
    return
  }

  tokens.push({ text, type })
}

export const scanLine = (
  line: string,
  pattern: RegExp,
  classify: (chunk: string, rest: string) => CodeBlockHighlightTokenType
): CodeBlockHighlightToken[] => {
  const tokens: CodeBlockHighlightToken[] = []

  for (const match of line.matchAll(pattern)) {
    const chunk = match[0]
    const blank = /^\s+$/.test(chunk)
    const rest = line.slice(match.index + chunk.length)

    pushToken(tokens, chunk, blank ? 'identifier' : classify(chunk, rest))
  }

  return tokens.length ? tokens : [{ text: line || ' ', type: 'identifier' }]
}
