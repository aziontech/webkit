import type { CodeBlockHighlightToken } from '../highlight-code'
import { pushToken } from './tokens'

export const LINE_COMMENT = /(?<=^|[\s;])(?:#|\/\/)/y
export const JS_LINE_COMMENT = /\/\/|(?<=^|[\s;])#(?=\s|$|!)/y

const findLineCommentStart = (line: string, marker: RegExp): number => {
  let quote = ''

  for (let index = 0; index < line.length; index++) {
    const char = line[index]

    if (quote) {
      if (char === '\\') {
        index++
      } else if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    marker.lastIndex = index
    if (marker.test(line)) {
      return index
    }
  }

  return -1
}

export const withLineComment = (
  line: string,
  marker: RegExp,
  highlightCode: (code: string) => CodeBlockHighlightToken[]
): CodeBlockHighlightToken[] => {
  const start = findLineCommentStart(line, marker)

  if (start === -1) {
    return highlightCode(line)
  }

  const tokens = start > 0 ? highlightCode(line.slice(0, start)) : []
  pushToken(tokens, line.slice(start), 'comment')
  return tokens
}
