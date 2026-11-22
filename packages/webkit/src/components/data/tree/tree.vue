<script setup lang="ts">
  import { computed, nextTick, onBeforeUpdate, provide, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { useTreeEvents } from './composables/use-tree-events'
  import { useTreeNavigation } from './composables/use-tree-navigation'
  import { useTreeRename } from './composables/use-tree-rename'
  import { useTreeRows } from './composables/use-tree-rows'
  import { type TreeSelectionMode, useTreeSelection } from './composables/use-tree-selection'
  import { TreeInjectionKey } from './injection-key'
  import { rowElement } from './lib/tree-dom'
  import { ROW_HEIGHTS, SKELETON_WIDTHS } from './lib/tree-rows'
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

  /** Row density: small is 24px rows, medium 32px, large 40px. */
  export type TreeSize = 'small' | 'medium' | 'large'

  /** Selection model: single writes v-model:selected-key, multiple writes v-model:selected-keys. */
  export type TreeSelectable = 'single' | 'multiple'

  /** Payload of the rename event: the node and its new, trimmed label. */
  export type TreeRenamePayload = { item: TreeItem; label: string }

  export interface TreeProps {
    /** Nodes to render; a node with a non-empty children array is a parent. */
    items?: TreeItem[]
    /** Enables selection: true or single writes one id to v-model:selected-key; multiple writes ids to v-model:selected-keys. */
    selectable?: boolean | TreeSelectable
    /** Lets the user rename a node in place with F2, or through the exposed startRename. */
    editable?: boolean
    /** Renders Skeleton rows in place of the tree and sets aria-busy. */
    loading?: boolean
    /** Row density: small is 24px rows, medium 32px, large 40px. */
    size?: TreeSize
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
    size: 'medium',
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
  const selectedKey = defineModel<string>('selectedKey', { default: '' })

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

  const mode = computed<TreeSelectionMode>(() => {
    if (props.selectable === 'multiple') return 'multiple'
    return props.selectable ? 'single' : 'none'
  })

  const activeSelection = computed(() => {
    if (mode.value === 'none') return ''
    return mode.value === 'single' ? selectedKey.value : (selectedKeys.value[0] ?? '')
  })

  const navigation = useTreeNavigation<TreeItem>({
    items: () => props.items,
    expanded: () => openKeys.value,
    selected: activeSelection
  })
  const selection = useTreeSelection(mode, selectedKey, selectedKeys, navigation)

  const treeEl = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tree')
  const isEmpty = computed(() => !props.loading && props.items.length === 0)
  const selectionOn = computed(() => mode.value !== 'none')
  const multiple = computed(() => mode.value === 'multiple')
  const editable = computed(() => props.editable)

  const grid = ref<boolean>(Boolean(slots.actions))
  onBeforeUpdate(() => {
    grid.value = Boolean(slots.actions)
  })

  const expandedSet = computed(() => new Set(openKeys.value))
  const rowHeight = computed(() => ROW_HEIGHTS[props.size] ?? ROW_HEIGHTS.medium)

  function isExpanded(id: string) {
    return navigation.isParent(id) && expandedSet.value.has(id)
  }

  const { flat, entries, revealRow, observe } = useTreeRows(
    () => props.items,
    expandedSet,
    rowHeight,
    navigation
  )

  function setExpanded(id: string, open: boolean) {
    if (!navigation.isParent(id) || isExpanded(id) === open) return
    openKeys.value = open ? [...openKeys.value, id] : openKeys.value.filter((key) => key !== id)
  }

  function withRow(id: string, run: (row: globalThis.HTMLElement) => void) {
    const target = rowElement(treeEl.value, id)
    if (target) run(target)
    else if (revealRow(id))
      nextTick(() => {
        const mounted = rowElement(treeEl.value, id)
        if (mounted) run(mounted)
      })
  }

  function focusItem(id: string) {
    if (!id || !treeEl.value) return
    withRow(id, (target) => {
      navigation.setFocused(id)
      target.focus()
    })
  }

  function activate(event: MouseEvent | KeyboardEvent, id: string) {
    const entry = navigation.entry(id)
    if (!entry || entry.item.disabled) return
    if (mode.value === 'single' && selectedKey.value !== id) selectedKey.value = id
    if (mode.value === 'multiple') selection.selectMultiple(event, id)
    emit('item-click', event, entry.item)
  }

  const rename = useTreeRename(
    () => props.editable,
    navigation,
    focusItem,
    (event, payload) => emit('rename', event, payload)
  )

  const { onKeydown, onFocusin, onClick, onMousedown, onDblclick } = useTreeEvents({
    navigation,
    selection,
    tree: () => treeEl.value,
    grid: () => grid.value,
    multiple: () => multiple.value,
    editable: () => props.editable,
    isExpanded,
    setExpanded,
    focusItem,
    withRow,
    activate,
    startRename: rename.start,
    doubleClick: (event, item) => emit('item-double-click', event, item)
  })

  provide(TreeInjectionKey, {
    testId,
    grid,
    selectable: selectionOn,
    editable,
    renamingId: rename.renamingId,
    loadingLabel: computed(() => t('tree.loadingChildren')),
    renameLabel: (label: string) => t('tree.renameLabel', { label }),
    commitRename: rename.commit,
    cancelRename: rename.cancel,
    tabStop: navigation.tabStop,
    isExpanded,
    isSelected: selection.isSelected,
    toggle: (id: string) => setExpanded(id, !isExpanded(id)),
    focusItem
  })

  defineExpose({
    /** Opens the in-place rename field on the node with this id, when editable. */
    startRename: rename.start
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
    :data-size="size"
    :aria-busy="loading || undefined"
    class="group/tree flex w-full min-w-0 flex-col"
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
        :height="`${rowHeight / 16}rem`"
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
      @mousedown="onMousedown"
      @click="onClick"
      @dblclick="onDblclick"
      @keydown="onKeydown"
      @focusin="onFocusin"
    >
      <template
        v-for="entry in entries"
        :key="entry.key"
      >
        <li
          v-if="entry.placeholder"
          :ref="(el) => observe(el, entry.chunk)"
          role="none"
          aria-hidden="true"
          :data-chunk="entry.chunk"
          class="m-0 list-none p-0"
          :style="{ height: `${entry.height}px` }"
        />
        <TreeNode
          v-else
          :item="entry.item"
          :level="entry.level"
          :posinset="entry.posinset"
          :setsize="entry.setsize"
          :flat="flat"
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
                  class="min-w-0 truncate text-label-md text-(--text-default) group-data-[disabled]/tree-row:text-(--text-disabled) group-data-[size=large]/tree:text-label-lg"
                >
                  {{ scope.item.label }}
                </span>
                <span
                  v-if="scope.item.description"
                  class="min-w-0 truncate text-label-sm text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled) group-data-[size=large]/tree:text-label-md"
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
      </template>
    </component>
  </div>
</template>
