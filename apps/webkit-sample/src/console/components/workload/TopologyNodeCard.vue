<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'

  import ResourceLink from '../resource/ResourceLink.vue'
  import TopologyNode from './TopologyNode.vue'

  interface Props {
    node: Record<string, unknown>
    email?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    email: ''
  })

  defineSlots<{
    actions(): unknown
  }>()

  const open = defineModel('open', { type: Boolean, default: false })

  const NODE_SEVERITY = {
    Live: 'success',
    Active: 'success',
    Public: 'info',
    Private: 'neutral',
    Staged: 'warning',
    'Not bound': 'neutral'
  }
  const nodeSeverity = (status) => NODE_SEVERITY[status] ?? 'neutral'

  const route = () =>
    props.node.href
      ? { path: props.node.href, query: { name: props.node.name || undefined, email: props.email } }
      : null
</script>

<template>
  <TopologyNode
    v-model:open="open"
    :kind="node.kind"
    :icon="node.icon"
    :name="node.name"
    :status="node.status"
    :severity="nodeSeverity(node.status)"
    :dashed="Boolean(node.dashed)"
  >
    <template #identity>
      <ResourceLink
        :label="node.name || '—'"
        :to="route()"
        :module="node.kind"
      />
    </template>

    <template
      v-if="$slots.actions"
      #actions
    >
      <slot name="actions" />
    </template>

    <p
      v-if="node.message"
      class="text-body-xs text-(--text-muted)"
    >
      {{ node.message }}
    </p>

    <div
      v-for="field in node.fields"
      :key="field.label"
      class="flex flex-col gap-(--spacing-xxs)"
    >
      <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <a
          v-if="field.url"
          :href="field.url"
          target="_blank"
          rel="noopener noreferrer"
          class="truncate text-body-xs text-(--text-default) hover:underline"
        >
          {{ field.value }}
        </a>
        <span
          v-else
          class="truncate text-body-xs text-(--text-default)"
        >
          {{ field.value }}
        </span>
        <CopyButton
          v-if="field.copy"
          kind="outlined"
          :value="field.value"
          :aria-label="`Copy ${node.kind} ${field.label.toLowerCase()}`"
        />
      </div>
    </div>
  </TopologyNode>
</template>
