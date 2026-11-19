export interface ImageGalleryItem {
  /** Stable identity of the image; the position is used when it is missing. */
  key?: string
  /** URL of the image (an https, blob or data URL). */
  src?: string
  /** Base64 image data, used when `src` is empty; a value that already starts with `data:` is used as is. */
  data?: string
  /** Media type of `data` (`image/png`, `image/jpeg`); empty means `image/png`. */
  mimeType?: string
  /** Alternative text; empty uses the position of the image. */
  alt?: string
  /** Name the download is saved under; empty uses the position and the extension of the media type. */
  fileName?: string
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico'
}

export function imageSource(item: ImageGalleryItem): string {
  if (item.src) return item.src
  if (!item.data) return ''
  if (item.data.startsWith('data:')) return item.data
  return `data:${item.mimeType || 'image/png'};base64,${item.data}`
}

export function imageMimeType(item: ImageGalleryItem): string {
  if (item.mimeType) return item.mimeType
  const match = /^data:([^;,]+)/.exec(imageSource(item))
  return match?.[1] ?? 'image/png'
}

export function imageFileName(item: ImageGalleryItem, position: number): string {
  if (item.fileName) return item.fileName
  const named =
    item.src && !item.src.startsWith('data:')
      ? /([^/?#]+\.[a-z0-9]+)(?:[?#]|$)/i.exec(item.src)
      : null
  if (named?.[1]) return decodeURIComponent(named[1])
  const type = imageMimeType(item)
  const extension = EXTENSIONS[type] ?? (type.split('/')[1] || 'png')
  return `image-${position}.${extension}`
}
