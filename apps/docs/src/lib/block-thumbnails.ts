export const BLOCK_THUMBNAIL = { width: 384, height: 240, quality: 0.72 } as const

export type BlockThumbnailTheme = 'light' | 'dark'

export function blockThumbnailFile(id: string, theme: BlockThumbnailTheme): string {
  return `thumbnails/blocks/${id}--${theme}.webp`
}
