<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'ClosingCallToActionTemplates',
    inheritAttrs: false
  })

  /** One call to action under the headline. */
  export type ClosingCallToActionTemplatesAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Browsing context the link opens in: `_self` or `_blank`. */
    target?: '_self' | '_blank'
  }

  /** One deployable template, rendered as a card of the scrolling grid. */
  export type ClosingCallToActionTemplatesTemplate = {
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
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered as its `h2` and naming its region; the band renders nothing when empty. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** The white button under the copy; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ClosingCallToActionTemplatesAction
    /** The outlined button beside the primary one; `{ label, href, trailing?, target? }`. Omitted when absent. */
    secondaryAction?: ClosingCallToActionTemplatesAction
    /** The template cards of the scrolling grid beside the copy, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped and the grid is omitted when none is left. */
    templates?: ClosingCallToActionTemplatesTemplate[]
    /** Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. */
    deployLabel?: string
    /** Accessible name of the scrolling grid of templates. */
    templatesAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    templates: () => [],
    deployLabel: '',
    templatesAriaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action-templates'
  )

  const cards = computed(() => props.templates.filter((template) => Boolean(template.title)))

  const hasCards = computed(() => cards.value.length > 0)

  const hasActions = computed(() => Boolean(props.primaryAction || props.secondaryAction))
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <template v-if="title">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <section
            :aria-label="title"
            class="grid lg:grid-cols-2"
          >
            <div class="relative isolate flex items-center overflow-clip bg-(--bg-canvas)">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 [--texture-pool-a:50%_140%] [--texture-pool-b:50%_140%] [--texture-wave-gain:3] [--texture-wave-pace:5]"
              >
                <TextureMaterial
                  kind="pixelate"
                  size="small"
                  fade="bottom"
                />
              </div>
              <SectionTitle
                :framed="false"
                kind="left"
                size="large"
                :title="title"
                :description="description"
                class="relative z-10 px-(--spacing-xl) py-[calc(var(--spacing-xxl)*1.5)]"
              >
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
              </SectionTitle>
            </div>
            <div
              v-if="hasCards"
              class="relative min-h-[32rem] border-t border-(--border-default) lg:min-h-[38rem] lg:border-t-0 lg:border-s"
            >
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
                        class="mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5 rtl:group-hover/template:[&_[data-animated]]:-translate-x-0.5"
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
          </section>
        </FrameBox>
      </SectionModule>
      <FrameBox
        borders="none"
        marks="all"
        data-hatch="true"
        class="h-[calc(var(--spacing-xxl)*2)]"
      >
        <TextureMaterial kind="lines" />
      </FrameBox>
    </template>
  </div>
</template>
