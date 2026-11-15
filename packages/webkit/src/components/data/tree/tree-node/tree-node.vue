<script setup lang="ts">
  import { computed, inject, onMounted, onUpdated, ref, useId, watch } from 'vue'

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
  }

  const props = withDefaults(defineProps<Props>(), { actionable: false })

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

  const actionsRef = ref<HTMLElement | null>(null)

  const ACTION_FOCUSABLE =
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-tree-parked]'

  function syncActionTabOrder() {
    const region = actionsRef.value
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
</script>

<template>
  <li
    v-bind="grid ? { role: 'none' } : focusAttrs"
    class="m-0 list-none p-0 focus-visible:outline-none"
  >
    <div
      v-bind="grid ? focusAttrs : {}"
      data-tree-row
      :data-state="state"
      :data-selected="selected || null"
      :data-disabled="item.disabled || null"
      class="group/tree-row relative isolate flex min-h-8 w-full cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 active:before:bg-(--bg-active) motion-reduce:before:transition-none data-[selected]:bg-(--bg-selected) data-[disabled]:cursor-default [:focus-visible>&]:ring-2 [:focus-visible>&]:ring-(--ring-color) [:focus-visible>&]:ring-offset-1 [:focus-visible>&]:ring-offset-(--bg-canvas) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
    >
      <span
        :role="grid ? 'gridcell' : undefined"
        :tabindex="grid ? -1 : undefined"
        :data-tree-cell="grid ? '' : undefined"
        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) self-stretch rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <span class="flex w-4 shrink-0 items-center justify-center self-stretch">
          <button
            v-if="isParent"
            type="button"
            tabindex="-1"
            aria-hidden="true"
            data-tree-toggle
            :data-testid="`${ctx.testId.value}__toggle`"
            :data-state="state"
            class="flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled)"
            @mousedown.prevent
            @click="onToggle"
          >
            <i
              :data-state="state"
              class="ai ai-angle-right leading-none transition-[rotate] duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-90 rtl:-scale-x-100 rtl:data-[state=open]:-rotate-90"
            />
          </button>
        </span>
        <span
          :id="labelId"
          class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)"
        >
          <input
            v-if="renaming"
            :ref="mountRenameField"
            type="text"
            data-tree-rename
            :data-testid="`${ctx.testId.value}__rename`"
            :value="item.label"
            :aria-label="ctx.renameLabel(item.label)"
            class="h-6 min-w-0 flex-1 rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) px-(--spacing-xxs) text-label-md text-(--text-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
        ref="actionsRef"
        :role="grid ? 'gridcell' : undefined"
        data-tree-actions
        class="ms-auto flex shrink-0 items-center gap-(--spacing-xxs)"
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
      v-if="expanded"
      :role="grid ? 'none' : 'group'"
      :aria-busy="(!grid && item.loading) || undefined"
      class="m-0 ms-(--spacing-md) list-none border-s border-(--border-muted) p-0"
    >
      <li
        v-if="item.loading"
        role="none"
        :data-testid="`${ctx.testId.value}__loading`"
        class="m-0 flex min-h-8 list-none items-center gap-(--spacing-xs) px-(--spacing-xs) ps-[calc(var(--spacing-xs)+1rem+var(--spacing-xs))]"
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
              kind="rectangle"
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
        v-for="(child, index) in item.loading ? [] : children"
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
  </li>
</template>
