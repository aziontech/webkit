const CELL_CONTROLS =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]'

const ROW_CONTROLS =
  '[data-slot="tree-toggle"], [data-slot="tree-actions"], [data-slot="tree-rename"]'

export function rowElement(
  tree: globalThis.HTMLElement | null,
  id: string
): globalThis.HTMLElement | null {
  const nodes = tree?.querySelectorAll<globalThis.HTMLElement>('[data-tree-focus]') ?? []
  return Array.from(nodes).find((node) => node.dataset['itemId'] === id) ?? null
}

export function treeitemOf(target: EventTarget | null): string {
  if (!(target instanceof globalThis.HTMLElement)) return ''
  if (!target.hasAttribute('data-tree-focus')) return ''
  return target.dataset['itemId'] ?? ''
}

export function rowOf(target: EventTarget | null): globalThis.HTMLElement | null {
  if (!(target instanceof globalThis.Element)) return null
  return target.closest<globalThis.HTMLElement>('[data-tree-focus]')
}

export function cellsOf(row: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
  if (!row) return []
  const label = row.querySelector<globalThis.HTMLElement>('[data-slot="tree-cell"]')
  const actions = row.querySelector<globalThis.HTMLElement>('[data-slot="tree-actions"]')
  const controls = actions
    ? Array.from(actions.querySelectorAll<globalThis.HTMLElement>(CELL_CONTROLS))
    : []
  return [...(label ? [label] : []), ...new Set(controls)]
}

export function clickedRowId(target: EventTarget | null): string {
  if (!(target instanceof globalThis.Element) || target.closest(ROW_CONTROLS)) return ''
  const row = target.closest('[data-slot="tree-row"]')
  return row?.closest<globalThis.HTMLElement>('[data-item-id]')?.dataset['itemId'] ?? ''
}

export function keepsTextSelection(event: MouseEvent): boolean {
  if (!event.shiftKey && !event.ctrlKey && !event.metaKey) return true
  const target = event.target
  if (!(target instanceof globalThis.Element)) return true
  if (target.closest('[data-slot="tree-actions"], [data-slot="tree-rename"]')) return true
  return !target.closest('[data-slot="tree-row"]')
}
