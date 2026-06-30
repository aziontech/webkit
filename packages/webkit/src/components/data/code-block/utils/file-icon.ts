const LANGUAGE_ICON: Record<string, string> = {
  javascript: 'pi pi-code',
  js: 'pi pi-code',
  typescript: 'pi pi-code',
  ts: 'pi pi-code',
  python: 'pi pi-code',
  json: 'pi pi-file',
  shell: 'pi pi-code',
  bash: 'pi pi-code'
}

export const resolveFileIcon = (language?: string, fileIcon?: string): string => {
  if (fileIcon) {
    return fileIcon
  }

  const normalized = language?.trim().toLowerCase()

  if (normalized && LANGUAGE_ICON[normalized]) {
    return LANGUAGE_ICON[normalized]
  }

  return 'pi pi-file'
}
