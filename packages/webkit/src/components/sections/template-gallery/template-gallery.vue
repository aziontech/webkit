<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Ticker from '../../marketing/ticker/ticker.vue'

  defineOptions({
    name: 'TemplateGallery',
    inheritAttrs: false
  })

  /** One call to action under the band's copy. */
  export type TemplateGalleryAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Browsing context the link opens in: `_self` or `_blank`. */
    target?: '_self' | '_blank'
  }

  /** One deployable template, rendered as a card of the scrolling wall. */
  export type TemplateGalleryTemplate = {
    /** Name of the template. */
    title: string
    /** One line on what the template builds. */
    description?: string
    /** Icon-font class of the template's mark, such as `ai-cor ai-astro`. */
    icon?: string
    /** Inverts the mark under the dark theme, for a mark whose artwork ships in dark ink only. */
    invertInDark?: boolean
    /** Destination of the card's deploy button. */
    href?: string
  }

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2` and naming its region. */
    title?: string
    /** Paragraph under the headline. */
    description?: string
    /** First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: TemplateGalleryAction
    /** Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent. */
    secondaryAction?: TemplateGalleryAction
    /** The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped. */
    templates?: TemplateGalleryTemplate[]
    /** Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. */
    deployLabel?: string
    /** Accessible name of the scrolling wall of templates. */
    templatesAriaLabel?: string
    /** Overline above the row of marks. */
    tickerLabel?: string
    /** Registry names of the frameworks and clouds in the row of marks, in order; the ticker is omitted when empty. */
    tickerMarks?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    templates: () => [],
    deployLabel: '',
    templatesAriaLabel: '',
    tickerLabel: '',
    tickerMarks: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-template-gallery'
  )

  const cards = computed(() => props.templates.filter((template) => Boolean(template.title)))

  const hasCards = computed(() => cards.value.length > 0)

  const hasActions = computed(() => Boolean(props.primaryAction || props.secondaryAction))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="hasCards"
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        :heading-level="2"
        align="center"
        :eyebrow="eyebrow"
        size="large"
        texture="none"
        :title="title"
        :description="description"
      >
        <template #media>
          <div class="relative min-h-[36rem] w-full self-stretch lg:min-h-[44rem]">
            <ScrollArea
              :aria-label="templatesAriaLabel || undefined"
              class="absolute inset-0 mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
            >
              <CardGrid
                flush
                kind="frame"
                :columns="2"
              >
                <CardGridCell
                  v-for="(template, index) in cards"
                  :key="`${template.title}-${index}`"
                  kind="none"
                  :padded="false"
                >
                  <div
                    class="group/template flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
                  >
                    <span
                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        v-if="template.icon"
                        aria-hidden="true"
                        :data-invert="template.invertInDark || null"
                        :class="template.icon"
                        class="text-[1.25rem] leading-none text-(--text-default) data-[invert]:[[data-theme=dark]_&]:invert"
                      />
                    </span>
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-body-md text-(--text-default)">{{ template.title }}</span>
                      <span
                        v-if="template.description"
                        class="text-pretty text-body-sm text-(--text-muted)"
                      >
                        {{ template.description }}
                      </span>
                    </div>
                    <Button
                      v-if="deployLabel && template.href"
                      :label="deployLabel"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-chevron-right"
                      icon-position="trailing"
                      animated
                      :href="template.href"
                      class="mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5"
                    >
                      <template #prefix>
                        <i
                          class="ai ai-azion text-(--primary)"
                          aria-hidden="true"
                        />
                      </template>
                    </Button>
                  </div>
                </CardGridCell>
              </CardGrid>
              <div
                aria-hidden="true"
                class="h-16"
              />
            </ScrollArea>
          </div>
        </template>
        <template
          v-if="hasActions"
          #actions
        >
          <Button
            key="primaryAction"
            v-if="primaryAction"
            :label="primaryAction.label"
            :href="primaryAction.href"
            :target="primaryAction.target"
            kind="secondary"
            size="large"
            :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
            icon-position="trailing"
            :animated="Boolean(primaryAction.trailing)"
          />
          <Button
            key="secondaryAction"
            v-if="secondaryAction"
            :label="secondaryAction.label"
            :href="secondaryAction.href"
            :target="secondaryAction.target"
            kind="outlined"
            size="large"
            :icon="secondaryAction.trailing ? 'pi pi-chevron-right' : ''"
            icon-position="trailing"
            :animated="Boolean(secondaryAction.trailing)"
          />
        </template>
      </MediaSplit>

      <FrameBox
        v-if="tickerMarks.length > 0"
        flush
        borders="y"
        marks="all"
      >
        <SectionModule :divided="false">
          <Ticker
            size="small"
            :label="tickerLabel"
            :marks="tickerMarks"
          />
        </SectionModule>
      </FrameBox>
    </SectionModule>
  </div>
</template>
