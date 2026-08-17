<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import FrameBox from '../frame-box/frame-box.vue'
  import { FooterInjectionKey } from './injection-key'

  defineOptions({
    name: 'Footer',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the contentinfo landmark. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Footer'
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
    class="flex w-full flex-col bg-(--bg-canvas)"
  >
    <!-- The measure and its two gutters are one row, so a gutter is what the leftover width
         BECOMES rather than something the page has to size: each is `flex-1` against a measure
         that does not shrink. They appear at `xl` rather than with the rest of the desktop
         presentation because that is the first breakpoint past the measure itself (1192px):
         gated any earlier they would resolve to zero width and still paint their corner marks
         on the measure's own edges. They hold no content — the hatch is page material, so they
         stay out of the a11y tree. -->
    <div class="flex w-full items-stretch">
      <FrameBox
        hatch
        borders="none"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 xl:block"
      />

      <!-- ONE grid holds all four bands, which is what keeps each of them a single element in a
           single place in the DOM while their vertical order changes. Stacked, `order-*` reads
           links → status → signature → social, the order the Mobile variant fixes. From `md`,
           explicit row/column placement puts the social icons and the status cluster side by
           side in one row and spans the other two bands across both columns — the row fits at
           768px because the brand no longer sits in it. The alternative —
           a wrapper row that only exists on desktop — would mean two copies of the markup, so
           two copies of the consumer's slot content. -->
      <div
        class="grid w-full max-w-(--container-5xl) shrink-0 grid-cols-1 border-x border-x-(length:--border-width-default) border-x-(--border-default) md:grid-cols-2"
      >
        <div
          :data-testid="`${testId}__columns`"
          class="order-1 grid w-full grid-cols-2 gap-y-(--spacing-lg) md:grid-cols-4 md:gap-y-0 md:col-span-2 md:row-start-1"
        >
          <slot />
        </div>

        <!-- Status and language swap places between the two variants — the phone leads with the
             language select, the desktop row ends with it — so they are two slots the row
             reverses, not one cluster the consumer orders. -->
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
          borders="all"
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
            <p class="text-heading-xl text-(--text-default) md:text-right">
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
        hatch
        borders="none"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 xl:block"
      />
    </div>

    <!-- The closing band is the page's own material below the last rule: full-bleed, so it is a
         sibling of the gutter row rather than inside it, and it keeps only the bottom pair of
         marks because the band above already draws the edge the top pair would sit on. -->
    <FrameBox
      hatch
      borders="top"
      marks="bottom"
      aria-hidden="true"
      :data-testid="`${testId}__closing`"
      class="h-[calc(var(--spacing-xxl)*2)] w-full"
    />
  </footer>
</template>
