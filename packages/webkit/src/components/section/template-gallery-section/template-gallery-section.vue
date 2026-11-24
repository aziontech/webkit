<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Marquee from '../../marketing/marquee/marquee.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionBand from '../parts/section-band.vue'
  import SectionHatch from '../parts/section-hatch.vue'

  defineOptions({
    name: 'TemplateGallerySection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** One deployable template, rendered as a card of the scrolling wall. */
  export type TemplateGallerySectionTemplate = {
    /** Name of the template. */
    title: string
    /** One line on what the template builds. */
    description?: string
    /** Icon-font class of the template's mark, such as `az-color az-astro`. */
    icon?: string
    /** Inverts the mark under the dark theme, for a mark whose artwork ships in dark ink only. */
    invertInDark?: boolean
    /** Destination of the card's deploy button. */
    href?: string
  }

  export interface TemplateGallerySectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2` and naming its region. */
    title?: string
    /** Paragraph under the headline. */
    description?: string
    /** First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
    /** Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent. */
    secondaryAction?: ModuleHeaderAction
    /** The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped. */
    templates?: TemplateGallerySectionTemplate[]
    /** Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. */
    deployLabel?: string
    /** Accessible name of the scrolling wall of templates. */
    templatesAriaLabel?: string
    /** Eyebrow above the row of marks. */
    marqueeLabel?: string
    /** Registry names of the frameworks and clouds in the row of marks, in order; the marquee is omitted when empty. */
    marqueeMarks?: string[]
    /** Makes the band the page's closing band: the hatched closing frame follows it, as the closing call to action draws it. */
    closing?: boolean
    /** Draws the hatched closing frame under a `closing` band; turn it off when another closing band stacks directly below and draws the shared frame. Ignored without `closing`. */
    hatch?: boolean
  }

  const props = withDefaults(defineProps<TemplateGallerySectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    templates: () => [],
    deployLabel: '',
    templatesAriaLabel: '',
    marqueeLabel: '',
    marqueeMarks: () => [],
    closing: false,
    hatch: true
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'template-gallery-section'
  )

  const cards = computed(() => props.templates.filter((template) => Boolean(template.title)))

  const hasCards = computed(() => cards.value.length > 0)

  const hasActions = computed(() => Boolean(props.primaryAction || props.secondaryAction))

  const DEPLOY_BUTTON_CLASS =
    'z-1 mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5 ' +
    'rtl:group-hover/template:[&_[data-animated]]:-translate-x-0.5'

  const SCROLL_AREA_CLASS =
    '@min-[60rem]/template-gallery:absolute @min-[60rem]/template-gallery:inset-0 ' +
    '@min-[60rem]/template-gallery:mask-t-from-[calc(100%_-_2rem)] @min-[60rem]/template-gallery:mask-b-from-[calc(100%_-_6rem)]'

  const CARD_LINK_CLASS =
    'absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :filled="hasCards"
    :framed="false"
    class="@container/template-gallery"
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
        <div class="relative w-full self-stretch @min-[60rem]/template-gallery:min-h-[44rem]">
          <ScrollArea
            :aria-label="templatesAriaLabel || undefined"
            :class="SCROLL_AREA_CLASS"
          >
            <CardGrid
              flush
              variant="frame"
              :columns="2"
            >
              <CardGridCell
                v-for="(template, index) in cards"
                :key="`${template.title}-${index}`"
                variant="none"
                :padded="false"
              >
                <div
                  :data-linked="template.href ? true : null"
                  class="group/template relative flex h-full min-w-0 flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl) data-[linked]:cursor-pointer"
                >
                  <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      v-if="template.icon"
                      aria-hidden="true"
                      :data-invert="template.invertInDark || null"
                      :class="template.icon"
                      class="text-[1.25rem] leading-none text-(--text-default) data-[invert]:[[data-theme=dark]_&]:invert"
                    />
                  </span>
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-body-md text-(--text-default)">{{ template.title }}</span>
                    <span
                      v-if="template.description"
                      class="text-pretty text-body-sm text-(--text-muted)"
                    >
                      {{ template.description }}
                    </span>
                  </div>
                  <a
                    v-if="template.href && deployLabel"
                    :href="safeHref(template.href) ?? undefined"
                    tabindex="-1"
                    aria-hidden="true"
                    :aria-label="template.title"
                    :data-testid="`${testId}__card-link`"
                    :class="CARD_LINK_CLASS"
                  />
                  <a
                    v-else-if="template.href"
                    :href="safeHref(template.href) ?? undefined"
                    :aria-label="template.title"
                    :data-testid="`${testId}__card-link`"
                    :class="CARD_LINK_CLASS"
                  />
                  <Button
                    v-if="deployLabel && template.href"
                    :label="deployLabel"
                    variant="outline"
                    size="medium"
                    icon="az az-chevron-right"
                    icon-position="trailing"
                    animated
                    :href="template.href"
                    :class="DEPLOY_BUTTON_CLASS"
                  >
                    <template #leading>
                      <i
                        class="az az-azion text-(--primary)"
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
          variant="secondary"
          size="large"
          :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
          icon-position="trailing"
          :animated="Boolean(primaryAction.trailing)"
        />
        <Button
          key="secondaryAction"
          v-if="secondaryAction"
          :label="secondaryAction.label"
          :href="secondaryAction.href"
          :target="secondaryAction.target"
          variant="outline"
          size="large"
          :icon="secondaryAction.trailing ? 'az az-chevron-right' : ''"
          icon-position="trailing"
          :animated="Boolean(secondaryAction.trailing)"
        />
      </template>
    </MediaSplit>

    <RegistrationFrame
      v-if="marqueeMarks.length > 0"
      flush
      borders="y"
      marks="all"
    >
      <Module :divided="false">
        <Marquee
          size="small"
          :label="marqueeLabel"
          :marks="marqueeMarks"
        />
      </Module>
    </RegistrationFrame>
    <template #after>
      <SectionHatch v-if="hasCards && closing && hatch" />
    </template>
  </SectionBand>
</template>
