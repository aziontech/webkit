import type { ComboboxOption } from '../types'

/** One row of the list: an option, or the typed value offered as a new one. */
export type ComboboxRow =
  | { kind: 'option'; id: string; option: ComboboxOption }
  | { kind: 'custom'; id: string; value: string }

/** A titled group of rows; the untitled group comes first. */
export type ComboboxSection = { id: string; title: string; rows: ComboboxRow[] }

export const optionLabel = (option: ComboboxOption): string => option.label || option.value

export const isDisabledRow = (row: ComboboxRow): boolean =>
  row.kind === 'option' && Boolean(row.option.disabled)

export const buildSections = (
  matches: ComboboxOption[],
  uid: string,
  custom: string
): ComboboxSection[] => {
  const order: string[] = []
  const byGroup = new Map<string, ComboboxRow[]>()
  matches.forEach((option, index) => {
    const key = option.group ?? ''
    if (!byGroup.has(key)) {
      byGroup.set(key, [])
      order.push(key)
    }
    byGroup.get(key)?.push({ kind: 'option', id: `${uid}-option-${index}`, option })
  })
  const ordered = [...order.filter((key) => !key), ...order.filter((key) => key)]
  const out: ComboboxSection[] = ordered.map((key, index) => ({
    id: `${uid}-group-${index}`,
    title: key,
    rows: byGroup.get(key) ?? []
  }))
  if (custom) {
    out.push({
      id: `${uid}-custom`,
      title: '',
      rows: [{ kind: 'custom', id: `${uid}-option-custom`, value: custom }]
    })
  }
  return out
}

export const nextEnabled = (rows: ComboboxRow[], start: number, step: 1 | -1): number => {
  const total = rows.length
  let index = start
  for (let i = 0; i < total; i += 1) {
    index = (index + total) % total
    const row = rows[index]
    if (row && !isDisabledRow(row)) return index
    index += step
  }
  return -1
}
