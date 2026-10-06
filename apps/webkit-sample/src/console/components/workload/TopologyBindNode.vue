<script setup lang="ts">
  import TopologyBindControl from './TopologyBindControl.vue'
  import TopologyNode from './TopologyNode.vue'

  interface Props {
    target: Record<string, unknown>
    options?: unknown[]
    status?: string
    severity?: string
    message?: string
  }

  withDefaults(defineProps<Props>(), {
    options: () => [],
    status: 'Not bound',
    severity: 'neutral',
    message: ''
  })

  const emit = defineEmits<{
    bind: []
    create: []
  }>()

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
