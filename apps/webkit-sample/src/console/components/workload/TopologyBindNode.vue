<script setup>
  // TopologyBindNode — an OPEN SLOT in the topology: a position the chain supports
  // that holds nothing yet. Same card as a provisioned node (TopologyNode), dashed,
  // with an em dash where a name would be and the bind control on the identity row
  // — so an empty position is reachable while the node is collapsed, which is how it
  // arrives. The body carries the one line on what the slot being empty costs.
  import TopologyBindControl from './TopologyBindControl.vue'
  import TopologyNode from './TopologyNode.vue'

  defineProps({
    /** A `TOPOLOGY_BIND_TARGETS` entry — the kind, the glyph and every label. */
    target: { type: Object, required: true },
    /** Bindable resources, `{ value, label }`. */
    options: { type: Array, default: () => [] },
    /** Status word for the header — `Not bound`, or `Staged` while a pick waits for a deploy. */
    status: { type: String, default: 'Not bound' },
    /** Severity for that word. */
    severity: { type: String, default: 'neutral' },
    /** One line on what this slot's state means for the deployment. */
    message: { type: String, default: '' }
  })

  /** `bind` carries the picked resource id; `create` leaves for the create page. */
  const emit = defineEmits(['bind', 'create'])

  const open = defineModel('open', { type: Boolean, default: false })
</script>

<template>
  <TopologyNode
    v-model:open="open"
    :kind="target.kind"
    :icon="target.icon"
    :status="status"
    :severity="severity"
    dashed
  >
    <template #actions>
      <TopologyBindControl
        :target="target"
        :options="options"
        @bind="emit('bind', $event)"
        @create="emit('create')"
      />
    </template>

    <p
      v-if="message"
      class="text-body-xs text-(--text-muted)"
    >
      {{ message }}
    </p>
  </TopologyNode>
</template>
