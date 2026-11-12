<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({ name: 'ProcessScroll', inheritAttrs: false })

  /** One stage of the process. */
  export type ProcessScrollStep = {
    /** Name of the stage. */
    title: string
    /** What happens during the stage. */
    description: string
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Alignment of the section title over the card row. */
    titleKind?: SectionTitleKind
    /** Headline of the band, rendered as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: SectionTitleDescriptionWidth
    /** The stages, in order; each is `{ title, description }` and gets its own numbered card. */
    steps?: ProcessScrollStep[]
    /** Accessible name of the scrollable card row. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    titleKind: 'horizontal',
    title: '',
    description: '',
    descriptionWidth: 'narrow',
    steps: () => [],
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-process-scroll'
  )

  const rowName = computed(() => props.ariaLabel || props.title)

  const TEXTURE = {
    '--texture-pool-a': '50% 112%',
    '--texture-pool-b': '50% -10%',
    '--texture-wave-pace': 6,
    '--texture-wave-gain': 1.4
  }

  const stepNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <div
    v-if="title && steps.length"
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="flex flex-col"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          :kind="titleKind"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
          :description-width="descriptionWidth"
        />
      </template>
    </SectionModule>

    <div class="grid flex-1 grid-cols-1">
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          role="region"
          :aria-label="rowName"
          tabindex="0"
          class="h-full snap-x snap-mandatory overflow-x-auto scrollbar-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) [&::-webkit-scrollbar]:hidden"
        >
          <ol
            class="m-0 grid h-full min-h-56 w-max list-none auto-cols-[min(22rem,80vw)] grid-flow-col grid-rows-[1fr_auto_auto] p-0 lg:min-h-96 lg:w-full lg:auto-cols-fr"
          >
            <li
              v-for="(step, index) in steps"
              :key="step.title"
              data-theme="dark"
              :style="TEXTURE"
              class="relative row-span-3 grid min-w-0 snap-start grid-rows-subgrid gap-y-(--spacing-sm) overflow-hidden border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) not-last:border-e lg:p-(--spacing-lg)"
            >
              <TextureMaterial
                kind="pixelate"
                size="small"
              />
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_top,var(--bg-surface)_0%,color-mix(in_srgb,var(--bg-surface)_92%,transparent)_34%,transparent_62%)]"
              />
              <span
                aria-hidden="true"
                class="relative self-start pb-(--spacing-xxl) text-big-number-lg text-(--text-default) tabular-nums lg:pb-(--spacing-lg)"
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
      </FrameBox>
    </div>
  </div>
</template>
