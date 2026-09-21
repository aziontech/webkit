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
  // A COLLAPSED NODE STILL ANSWERS THE TWO QUESTIONS THE DIAGRAM IS READ FOR, so
  // only the node's FIELDS sit behind the disclosure. Above it are two rows that
  // never collapse: the header, which is the kind (the node's place in the chain)
  // with its status on the same line, and the identity row under it, which names
  // the resource and carries whatever can be done to it.
  //
  // The trigger is a real <button> spanning the whole header (`aria-expanded` +
  // `aria-controls`), so nothing interactive may live inside it — a nested button
  // or anchor is invalid and unreachable. That is why the name (a link out to the
  // resource) and the controls are a row of their own rather than part of it.
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import Tag from '@aziontech/webkit/tag'
  import { computed, useId } from 'vue'

  const props = defineProps({
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
    // Severity for that word; the caller maps it. Stays the indicator vocabulary
    // (success / info / warning / danger / neutral) that TopologyNodeCard and
    // TopologyBindNode already speak — `tagSeverity` below translates it, so
    // switching the header's rendering never rippled out to the callers.
    severity: { type: String, default: 'neutral' },
    // Dashed frame — the border an OPEN SLOT wears, so a position that is still
    // free reads as free without leaving the diagram.
    dashed: { type: Boolean, default: false }
  })

  // Uncontrolled by default, so a node works on its own; WorkloadDetail binds it
  // to keep the workload open and everything else closed on arrival.
  const open = defineModel('open', { type: Boolean, default: false })

  // The header renders status as a Tag. Tag and StatusIndicator already share the
  // success / info / warning / danger vocabulary, so only `neutral` needs a word:
  // Tag spells that `secondary` (bordered, canvas surface), the same neutral the
  // workloads list gives a non-Live status.
  const tagSeverity = computed(() => (props.severity === 'neutral' ? 'secondary' : props.severity))

  // `useId` (not a hand-rolled counter) so the trigger ↔ body association is
  // stable and unique across every node on the page.
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`
</script>

<template>
  <!-- w-full: the card takes the width its Flow level hands it, so the levels
       divide the diagram evenly instead of each node being a fixed box.

       NO `overflow-hidden` here, deliberately. Flow's connector ports are absolutely
       positioned OUTSIDE the FlowAnchor's box (that is what makes a line terminate on
       a port instead of a bare edge), and the anchor lives inside this card — so
       clipping this card renders every port invisible. The header button carries its
       own rounding instead, which is the only thing the clip was buying: a hover
       background that stays inside the card's corners. The collapsing body still has
       its own `overflow-hidden` further down.

       Hover and focus both raise the border to `--border-strong`, and both live HERE
       rather than on the trigger, because the border being lit is a property of the
       NODE — hovering its body should light it up the same as hovering its header.
       Focus comes in through `has-[:focus-visible]` since the focusable element is the
       trigger nested inside: `:focus-visible` (not `focus-within`) so a click that
       moves focus does not leave the border lit behind the pointer. The trigger keeps
       its own inset ring — that is the a11y indicator; this is the state. -->
  <div
    :data-state="open ? 'open' : 'closed'"
    :data-dashed="dashed || null"
    class="w-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-dashed:border-dashed"
  >
    <!-- The connectors attach HERE rather than to the card: Flow measures an
         anchor's own box, so every connector stays pinned to the header row instead
         of drifting to the middle of whichever node happens to be expanded.

         Every node gets one, bound or not: a binding slot still receives the default
         Workload relationship, so it needs an attachment point. Whether it ORIGINATES
         a connector is Flow's `terminal` prop, set by the page. -->
    <FlowAnchor>
      <button
        :id="triggerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        class="group flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs) text-left outline-none transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
        @click="open = !open"
      >
        <i
          :class="icon"
          class="shrink-0 text-[12px] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-label-sm text-(--text-muted)">{{ kind }}</span>
        <Tag
          class="ml-auto shrink-0"
          :severity="tagSeverity"
          :label="status"
          size="small"
        />
        <i
          class="pi pi-chevron-down shrink-0 text-(--text-muted) transition-transform duration-150 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </FlowAnchor>

    <!-- IDENTITY ROW — what this node holds and what can be done to it, outside the
         disclosure. It stays visible while the node is collapsed because those are the
         two things a reader looks for on a diagram: which resource is in this position,
         and how to change it. Keeping it out of the trigger is also what makes the
         controls legal markup: the header is one full-width button, and a link or a
         button nested inside it is invalid and unreachable by keyboard.

         `identity` falls back to the plain name, truncated rather than wrapped so a long
         one cannot change the node's height and re-route the diagram's connectors; an
         open slot has none and renders the em dash. -->
    <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
      <slot name="identity">
        <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ name || '—' }}</span>
      </slot>
      <div
        v-if="$slots.actions"
        class="ml-auto flex shrink-0 items-center"
      >
        <slot name="actions" />
      </div>
    </div>

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
          class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
