export interface TextSegment {
  text: string
  match: boolean
}

/** Splits text into segments for optional search highlighting (case-insensitive). */
export function splitTextByQuery(text: string, query: string): TextSegment[] {
  const needle = query.trim()

  if (!needle) {
    return [{ text, match: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerNeedle = needle.toLowerCase()
  const segments: TextSegment[] = []
  let start = 0
  let index = lowerText.indexOf(lowerNeedle, start)

  while (index !== -1) {
    if (index > start) {
      segments.push({ text: text.slice(start, index), match: false })
    }

    segments.push({ text: text.slice(index, index + needle.length), match: true })
    start = index + needle.length
    index = lowerText.indexOf(lowerNeedle, start)
  }

  if (start < text.length) {
    segments.push({ text: text.slice(start), match: false })
  }

  return segments.length > 0 ? segments : [{ text, match: false }]
}
