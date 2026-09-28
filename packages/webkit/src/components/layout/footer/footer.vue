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
    <!-- Two placements, identical bands: `content` (default) runs them full bleed with no inset
         of its own (every band already carries the boundary value); `site` caps them at the
         site measure token, insets by the page boundary below it, and draws the frame. The
         frame is site-only: full bleed, the rules would land on the zone's edges and the
         gutters collapse to zero width while still painting borders. -->
    <div class="flex w-full items-stretch justify-center">
      <!-- Centred because between the measure (1388) and the gutter breakpoint (1536) the row
           holds one capped child, which an unjustified flex row left-aligns by up to 148px. -->
      <!-- The gutters turn on at the first breakpoint past the measure: below it the column is
           the whole row, a gutter has no slack, and its border and marks paint on the column's
           own edge. Move the breakpoint with the measure. -->
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
            <!-- The gap only matters between md and the width that fits the tagline on one line,
                 where a wrapped tagline would otherwise run into the brand. -->
            <!-- Rendered only when filled: an empty paragraph is still a flex item and spends the
                 row's gap, pushing a lone brand off centre (measured 12px at 768 to 1023). -->
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
