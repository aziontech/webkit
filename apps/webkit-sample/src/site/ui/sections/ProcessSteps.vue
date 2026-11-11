<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import type { CardGridColumns } from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '@aziontech/webkit/section-title'
  import { computed } from 'vue'

  defineOptions({ name: 'ProcessSteps' })

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
    /** Alignment of the section title over the card grid. */
    titleKind?: SectionTitleKind
    /** The band's headline. */
    title: string
    /** The paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: SectionTitleDescriptionWidth
    /** The stages, in order; each gets its own card, all in one row at the large breakpoint. */
    steps: ProcessStep[]
    /** Accessible name of the card grid. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    titleKind: 'centered',
    description: '',
    descriptionWidth: 'narrow',
    ariaLabel: ''
  })

  const columns = computed(
    () => Math.min(5, Math.max(2, props.steps.length)) as CardGridColumns
  )

  const stepNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
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

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        flush
        kind="frame"
        :columns="columns"
        role="list"
        :aria-label="ariaLabel || undefined"
      >
        <CardGridCell
          v-for="(step, index) in steps"
          :key="step.title"
          kind="canvas"
          :padded="false"
          role="listitem"
        >
          <div
            :data-columns="columns"
            class="flex h-full flex-col items-start gap-(--spacing-md) p-(--spacing-xl) lg:p-(--spacing-lg)"
          >
            <Overline
              prefix="//"
              aria-hidden="true"
            >
              {{ stepNumber(index) }}
            </Overline>
            <div class="flex flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-balance text-heading-sm text-(--text-default) in-data-[columns=5]:lg:max-[90rem]:min-h-[2lh]">
                {{ step.title }}
              </h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                {{ step.description }}
              </p>
            </div>
          </div>
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
