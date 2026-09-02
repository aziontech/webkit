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

  // NO BLUE ON A REFERENCE. The link is full ink with a muted underline that firms to full
  // ink on hover — the same clothes every reference on this page wears (the workload card's
  // hostname, its custom domain, its deployment). It was `--text-link`, which made a node's
  // one way out the loudest thing in a card whose job is to name a resource calmly.
  //
  // EVERY node links out, so the link is unconditional. The chain's four provisioned
  // resources go to their detail page; the firewall, the connector and the two bound
  // slots go to the `/<module>/:id/settings` page their module list edits a row with —
  // which is generated from the resource descriptor and seeds itself from the URL
  // (console/pages/resources/ResourceSettings.vue), hence the `name` alongside `email`.

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
         on the right. -->
    <div
      v-if="node.href || $slots.actions"
      class="flex items-center gap-(--spacing-xs)"
    >
      <router-link
        v-if="node.href"
        :to="{ path: node.href, query: { name: node.name || undefined, email } }"
        class="inline-flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default) underline decoration-(--text-muted) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:decoration-(--text-default) motion-reduce:transition-none"
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
