<script setup>
  // TopologyNodeCard — one PROVISIONED resource in the workload's deployment
  // topology (Workload / Application / Connector / Storage), and the two
  // Application-level slots once they are bound.
  //
  // The card frame, the disclosure header (kind + status + name) and the open state
  // all belong to TopologyNode, so this file owns only what the resource itself has
  // to say: its fields, and the way out to its module page.
  //
  // That way out is a BODY row rather than the header's name, which is where it
  // used to live: the header is now one full-width trigger button, and an anchor
  // inside a button is invalid markup and unreachable by keyboard.
  import CopyButton from '@aziontech/webkit/copy-button'

  import TopologyNode from './TopologyNode.vue'

  defineProps({
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
    Private: 'neutral'
  }
  const nodeSeverity = (status) => NODE_SEVERITY[status] ?? 'neutral'
</script>

<template>
  <TopologyNode
    v-model:open="open"
    :kind="node.kind"
    :icon="node.icon"
    :name="node.name"
    :status="node.status"
    :severity="nodeSeverity(node.status)"
  >
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

    <!-- The node's own controls, on one row under its fields: the way out to the
         resource on the left, and whatever the page adds (unbinding a bound slot)
         on the right. Modules without a page yet (Connector, Custom Page) simply
         have no href and render no link. -->
    <div
      v-if="node.href || $slots.actions"
      class="flex items-center gap-(--spacing-xs)"
    >
      <router-link
        v-if="node.href"
        :to="{ path: node.href, query: { email } }"
        class="inline-flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm text-(--text-link) no-underline hover:underline"
      >
        <span class="truncate">Open {{ node.kind }}</span>
        <i
          class="pi pi-arrow-up-right shrink-0"
          aria-hidden="true"
        />
      </router-link>
      <div
        v-if="$slots.actions"
        class="ml-auto flex shrink-0 items-center"
      >
        <slot name="actions" />
      </div>
    </div>
  </TopologyNode>
</template>
