<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import SectionContainer from '../../marketing/section-container/section-container.vue'
  import SectionGap from '../../marketing/section-gap/section-gap.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'HeroWithOpening',
    inheritAttrs: false
  })

  /** A call to action under the headline. */
  export type HeroWithOpeningAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** One argument of the grid. */
  export type HeroWithOpeningItem = {
    /** Icon class drawn above the heading. */
    icon: string
    /** Short heading of the argument. */
    title: string
    /** One sentence supporting the heading. */
    description: string
  }

  interface Props {
    /** Short overline above the headline. */
    eyebrow?: string
    /** Page headline, rendered as the page `h1`; the band renders nothing when empty. A title longer than 45 characters widens the headline column. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    primaryAction?: HeroWithOpeningAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    secondaryAction?: HeroWithOpeningAction
    /** The arguments in reading order, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items. */
    items?: HeroWithOpeningItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-with-opening'
  )

  const titleWidth = computed(() => (props.title.length > 45 ? '4xl' : 'xl'))

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <template v-if="title">
      <Hero
        kind="band"
        max-width="5xl"
        size="large"
        :aria-label="title"
      >
        <HeroTitle
          centered
          :max-width="titleWidth"
          :eyebrow="eyebrow"
          eyebrow-prefix="//"
          :title="title"
          :description="description"
        >
          <template
            v-if="primary || secondary"
            #actions
          >
            <Button
              v-if="primary"
              :label="primary.label"
              :href="primary.href"
              :target="primary.target"
              kind="secondary"
              size="large"
              :icon="primary.trailing ? 'pi pi-chevron-right' : ''"
              :icon-position="primary.trailing ? 'trailing' : 'leading'"
              :animated="Boolean(primary.trailing)"
            />
            <Button
              key="button-2"
              v-if="secondary"
              :label="secondary.label"
              :href="secondary.href"
              :target="secondary.target"
              kind="outlined"
              size="large"
              :icon="secondary.trailing ? 'pi pi-chevron-right' : ''"
              :icon-position="secondary.trailing ? 'trailing' : 'leading'"
              :animated="Boolean(secondary.trailing)"
            />
          </template>
        </HeroTitle>
      </Hero>

      <SectionContainer
        v-if="items.length > 0"
        max-width="site"
      >
        <SectionModule
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
                v-for="item in items"
                :key="item.title"
                kind="canvas"
              >
                <Topic
                  :heading-level="2"
                  :icon="item.icon"
                  :title="item.title"
                  :description="item.description"
                />
              </CardGridCell>
            </CardGrid>
          </FrameBox>
        </SectionModule>

        <SectionGap hatch />
      </SectionContainer>
    </template>
  </div>
</template>
