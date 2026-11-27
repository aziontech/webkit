<script setup lang="ts">
  import FlowDiagramBind from '@aziontech/ui/flow-diagram-bind'
  import type { FlowDiagramEdgeData, FlowDiagramNodeData } from '@aziontech/ui/flow-diagram-root'
  import FlowDiagram from '@aziontech/ui/flow-diagram-root'
  import Subheader from '@aziontech/ui/subheader'
  import { ref } from 'vue'

  export interface TopologyPanelProps {
    /** The element the panel renders as. */
    tag?: 'section' | 'div'
    /** What the topology shows and what can change in it. */
    description: string
    /** The nodes of the diagram. */
    nodes: FlowDiagramNodeData[]
    /** The connectors of the diagram. */
    edges: FlowDiagramEdgeData[]
    /** How many changes wait for the next deploy. */
    stagedCount: number
    /** The last thing that was staged. */
    stagedNote: string
  }

  withDefaults(defineProps<TopologyPanelProps>(), {
    tag: 'section'
  })

  const openKeys = defineModel<string[]>('openKeys', { required: true })

  const emit = defineEmits<{
    bind: [key: string, value: string]
    remove: [key: string]
    create: [key: string]
  }>()

  defineSlots<{
    'node-actions'?(props: { node: FlowDiagramNodeData }): unknown
  }>()

  const panelEl = ref<HTMLElement | null>(null)

  defineExpose({
    /** Scrolls the panel into view. */
    reveal: () => panelEl.value?.scrollIntoView({ block: 'start' })
  })
</script>

<template>
  <component
    :is="tag"
    ref="panelEl"
  >
    <Subheader
      title="Deployment topology"
      :description="description"
      size="small"
    />
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <FlowDiagram
        v-model:open-keys="openKeys"
        :nodes="nodes"
        :edges="edges"
        aria-label="Deployment topology"
      >
        <template #actions="{ node }">
          <slot
            name="node-actions"
            :node="node"
          />
          <FlowDiagramBind
            v-if="node.bindable"
            :label="node.eyebrow"
            :options="node.bindOptions"
            :value="node.boundValue"
            :removable="node.removable"
            @bind="(_event, value) => emit('bind', node.id, value)"
            @remove="() => emit('remove', node.id)"
            @create="() => emit('create', node.id)"
          />
        </template>
      </FlowDiagram>
    </div>
    <p
      role="status"
      class="m-0 text-body-sm text-(--text-muted)"
    >
      {{ stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote }}
    </p>
  </component>
</template>
