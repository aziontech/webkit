<script setup lang="ts">
  import {
    computed,
    type FunctionalComponent,
    h,
    inject,
    onMounted,
    onUpdated,
    ref,
    useId,
    watch
  } from 'vue'

  import Skeleton from '../../../feedback/skeleton/skeleton.vue'
  import { TreeInjectionKey } from '../injection-key'
  import type { TreeItem } from '../tree.vue'

  defineOptions({ name: 'TreeNode', inheritAttrs: false })

  interface Props {
    /** Node rendered by this row. */
    item: TreeItem
    /** One-based depth of the node. */
    level: number
    /** One-based position of the node among its siblings. */
    posinset: number
    /** Number of siblings, the node included. */
    setsize: number
    /** Renders the trailing actions region. */
    actionable?: boolean
    /** Renders the row alone, indented by its level, with its children as later rows of a flat list. */
    flat?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { actionable: false, flat: false })

  defineSlots<{
    /** Label region of the row. */
    item(props: { item: TreeItem; level: number; expanded: boolean }): unknown
    /** Trailing per-row controls. */
    actions(props: { item: TreeItem; level: number }): unknown
  }>()

  const context = inject(TreeInjectionKey, null)
  if (!context) throw new Error('TreeNode must be rendered by Tree.')
  const ctx = context

  const labelId = useId()

  const INDENT_CLASS =
    'ms-(--spacing-md) border-s border-(--border-muted) group-data-[size=small]/tree:ms-(--spacing-sm) group-data-[size=large]/tree:ms-[calc(var(--spacing-sm)+0.5rem)]'

  const Indent: FunctionalComponent<{ depth: number }> = (indent, { slots }) =>
    indent.depth > 0
      ? h('div', { role: 'none', 'data-tree-indent': '', class: INDENT_CLASS }, [
          h(Indent, { depth: indent.depth - 1 }, slots)
        ])
      : slots['default']?.()

  const children = computed(() => props.item.children ?? [])
  const isParent = computed(() => props.item.lazy === true || children.value.length > 0)
  const renaming = computed(() => ctx.renamingId.value === props.item.id)
  const expanded = computed(() => isParent.value && ctx.isExpanded(props.item.id))
  const selected = computed(() => ctx.isSelected(props.item.id))
  const state = computed(() => {
    if (!isParent.value) return undefined
    return expanded.value ? 'open' : 'closed'
  })
  const tabindex = computed(() => (ctx.tabStop.value === props.item.id ? 0 : -1))
  const grid = computed(() => ctx.grid.value)

  const focusAttrs = computed(() => ({
    role: grid.value ? 'row' : 'treeitem',
    'data-testid': `${ctx.testId.value}__item`,
    'data-item-id': props.item.id,
    'data-tree-focus': '',
    'aria-level': props.level,
    'aria-setsize': props.setsize,
    'aria-posinset': props.posinset,
    'aria-labelledby': labelId,
    'aria-expanded': isParent.value ? expanded.value : undefined,
    'aria-selected': ctx.selectable.value ? selected.value : undefined,
    'aria-disabled': props.item.disabled || undefined,
    tabindex: tabindex.value
  }))

  const actionsEl = ref<HTMLElement | null>(null)

  const ACTION_FOCUSABLE =
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-tree-parked]'

  function syncActionTabOrder() {
    const region = actionsEl.value
    if (!region) return
    const isStop = !grid.value && tabindex.value === 0
    for (const el of Array.from(region.querySelectorAll<HTMLElement>(ACTION_FOCUSABLE))) {
      if (isStop && el.hasAttribute('data-tree-parked')) {
        const original = el.getAttribute('data-tree-parked')
        if (original) el.setAttribute('tabindex', original)
        else el.removeAttribute('tabindex')
        el.removeAttribute('data-tree-parked')
      } else if (!isStop && !el.hasAttribute('data-tree-parked')) {
        el.setAttribute('data-tree-parked', el.getAttribute('tabindex') ?? '')
        el.setAttribute('tabindex', '-1')
      }
    }
  }

  onMounted(syncActionTabOrder)
  onUpdated(syncActionTabOrder)
  watch(tabindex, syncActionTabOrder, { flush: 'post' })

  function onToggle() {
    ctx.toggle(props.item.id)
    ctx.focusItem(props.item.id)
  }

  let renameDone = false

  function mountRenameField(el: unknown) {
    if (!(el instanceof globalThis.HTMLInputElement) || el.dataset['ready']) return
    el.dataset['ready'] = 'true'
    renameDone = false
    el.focus()
    el.select()
  }

  function commitRename(event: KeyboardEvent | FocusEvent) {
    if (renameDone) return
    renameDone = true
    const field = event.target as globalThis.HTMLInputElement
    ctx.commitRename(event, props.item.id, field.value)
  }

  function onRenameKeydown(event: KeyboardEvent) {
    event.stopPropagation()
    if (event.key === 'Enter') {
      event.preventDefault()
      commitRename(event)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      renameDone = true
      ctx.cancelRename(props.item.id)
    }
  }

  const ROW_CLASS =
    'group/tree-row relative isolate flex min-h-8 w-full cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-xs) text-label-lg transition-colors duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 ' +
    "before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 active:before:bg-(--bg-active) " +
    'motion-reduce:before:transition-none after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-(--ring-color) after:opacity-0 ' +
    "after:content-[''] " +
    'data-[selected]:bg-(--bg-selected) ' +
    'data-[disabled]:cursor-default ' +
    'focus-visible:outline-none focus-visible:after:opacity-100 [:focus-visible>&]:after:opacity-100 ' +
    '[:focus-visible>[data-tree-indent]_&]:after:opacity-100 ' +
    'group-data-[size=small]/tree:min-h-6 group-data-[size=small]/tree:gap-(--spacing-2xs) group-data-[size=small]/tree:px-(--spacing-2xs) group-data-[size=small]/tree:text-label-md ' +
    'group-data-[size=large]/tree:min-h-10 group-data-[size=large]/tree:px-(--spacing-sm) ' +
    'pointer-coarse:min-h-11 group-data-[size=small]/tree:pointer-coarse:min-h-11'

  const CELL_CLASS =
    'flex min-w-0 flex-1 items-center gap-(--spacing-xs) self-stretch rounded-(--shape-control) ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
    'group-data-[size=small]/tree:gap-(--spacing-2xs)'

  const CHEVRON_CLASS =
    'az az-chevron-right leading-none transition-[rotate] duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[state=open]:rotate-90 ' +
    'rtl:-scale-x-100 rtl:data-[state=open]:-rotate-90'

  const RENAME_CLASS =
    'h-6 min-w-0 flex-1 rounded-(--shape-control) border border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) text-label-md text-(--text-default) outline-none ' +
    'focus-visible:border-(--ring-color) ' +
    'group-data-[size=small]/tree:h-5 group-data-[size=large]/tree:h-8 group-data-[size=large]/tree:text-label-lg ' +
    'pointer-coarse:text-body-md'

  const LOADING_CLASS =
    'm-0 flex min-h-8 list-none items-center gap-(--spacing-xs) px-(--spacing-xs) ps-[calc(var(--spacing-xs)+1rem+var(--spacing-xs))] ' +
    'group-data-[size=small]/tree:min-h-6 group-data-[size=small]/tree:ps-[calc(var(--spacing-2xs)+1rem+var(--spacing-2xs))] group-data-[size=large]/tree:min-h-10 ' +
    'group-data-[size=large]/tree:ps-[calc(var(--spacing-sm)+1rem+var(--spacing-xs))]'
