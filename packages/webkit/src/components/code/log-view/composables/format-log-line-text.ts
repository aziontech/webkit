import type { LogViewLine } from '../injection-key'

/** Plain-text representation of a log line, aligned with LogViewContent rendering. */
export function formatLogLineText(line: LogViewLine): string {
  const parts: string[] = [line.time]

  if (line.type === 'success') {
    const hasCheckmark = line.message.includes('✔') || line.message.includes('✓')

    parts.push(hasCheckmark ? line.message : `✓ ${line.message}`)
  } else if (line.type === 'framework-version') {
    parts.push(line.message)
    if (line.suffix) parts.push(line.suffix)
  } else if (line.type === 'folder') {
    parts.push(line.message)
    if (line.folderType) parts.push(line.folderType)
    if (line.size) {
      parts.push(line.gzipSize ? `${line.size} | gzip: ${line.gzipSize}` : line.size)
    }
  } else {
    parts.push(line.message)
  }

  return parts.join(' ')
}
