import { readonly, type Ref, ref } from 'vue'

import { useElementListener } from '../../../../composables/use-element-listener'

/** What a drag moves: a row, or a whole group in grouped mode. */
export type AttributeEditorDragScope = 'row' | 'group'

type Drag = { scope: AttributeEditorDragScope; index: number; groupIndex: number | undefined }
type Drop = { index: number; groupIndex: number | undefined; edge: 'before' | 'after' }
type Row = { el: HTMLElement; index: number; groupIndex: number | undefined; key: string }

export interface UseAttributeEditorDragReturn {
  armed: Readonly<Ref<string>>
  arm: (key: string) => void
  disarm: () => void
  onDragstart: (
    event: DragEvent,
    scope: AttributeEditorDragScope,
    key: string,
    index: number,
    groupIndex: number | undefined,
    owner?: EventTarget | null
  ) => void
  onDragover: (
    event: DragEvent,
    scope: AttributeEditorDragScope,
    index: number,
    groupIndex: number | undefined,
    owner?: HTMLElement
  ) => void
  onDrop: (
    event: DragEvent,
    scope: AttributeEditorDragScope,
    groupIndex: number | undefined
  ) => void
  onDragend: () => void
  dragging: (
    scope: AttributeEditorDragScope,
    index: number,
    groupIndex: number | undefined
  ) => '' | undefined
  dropEdge: (
    scope: AttributeEditorDragScope,
    index: number,
    groupIndex: number | undefined
  ) => 'before' | 'after' | undefined
}

type DragState = { drag: Ref<Drag | null>; drop: Ref<Drop | null>; armed: Ref<string> }

const sameList = (
  state: DragState,
  scope: AttributeEditorDragScope,
  groupIndex: number | undefined
) =>
  state.drag.value !== null &&
  state.drag.value.scope === scope &&
  (scope === 'group' || state.drag.value.groupIndex === groupIndex)

const overRow = (
  state: DragState,
  event: DragEvent,
  scope: AttributeEditorDragScope,
  index: number,
  groupIndex: number | undefined,
  owner: HTMLElement
) => {
  if (!sameList(state, scope, groupIndex)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  const rect = owner.getBoundingClientRect()
  const edge = event.clientY > rect.top + rect.height / 2 ? 'after' : 'before'
  state.drop.value = { index, groupIndex: scope === 'group' ? undefined : groupIndex, edge }
}

const startDrag = (
  state: DragState,
  disabled: boolean,
  event: DragEvent,
  drag: Drag & { key: string; owner: EventTarget | null }
) => {
  if (event.target !== drag.owner || state.armed.value !== drag.key || disabled) return
  state.drag.value = { scope: drag.scope, index: drag.index, groupIndex: drag.groupIndex }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(drag.index))
  }
}

const dropTarget = (state: DragState): { from: number; to: number } | null => {
  if (!state.drag.value || !state.drop.value) return null
  const from = state.drag.value.index
  let to = state.drop.value.index + (state.drop.value.edge === 'after' ? 1 : 0)
  if (from < to) to -= 1
  return { from, to }
}

const edgeOf = (
  state: DragState,
  scope: AttributeEditorDragScope,
  index: number,
  groupIndex: number | undefined
) =>
  sameList(state, scope, groupIndex) &&
  state.drop.value?.index === index &&
  (scope === 'group' || state.drop.value.groupIndex === groupIndex) &&
  state.drag.value?.index !== index
    ? state.drop.value.edge
    : undefined

function useRowListeners(
  rootEl: Ref<HTMLElement | null>,
  rowOf: (event: Event) => Row | null,
  onRowKeydown: (event: KeyboardEvent, index: number, groupIndex: number | undefined) => void,
  drag: Pick<UseAttributeEditorDragReturn, 'onDragstart' | 'onDragover' | 'onDrop'>
) {
  const on =
    <E extends Event>(handler: (event: E, row: Row) => void) =>
    (event: E) => {
      const row = rowOf(event)
      if (row) handler(event, row)
    }
  useElementListener(
    rootEl,
    'keydown',
    on((event: KeyboardEvent, row) => onRowKeydown(event, row.index, row.groupIndex))
  )
  useElementListener(
    rootEl,
    'dragstart',
    on((event: DragEvent, row) =>
      drag.onDragstart(event, 'row', row.key, row.index, row.groupIndex, row.el)
    )
  )
  useElementListener(
    rootEl,
    'dragover',
    on((event: DragEvent, row) => drag.onDragover(event, 'row', row.index, row.groupIndex, row.el))
  )
  useElementListener(
    rootEl,
    'drop',
    on((event: DragEvent, row) => drag.onDrop(event, 'row', row.groupIndex))
  )
}

export function useAttributeEditorDrag(
  props: { disabled: boolean },
  rootEl: Ref<HTMLElement | null>,
  rowOf: (event: Event) => Row | null,
  onRowKeydown: (event: KeyboardEvent, index: number, groupIndex: number | undefined) => void,
  move: (
    scope: AttributeEditorDragScope,
    from: number,
    to: number,
    groupIndex: number | undefined
  ) => void
): UseAttributeEditorDragReturn {
  const state: DragState = { drag: ref(null), drop: ref(null), armed: ref('') }
  const disarm = () => {
    state.armed.value = ''
  }

  const onDragstart: UseAttributeEditorDragReturn['onDragstart'] = (
    event,
    scope,
    key,
    index,
    groupIndex,
    owner = event.currentTarget
  ) => startDrag(state, props.disabled, event, { scope, index, groupIndex, key, owner })

  const onDragover: UseAttributeEditorDragReturn['onDragover'] = (
    event,
    scope,
    index,
    groupIndex,
    owner = event.currentTarget as HTMLElement
  ) => overRow(state, event, scope, index, groupIndex, owner)

  const onDragend = () => {
    state.drag.value = null
    state.drop.value = null
    disarm()
  }

  const onDrop: UseAttributeEditorDragReturn['onDrop'] = (event, scope, groupIndex) => {
    const target = sameList(state, scope, groupIndex) ? dropTarget(state) : null
    if (!target) return
    event.preventDefault()
    onDragend()
    move(scope, target.from, target.to, groupIndex)
  }

  useRowListeners(rootEl, rowOf, onRowKeydown, { onDragstart, onDragover, onDrop })

  return {
    armed: readonly(state.armed),
    arm: (key) => {
      state.armed.value = key
    },
    disarm,
    onDragstart,
    onDragover,
    onDrop,
    onDragend,
    dragging: (scope, index, groupIndex) =>
      sameList(state, scope, groupIndex) && state.drag.value?.index === index ? '' : undefined,
    dropEdge: (scope, index, groupIndex) => edgeOf(state, scope, index, groupIndex)
  }
}
