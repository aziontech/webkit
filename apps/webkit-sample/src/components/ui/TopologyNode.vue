<script setup>
  // TopologyNode — the frame EVERY node of the deployment topology wears: a card
  // whose header is a disclosure trigger and whose body is collapsed by default.
  // TopologyNodeCard (a provisioned resource) and TopologyBindNode (an open slot)
  // both render through it, so a node is one card shape with two bodies rather
  // than two cards that have to be kept looking alike by hand.
  //
  // Why the nodes collapse — the platform's own topology does the same: the
  // diagram divides the card's width across the chain's levels, so a node column
  // is ~230px. Open, four nodes of three fields each is a ~380px wall of
  // key/value pairs nobody asked for; closed, the chain reads as what it IS —
  // Workload → Application → Connector → Storage, each node naming itself and its
  // state — and the fields are one click away. WorkloadDetail owns which nodes
  // start open (`v-model:open`), not this component: which node matters is a
  // property of the page, not of the card. Today it opens none of them, which is
  // what lets the diagram itself arrive expanded.
  //
  // The header therefore has to IDENTIFY the node on its own, so it keeps
  // everything that was readable at a glance before the body could close: the kind
  // as the eyebrow (the node's place in the chain) with the status on that same
  // line, and the resource's own name below it. A node that is an open SLOT has no
  // name, so its header is the eyebrow line alone — which is also what makes an
  // unfilled slot legible while collapsed.
  //
  // The trigger is a real <button> spanning the whole header (`aria-expanded` +
  // `aria-controls`), so nothing interactive may live inside it — a nested button
  // or anchor is invalid and unreachable. A node's ACTIONS (open its module page,
  // unbind the slot) belong to the body, which is where the platform puts them.
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { useId } from 'vue'

  defineProps({
    // Resource kind — the eyebrow, and the node's place in the chain ("Workload",
    // "Application", "Firewall").
    kind: { type: String, required: true },
    // Azion icon class, matching the module's sidebar icon.
    icon: { type: String, default: '' },
    // The resource's own name. Empty for an open slot, which collapses the header
    // to its single eyebrow line.
    name: { type: String, default: '' },
    // Status word shown in the header ("Live", "Active", "Not bound").
    status: { type: String, required: true },
    // StatusIndicator severity for that word; the caller maps it.
    severity: { type: String, default: 'neutral' },
    // Dashed frame — the border an OPEN SLOT wears, so a position that is still
    // free reads as free without leaving the diagram.
    dashed: { type: Boolean, default: false }
  })

  // Uncontrolled by default, so a node works on its own; WorkloadDetail binds it
  // to keep the workload open and everything else closed on arrival.
  const open = defineModel('open', { type: Boolean, default: false })

  // `useId` (not a hand-rolled counter) so the trigger ↔ body association is
  // stable and unique across every node on the page.
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`
</script>

<template>
  <!-- w-full: the card takes the width its Flow level hands it, so the levels
       divide the diagram evenly instead of each node being a fixed box. -->
  <div
    :data-state="open ? 'open' : 'closed'"
    :data-dashed="dashed || null"
    class="w-full overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] data-[dashed]:border-dashed data-[dashed]:border-[var(--border-strong)]"
  >
    <!-- The connectors attach HERE rather than to the card: Flow measures an
         anchor's own box, so every arrow stays pinned to the header row instead of
         drifting to the middle of whichever node happens to be expanded. -->
    <FlowAnchor>
      <button
        :id="triggerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        class="group flex w-full items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left outline-none transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-inset motion-reduce:transition-none"
        @click="open = !open"
      >
        <span class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)]">
          <!-- Eyebrow: what this node is, and how it is doing. The status keeps
               the right edge it had when the whole card was open. -->
          <span class="flex items-center gap-[var(--spacing-xs)]">
            <i
              :class="icon"
              class="shrink-0 text-[14px] leading-none text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <span class="truncate text-label-sm text-[var(--text-muted)]">{{ kind }}</span>
            <StatusIndicator
              class="ml-auto shrink-0"
              :severity="severity"
              :label="status"
            />
          </span>
          <!-- Identity: the resource's own name, truncated rather than wrapped so
               a long name cannot change the node's height and re-route the
               diagram's connectors. Absent on an open slot. -->
          <span
            v-if="name"
            class="truncate text-label-md text-[var(--text-default)]"
          >
            {{ name }}
          </span>
        </span>
        <i
          class="pi pi-chevron-down shrink-0 text-[var(--text-muted)] transition-transform duration-150 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </FlowAnchor>

    <!-- The collapse is CSS-only: a one-row grid animated from `0fr` to `1fr`, so
         the body's own height is what it opens to and nothing has to be measured
         in JS. `inert` while closed keeps the clipped content (a bind slot's
         Dropdown, a module link) out of the tab order — `overflow-hidden` hides
         it from the eye, not from the keyboard. -->
    <div
      :id="bodyId"
      role="region"
      :aria-labelledby="triggerId"
      :inert="!open || undefined"
      :data-state="open ? 'open' : 'closed'"
      class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="overflow-hidden">
        <!-- The separator is the body's own top border, so it is clipped away with
             the body: a collapsed node shows one bottom edge, not two. -->
        <div
          class="flex flex-col gap-[var(--spacing-sm)] border-t border-[var(--border-muted)] p-[var(--spacing-md)]"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
