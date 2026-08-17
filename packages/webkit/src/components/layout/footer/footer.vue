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
    <div class="flex w-full items-stretch">
      <FrameBox
        :borders="['left']"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 xl:block"
      />
      <div
        class="grid w-full max-w-(--container-5xl) shrink-0 grid-cols-1 border-x border-x-(length:--border-width-default) border-x-(--border-default) md:grid-cols-2"
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
        :borders="['right']"
        marks="all"
        aria-hidden="true"
        :data-testid="`${testId}__gutter`"
        class="hidden flex-1 xl:block"
      />
    </div>

    <FrameBox
      borders="all"
      marks="bottom"
      aria-hidden="true"
      :data-testid="`${testId}__closing`"
      class="h-[calc(var(--spacing-xxl)*2)] w-full"
    />
  </footer>
</template>
