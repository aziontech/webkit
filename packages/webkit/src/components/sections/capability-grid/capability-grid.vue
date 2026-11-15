<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleKind } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({ name: 'CapabilityGrid', inheritAttrs: false })

  /** How many capabilities a row holds from the large breakpoint up. */
  export type CapabilityGridColumns = 3 | 4

  /** One capability in the grid. */
  export type CapabilityGridItem = {
    /** Heading of the capability. */
    title: string
    /** One or two sentences under the heading. */
    description: string
    /** Leading glyph, as an icon class. */
    icon?: string
    /** Bullet points under the description. */
    points?: string[]
    /** Destination the whole cell links to. */
    href?: string
  }

  /** Button kind of an action. */
  export type CapabilityGridActionKind = 'secondary' | 'outlined'

  /** A button under the section title. */
  export type CapabilityGridAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
    /** Button kind; the grid draws the primary action `secondary` and the secondary `outlined`. */
    kind?: CapabilityGridActionKind
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`. */
    title?: string
    /** One or two sentences under the title. */
    description?: string
    /** The capabilities, in order; each is `{ title, description, icon?, points?, href? }`; an item with `href` links its whole cell. Three or six fill a three-column grid. */
    items?: CapabilityGridItem[]
    /** Capabilities per row from the large breakpoint up. */
    columns?: CapabilityGridColumns
    /** First button under the section title, secondary; shown only with a label and a link. */
    primaryAction?: CapabilityGridAction
    /** Second button under the section title, outlined; shown only with a label and a link. */
    secondaryAction?: CapabilityGridAction
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Layout of the section title: `centered` stacks and centers it, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns. */
    titleKind?: SectionTitleKind
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => [],
    columns: 3,
    primaryAction: undefined,
    secondaryAction: undefined,
    anchor: '',
    titleKind: 'centered'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-capability-grid'
  )

  const headingLevel = computed(() => (props.title ? 3 : 2))

  const shown = (action: CapabilityGridAction | undefined): action is CapabilityGridAction =>
    Boolean(action?.label && action.href)

  const buttons = computed<CapabilityGridAction[]>(() => {
    const named: CapabilityGridAction[] = []
    if (shown(props.primaryAction)) named.push({ ...props.primaryAction, kind: 'secondary' })
    if (shown(props.secondaryAction)) named.push({ ...props.secondaryAction, kind: 'outlined' })
    return named
  })
</script>

<template>
  <section
    v-if="items.length"
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-xxl)"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          :kind="titleKind"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="buttons.length"
            #actions
          >
            <Button
              v-for="action in buttons"
              :key="action.label"
              :label="action.label"
              :href="action.href"
              :target="action.target"
              :kind="action.kind"
              size="large"
              :icon="action.trailing ? 'ai ai-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(action.trailing)"
            />
          </template>
        </SectionTitle>
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
        >
          <CardGridCell
            v-for="item in items"
            :key="(item.href ?? '') + item.title"
            kind="canvas"
            class="relative"
          >
            <Topic
              :heading-level="headingLevel"
              :icon="item.icon ?? ''"
              :title="item.title"
              :description="item.description"
              :href="item.href ?? ''"
            />
            <ul
              v-if="item.points?.length"
              class="m-0 mt-(--spacing-sm) flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-md text-(--text-muted)"
            >
              <li
                v-for="point in item.points"
                :key="point"
              >
                {{ point }}
              </li>
            </ul>
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>
