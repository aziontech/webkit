/** How `FilePreview` draws a file. */
export type FilePreviewType = 'image' | 'pdf' | 'audio' | 'video' | 'text' | 'json' | 'unknown'

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'bmp', 'ico'])

const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus', 'weba'])

const VIDEO_EXTENSIONS = new Set(['mp4', 'm4v', 'webm', 'ogv', 'mov', 'mkv', 'avi'])

const TEXT_EXTENSIONS = new Set([
  'txt',
  'md',
  'csv',
  'tsv',
  'log',
  'xml',
  'yaml',
  'yml',
  'toml',
  'ini',
  'conf',
  'env',
  'html',
  'htm',
  'css',
  'js',
  'mjs',
  'cjs',
  'ts',
  'vue',
  'sh',
  'sql',
  'graphql'
])

const TEXT_MEDIA_TYPES =
  /^application\/(xml|javascript|ecmascript|x-yaml|yaml|toml|x-sh|sql|graphql)$|\+xml$/

export function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}

export function filePreviewType(mimeType: string, fileName: string): FilePreviewType {
  const media = mimeType.toLowerCase().split(';')[0]?.trim() ?? ''
  if (media.startsWith('image/')) return 'image'
  if (media === 'application/pdf') return 'pdf'
  if (media.startsWith('audio/')) return 'audio'
  if (media.startsWith('video/')) return 'video'
  if (media === 'application/json' || media.endsWith('+json')) return 'json'
  if (media.startsWith('text/') || TEXT_MEDIA_TYPES.test(media)) return 'text'
  if (media && media !== 'application/octet-stream') return 'unknown'
  const extension = extensionOf(fileName)
  if (IMAGE_EXTENSIONS.has(extension)) return 'image'
  if (extension === 'pdf') return 'pdf'
  if (AUDIO_EXTENSIONS.has(extension)) return 'audio'
  if (VIDEO_EXTENSIONS.has(extension)) return 'video'
  if (extension === 'json') return 'json'
  if (TEXT_EXTENSIONS.has(extension)) return 'text'
  return 'unknown'
}

export function formatJson(content: string): string {
  try {
    return JSON.stringify(JSON.parse(content), null, 2)
  } catch {
    return content
  }
}

export function decodeBase64(base64: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binary = atob(base64.replace(/^data:[^,]*;base64,/i, '').replace(/\s+/g, ''))
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
    return bytes
  } catch {
    return null
  }
}

export function decodeBase64Text(base64: string): string {
  const bytes = decodeBase64(base64)
  return bytes ? new TextDecoder().decode(bytes) : ''
}
