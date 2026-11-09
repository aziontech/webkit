<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Brand from '../../content/brand/brand.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverDescription from '../../overlay/popover/popover-description/popover-description.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'ComparisonTable',
    inheritAttrs: false
  })

  /** How far a platform covers a capability. */
  export type ComparisonTableSupport = 'full' | 'partial' | 'none'

  /** The platform compared with Azion, heading the last column. */
  export type ComparisonTableCompetitor = {
    /** Name of the platform; the logo's alt text, and the column head when no logo is set. */
    name: string
    /** Logo file for the dark theme, or for both themes when `logoLight` is absent. */
    logo?: string
    /** Logo file for the light theme. */
    logoLight?: string
  }

  /** One capability, rendered as a table row. */
  export type ComparisonTableRow = {
    /** The capability, rendered as the row head. */
    capability: string
    /** What the capability means, opened from the info button next to it. */
    definition?: string
    /** Azion's support level; missing reads as `none`. */
    azion?: ComparisonTableSupport
    /** The competitor's support level; missing reads as `none`. */
    competitor?: ComparisonTableSupport
  }

  /** One category of capabilities, opened by a heading row. */
  export type ComparisonTableGroup = {
    /** The category, rendered as the group's heading row. */
    title: string
    /** The capabilities of the category, in order. */
    rows: ComparisonTableRow[]
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty. */
    title?: string
    /** Screen-reader caption naming the table. */
    caption?: string
    /** Heading of the capability column. */
    columnLabel?: string
    /** Tooltip and screen-reader text of a full-support cell. */
    fullLabel?: string
    /** Tooltip and screen-reader text of a partial-support cell. */
    partialLabel?: string
    /** Tooltip and screen-reader text of an unsupported cell. */
    noneLabel?: string
    /** The platform compared with Azion; `{ name, logo?, logoLight? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. */
    competitor: ComparisonTableCompetitor
    /** The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`). */
    groups?: ComparisonTableGroup[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    caption: '',
    columnLabel: '',
    fullLabel: '',
    partialLabel: '',
    noneLabel: '',
    groups: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-comparison-table'
  )

  const hasGroups = computed(() => props.groups.length > 0)

  const platforms = ['azion', 'competitor'] as const

  const supportIcon: Record<ComparisonTableSupport, string> = {
    full: 'pi pi-check-circle',
    partial: 'ai ai-circle-half',
    none: 'ai ai-circle-minus'
  }

  const labelOf = (level: ComparisonTableSupport | undefined) =>
    ({ full: props.fullLabel, partial: props.partialLabel, none: props.noneLabel })[level ?? 'none']

  const iconOf = (level: ComparisonTableSupport | undefined) => supportIcon[level ?? 'none']

  const isLast = (groupIndex: number, rowIndex: number) =>
    groupIndex === props.groups.length - 1 && rowIndex === props.groups[groupIndex].rows.length - 1
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="hasGroups"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          kind="left"
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <table
          class="w-full table-fixed border-separate border-spacing-0 text-left [--compare-head:3.5rem] sm:[--compare-head:5rem]"
        >
          <caption
            v-if="caption"
            class="sr-only"
          >
            {{
              caption
            }}
          </caption>
          <colgroup>
            <col class="w-[56%] md:w-[44%] lg:w-[40%]" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-xl) py-0 align-middle font-normal h-(--compare-head)"
              >
                <span class="text-overline-md text-(--text-muted)">{{ columnLabel }}</span>
              </th>
              <th
                scope="col"
                aria-label="Azion"
                class="sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0 text-center align-middle font-normal h-(--compare-head) sm:px-(--spacing-lg)"
              >
                <Brand
                  kind="default"
                  size="small"
                  class="[&>svg]:h-3! sm:[&>svg]:h-4! md:[&>svg]:h-6!"
                />
                <span class="sr-only">Azion</span>
              </th>
              <th
                scope="col"
                :aria-label="competitor.name"
                class="sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0 align-middle font-normal h-(--compare-head) sm:px-(--spacing-lg)"
              >
                <template v-if="competitor.logo && competitor.logoLight">
                  <img
                    :src="competitor.logo"
                    :alt="competitor.name"
                    decoding="async"
                    class="mx-auto h-3 w-auto max-w-full object-contain sm:h-4 md:h-6 hidden [[data-theme=dark]_&]:block"
                  />
                  <img
                    :src="competitor.logoLight"
                    :alt="competitor.name"
                    decoding="async"
                    class="mx-auto h-3 w-auto max-w-full object-contain sm:h-4 md:h-6 block [[data-theme=dark]_&]:hidden"
                  />
                </template>
                <img
                  v-else-if="competitor.logo"
                  :src="competitor.logo"
                  :alt="competitor.name"
                  decoding="async"
                  class="mx-auto h-3 w-auto max-w-full object-contain sm:h-4 md:h-6"
                />
                <span
                  v-else
                  class="block text-center text-heading-xxs whitespace-nowrap"
                >
                  {{ competitor.name }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(group, groupIndex) in groups"
            :key="group.title"
          >
            <tr>
              <th
                scope="colgroup"
                colspan="3"
                class="sticky top-[calc(3.5rem+var(--compare-head))] z-10 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-xl) py-(--spacing-sm) text-left font-normal"
              >
                <span class="text-overline-md text-(--primary)">{{ group.title }}</span>
              </th>
            </tr>
            <tr
              v-for="(item, rowIndex) in group.rows"
              :key="item.capability"
              :data-last="isLast(groupIndex, rowIndex) || null"
              class="group/row"
            >
              <th
                scope="row"
                class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[last]/row:border-b-0"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span class="min-w-0 max-sm:truncate">{{ item.capability }}</span>
                  <span
                    v-if="item.definition"
                    class="-my-(--spacing-xxs) inline-flex shrink-0"
                  >
                    <Popover placement="auto">
                      <PopoverTrigger>
                        <IconButton
                          kind="transparent"
                          size="small"
                          icon="pi pi-info-circle"
                          :ariaLabel="`About ${item.capability}`"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div class="flex flex-col gap-(--spacing-xxs) p-(--spacing-sm)">
                          <PopoverTitle>{{ item.capability }}</PopoverTitle>
                          <PopoverDescription>{{ item.definition }}</PopoverDescription>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                </span>
              </th>
              <td
                v-for="platform in platforms"
                :key="platform"
                class="border-b border-l border-(--border-default) px-(--spacing-xs) py-(--spacing-md) text-center align-middle group-data-[last]/row:border-b-0 sm:px-(--spacing-md)"
              >
                <Tooltip :text="labelOf(item[platform])">
                  <i
                    :data-support="item[platform] ?? 'none'"
                    :class="iconOf(item[platform])"
                    class="text-body-md data-[support=full]:text-(--success-contrast) data-[support=none]:text-(--text-muted) data-[support=partial]:text-(--warning-contrast)"
                    aria-hidden="true"
                  />
                </Tooltip>
                <span class="sr-only">{{ labelOf(item[platform]) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </FrameBox>
    </SectionModule>
  </section>
</template>
