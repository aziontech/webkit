<script setup lang="ts">
  import { computed, nextTick, onBeforeUpdate, provide, ref, useAttrs } from 'vue'

  import { eventDirection, logicalArrowKey } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { useTreeNavigation } from './composables/use-tree-navigation'
  import { TreeInjectionKey } from './injection-key'
  import TreeNode from './parts/tree-node.vue'

  defineOptions({ name: 'Tree', inheritAttrs: false })

  /** One node of the tree; a node with a non-empty children array, or lazy, is a parent. */
  export type TreeItem = {
    id: string
    label: string
    icon?: string
    description?: string
    disabled?: boolean
    children?: TreeItem[]
    /** The node is a parent whose children load on demand; it shows a chevron while children is empty. */
    lazy?: boolean
    /** While expanded, renders a loading row in place of the children. */
    loading?: boolean
  }

  /** Selection model: single writes v-model:selected, multiple writes v-model:selected-keys. */
  export type TreeSelectable = 'single' | 'multiple'

  /** Payload of the rename event: the node and its new, trimmed label. */
  export type TreeRenamePayload = { item: TreeItem; label: string }

  export interface TreeProps {
    /** Nodes to render; a node with a non-empty children array is a parent. */
    items?: TreeItem[]
    /** Enables selection: true or single writes one id to v-model:selected; multiple writes ids to v-model:selected-keys. */
    selectable?: boolean | TreeSelectable
    /** Lets the user rename a node in place with F2, or through the exposed startRename. */
    editable?: boolean
    /** Renders Skeleton rows in place of the tree and sets aria-busy. */
    loading?: boolean
    /** Title of the default empty state shown when items is empty. Empty uses the locale catalog (`No items`). */
    emptyTitle?: string
    /** Supporting line under the empty title. */
    emptyDescription?: string
    /** Accessible name of the tree. Empty uses the locale catalog (`Tree`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<TreeProps>(), {
    items: () => [],
    selectable: false,
    editable: false,
    loading: false,
    emptyTitle: '',
    emptyDescription: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** A node activated by a row click, or Enter or Space on the focused node. */
    'item-click': [event: MouseEvent | KeyboardEvent, item: TreeItem]
    /** A node was double-clicked, to open or preview it. */
    'item-double-click': [event: MouseEvent, item: TreeItem]
    /** An in-place rename was submitted with a new, non-empty label. */
    rename: [event: KeyboardEvent | FocusEvent, payload: TreeRenamePayload]
  }>()

  /** Ids of the open parents. */
  const openKeys = defineModel<string[]>('openKeys', { default: () => [] })

  /** Id of the selected node; empty when nothing is selected. */
  const selected = defineModel<string>('selected', { default: '' })

  /** Ids of the selected nodes while selectable is multiple. */
  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

  const slots = defineSlots<{
    /** Replaces the label region of every row; receives the node, its level and whether it is expanded. */
    item(props: { item: TreeItem; level: number; expanded: boolean }): unknown
    /** Trailing per-row controls, end-aligned in the row. */
    actions(props: { item: TreeItem; level: number }): unknown
    /** Replaces the default empty state. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tree: en.tree })

  const ItemOutlet = (outlet: {
    scope: { item: TreeItem; level: number; expanded: boolean }
  }): unknown => slots.item?.(outlet.scope)
  const ActionsOutlet = (outlet: { scope: { item: TreeItem; level: number } }): unknown =>
    slots.actions?.(outlet.scope)

  const mode = computed(() => {
    if (props.selectable === 'multiple') return 'multiple'
    return props.selectable ? 'single' : 'none'
  })

  const selectedSet = computed(() => new Set(mode.value === 'multiple' ? selectedKeys.value : []))

  const activeSelection = computed(() => {
    if (mode.value === 'single') return selected.value
    if (mode.value === 'multiple') return selectedKeys.value[0] ?? ''
    return ''
  })

  const navigation = useTreeNavigation<TreeItem>({
    items: () => props.items,
    expanded: () => openKeys.value,
    selected: activeSelection
  })

  const treeEl = ref<globalThis.HTMLElement | null>(null)

  const SKELETON_WIDTHS = ['100%', '80%', '64%', '48%', '32%']

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tree')

  const isEmpty = computed(() => !props.loading && props.items.length === 0)

  const selectionOn = computed(() => mode.value !== 'none')

  const multiple = computed(() => mode.value === 'multiple')

  const editable = computed(() => props.editable)

  const grid = ref<boolean>(Boolean(slots.actions))
  onBeforeUpdate(() => {
    grid.value = Boolean(slots.actions)
  })

  const renamingId = ref('')

  const anchorId = ref('')

  const expandedSet = computed(() => new Set(openKeys.value))

  function isExpanded(id: string) {
    return navigation.isParent(id) && expandedSet.value.has(id)
  }

  function isSelected(id: string) {
    if (mode.value === 'multiple') return selectedSet.value.has(id)
    return mode.value === 'single' && selected.value !== '' && selected.value === id
  }

  function isEnabled(id: string) {
    const entry = navigation.entry(id)
    return Boolean(entry && !entry.item.disabled)
  }

  function writeSelection(ids: string[]) {
    const next = [...new Set(ids)]
    const same =
      next.length === selectedKeys.value.length && next.every((id) => selectedSet.value.has(id))
    if (!same) selectedKeys.value = next
  }

  function rangeTo(id: string) {
    const visible = navigation.visible.value
    const from = visible.indexOf(anchorId.value || id)
    const to = visible.indexOf(id)
    if (from === -1 || to === -1) return [id]
    const [start, end] = from < to ? [from, to] : [to, from]
    return visible.slice(start, end + 1).filter(isEnabled)
  }

  function toggleSelected(id: string) {
    anchorId.value = id
    writeSelection(
      selectedSet.value.has(id)
        ? selectedKeys.value.filter((key) => key !== id)
        : [...selectedKeys.value, id]
    )
  }

  function selectMultiple(event: MouseEvent | KeyboardEvent, id: string) {
    if (event.shiftKey) {
      writeSelection([
        ...(event.ctrlKey || event.metaKey ? selectedKeys.value : []),
        ...rangeTo(id)
      ])
      return
    }
    if (event instanceof MouseEvent && (event.ctrlKey || event.metaKey)) {
      toggleSelected(id)
      return
    }
    anchorId.value = id
    writeSelection([id])
  }

  function setExpanded(id: string, open: boolean) {
    if (!navigation.isParent(id) || isExpanded(id) === open) return
    openKeys.value = open ? [...openKeys.value, id] : openKeys.value.filter((key) => key !== id)
  }

  function toggle(id: string) {
    setExpanded(id, !isExpanded(id))
  }

  function focusItem(id: string) {
    if (!id || !treeEl.value) return
    const target = rowElement(id)
    if (!target) return
    navigation.setFocused(id)
    target.focus()
  }

  function activate(event: MouseEvent | KeyboardEvent, id: string) {
    const entry = navigation.entry(id)
    if (!entry || entry.item.disabled) return
    if (mode.value === 'single' && selected.value !== id) selected.value = id
    if (mode.value === 'multiple') selectMultiple(event, id)
    emit('item-click', event, entry.item)
  }

  function startRename(id: string) {
    const entry = navigation.entry(id)
    if (!props.editable || !entry || entry.item.disabled) return
    renamingId.value = id
  }

  function endRename(id: string, refocus: boolean) {
    if (renamingId.value !== id) return
    renamingId.value = ''
    if (refocus) nextTick(() => focusItem(id))
  }

  function commitRename(event: KeyboardEvent | FocusEvent, id: string, value: string) {
    const entry = navigation.entry(id)
    const label = value.trim()
    endRename(id, event.type === 'keydown')
    if (!entry || !label || label === entry.item.label) return
    emit('rename', event, { item: entry.item, label })
  }

  function cancelRename(id: string) {
    endRename(id, true)
  }

  function extendTo(id: string) {
    if (!id) return
    focusItem(id)
    if (!isEnabled(id)) return
    writeSelection([...selectedKeys.value, id])
  }

  function selectAll() {
    anchorId.value = navigation.visible.value[0] ?? ''
    writeSelection(navigation.visible.value.filter(isEnabled))
  }

  function rowElement(id: string) {
    const nodes = treeEl.value?.querySelectorAll<globalThis.HTMLElement>('[data-tree-focus]') ?? []
    return Array.from(nodes).find((node) => node.dataset['itemId'] === id) ?? null
  }

  function treeitemOf(target: EventTarget | null) {
    if (!(target instanceof globalThis.HTMLElement)) return ''
    if (!target.hasAttribute('data-tree-focus')) return ''
    return target.dataset['itemId'] ?? ''
  }

  function rowOf(target: EventTarget | null) {
    if (!(target instanceof globalThis.Element)) return null
    return target.closest<globalThis.HTMLElement>('[data-tree-focus]')
  }

  const CELL_CONTROLS =
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]'

  function cellsOf(row: globalThis.HTMLElement | null): globalThis.HTMLElement[] {
    if (!row) return []
    const label = row.querySelector<globalThis.HTMLElement>('[data-slot="tree-cell"]')
    const actions = row.querySelector<globalThis.HTMLElement>('[data-slot="tree-actions"]')
    const controls = actions
      ? Array.from(actions.querySelectorAll<globalThis.HTMLElement>(CELL_CONTROLS))
      : []
    return [...(label ? [label] : []), ...new Set(controls)]
  }

  function onFocusin(event: FocusEvent) {
    const id =
      treeitemOf(event.target) || (grid.value ? (rowOf(event.target)?.dataset['itemId'] ?? '') : '')
    if (id) navigation.setFocused(id)
  }

  function onCellKeydown(event: KeyboardEvent) {
    const row = rowOf(event.target)
    const id = row?.dataset['itemId'] ?? ''
    if (!row || !id) return
    const cells = cellsOf(row)
    const at = cells.findIndex(
      (cell) => cell === event.target || cell.contains(event.target as Node)
    )
    if (at === -1) return
    const moveRow = (offset: 1 | -1) => {
      const next = navigation.sibling(id, offset)
      const target = cellsOf(rowElement(next))
      if (!next || target.length === 0) return
      navigation.setFocused(next)
      target[Math.min(at, target.length - 1)]?.focus()
    }
    switch (logicalArrowKey(event.key, eventDirection(event))) {
      case 'ArrowRight':
        cells[at + 1]?.focus()
        break
      case 'ArrowLeft':
        if (at > 0) cells[at - 1]?.focus()
        else focusItem(id)
        break
      case 'ArrowDown':
        moveRow(1)
        break
      case 'ArrowUp':
        moveRow(-1)
        break
      case 'Escape':
        focusItem(id)
        break
      case 'Enter':
        if (at !== 0) return
        activate(event, id)
        break
      default:
        return
    }
    event.preventDefault()
  }

  function onClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof globalThis.Element)) return
    if (
      target.closest(
        '[data-slot="tree-toggle"], [data-slot="tree-actions"], [data-slot="tree-rename"]'
      )
    )
      return
    const row = target.closest('[data-slot="tree-row"]')
    const id = row?.closest<globalThis.HTMLElement>('[data-item-id]')?.dataset['itemId'] ?? ''
    if (!id) return
    focusItem(id)
    activate(event, id)
  }

  function onDblclick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof globalThis.Element)) return
    if (
      target.closest(
        '[data-slot="tree-toggle"], [data-slot="tree-actions"], [data-slot="tree-rename"]'
      )
    )
      return
    const row = target.closest('[data-slot="tree-row"]')
    const entry = navigation.entry(
      row?.closest<globalThis.HTMLElement>('[data-item-id]')?.dataset['itemId'] ?? ''
    )
    if (!entry || entry.item.disabled) return
    emit('item-double-click', event, entry.item)
  }

  function onKeydown(event: KeyboardEvent) {
    const id = treeitemOf(event.target)
    if (!id) {
      if (grid.value) onCellKeydown(event)
      return
    }
    const parent = navigation.isParent(id)
    const extend = multiple.value && event.shiftKey
    if (multiple.value && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      selectAll()
      event.preventDefault()
      return
    }
    switch (logicalArrowKey(event.key, eventDirection(event))) {
      case 'ArrowDown':
        if (extend) extendTo(navigation.sibling(id, 1))
        else focusItem(navigation.sibling(id, 1))
        break
      case 'ArrowUp':
        if (extend) extendTo(navigation.sibling(id, -1))
        else focusItem(navigation.sibling(id, -1))
        break
      case 'ArrowRight':
        if (parent && !isExpanded(id)) setExpanded(id, true)
        else if (grid.value) cellsOf(rowElement(id))[0]?.focus()
        else if (parent) focusItem(navigation.firstChildOf(id))
        break
      case 'ArrowLeft':
        if (parent && isExpanded(id)) setExpanded(id, false)
        else focusItem(navigation.parentOf(id))
        break
      case 'Home':
        focusItem(navigation.first())
        break
      case 'End':
        focusItem(navigation.last())
        break
      case 'F2':
        if (!props.editable) return
        startRename(id)
        break
      case ' ':
        if (multiple.value) {
          if (isEnabled(id)) toggleSelected(id)
          break
        }
        activate(event, id)
        break
      case 'Enter':
        activate(event, id)
        break
      default:
        if (!typeahead(event, id)) return
    }
    event.preventDefault()
  }

  let typed = ''
  let typedAt = 0

  function typeahead(event: KeyboardEvent, fromId: string): boolean {
    if (
      event.key.length !== 1 ||
      event.key === ' ' ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return false
    typed = event.timeStamp - typedAt > 500 ? event.key : `${typed}${event.key}`
    typedAt = event.timeStamp
    const query = typed.toLocaleLowerCase()
    const ids = navigation.visible.value
    const position = ids.indexOf(fromId)
    const start = typed.length === 1 ? position + 1 : Math.max(position, 0)
    const ordered = [...ids.slice(start), ...ids.slice(0, start)]
    const match = ordered.find((candidate) =>
      (navigation.entry(candidate)?.item.label ?? '').toLocaleLowerCase().startsWith(query)
    )
    if (!match) return false
    focusItem(match)
    return true
  }

  provide(TreeInjectionKey, {
    testId,
    grid,
    selectable: selectionOn,
    editable,
    renamingId,
    loadingLabel: computed(() => t('tree.loadingChildren')),
    renameLabel: (label: string) => t('tree.renameLabel', { label }),
    commitRename,
    cancelRename,
    tabStop: navigation.tabStop,
    isExpanded,
    isSelected,
    toggle,
    focusItem
  })

  defineExpose({
    /** Opens the in-place rename field on the node with this id, when editable. */
    startRename
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-empty="isEmpty || null"
    :data-selectable="selectionOn || null"
    :data-multiple="multiple || null"
    :aria-busy="loading || undefined"
    class="flex w-full min-w-0 flex-col"
  >
    <div
      v-if="loading"
      aria-hidden="true"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <Skeleton
        v-for="width in SKELETON_WIDTHS"
        :key="width"
        variant="rectangle"
        :width="width"
        height="2rem"
      />
    </div>
    <template v-else-if="isEmpty">
      <slot name="empty">
        <EmptyState
          :title="emptyTitle || t('tree.emptyTitle')"
          :description="emptyDescription"
        />
      </slot>
    </template>
    <component
      :is="grid ? 'div' : 'ul'"
      v-else
      ref="treeEl"
      :role="grid ? 'treegrid' : 'tree'"
      :aria-label="ariaLabel || t('tree.label')"
      :aria-multiselectable="multiple || undefined"
      class="m-0 flex list-none flex-col p-0"
      @click="onClick"
      @dblclick="onDblclick"
      @keydown="onKeydown"
      @focusin="onFocusin"
    >
      <TreeNode
        v-for="(root, position) in items"
        :key="root.id"
        :item="root"
        :level="1"
        :posinset="position + 1"
        :setsize="items.length"
        :actionable="!!$slots['actions']"
      >
        <template #item="scope">
          <ItemOutlet
            v-if="$slots['item']"
            :scope="scope"
          />
          <template v-else>
            <span
              v-if="scope.item.icon"
              aria-hidden="true"
              class="flex size-4 shrink-0 items-center justify-center text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled)"
            >
              <i
                :class="scope.item.icon"
                class="leading-none"
              />
            </span>
            <span class="flex min-w-0 flex-1 items-baseline gap-(--spacing-2xs)">
              <span
                class="min-w-0 truncate text-label-md text-(--text-default) group-data-[disabled]/tree-row:text-(--text-disabled)"
              >
                {{ scope.item.label }}
              </span>
              <span
                v-if="scope.item.description"
                class="min-w-0 truncate text-label-sm text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled)"
              >
                {{ scope.item.description }}
              </span>
            </span>
          </template>
        </template>
        <template #actions="scope">
          <ActionsOutlet :scope="scope" />
        </template>
      </TreeNode>
    </component>
  </div>
</template>
