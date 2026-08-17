<script setup>
  // FirstUsePromo — the wide, quiet card that sits UNDER a module's first-use card, two
  // to a row (Figma: console.azion.com → Empty Module, node 2262:2839).
  //
  // It is the third thing a first-use screen says, and it is deliberately the softest.
  // The card above it answers "what is this and how do I make one" with a lead and three
  // gates; these two answer "or let something else start it for you" — the catalog, and
  // the agent in the reader's own editor. So they carry no button: the whole card is the
  // control, which is what lets them read as offers rather than as two more gates
  // competing with the three above.
  //
  // ── ANATOMY, FROM THE DESIGN ──
  //
  //   A LOGO CLUSTER, overlapping. Three 32px frames, each shifted 8px onto the one
  //     before it, so the group reads as a set rather than as three unrelated marks in a
  //     row. The frames are ./IconFrame.vue — the same square the gate rows above use —
  //     because a second 32px frame defined here would drift from that one. The cluster
  //     is a slot: one card's marks are font glyphs (framework logos) and the other's are
  //     SVG components (editor logos), and that difference has no business in a prop.
  //   A TITLE and ONE LINE, at the row scale (`text-heading-xxs` over `text-body-sm`), so
  //     the card is visibly quieter than the lead above and visibly the same family as
  //     the rows.
  //   A CORNER GLYPH — only when the card leaves the console. See below.
  //
  // ── ONE CONTROL, AND WHICH ELEMENT IT IS ──
  //
  // The whole card is one real control, not a div with a click handler: a link when it
  // has an `href` and a button when it acts in place. That is what gives it a focus ring,
  // Enter/Space, and — for the link — middle-click and open-in-new-tab, none of which a
  // handler on a div has. The hover surface is the card's own, so the affordance is the
  // card and not a target inside it.
  //
  // ── THE CORNER GLYPH IS NOT DECORATION ──
  //
  // It answers one question before the card is pressed: does this KEEP me here, or take me
  // somewhere? So it renders on a card that navigates — an outward `href` or an in-console
  // route (`navigates`) — and never on one that acts in place. On this screen that is the
  // difference between the catalog card (which leaves for the Marketplace) and the agent
  // card (which copies a prompt and leaves the reader exactly where they were), and it is
  // worth a glyph precisely because the two look otherwise identical.
  //
  // It stays `pi-external-link` for both kinds of leaving. The glyph is often read as
  // "leaves the site", and a route is narrower than that — but the question a reader asks
  // of a card is "am I going somewhere", and answering it with two different arrows would
  // teach a distinction (site vs. app) that costs more to learn than it pays back.
  import CardBox from '@aziontech/webkit/card-box'
  import { computed } from 'vue'

  const props = defineProps({
    /** What the card offers, in the product's own words. */
    title: { type: String, required: true },
    /** One line under it. */
    description: { type: String, default: '' },
    /** When set, the card is an outward link rather than a button. */
    href: { type: String, default: '' },
    /** For a BUTTON that routes: the card takes the reader elsewhere in the console. */
    navigates: { type: Boolean, default: false }
  })

  // An `href` always leaves; a button leaves only when it says so.
  const goesAway = computed(() => Boolean(props.href) || props.navigates)

  // Emitted only in the button case; a link needs no handler.
  defineEmits(['activate'])
</script>

<template>
  <!-- `:padded="false"` because the control inside carries the padding: a card padding
       on top of it would leave a dead inset the hover surface never reaches, and a card
       whose edge is not pressable is not "the whole card is the control". -->
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #content>
      <!-- `rounded-(--shape-card)` on the CONTROL, not just on the CardBox around it.
           The card owns the radius, but the focus ring is drawn on this element, and
           `ring-inset` follows the element's OWN corners — so with no radius here the ring
           traced a square inside a rounded card, which is the one place a focus ring must
           not look like a rendering bug. Same token the card uses, so the two can never
           disagree; the hover fill picks up the correction for free. -->
      <component
        :is="href ? 'a' : 'button'"
        :type="href ? undefined : 'button'"
        :href="href || undefined"
        :target="href ? '_blank' : undefined"
        :rel="href ? 'noreferrer' : undefined"
        class="group relative flex h-full w-full flex-col items-start gap-[var(--spacing-md)] rounded-[var(--shape-card)] p-[var(--spacing-md)] text-left transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-inset"
        @click="href ? undefined : $emit('activate')"
      >
        <!-- ── THE CLUSTER, AND ITS ONE MOVE ──
             `-ml-2` on every child after the first is the design's 8px overlap; each
             frame is opaque, so the later ones paint over the earlier in plain DOM order
             and no z-index is needed.
             ON HOVER THE STACK BREATHES: the overlap eases from 8px to 6px, so each mark
             separates by 2px and the group reads as a deck loosening rather than a static
             graphic. It is the whole personality budget for this card — one property, on
             one axis, 6px of total width. It opened by 6px per mark at first and that was
             too much: the deck came apart into four separate frames, which is a different
             object rather than the same one relaxing, and the cluster visibly grew inside
             a card whose other content held still. The card's own hover tint already
             carries the "this is pressable" message; this only has to add warmth.
             `transition-[margin-left]` names the property the utility ACTUALLY sets:
             Tailwind's `-ml-*` compiles to `margin-left`, so a transition naming
             `transform` or `margin` in the abstract animates nothing (the styling rule's
             translate/scale trap, one property over). Tokens for both duration and ease,
             and `motion-reduce:` so the frames simply sit at the hovered spacing for a
             reader who asked for no motion. -->
        <span
          class="flex items-center [&>*+*]:-ml-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ml-1.5 group-focus-visible:[&>*+*]:-ml-1.5 motion-reduce:[&>*+*]:transition-none"
          aria-hidden="true"
        >
          <slot name="logos" />
        </span>

        <span class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
          <span class="text-heading-xxs text-[var(--text-default)]">{{ title }}</span>
          <span
            v-if="description"
            class="text-pretty text-body-sm text-[var(--text-muted)]"
            >{{ description }}</span
          >
        </span>

        <!-- Pinned to the corner the design puts it in, on every card that takes the
             reader somewhere. Absolute, so it never joins the content column: it belongs
             to the CARD, and in the flow it would push the title's baseline around as the
             description wraps. Its inset is the card's own padding, so it lines up with
             the cluster's top edge and the text's right edge instead of floating near
             them.
             It brightens with the card rather than sitting at full contrast, because it
             labels the destination and is not a second thing to look at. -->
        <i
          v-if="goesAway"
          class="pi pi-external-link absolute right-[var(--spacing-md)] top-[var(--spacing-md)] text-[14px] leading-none text-[var(--text-muted)] transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:text-[var(--text-default)]"
          aria-hidden="true"
        />
      </component>
    </template>
  </CardBox>
</template>
