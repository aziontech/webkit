import type { FileBrowserEntry } from './file-browser.vue'

/** One object of a bucket listing; the key is its full path. */
export interface AzionStorageObject {
  /** Full path of the object; a folder key ends in a slash. */
  key: string
  /** When the object changed last, as an ISO time. */
  last_modified: string
  /** Size in bytes. */
  size: number
  /** Whether the key is a folder marker. */
  is_folder?: boolean
}

/** The body of GET /v4/storage/buckets/{bucket}/objects. */
export interface AzionStorageObjectsResponse {
  /** Pass it back as continuation_token for the next page; null on the last page. */
  continuation_token: string | null
  /** The objects of this page. */
  results: AzionStorageObject[]
}

export const toFileBrowserEntries = (
  listing: AzionStorageObjectsResponse | AzionStorageObject[],
  prefix = ''
): FileBrowserEntry[] => {
  const objects = Array.isArray(listing) ? listing : listing.results
  const folders = new Set<string>()
  const files: FileBrowserEntry[] = []
  for (const object of objects) {
    if (!object.key.startsWith(prefix)) continue
    const rest = object.key.slice(prefix.length)
    if (!rest) continue
    const slash = rest.indexOf('/')
    if (slash >= 0) folders.add(rest.slice(0, slash + 1))
    else if (object.is_folder) folders.add(`${rest}/`)
    else
      files.push({
        name: rest,
        kind: 'file',
        bytes: object.size,
        modifiedAt: object.last_modified
      })
  }
  return [...[...folders].map((name): FileBrowserEntry => ({ name, kind: 'folder' })), ...files]
}
