<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '@aziontech/webkit/section-title'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type { Component } from 'vue'

  defineOptions({ name: 'StepsList' })

  export interface StepsListScene {
    /** The scene component the page supplies. */
    component: Component
    /** Props forwarded to the scene. */
    props?: Record<string, unknown>
  }

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
    /** Scene set in the right half, beside the list; without it the list runs full width. */
    scene?: StepsListScene | null
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    titleKind: 'centered',
    description: '',
    descriptionWidth: 'narrow',
    scene: null,
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
      <div class="grid gap-px bg-(--border-default) lg:grid-cols-2">
        <div class="min-w-0 bg-(--bg-canvas)">
          <ol
            :aria-label="ariaLabel || undefined"
            class="m-0 grid w-full list-none grid-cols-[auto_1fr] gap-x-(--spacing-xl) p-0 divide-y divide-(--border-default)"
          >
            <li
              v-for="(step, index) in steps"
              :key="step.title"
              class="col-span-2 grid grid-cols-subgrid items-start p-(--spacing-xl) lg:px-(--spacing-lg) lg:py-(--spacing-lg)"
            >
              <span
                aria-hidden="true"
                class="text-big-number-md tabular-nums text-(--text-muted)"
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
        <div
          v-if="scene"
          class="flex min-w-0 bg-(--bg-surface)"
        >
          <component
            :is="scene.component"
            v-bind="scene.props ?? {}"
          />
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
