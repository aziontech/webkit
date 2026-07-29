<script setup>
// TopologyBindNode — the EMPTY node of the deployment topology: an
// Application-level resource that CAN be bound to the deployment (Firewall,
// Custom Page) but is not. Instead of hiding the slot, the chain keeps the
// position visible as a dashed card carrying the CTA that fills it.
//
// It is the same card frame as TopologyNodeCard (same width, same header row),
// so the Application level reads as one column: what is bound, and what is
// still open. The CTA is a Dropdown of the resources available to bind — the
// choice is the whole interaction, so it needs no drawer.
import Button from "@aziontech/webkit/button";
import Dropdown from "@aziontech/webkit/dropdown";
import StatusIndicator from "@aziontech/webkit/status-indicator";

defineProps({
  // Resource kind shown in the header ("Firewall", "Custom Page").
  kind: { type: String, required: true },
  // Azion icon class, matching the module's sidebar icon.
  icon: { type: String, default: "" },
  // One line on what NOT binding this resource means for the deployment.
  description: { type: String, default: "" },
  // CTA label ("Bind Firewall").
  ctaLabel: { type: String, required: true },
  // Bindable resources: `{ value, label }`.
  options: { type: Array, default: () => [] },
});

const emit = defineEmits(["bind"]);
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-[var(--shape-card)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)]"
  >
    <!-- Same wrap rule as TopologyNodeCard's header. -->
    <div
      class="flex flex-wrap items-center gap-x-[var(--spacing-xs)] gap-y-[var(--spacing-xxs)] border-b border-dashed border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
    >
      <i
        :class="icon"
        class="shrink-0 text-[14px] leading-none text-[var(--text-muted)]"
        aria-hidden="true"
      />
      <span class="whitespace-nowrap text-label-sm text-[var(--text-muted)]">{{ kind }}</span>
      <StatusIndicator
        class="ml-auto shrink-0"
        severity="neutral"
        label="Not bound"
      />
    </div>

    <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <p class="text-body-sm text-[var(--text-muted)]">{{ description }}</p>

      <Dropdown
        placement="bottom-start"
        @select="(event, value) => emit('bind', event, value)"
      >
        <Dropdown.Trigger>
          <Button
            :label="ctaLabel"
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
            class="w-full"
          />
        </Dropdown.Trigger>

        <Dropdown.Group>
          <Dropdown.Option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </Dropdown.Group>
      </Dropdown>
    </div>
  </div>
</template>
