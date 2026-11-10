<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  defineOptions({ name: 'ProcessScroll' })

  export interface ProcessStep {
    /** The stage's name. */
    title: string
    /** What happens during the stage. */
    description: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Alignment of the section title over the card row. */
    titleKind?: SectionTitleKind
    /** The band's headline. */
    title: string
    /** The paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: SectionTitleDescriptionWidth
    /** The stages, in order; each gets its own card. */
    steps: ProcessStep[]
    /** Accessible name of the card row. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    titleKind: 'horizontal',
    description: '',
    descriptionWidth: 'narrow',
    ariaLabel: ''
  })

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
    :id="anchor || undefined"
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
          :aria-label="ariaLabel || undefined"
          tabindex="0"
          class="h-full snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
        >
          <ol
            class="m-0 grid h-full w-max list-none auto-cols-[min(22rem,80vw)] grid-flow-col grid-rows-[1fr_auto_auto] p-0 min-h-56 lg:min-h-96 lg:w-full lg:auto-cols-fr"
          >
            <li
              v-for="(step, index) in steps"
              :key="step.title"
              data-theme="dark"
              :style="TEXTURE"
              class="relative row-span-3 grid min-w-0 snap-start grid-rows-subgrid gap-y-(--spacing-sm) overflow-hidden border-(--border-default) bg-(--bg-surface) not-last:border-r p-(--spacing-xl) lg:p-(--spacing-lg)"
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
                class="relative self-start pb-(--spacing-xxl) text-big-number-lg tabular-nums text-(--text-default) lg:pb-(--spacing-lg)"
              >
                {{ stepNumber(index) }}
              </span>
              <h3 class="relative m-0 text-balance text-heading-sm text-(--text-default)">
                {{ step.title }}
              </h3>
              <p class="relative m-0 text-pretty text-body-md text-(--text-muted)">
                {{ step.description }}
              </p>
            </li>
          </ol>
        </div>
      </FrameBox>
    </div>
  </div>
</template>
