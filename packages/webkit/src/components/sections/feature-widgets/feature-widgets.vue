<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import ButtonHighlight from '../../actions/button-highlight/button-highlight.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import BentoGrid from '../../marketing/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../marketing/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'FeatureWidgets',
    inheritAttrs: false
  })

  /** A call to action under the headline. */
  export type FeatureWidgetsAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The copy affordance of a cell: a button that puts a prompt on the clipboard. */
  export type FeatureWidgetsCopy = {
    /** Visible label of the copy button. */
    label: string
    /** The text written to the clipboard on activation. */
    text: string
  }

  /** Column count of the grid from the medium breakpoint up. */
  export type FeatureWidgetsColumns = 2 | 3 | 4

  /** One cell of the grid: an illustration above a bold-led sentence and one affordance. */
  export type FeatureWidgetsItem = {
    /** The bold lead of the cell's sentence. */
    title: string
    /** The rest of the cell's sentence, after the lead. */
    description: string
    /** Name of the illustration scene drawn above the sentence. */
    illustration: string
    /** Outlined link button rendered at the foot of the cell; `{ label, href }`. */
    action?: FeatureWidgetsAction
    /** Copy button rendered at the foot of the cell; `{ label, text }` where `text` goes to the clipboard. */
    copy?: FeatureWidgetsCopy
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the centered section title as its `h2`, and the accessible name of the band. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** First button under the headline; `{ label, href, trailing? }`. Omitted when absent. */
    primaryAction?: FeatureWidgetsAction
    /** Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    secondaryAction?: FeatureWidgetsAction
    /** Column count of the grid from the medium breakpoint up: `2`, `3` or `4`. */
    columns?: FeatureWidgetsColumns
    /** The cells, in order; each is `{ title, description, illustration, action?, copy? }` where `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard. */
    items?: FeatureWidgetsItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    columns: 3,
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-feature-widgets'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const copyPrompt = (text: string) => {
    void navigator.clipboard?.writeText(text)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :id="anchor || undefined"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <SectionTitle
          kind="centered"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template #actions>
            <Button
              v-if="primaryAction"
              :label="primaryAction.label"
              :href="primaryAction.href"
              kind="secondary"
            />
            <Button
              key="button-2"
              v-if="secondaryAction"
              :label="secondaryAction.label"
              :href="secondaryAction.href"
              kind="outlined"
              :icon="secondaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
            />
          </template>
        </SectionTitle>
      </template>
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <BentoGrid
          flush
          :columns="columns"
        >
          <BentoGridCell
            v-for="item in items"
            :key="item.title"
            :padded="false"
          >
            <div class="flex h-full w-full min-w-0 flex-col">
              <Illustration :name="item.illustration" />
              <div class="flex flex-1 flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  <strong class="font-medium text-(--text-default)">{{ item.title }}</strong>
                  {{ item.description }}
                </p>
                <span class="mt-auto flex flex-wrap gap-(--spacing-sm)">
                  <ButtonHighlight
                    v-if="item.copy"
                    :label="item.copy.label"
                    size="medium"
                    icon="pi pi-copy"
                    @click="copyPrompt(item.copy.text)"
                  />
                  <Button
                    v-else-if="item.action"
                    :label="item.action.label"
                    :href="item.action.href"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-chevron-right"
                    icon-position="trailing"
                    animated
                  />
                </span>
              </div>
            </div>
          </BentoGridCell>
        </BentoGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>
