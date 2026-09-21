<script setup>
  // TopologyNodeCard — one PROVISIONED resource in the workload's deployment
  // topology (Domains / Workload / Application / Connector / Storage), and the
  // bindable slots once they are bound.
  //
  // The card frame, the disclosure header, the identity row and the open state all
  // belong to TopologyNode, so this file owns only what the resource itself has to
  // say: the name it is known by, the way out to its module page, and its fields.
  //
  // THE NAME IS THE WAY OUT. It used to be plain text in the header with a separate
  // "Open <kind>" link buried in the body; the name itself carries the route now, so
  // the node has one identity rather than two, and ResourceLink puts the glyph and
  // the "Open <name> in <kind>" tooltip on it that every cross-resource link in the
  // console wears (../resource/ResourceLink.vue).
  import CopyButton from '@aziontech/webkit/copy-button'

  import ResourceLink from '../resource/ResourceLink.vue'
  import TopologyNode from './TopologyNode.vue'

  const props = defineProps({
    // A node from `resourceChain()` — { kind, icon, name, status, href, fields[] }.
    node: { type: Object, required: true },
    // Carried into the module link so the demo keeps the signed-in email.
    email: { type: String, default: '' }
  })

  // Forwarded straight to TopologyNode so the PAGE decides which nodes start open.
  const open = defineModel('open', { type: Boolean, default: false })

  // A node's status word → severity. This stays the indicator vocabulary that
  // TopologyNode's `severity` prop accepts; TopologyNode maps it to the Tag it
  // renders the status with.
  const NODE_SEVERITY = {
    Live: 'success',
    Active: 'success',
    Public: 'info',
    Private: 'neutral',
    Staged: 'warning',
    'Not bound': 'neutral'
  }
  const nodeSeverity = (status) => NODE_SEVERITY[status] ?? 'neutral'

  // EVERY node that names a resource links out: the chain's provisioned resources go
  // to their detail page, the bound slots to the `/<module>/:id/settings` page their
  // module list edits a row with — which seeds itself from the URL
  // (console/pages/resources/ResourceSettings.vue), hence the `name` alongside
  // `email`. A node with no page of its own (Domains) renders its name as text.
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
