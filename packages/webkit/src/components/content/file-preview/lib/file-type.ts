/** How `FilePreview` draws a file. */
export type FilePreviewType = 'image' | 'text' | 'json' | 'unknown'

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'bmp', 'ico'])

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
  if (media === 'application/json' || media.endsWith('+json')) return 'json'
  if (media.startsWith('text/') || TEXT_MEDIA_TYPES.test(media)) return 'text'
  if (media && media !== 'application/octet-stream') return 'unknown'
  const extension = extensionOf(fileName)
  if (IMAGE_EXTENSIONS.has(extension)) return 'image'
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
