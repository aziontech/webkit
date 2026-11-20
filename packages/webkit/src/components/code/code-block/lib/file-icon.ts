const LANGUAGE_ICON: Record<string, string> = {
  javascript: 'az az-code',
  js: 'az az-code',
  typescript: 'az az-code',
  ts: 'az az-code',
  python: 'az az-code',
  json: 'az az-file',
  shell: 'az az-code',
  bash: 'az az-code'
}

export const resolveFileIcon = (language?: string, fileIcon?: string): string => {
  if (fileIcon) {
    return fileIcon
  }

  const normalized = language?.trim().toLowerCase()

  if (normalized && LANGUAGE_ICON[normalized]) {
    return LANGUAGE_ICON[normalized]
  }

  return 'az az-file'
}
