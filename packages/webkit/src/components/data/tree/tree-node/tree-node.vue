<script setup lang="ts">
  import { computed, inject, useId } from 'vue'

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
  }

  const props = defineProps<Props>()

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
  const isParent = computed(() => children.value.length > 0)
  const expanded = computed(() => isParent.value && ctx.isExpanded(props.item.id))
  const selected = computed(() => ctx.isSelected(props.item.id))
  const state = computed(() => {
    if (!isParent.value) return undefined
    return expanded.value ? 'open' : 'closed'
  })
  const tabindex = computed(() => (ctx.tabStop.value === props.item.id ? 0 : -1))

  function onToggle() {
    ctx.toggle(props.item.id)
    ctx.focusItem(props.item.id)
  }
</script>

<template>
  <li
    role="treeitem"
    :data-testid="`${ctx.testId.value}-item`"
    :data-item-id="item.id"
    :aria-level="level"
    :aria-setsize="setsize"
    :aria-posinset="posinset"
    :aria-labelledby="labelId"
    :aria-expanded="isParent ? expanded : undefined"
    :aria-selected="ctx.selectable.value ? selected : undefined"
    :aria-disabled="item.disabled || undefined"
    :tabindex="tabindex"
    class="m-0 list-none p-0 focus-visible:outline-none"
  >
    <div
      data-tree-row
      :data-state="state"
      :data-selected="selected || null"
      :data-disabled="item.disabled || null"
      class="group/tree-row relative isolate flex min-h-8 w-full cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 active:before:bg-(--bg-active) motion-reduce:before:transition-none data-[selected]:bg-(--bg-selected) data-[disabled]:cursor-default [:focus-visible>&]:ring-2 [:focus-visible>&]:ring-(--ring-color) [:focus-visible>&]:ring-offset-1 [:focus-visible>&]:ring-offset-(--bg-canvas)"
    >
      <span class="flex w-4 shrink-0 items-center justify-center self-stretch">
        <button
          v-if="isParent"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          data-tree-toggle
          :data-testid="`${ctx.testId.value}-toggle`"
          :data-state="state"
          class="flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-(--text-muted) group-data-[disabled]/tree-row:text-(--text-disabled)"
          @mousedown.prevent
          @click="onToggle"
        >
          <i
            :data-state="state"
            class="pi pi-angle-right leading-none transition-[rotate] duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-90 rtl:-scale-x-100 rtl:data-[state=open]:-rotate-90"
          />
        </button>
      </span>
      <span
        :id="labelId"
        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)"
      >
        <slot
          name="item"
          :item="item"
          :level="level"
          :expanded="expanded"
        />
      </span>
      <span
        v-if="$slots['actions']"
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
      role="group"
      class="m-0 ms-(--spacing-md) list-none border-s border-(--border-muted) p-0"
    >
      <TreeNode
        v-for="(child, index) in children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :posinset="index + 1"
        :setsize="children.length"
      >
        <template #item="scope">
          <slot
            name="item"
            v-bind="scope"
          />
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
  </li>
</template>
