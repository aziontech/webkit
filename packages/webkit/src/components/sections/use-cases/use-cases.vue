<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Topic from '../../marketing/topic/topic.vue'
  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'UseCases',
    inheritAttrs: false
  })

  /** The call to action pinned to the foot of the title cell. */
  export type UseCasesAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** One use case, rendered as a frame cell. */
  export type UseCasesItem = {
    /** Icon class for the glyph that leads the use case's heading. */
    icon: string
    /** The use case, rendered as its h3. */
    title: string
    /** One sentence explaining the use case. */
    description: string
  }

  interface Props {
    /** Overline above the headline in the title cell, closed by the blinking cursor. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2` in the title cell. */
    title?: string
    /** One-line lead under the headline. */
    description?: string
    /** Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: UseCasesAction
    /** The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`. */
    items?: UseCasesItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    items: () => []
  })

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-use-cases'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeading = computed(() => hasItems.value && props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-labelledby="hasHeading ? headingId : undefined"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            kind="canvas"
            class="lg:row-span-2"
          >
            <div class="flex h-full flex-col items-start gap-(--spacing-md)">
              <Overline
                v-if="eyebrow"
                prefix="//"
                show-cursor
              >
                {{ eyebrow }}
              </Overline>
              <h2
                v-if="hasHeading"
                :id="headingId"
                class="m-0 text-balance text-heading-lg text-(--text-default)"
              >
                {{ title }}
              </h2>
              <p
                v-if="description"
                class="m-0 mb-(--spacing-xl) text-body-md text-(--text-muted)"
              >
                {{ description }}
              </p>
              <Button
                v-if="primaryAction"
                :label="primaryAction.label"
                :href="primaryAction.href"
                kind="secondary"
                size="large"
                :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
                class="mt-auto"
              />
            </div>
          </CardGridCell>
          <CardGridCell
            v-for="item in items"
            :key="item.title"
            kind="canvas"
          >
            <Topic
              :heading-level="3"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>
