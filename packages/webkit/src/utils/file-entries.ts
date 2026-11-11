const withPath = (file: globalThis.File, path: string): globalThis.File => {
  if (file.webkitRelativePath !== path) {
    Object.defineProperty(file, 'webkitRelativePath', { value: path, configurable: true })
  }
  return file
}

const readBatch = (reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> =>
  new Promise((resolve, reject) => reader.readEntries(resolve, reject))

const readFile = (entry: FileSystemFileEntry): Promise<globalThis.File> =>
  new Promise((resolve, reject) => entry.file(resolve, reject))

async function walk(entry: FileSystemEntry, out: globalThis.File[]): Promise<void> {
  if (entry.isFile) {
    const file = await readFile(entry as FileSystemFileEntry)
    out.push(withPath(file, entry.fullPath.replace(/^\/+/, '')))
    return
  }
  if (!entry.isDirectory) return
  const reader = (entry as FileSystemDirectoryEntry).createReader()
  for (let batch = await readBatch(reader); batch.length > 0; batch = await readBatch(reader)) {
    for (const child of batch) await walk(child, out)
  }
}

export function dropEntries(transfer: DataTransfer | null): FileSystemEntry[] | null {
  const items = Array.from(transfer?.items ?? []).filter((item) => item.kind === 'file')
  if (items.length === 0 || typeof items[0].webkitGetAsEntry !== 'function') return null
  const entries = items.map((item) => item.webkitGetAsEntry())
  return entries.every((entry): entry is FileSystemEntry => entry !== null) ? entries : null
}

export async function filesFromEntries(entries: FileSystemEntry[]): Promise<globalThis.File[]> {
  const out: globalThis.File[] = []
  for (const entry of entries) await walk(entry, out)
  return out
}

export const relativePathOf = (file: { name: string; webkitRelativePath?: string }): string =>
  file.webkitRelativePath || file.name
