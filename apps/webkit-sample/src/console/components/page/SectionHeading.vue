<script setup>
  // Reusable SECTION heading — one level below PageHeading. A page carries a
  // single PageHeading (the <h1> that names the page); each band inside it opens
  // with a SectionHeading (an <h2>) that titles the flush CardBox below it, with
  // an optional `actions` slot for that band's own controls on the right.
  //
  // Two in-product documentation affordances sit on the header row, both opt-in:
  //
  //   `anchor`        — a transparent copy button after the title that copies a
  //     DEEP LINK to this section (…/applications/1?tab=build#build-configuration),
  //     so a section can be pointed at in a ticket, a chat message, or a runbook.
  //     It is the section's anchor point: the heading takes the derived id, and
  //     router.js's scrollBehavior brings that id into view when the URL is opened.
  //     Revealed on hover / keyboard focus rather than always painted, because ~60
  //     section titles each carrying a permanent glyph is noise; it stays reachable
  //     by Tab either way (opacity, not `hidden`).
  //
  //   `documentation` — a URL rendered as a TEXT link on the right, so the docs for
  //     a band live NEXT TO the band instead of only at page level. Text, not a
  //     control: it takes the link colour tokens (`--text-link`, and
  //     `--text-link-hover` on hover) with an underline and a trailing
  //     external-link glyph, and draws no box — beside a 14px heading a button-sized
  //     affordance reads as an action rather than as a reference. It is a real <a>
  //     with rel="noopener noreferrer", so middle-click and "copy link address"
  //     behave like any other link.
  //
  // Both are off unless asked for, so a section inside a Drawer — where a deep link
  // means nothing, since the panel is transient — simply doesn't opt in.
  //
  // This replaces the hand-written paragraph the console repeated ~90 times:
  //   <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">General</p>
  // The `px-[var(--spacing-xs)]` inset is baked in and is optical, not structural:
  // the CardBox below is flush (`:padded="false"`), so its own rows carry inner
  // padding — the bare title needs the same nudge to line up with the text inside
  // the card rather than with the card's border. The inset sits on the whole
  // header so a trailing action stays symmetric with the title.
  //
  // The `bottom` slot is the band's own message region: a Message that belongs to
  // THIS section (a field-scoped server rejection, a scoped warning) renders
  // between the title and the flush CardBox below, so the section that needs
  // attention carries the notice itself. It is opt-in — the region is not rendered
  // at all unless the slot is passed, so every existing SectionHeading is unchanged.
  // Unlike the header row, the region is NOT inset: a Message is a full-width banner
  // that must align with the flush CardBox beneath it, not with the title text.
  //
  // It animates its HEIGHT so appearing/disappearing content never jumps the page.
  // `height: auto` is not animatable, so the region is a one-row grid transitioning
  // `grid-template-rows` between `0fr` and `1fr` — the standard CSS-only collapse:
  // no JS measurement, no component-local keyframes. The `has-[>div>div>*]` variant
  // is what drives it — when the consumer's `v-if` is false Vue leaves a comment
  // node in the innermost wrapper, so `> div > div > *` matches no element and the
  // row stays `0fr`. Two gotchas this shape works around:
  //   - `transition-[grid-template-rows,padding-top]` does NOT compile (Tailwind's
  //     class extractor drops the comma), so exactly ONE property is transitioned.
  //   - the 12px gap to the title therefore sits in a third wrapper INSIDE the
  //     clipped cell, where it collapses with the height. On the cell itself it
  //     would survive at 12px, because `box-sizing: border-box` cannot shrink
  //     padding below its own size when the row forces the height to 0.
  import CopyButton from '@aziontech/webkit/copy-button'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps({
    // The section title. Omitted only when a band is titled by something else
    // (a card header) and this is used purely for its `actions` row.
    title: { type: String, default: '' },
    // Optional supporting line under the title.
    description: { type: String, default: '' },
    // When true, the section becomes linkable: the <h2> takes a stable id and a
    // transparent copy button after the title copies the deep link to it. Opt-in,
    // because an id only earns its keep on a section that persists at a URL — and
    // because two ids must never collide on one page (see `anchorId`).
    anchor: { type: Boolean, default: false },
    // Documentation URL for THIS band. When set, a text Button linking to it
    // renders on the right, before anything in the `actions` slot.
    documentation: { type: String, default: '' },
    // Label for that link — override when a generic "Documentation" is vaguer than
    // the page deserves ("Rules Engine reference").
    documentationLabel: { type: String, default: 'Documentation' },
    // Title scale, matching the levels the console actually uses:
    // 'medium' — the standard section title over a flush CardBox (General,
    //   Modules, Build configuration). The default.
    // 'small'  — a sub-group label INSIDE a band that a 'medium' heading already
    //   titles (Subscription modules under Modules). Muted, so the nesting reads
    //   as subordinate rather than as a second section.
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium'].includes(value)
    },
    // Optional id on the <h2>, so a form/fieldset can wire aria-labelledby to it.
    titleId: { type: String, default: undefined }
  })

  const route = useRoute()

  // The heading's id. An explicit `titleId` always wins; otherwise it is derived
  // from the title only when `anchor` is on. Derivation is deliberately NOT
  // unconditional: the same title recurs across the app ("General" titles a band on
  // Main Settings and a section inside three create drawers), and two elements
  // sharing an id is invalid HTML that also breaks any aria-labelledby pointing at
  // it. Opting in per section is what keeps each id unique on its own page.
  const anchorId = computed(() => {
    if (props.titleId) return props.titleId
    if (!props.anchor) return undefined
    return props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  })

  // The full, shareable URL of this section. Built from the router's `fullPath`
  // rather than read off `window.location` once, because these views are held by
  // <KeepAlive>: a heading mounted under `?tab=build` stays alive while the user
  // moves to another tab, so a value captured at setup would keep copying the URL
  // of whichever tab happened to be open first. Any existing hash is dropped so
  // copying twice can't produce `#a#b`. Lazily evaluated — a section that never
  // opts into `anchor` never renders the button, so this never runs.
  const anchorUrl = computed(
    () => `${globalThis.location?.origin ?? ''}${route.fullPath.split('#')[0]}#${anchorId.value}`
  )