</script>

<template>
  <li
    v-bind="grid ? { role: 'none' } : focusAttrs"
    class="m-0 list-none p-0 focus-visible:outline-none"
  >
    <Indent :depth="flat ? level - 1 : 0">
      <div
        v-bind="grid ? focusAttrs : {}"
        data-slot="tree-row"
        :data-state="state"
        :data-selected="selected || null"
        :data-disabled="item.disabled || null"
        :class="ROW_CLASS"
      >
        <span
          :role="grid ? 'gridcell' : undefined"
          :tabindex="grid ? -1 : undefined"
          data-slot="tree-cell"
          :class="CELL_CLASS"
        >
          <span class="flex w-4 shrink-0 items-center justify-center self-stretch">
            <button
              v-if="isParent"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              data-slot="tree-toggle"
              :data-testid="`${ctx.testId.value}__toggle`"
              :data-state="state"
              class="relative flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled)"
              @mousedown.prevent
              @click="onToggle"
            >
              <i
                :data-state="state"
                :class="CHEVRON_CLASS"
              />
              <span
                aria-hidden="true"
                data-slot="touch-target"
                class="absolute inset-y-0 -inset-x-3.5 hidden pointer-coarse:block"
              />
            </button>
          </span>
          <span
            :id="labelId"
            class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) group-data-[size=small]/tree:gap-(--spacing-2xs)"
          >
            <input
              v-if="renaming"
              :ref="mountRenameField"
              type="text"
              data-slot="tree-rename"
              :data-testid="`${ctx.testId.value}__rename`"
              :value="item.label"
              :aria-label="ctx.renameLabel(item.label)"
              :class="RENAME_CLASS"
              @keydown="onRenameKeydown"
              @blur="commitRename"
            />
            <slot
              v-else
              name="item"
              :item="item"
              :level="level"
              :expanded="expanded"
            />
          </span>
        </span>
        <span
          v-if="actionable"
          ref="actionsEl"
          :role="grid ? 'gridcell' : undefined"
          data-slot="tree-actions"
          class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
          @mousedown.self.prevent
        >
          <slot
            name="actions"
            :item="item"
            :level="level"
          />
        </span>
      </div>
      <ul
        v-if="expanded && (!flat || item.loading)"
        :role="grid ? 'none' : 'group'"
        :aria-busy="(!grid && item.loading) || undefined"
        class="m-0 ms-(--spacing-md) list-none border-s border-(--border-muted) p-0 group-data-[size=small]/tree:ms-(--spacing-sm) group-data-[size=large]/tree:ms-[calc(var(--spacing-sm)+0.5rem)]"
      >
        <li
          v-if="item.loading"
          role="none"
          :data-testid="`${ctx.testId.value}__loading`"
          :class="LOADING_CLASS"
        >
          <span
            :role="grid ? 'row' : undefined"
            :aria-busy="grid || undefined"
            :aria-level="grid ? level + 1 : undefined"
            class="flex min-w-0 flex-1 items-center"
          >
            <span
              :role="grid ? 'gridcell' : undefined"
              class="flex min-w-0 flex-1 items-center"
            >
              <Skeleton
                variant="rectangle"
                width="60%"
                height="1rem"
                aria-hidden="true"
              />
              <span
                role="status"
                class="sr-only"
                >{{ ctx.loadingLabel.value }}</span
              >
            </span>
          </span>
        </li>
        <TreeNode
          v-for="(child, index) in item.loading || flat ? [] : children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          :posinset="index + 1"
          :setsize="children.length"
          :actionable="actionable"
        >
          <template #item="scope">
            <slot
              name="item"
              v-bind="scope"
            />
          </template>
          <template #actions="scope">
            <slot
              name="actions"
              v-bind="scope"
            />
          </template>
        </TreeNode>
      </ul>
    </Indent>
  </li>
</template>
