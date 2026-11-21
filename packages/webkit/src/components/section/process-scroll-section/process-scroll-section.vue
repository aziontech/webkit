<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { usePinnedRow } from '../../../composables/use-pinned-row'
  import Texture from '../../content/texture/texture.vue'
  import Module from '../../layout/module/module.vue'
  import type {
    ModuleHeaderAlign,
    ModuleHeaderDescriptionWidth
  } from '../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'ProcessScrollSection', inheritAttrs: false })

  /** One stage of the process. */
  export type ProcessScrollSectionStep = {
    /** Name of the stage. */
    title: string
    /** What happens during the stage. */
    description: string
  }

  export interface ProcessScrollSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Eyebrow above the title. */
    eyebrow?: string
    /** Alignment of the section title over the card row. */
    titleAlign?: ModuleHeaderAlign
    /** Headline of the band, rendered as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: ModuleHeaderDescriptionWidth
    /** The stages, in order; each is `{ title, description }` and gets its own numbered card. */
    steps?: ProcessScrollSectionStep[]
    /** Accessible name of the scrollable card row. */
    ariaLabel?: string
    /**
     * From the large breakpoint, pins the band under the site header while the page scrolls and
     * slides the card row sideways until its last card is in view; below it, or under reduced
     * motion, the row scrolls sideways on its own.
     */
    pinned?: boolean
    /** Height of the sticky site header a pinned band sticks under; defaults to the SiteHeaderSection bar's token, any CSS length. */
    headerOffset?: string
  }

  const props = withDefaults(defineProps<ProcessScrollSectionProps>(), {
    anchor: '',
    eyebrow: '',
    titleAlign: 'split',
    title: '',
    description: '',
    descriptionWidth: 'narrow',
    steps: () => [],
    ariaLabel: '',
    pinned: false,
    headerOffset: 'var(--layout-header-height)'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'process-scroll-section'
  )

  const rowName = computed(() => props.ariaLabel || props.title)

  const runwayEl = ref<HTMLElement | null>(null)
  const bandEl = ref<HTMLElement | null>(null)
  const viewportEl = ref<HTMLElement | null>(null)
  const trackEl = ref<HTMLElement | null>(null)

  const { runwayHeight, shift } = usePinnedRow(
    { runway: runwayEl, pinned: bandEl, viewport: viewportEl, track: trackEl },
    () => props.pinned
  )

  const TEXTURE = {
    '--texture-pool-a': '50% 112%',
    '--texture-pool-b': '50% -10%',
    '--texture-wave-pace': 6,
    '--texture-wave-gain': 1.4
  }

  const stepNumber = (index: number) => String(index + 1).padStart(2, '0')

  const BAND_CLASS =
    'flex flex-col lg:motion-safe:group-data-[pinned]/process:sticky lg:motion-safe:group-data-[pinned]/process:top-(--process-scroll-section-offset) ' +
    'lg:motion-safe:group-data-[pinned]/process:h-[calc(100dvh-var(--process-scroll-section-offset))]'

  const VIEWPORT_CLASS =
    'h-full snap-x snap-mandatory overflow-x-auto scrollbar-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
    'lg:motion-safe:group-data-[pinned]/process:snap-none lg:motion-safe:group-data-[pinned]/process:overflow-hidden [&::-webkit-scrollbar]:hidden'

  const TRACK_CLASS =
    'm-0 grid h-full min-h-56 w-max list-none auto-cols-[min(22rem,80vw)] grid-flow-col grid-rows-[1fr_auto_auto] p-0 ' +
    'lg:min-h-96 lg:w-full lg:auto-cols-fr lg:group-data-[pinned]/process:w-max lg:group-data-[pinned]/process:auto-cols-[26rem]'

  const STEP_CLASS =
    'relative row-span-3 grid min-w-0 snap-start grid-rows-subgrid gap-y-(--spacing-sm) overflow-hidden border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) ' +
    'not-last:border-e lg:p-(--spacing-lg)'
</script>

<template>
  <div
    v-if="title && steps.length"
    v-bind="$attrs"
    :id="anchor || undefined"
    ref="runwayEl"
    :data-testid="testId"
    :data-pinned="pinned || null"
    :style="{ height: runwayHeight || undefined, '--process-scroll-section-offset': headerOffset }"
    class="scroll-mt-(--spacing-2xl) group/process"
  >
    <div
      ref="bandEl"
      :class="BAND_CLASS"
    >
      <Module
        :divided="false"
        :padded="false"
      >
        <template #header>
          <ModuleHeader
            :align="titleAlign"
            :eyebrow="eyebrow"
            :title="title"
            :description="description"
            :description-width="descriptionWidth"
          />
        </template>
      </Module>

      <div class="grid flex-1 grid-cols-1">
        <RegistrationFrame
          flush
          borders="y"
          marks="bottom"
        >
          <div
            ref="viewportEl"
            role="region"
            :aria-label="rowName"
            tabindex="0"
            :class="VIEWPORT_CLASS"
          >
            <ol
              ref="trackEl"
              :style="{ translate: shift }"
              :class="TRACK_CLASS"
            >
              <li
                v-for="(step, index) in steps"
                :key="step.title"
                data-theme="dark"
                :style="TEXTURE"
                :class="STEP_CLASS"
              >
                <Texture
                  variant="pixelate"
                  size="small"
                />
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_top,var(--bg-surface)_0%,color-mix(in_srgb,var(--bg-surface)_92%,transparent)_34%,transparent_62%)]"
                />
                <span
                  aria-hidden="true"
                  class="relative self-start pb-(--spacing-2xl) text-big-number-lg text-(--text-default) tabular-nums lg:pb-(--spacing-lg)"
                >
                  {{ stepNumber(index) }}
                </span>
                <h3 class="relative m-0 text-heading-sm text-balance text-(--text-default)">
                  {{ step.title }}
                </h3>
                <p class="relative m-0 text-body-md text-pretty text-(--text-muted)">
                  {{ step.description }}
                </p>
              </li>
            </ol>
          </div>
        </RegistrationFrame>
      </div>
    </div>
  </div>
</template>
