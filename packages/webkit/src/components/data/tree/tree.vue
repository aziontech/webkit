<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useLocale } from '../../../composables/use-locale'
  import * as en from '../../../i18n/messages/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { useTreeNavigation } from './composables/use-tree-navigation'
  import { TreeInjectionKey } from './injection-key'
  import TreeNode from './tree-node/tree-node.vue'

  defineOptions({ name: 'Tree', inheritAttrs: false })

  /** One node of the tree; a node with a non-empty children array is a parent. */
  export type TreeItem = {
    id: string
    label: string
    icon?: string
    description?: string
    disabled?: boolean
    children?: TreeItem[]
  }

  interface Props {
    /** Nodes to render; a node with a non-empty children array is a parent. */
    items?: TreeItem[]
    /** Enables single selection: activating a node writes its id to v-model:selected and marks it aria-selected. */
    selectable?: boolean
    /** Renders Skeleton rows in place of the tree and sets aria-busy. */
    loading?: boolean
    /** Title of the default empty state shown when items is empty. Empty uses the locale catalog (`No items`). */
    emptyTitle?: string
    /** Supporting line under the empty title. */
    emptyDescription?: string
    /** Accessible name of the tree. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    selectable: false,
    loading: false,
    emptyTitle: '',
    emptyDescription: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** A node activated by a row click, or Enter or Space on the focused node. */
    'item-click': [event: MouseEvent | KeyboardEvent, item: TreeItem]
  }>()

  /** Ids of the expanded parents. */
  const expanded = defineModel<string[]>('expanded', { default: () => [] })

  /** Id of the selected node; empty when nothing is selected. */
  const selected = defineModel<string>('selected', { default: '' })

  defineSlots<{
    /** Replaces the label region of every row; receives the node, its level and whether it is expanded. */
    item(props: { item: TreeItem; level: number; expanded: boolean }): unknown
    /** Trailing per-row controls, end-aligned in the row. */
    actions(props: { item: TreeItem; level: number }): unknown
    /** Replaces the default empty state. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const dir = useDirection()
  const { t } = useLocale({ tree: en.tree })

  const activeSelection = computed(() => (props.selectable ? selected.value : ''))

  const navigation = useTreeNavigation<TreeItem>({
    items: () => props.items,
    expanded: () => expanded.value,
    selected: activeSelection
  })

  const treeRef = ref<globalThis.HTMLElement | null>(null)

  const SKELETON_WIDTHS = ['100%', '80%', '64%', '48%', '32%']

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'data-tree')

  const isEmpty = computed(() => !props.loading && props.items.length === 0)

  const selectable = computed(() => props.selectable)

  function isExpanded(id: string) {
    return navigation.isParent(id) && expanded.value.includes(id)
  }

  function isSelected(id: string) {
    return props.selectable && selected.value !== '' && selected.value === id
  }

  function setExpanded(id: string, open: boolean) {
    if (!navigation.isParent(id) || isExpanded(id) === open) return
    expanded.value = open ? [...expanded.value, id] : expanded.value.filter((key) => key !== id)
  }

  function toggle(id: string) {
    setExpanded(id, !isExpanded(id))
  }

  function focusItem(id: string) {
    if (!id || !treeRef.value) return
    const nodes = treeRef.value.querySelectorAll<globalThis.HTMLElement>('[role="treeitem"]')
    const target = Array.from(nodes).find((node) => node.dataset['itemId'] === id)
    if (!target) return
    navigation.setFocused(id)
    target.focus()
  }

  function activate(event: MouseEvent | KeyboardEvent, id: string) {
    const entry = navigation.entry(id)
    if (!entry || entry.item.disabled) return
    if (props.selectable && selected.value !== id) selected.value = id
    emit('item-click', event, entry.item)
  }

  function treeitemOf(target: EventTarget | null) {
    if (!(target instanceof globalThis.HTMLElement)) return ''
    if (target.getAttribute('role') !== 'treeitem') return ''
    return target.dataset['itemId'] ?? ''
  }

  function onFocusin(event: FocusEvent) {
    const id = treeitemOf(event.target)
    if (id) navigation.setFocused(id)
  }

  function onClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof globalThis.Element)) return
    if (target.closest('[data-tree-toggle], [data-tree-actions]')) return
    const row = target.closest('[data-tree-row]')
    const id = treeitemOf(row?.parentElement ?? null)
    if (!id) return
    focusItem(id)
    activate(event, id)
  }

  function onKeydown(event: KeyboardEvent) {
    const id = treeitemOf(event.target)
    if (!id) return
    const parent = navigation.isParent(id)
    switch (logicalArrowKey(event.key, dir.value)) {
      case 'ArrowDown':
        focusItem(navigation.sibling(id, 1))
        break
      case 'ArrowUp':
        focusItem(navigation.sibling(id, -1))
        break
      case 'ArrowRight':
        if (parent && !isExpanded(id)) setExpanded(id, true)
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
      case 'Enter':
      case ' ':
        activate(event, id)
        break
      default:
        return
    }
    event.preventDefault()
  }

  provide(TreeInjectionKey, {
    testId,
    selectable,
    tabStop: navigation.tabStop,
    isExpanded,
    isSelected,
    toggle,
    focusItem
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-empty="isEmpty || null"
    :data-selectable="selectable || null"
    :aria-busy="loading || undefined"
    class="flex w-full min-w-0 flex-col"
  >
    <div
      v-if="loading"
      aria-hidden="true"
      class="flex flex-col gap-(--spacing-xxs)"
    >
      <Skeleton
        v-for="width in SKELETON_WIDTHS"
        :key="width"
        kind="shape"
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
    <ul
      v-else
      ref="treeRef"
      role="tree"
      :aria-label="ariaLabel || undefined"
      class="m-0 flex list-none flex-col p-0"
      @click="onClick"
      @keydown="onKeydown"
      @focusin="onFocusin"
    >
      <TreeNode
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :level="1"
        :posinset="index + 1"
        :setsize="items.length"
      >
        <template #item="scope">
          <slot
            name="item"
            v-bind="scope"
          >
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
            <span class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xxs)">
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
          </slot>
        </template>
        <template
          v-if="$slots['actions']"
          #actions="scope"
        >
          <slot
            name="actions"
            v-bind="scope"
          />
        </template>
      </TreeNode>
    </ul>
  </div>
</template>
