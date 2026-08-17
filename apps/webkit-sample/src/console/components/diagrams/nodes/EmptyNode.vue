<script setup>
  // EmptyNode — a Vue Flow node for an Application-level resource that has NOT
  // been bound yet (Edge Firewall, Custom Page). It is the canvas equivalent of
  // an empty state: instead of hiding the slot, the graph keeps the position
  // visible as a dashed placeholder and offers the CTA that fills it.
  //
  // Registered on the canvas as `type: 'empty'` and rendered through Vue Flow's
  // `#node-empty` slot, so the `bind` event reaches the page in the parent
  // scope. Everything is drawn with @aziontech/theme tokens (dashed border,
  // muted surface) so it tracks light/dark like the rest of the graph.
  import Button from '@aziontech/webkit/button'
  import { Handle, Position } from '@vue-flow/core'

  defineProps({
    /** Vue Flow node id — echoed back on `bind` so the page knows what to fill. */
    id: {
      type: String,
      required: true
    },
    /**
     * Node payload: `title`, `description`, `icon` (PrimeIcons class),
     * `ctaLabel`, and the `source` / `target` handle flags.
     */
    data: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['bind'])
</script>

<template>
  <div
    class="flex w-[210px] flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-[var(--spacing-sm)] text-left transition-colors duration-150 ease-out hover:border-[var(--primary)] motion-reduce:transition-none"
  >
    <!-- Handles keep the placeholder wired into the flow, but are not
         connectable: there is nothing to connect until the slot is filled. -->
    <Handle
      v-if="data.target"
      type="target"
      :position="Position.Left"
      :connectable="false"
    />

    <div class="flex items-center gap-[var(--spacing-xs)]">
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-dashed border-[var(--border-default)] text-[var(--text-muted)]"
      >
        <i
          :class="data.icon"
          class="text-[10px]"
          aria-hidden="true"
        />
      </span>
      <span class="truncate text-body-sm text-[var(--text-default)]">{{ data.title }}</span>
    </div>

    <p class="text-body-xs text-[var(--text-muted)]">{{ data.description }}</p>

    <!-- `nodrag` lets the pointer reach the button instead of starting a node drag. -->
    <Button
      class="nodrag w-full"
      type="button"
      :label="data.ctaLabel"
      kind="secondary"
      size="small"
      icon="pi pi-plus"
      @click="(event) => emit('bind', event, id)"
    />

    <Handle
      key="handle-2"
      v-if="data.source"
      type="source"
      :position="Position.Right"
      :connectable="false"
    />
  </div>
</template>
