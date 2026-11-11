<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '@aziontech/webkit/section-title'

  defineOptions({ name: 'StepsList' })

  export interface StepsListItem {
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
    /** Alignment of the section title over the list. */
    titleKind?: SectionTitleKind
    /** The band's headline. */
    title: string
    /** The paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: SectionTitleDescriptionWidth
    /** The stages, in order; each is one numbered row of the list. */
    steps: StepsListItem[]
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    titleKind: 'centered',
    description: '',
    descriptionWidth: 'narrow',
    ariaLabel: ''
  })

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
      <div class="bg-(--bg-canvas)">
        <ol
          :aria-label="ariaLabel || undefined"
          class="m-0 grid w-full list-none grid-cols-[auto_1fr] gap-x-(--spacing-xl) p-0 divide-y divide-(--border-default)"
        >
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            class="col-span-2 grid grid-cols-subgrid p-(--spacing-xl) lg:px-(--spacing-lg) lg:py-(--spacing-lg)"
          >
            <span
              aria-hidden="true"
              class="text-heading-xs tabular-nums text-(--primary) lg:text-heading-sm"
            >
              {{ stepNumber(index) }}
            </span>
            <div class="flex flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-balance text-heading-xs text-(--text-default) lg:text-heading-sm">
                {{ step.title }}
              </h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                {{ step.description }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </FrameBox>
  </SectionModule>
</template>
