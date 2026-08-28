<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import FrameBox from '../frame-box/frame-box.vue'
  import { FooterInjectionKey } from './injection-key'

  defineOptions({
    name: 'Footer',
    inheritAttrs: false
  })

  /** Where the footer sits. */
  export type FooterKind = 'content' | 'site'

  interface Props {
    /** Accessible name for the contentinfo landmark. */
    ariaLabel?: string
    /** Where the footer sits: `content` is the default — the bands run full bleed across whatever zone holds the footer, opening on the page boundary; `site` closes a framed marketing page instead, capping the bands at the site measure and drawing the frame that page carries: the side rules, the hatched gutters and the closing band. */
    kind?: FooterKind
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Footer',
    kind: 'content'
  })

  const slots = defineSlots<{
    /** The Footer.Column items; laid out as a 2-column grid that becomes 4 columns at md. */
    default(): unknown
    /** The social icon buttons. */
    social(): unknown
    /** The system status indicator. */
    status(): unknown
    /** The language select. */
    language(): unknown
    /** The brand lockup of the signature band. */
    brand(): unknown
    /** The one-line tagline beside the brand. */
    tagline(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-footer')

  // Each band renders only when the consumer fills it, so a footer with links alone carries no
  // empty framed rows.
  const hasStatusBar = computed(() => Boolean(slots.status || slots.language))

  const hasSignature = computed(() => Boolean(slots.brand || slots.tagline))

  provide(FooterInjectionKey, {
    testId: testId.value
  })
</script>

<template>
  <footer
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-kind="kind"
    class="group flex w-full flex-col bg-(--bg-canvas)"
  >
    <!-- Two placements, the same two `GlobalHeader` has, and the bands are identical in
         both — what changes is whether they are capped and framed.

         `content` (the DEFAULT) runs them FULL BLEED across whatever zone holds the footer,
         and it needs no inset of its own to line up: every band already carries
         `--spacing-lg` inside it, which is the value `--layout-boundary-inline` resolves to,
         so the first column title opens on the page boundary by construction. Add a padding
         here and it would open at twice it.

         `site` closes a framed marketing page: the bands take `layout-column-site` — the
         page's shared measure as a CAP, and, once the window is narrower than it, the page
         boundary as an INSET — and the frame is drawn around them. The inset is what keeps
         this footer's side rules on the same vertical as the sections above it: capped
         alone, the rules land on the window's own edges below the measure, where a hairline
         reads as a seam against the bezel rather than as the page's frame. That measure is a token
         rather than a rung of the container ladder because the hero band, the framed
         sections and this footer are ONE vertical frame whose side rules only meet while
         all three resolve to the same width — retuning it has to move them together, which
         a hardcoded rung here cannot do. The top BAR is the one band deliberately outside
         that frame (--layout-measure-site-header, one rung wider — see GlobalHeader
         `kind="site"`), which is exactly why the frame's measure is a token of its own and
         not "whatever the header uses".

         THE FRAME APPARATUS IS `site`-ONLY, and not as a matter of taste. On a full-bleed
         footer the side rules land on the zone's own edges, where a hairline reads as a seam
         against the bezel rather than as a frame; and the `flex-1` gutters, having no slack
         to grow into, collapse to zero width while still painting their borders and corner
         marks — onto the bands' own edges. -->
    <!-- `justify-center` is what keeps the capped frame under the page's own. The gutters
         normally consume the slack symmetrically, but between the measure (1388) and the
         breakpoint that turns them on (1536) the row holds ONE child, and a capped child in
         a flex row with no justification is LEFT-aligned — the footer's frame sitting up to
         148px left of the centred frame it is supposed to close. With it, the footer's column
         lands on the page column's own vertical at every width: 26 at 1440, 74 at 1536, 266
         at 1920, 586 at 2560 — the same numbers `mx-auto` inside the page boundary gives. -->
    <div class="flex w-full items-stretch justify-center">
      <!-- `2xl` (1536) is the first breakpoint PAST the measure (1388), which is the only
           gate that works: below it the column is the whole row, so a gutter has no slack,
           resolves to zero width, and paints its border and corner marks on the column's own
           edge — two hairlines at one pixel. The gate has to move with the measure; it was
           `xl` while the measure was 1192. -->
      <FrameBox
        v-if="kind === 'site'"
        key="gutter-start"
        :borders="['left']"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 2xl:block"
      />
      <div
        class="grid w-full shrink-0 grid-cols-1 group-data-[kind=site]:layout-column-site group-data-[kind=site]:border-x group-data-[kind=site]:border-x-(length:--border-width-default) group-data-[kind=site]:border-x-(--border-default) md:grid-cols-2"
      >
        <div
          :data-testid="`${testId}__columns`"
          class="order-1 grid w-full grid-cols-2 gap-y-(--spacing-lg) md:grid-cols-4 md:gap-y-0 md:col-span-2 md:row-start-1"
        >
          <slot />
        </div>

        <div
          v-if="hasStatusBar"
          :data-testid="`${testId}__status`"
          class="order-2 flex min-w-0 flex-row-reverse items-center justify-between gap-(--spacing-lg) border-0 border-t border-t-(length:--border-width-default) border-t-(--border-default) px-(--spacing-lg) py-(--spacing-md) md:order-none md:col-start-2 md:row-start-2 md:min-h-14 md:flex-row md:justify-end md:py-0"
        >
          <slot name="status" />
          <slot name="language" />
        </div>

        <FrameBox
          v-if="hasSignature"
          borders="top"
          marks="all"
          flush="x"
          :data-testid="`${testId}__signature`"
          class="order-3 w-full px-(--spacing-sm) py-(--spacing-xl) md:order-none md:col-span-2 md:row-start-3"
        >
          <div
            class="flex flex-col items-start gap-(--spacing-md) p-(--spacing-lg) md:flex-row md:items-center md:justify-between md:gap-(--spacing-lg)"
          >
            <slot name="brand" />
            <!-- The gap earns its place only between `md` and the width that fits the tagline on
                 one line: there `justify-between` alone would let a wrapped second line run into
                 the brand. Past that width the tagline is one line pinned to the right edge and
                 the gap is slack that never resolves, so it costs the wide layout nothing. -->
            <!-- `v-if`, like every other band: the paragraph exists only when the consumer
                 fills it. Rendered unconditionally it was an empty heading-sized `<p>` in the
                 DOM of every brand-only footer, and — because it is still a flex ITEM — it
                 spent the row's `gap` too, pushing a lone brand off the band's centre by half
                 of it (measured 12px at 768–1023). A band with one thing in it should place
                 that thing as if it were alone, because it is. -->
            <p
              v-if="slots.tagline"
              class="text-heading-xl text-(--text-default) md:text-right"
            >
              <slot name="tagline" />
            </p>
          </div>
        </FrameBox>

        <div
          v-if="slots.social"
          :data-testid="`${testId}__social`"
          class="order-4 flex min-w-0 flex-wrap items-center justify-center gap-(--spacing-xxs) border-0 border-t border-t-(length:--border-width-default) border-t-(--border-default) px-(--spacing-lg) py-(--spacing-md) md:order-none md:col-start-1 md:row-start-2 md:min-h-14 md:justify-start md:py-0"
        >
          <slot name="social" />
        </div>
      </div>

      <FrameBox
        v-if="kind === 'site'"
        key="gutter-end"
        :borders="['right']"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 2xl:block"
      />
    </div>

    <!-- The frame's bottom edge, so it belongs to `site` with the gutters: it is hatched
         page material finishing a frame, and a footer that draws no frame has none to
         finish. -->
    <FrameBox
      v-if="kind === 'site'"
      borders="all"
      marks="bottom"
      aria-hidden="true"
      :data-testid="`${testId}__closing`"
      class="h-[calc(var(--spacing-xxl)*2)] w-full"
    />
  </footer>
</template>
