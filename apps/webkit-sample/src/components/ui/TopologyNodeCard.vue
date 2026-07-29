<script setup>
// TopologyNodeCard — one provisioned resource in the workload's deployment
// topology (Workload / Application / Connector / Storage). Extracted from
// WorkloadDetail so the Application level can stack this card next to the
// Firewall / Custom Page binding slots without duplicating its markup.
//
// Header: resource kind + status. Body: the resource's own name (linked to its
// module page when it has one) + that resource's fields.
import CopyButton from "@aziontech/webkit/copy-button";
import StatusIndicator from "@aziontech/webkit/status-indicator";

defineProps({
  // A node from `resourceChain()` — { kind, icon, name, status, href, fields[] }.
  node: { type: Object, required: true },
  // Carried into the module link so the demo keeps the signed-in email.
  email: { type: String, default: "" },
});

// A node's status word → StatusIndicator severity.
const NODE_SEVERITY = {
  Live: "success",
  Active: "success",
  Public: "info",
  Private: "neutral",
};
const nodeSeverity = (status) => NODE_SEVERITY[status] ?? "neutral";
</script>

<template>
  <!-- w-full: the card takes the width its Flow level hands it, so the four
       levels divide the diagram evenly instead of each node being a fixed box. -->
  <div
    class="w-full overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
  >
    <!-- Wraps instead of truncating: at a narrow level width the status pill
         drops to a second line, so neither the kind nor the status is cut. -->
    <div
      class="flex flex-wrap items-center gap-x-[var(--spacing-xs)] gap-y-[var(--spacing-xxs)] border-b border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
    >
      <i
        :class="node.icon"
        class="shrink-0 text-[14px] leading-none text-[var(--text-muted)]"
        aria-hidden="true"
      />
      <span class="whitespace-nowrap text-label-sm text-[var(--text-muted)]">
        {{ node.kind }}
      </span>
      <StatusIndicator
        class="ml-auto shrink-0"
        :severity="nodeSeverity(node.status)"
        :label="node.status"
      />
      <!-- Bound Application-level resources put their unbind control here; the
           provisioned chain nodes leave it empty. -->
      <slot name="header-action" />
    </div>

    <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <!-- The resource's own name links to its module page; modules without a
           page yet (Connector, Firewall, Custom Page) render as plain text. -->
      <router-link
        v-if="node.href"
        :to="{ path: node.href, query: { email } }"
        class="inline-flex items-center gap-[var(--spacing-xxs)] truncate text-label-md text-[var(--text-default)] no-underline hover:underline"
      >
        <span class="truncate">{{ node.name }}</span>
        <i
          class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
          aria-hidden="true"
        />
      </router-link>
      <span
        v-else
        class="truncate text-label-md text-[var(--text-default)]"
      >
        {{ node.name }}
      </span>

      <div
        v-for="field in node.fields"
        :key="field.label"
        class="flex flex-col gap-[var(--spacing-xxs)]"
      >
        <span class="text-label-sm text-[var(--text-muted)]">
          {{ field.label }}
        </span>
        <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
          <a
            v-if="field.url"
            :href="field.url"
            target="_blank"
            rel="noopener noreferrer"
            class="truncate text-body-sm text-[var(--text-default)] hover:underline"
          >
            {{ field.value }}
          </a>
          <span
            v-else
            class="truncate text-body-sm text-[var(--text-default)]"
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
    </div>
  </div>
</template>