</script>

<template>
  <header class="group/heading flex flex-col">
    <!-- The header row keeps the optical inset; the bottom region does not. -->
    <div class="flex items-start justify-between gap-[var(--spacing-md)] px-[var(--spacing-xs)]">
      <div
        v-if="title || description"
        class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]"
      >
        <!-- Title + its anchor share a row, so the copy button reads as belonging
             to the heading rather than to the band's actions. `scroll-mt-*` keeps
             the title clear of the sticky tab bar when the deep link lands here —
             without it the heading stops flush against the bar and the section it
             names looks like it starts above the fold. -->
        <div class="flex min-w-0 items-center gap-[var(--spacing-xxs)]">
          <!-- `size` drives TYPOGRAPHY only; the colour is the same muted token at
               every level. A section title is a label for the band below it, not a
               signal about it — a destructive band is marked by its own controls
               (a `kind="danger"` Button), not by recolouring the heading that
               names it. -->
          <h2
            v-if="title"
            :id="anchorId"
            :data-size="size"
            class="scroll-mt-[var(--spacing-xl)] text-balance text-[var(--text-muted)] data-[size=medium]:text-heading-xxs data-[size=small]:text-label-md"
          >
            {{ title }}
          </h2>
          <!-- The reveal classes live on this wrapper, not on CopyButton: that
               component sets `inheritAttrs: false` and never spreads `$attrs`, so a
               `class` passed to it is dropped on the floor. -->
          <span
            v-if="anchor"
            class="shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
          >
            <CopyButton
              :value="anchorUrl"
              kind="transparent"
              size="small"
              :aria-label="`Copy link to the ${title} section`"
              copied-label="Link copied"
            />
          </span>
        </div>
        <p
          v-if="description"
          class="text-pretty text-body-sm text-[var(--text-muted)]"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="documentation || $slots.actions"
        class="flex shrink-0 items-center gap-[var(--spacing-xs)]"
      >
        <!-- Docs first, so a band's primary control keeps the outer edge.
             Rendered as TEXT, not as a control: at section level the affordance
             should read like a link in prose, so it takes the link colour tokens
             (`--text-link`, and `--text-link-hover` on hover) with an underline
             and a trailing external-link glyph — and no box. webkit's `Link`
             component is the same idea one size up, but it forces a 28px-tall row
             with a ghost hover fill and never uses the hover token, so beside a
             14px heading it reads as a button. It has no inline/text variant to
             ask for, so this stays a plain anchor until it does. -->
        <a
          v-if="documentation"
          :href="documentation"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex shrink-0 items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-button)] text-label-sm text-[var(--text-link)] underline-offset-2 transition-colors duration-150 ease-out hover:text-[var(--text-link-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
        >
          {{ documentationLabel }}
          <i
            class="pi pi-external-link shrink-0 text-[0.9em] leading-none"
            aria-hidden="true"
          />
        </a>
        <slot name="actions" />
      </div>
    </div>

    <!-- Message region. Collapsed to a zero-height row until the slot actually
         renders an element, then it grows to content height, so nothing below it
         ever jumps. -->
    <div
      v-if="$slots.bottom"
      class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="min-w-0 overflow-hidden">
        <!-- The gap to the title lives INSIDE the clipped cell, so it collapses
             with the height instead of leaving 12px behind. -->
        <div class="pt-[var(--spacing-sm)]">
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </header>
</template>
