const LANGUAGE_ICON: Record<string, string> = {
  javascript: 'ai ai-code',
  js: 'ai ai-code',
  typescript: 'ai ai-code',
  ts: 'ai ai-code',
  python: 'ai ai-code',
  json: 'ai ai-file',
  shell: 'ai ai-code',
  bash: 'ai ai-code'
}

export const resolveFileIcon = (language?: string, fileIcon?: string): string => {
  if (fileIcon) {
    return fileIcon
  }

  const normalized = language?.trim().toLowerCase()

  if (normalized && LANGUAGE_ICON[normalized]) {
    return LANGUAGE_ICON[normalized]
  }

  return 'ai ai-file'
}
