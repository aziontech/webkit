import { markRaw, ref } from 'vue'

import type { SchemaFormMapRow } from '../injection-key'
import type { SchemaFormNode } from '../schema'

export interface UseSchemaFormCollectionsReturn {
  tokensOf: (node: SchemaFormNode) => object[]
  setRepeat: (node: SchemaFormNode, next: object[]) => void
  mapRowsOf: (node: SchemaFormNode) => SchemaFormMapRow[]
  setMap: (node: SchemaFormNode, rows: SchemaFormMapRow[]) => void
  duplicateRows: (node: SchemaFormNode) => boolean[]
}

const objectOf = (rows: SchemaFormMapRow[]) =>
  Object.fromEntries(rows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value]))

export function useSchemaFormCollections(
  valueAt: (path: string) => unknown,
  setValue: (node: SchemaFormNode, next: unknown) => void
): UseSchemaFormCollectionsReturn {
  const repeatTokens = new Map<string, object[]>()
  const listAt = (path: string): unknown[] => {
    const current = valueAt(path)
    return Array.isArray(current) ? current : []
  }

  const tokensOf = (node: SchemaFormNode) => {
    const length = listAt(node.path).length
    let tokens = repeatTokens.get(node.path) ?? []
    if (tokens.length !== length) {
      tokens = tokens.slice(0, length)
      while (tokens.length < length) tokens.push(markRaw({}))
      repeatTokens.set(node.path, tokens)
    }
    return tokens
  }

  const setRepeat = (node: SchemaFormNode, next: object[]) => {
    const previous = repeatTokens.get(node.path) ?? []
    const items = listAt(node.path)
    const list = next.map((token) => {
      const index = previous.indexOf(token)
      return index >= 0 ? (items[index] ?? {}) : {}
    })
    repeatTokens.set(node.path, next)
    setValue(node, list.length ? list : undefined)
  }

  const mapRowsStore = new Map<string, SchemaFormMapRow[]>()
  const mapVersion = ref(0)

  const mapRowsOf = (node: SchemaFormNode): SchemaFormMapRow[] => {
    void mapVersion.value
    const current = valueAt(node.path)
    const record = typeof current === 'object' && current && !Array.isArray(current) ? current : {}
    const stored = mapRowsStore.get(node.path)
    if (stored && JSON.stringify(objectOf(stored)) === JSON.stringify(record)) return stored
    const rows = Object.entries(record).map(([key, item]) => ({ key, value: String(item ?? '') }))
    mapRowsStore.set(node.path, rows)
    return rows
  }

  const setMap = (node: SchemaFormNode, rows: SchemaFormMapRow[]) => {
    mapRowsStore.set(node.path, rows)
    mapVersion.value += 1
    const record = objectOf(rows)
    setValue(node, Object.keys(record).length ? record : undefined)
  }

  const duplicateRows = (node: SchemaFormNode) => {
    const rows = mapRowsOf(node)
    const keys = rows.map((row) => row.key.trim())
    return rows.map((_, index) => Boolean(keys[index]) && keys.indexOf(keys[index] ?? '') !== index)
  }

  return { tokensOf, setRepeat, mapRowsOf, setMap, duplicateRows }
}
