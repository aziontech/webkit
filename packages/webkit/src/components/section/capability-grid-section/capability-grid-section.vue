<script setup lang="ts">
  import { computed, useAttrs, watch } from 'vue'

  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import type { ModuleHeaderAlign } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import FeatureItem from '../../marketing/feature-item/feature-item.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({ name: 'CapabilityGridSection', inheritAttrs: false })

  /** How many capabilities a row holds from the large breakpoint up. */
  export type CapabilityGridSectionColumns = 3 | 4

  /** One capability in the grid. */
  export type CapabilityGridSectionItem = {
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

  /** Button variant of an action. */
  export type CapabilityGridSectionActionVariant = 'secondary' | 'outline'

  /** A button under the section title. */
  export type CapabilityGridSectionAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
    /** Button variant; the grid draws the primary action `secondary` and the secondary `outline`. */
    variant?: CapabilityGridSectionActionVariant
  }

  export interface CapabilityGridSectionProps {
    /** Eyebrow above the title. */
    eyebrow?: string
    /** Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`. */
    title?: string
    /** One or two sentences under the title. */
    description?: string
    /** The capabilities, in order; each is `{ title, description, icon?, points?, href? }`; an item with `href` links its whole cell. Three or six fill a three-column grid. */
    items?: CapabilityGridSectionItem[]
    /** Capabilities per row from the large breakpoint up. */
    columns?: CapabilityGridSectionColumns
    /** First button under the section title, secondary; shown only with a label and a link. */
    primaryAction?: CapabilityGridSectionAction
    /** Second button under the section title, outlined; shown only with a label and a link. */
    secondaryAction?: CapabilityGridSectionAction
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Layout of the section title: `center` stacks and centers it, `start` stacks it at the start edge, `split` sets the headline and its description in two columns. */
    titleAlign?: ModuleHeaderAlign
  }

  const props = withDefaults(defineProps<CapabilityGridSectionProps>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => [],
    columns: 3,
    primaryAction: undefined,
    secondaryAction: undefined,
    anchor: '',
    titleAlign: 'center'
  })

  const attrs = useAttrs()

  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'capability-grid-section'
  )

  const headingLevel = computed(() => (props.title ? 3 : 2))

  const missingIcons = computed(() => {
    const bare = props.items.filter((item) => !item.icon).length
    return bare < props.items.length ? bare : 0
  })

  if (dev)
    watch(
      missingIcons,
      (bare) => {
        if (bare > 0)
          console.warn(
            `[webkit] <CapabilityGridSection>: ${bare} of ${props.items.length} items have no icon. A benefits grid gives every item an icon; a resource list or text columns give none.`
          )
      },
      { immediate: true }
    )
</script>

<template>
  <SectionBand
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :filled="items.length > 0"
    :framed="false"
    :anchor="anchor"
    :label="title"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :align="titleAlign"
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
  >
    <RegistrationFrame
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        flush
        variant="frame"
        :columns="columns"
      >
        <CardGridCell
          v-for="item in items"
          :key="(item.href ?? '') + item.title"
          variant="canvas"
          class="relative"
        >
          <FeatureItem
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
    </RegistrationFrame>
  </SectionBand>
</template>
