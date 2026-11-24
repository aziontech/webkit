<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Brand from '../../content/brand/brand.vue'
  import ThirdPartyLogo, {
    type ThirdPartyLogoArtwork
  } from '../../content/third-party-logo/third-party-logo.vue'
  import Hint from '../../input/hint/hint.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'CompetitorComparisonSection',
    inheritAttrs: false
  })

  /** How far a platform covers a capability. */
  export type CompetitorComparisonSectionSupport = 'full' | 'partial' | 'none'

  /** The platform compared with Azion, heading the last column. */
  export type CompetitorComparisonSectionCompetitor = {
    /** Name of the platform; the logo's alt text, and the key the competitor registry is searched by when no logo is set. */
    name: string
    /** Logo file for the dark theme, or for both themes when `logoLight` is absent. */
    logo?: string
    /** Logo file for the light theme. */
    logoLight?: string
    /** The ink a single logo file is drawn in, as the registries record it: `light` art is inverted on the light theme, `dark` art on the dark theme. */
    artwork?: ThirdPartyLogoArtwork
  }

  /** One capability, rendered as a table row. */
  export type CompetitorComparisonSectionRow = {
    /** The capability, rendered as the row head. */
    capability: string
    /** What the capability means, opened from the info button next to it. */
    definition?: string
    /** Azion's support level; missing reads as `none`. */
    azion?: CompetitorComparisonSectionSupport
    /** The competitor's support level; missing reads as `none`. */
    competitor?: CompetitorComparisonSectionSupport
  }

  /** One category of capabilities, opened by a heading row. */
  export type CompetitorComparisonSectionGroup = {
    /** The category, rendered as the group's heading row. */
    title: string
    /** The capabilities of the category, in order. */
    rows: CompetitorComparisonSectionRow[]
  }

  export interface CompetitorComparisonSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty. */
    title?: string
    /** Screen-reader caption naming the table. */
    caption?: string
    /** Heading of the capability column. */
    columnLabel?: string
    /** Legend entry, tooltip and screen-reader text of a full-support cell. */
    fullLabel?: string
    /** Legend entry, tooltip and screen-reader text of a partial-support cell. */
    partialLabel?: string
    /** Legend entry, tooltip and screen-reader text of an unsupported cell. */
    noneLabel?: string
    /**
     * The platform compared with Azion; `{ name, logo?, logoLight?, artwork? }` where `logo` is the
     * dark-theme file and `logoLight` the light-theme one. With only a `name`, the logo is taken from the
     * competitor registry once the page is interactive, and the name is the column head until then or when
     * the registry has no entry.
     */
    competitor: CompetitorComparisonSectionCompetitor
    /** The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`). */
    groups?: CompetitorComparisonSectionGroup[]
  }

  const props = withDefaults(defineProps<CompetitorComparisonSectionProps>(), {
    anchor: '',
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
  const { t } = useTranslate({ competitorComparisonSection: en.competitorComparisonSection })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'competitor-comparison-section'
  )

  const hasGroups = computed(() => props.groups.length > 0)

  const mounted = ref(false)

  const registryEntry = shallowRef<CompetitorComparisonSectionCompetitor | null>(null)

  const hasOwnLogo = computed(() => Boolean(props.competitor.logo || props.competitor.logoLight))

  const competitorMark = computed<CompetitorComparisonSectionCompetitor>(() =>
    hasOwnLogo.value ? props.competitor : (registryEntry.value ?? props.competitor)
  )

  async function loadRegistryEntry() {
    registryEntry.value = null
    if (!mounted.value || hasOwnLogo.value) return
    const name = props.competitor.name
    const { competitor } = await import('../../../assets/logos/competitors/registry')
    if (name === props.competitor.name && !hasOwnLogo.value) registryEntry.value = competitor(name)
  }

  watch(() => [mounted.value, props.competitor.name, hasOwnLogo.value], loadRegistryEntry)

  onMounted(() => {
    mounted.value = true
  })

  const platforms = ['azion', 'competitor'] as const

  const supportIcon: Record<CompetitorComparisonSectionSupport, string> = {
    full: 'az az-circle-check',
    partial: 'az az-circle-half',
    none: 'az az-minus'
  }

  const labelOf = (level: CompetitorComparisonSectionSupport | undefined) =>
    ({ full: props.fullLabel, partial: props.partialLabel, none: props.noneLabel })[level ?? 'none']

  const iconOf = (level: CompetitorComparisonSectionSupport | undefined) =>
    supportIcon[level ?? 'none']

  const legend = computed(() =>
    (['full', 'partial', 'none'] as const).filter((level) => labelOf(level))
  )

  const LEGEND_CLASS =
    'm-0 flex list-none flex-wrap gap-x-(--spacing-lg) gap-y-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm) ' +
    'text-body-sm text-(--text-muted) sm:px-(--spacing-xl)'

  const isLast = (groupIndex: number, rowIndex: number) =>
    groupIndex === props.groups.length - 1 && rowIndex === props.groups[groupIndex].rows.length - 1

  const CAPABILITY_HEADER_CELL_CLASS =
    'sticky top-(--layout-sticky-top) z-20 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) py-0 ' +
    'sm:px-(--spacing-xl) text-start align-middle font-normal h-(--competitor-comparison-section-head)'

  const PHONE_NAME_CLASS = 'text-label-sm wrap-break-word text-(--text-default) sm:hidden'

  const PLATFORM_HEADER_CELL_CLASS =
    'sticky top-(--layout-sticky-top) z-20 border-b border-s border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) py-0 text-center align-middle font-normal ' +
    'h-(--competitor-comparison-section-head) sm:px-(--spacing-lg)'

  const GROUP_HEADER_CELL_CLASS =
    'sticky top-[calc(3.5rem+var(--competitor-comparison-section-head))] z-10 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) ' +
    'sm:px-(--spacing-xl) text-start font-normal'

  const ROW_HEADER_CELL_CLASS =
    'border-b border-(--border-default) px-(--spacing-md) py-(--spacing-md) text-start align-middle text-label-md font-normal text-(--text-default) ' +
    'group-data-[last]/row:border-b-0 ' +
    'sm:px-(--spacing-xl)'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :filled="hasGroups"
    align="start"
    :eyebrow="eyebrow"
    :title="title"
  >
    <ul
      v-if="legend.length > 0"
      :data-testid="`${testId}__legend`"
      :class="LEGEND_CLASS"
    >
      <li
        v-for="level in legend"
        :key="level"
        class="flex items-center gap-(--spacing-xs)"
      >
        <i
          :data-level="level"
          :class="supportIcon[level]"
          class="text-body-md text-(--text-muted) data-[level=full]:text-(--success-mark)"
          aria-hidden="true"
        />
        {{ labelOf(level) }}
      </li>
    </ul>
    <table
      class="w-full table-fixed border-separate border-spacing-0 text-start [--competitor-comparison-section-head:3.5rem] sm:[--competitor-comparison-section-head:5rem]"
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
        <col class="w-[52%] sm:w-[50%] md:w-[44%] lg:w-[40%]" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th
            scope="col"
            :class="CAPABILITY_HEADER_CELL_CLASS"
          >
            <span class="text-overline-md text-(--text-muted)">{{ columnLabel }}</span>
          </th>
          <th
            scope="col"
            aria-label="Azion"
            :class="PLATFORM_HEADER_CELL_CLASS"
          >
            <Brand
              variant="default"
              size="small"
              class="max-w-full max-sm:hidden [&>svg]:max-w-full sm:[&>svg]:h-4! md:[&>svg]:h-6!"
            />
            <span
              aria-hidden="true"
              :class="PHONE_NAME_CLASS"
              >Azion</span
            >
            <span class="sr-only">Azion</span>
          </th>
          <th
            scope="col"
            :aria-label="competitor.name"
            :class="PLATFORM_HEADER_CELL_CLASS"
          >
            <ThirdPartyLogo
              :name="competitorMark.name"
              :src="competitorMark.logo"
              :src-light="competitorMark.logoLight"
              :artwork="competitorMark.artwork"
              :data-testid="`${testId}__competitor-logo`"
              class="max-sm:hidden sm:h-4 md:h-6"
            />
            <span
              aria-hidden="true"
              :data-testid="`${testId}__competitor-name`"
              :class="PHONE_NAME_CLASS"
              >{{ competitor.name }}</span
            >
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
            :class="GROUP_HEADER_CELL_CLASS"
          >
            <span
              :data-testid="`${testId}__group-title`"
              class="border-s-2 border-(--primary) ps-(--spacing-xs) text-overline-md text-(--text-default)"
              >{{ group.title }}</span
            >
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
            :class="ROW_HEADER_CELL_CLASS"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
              <span class="min-w-0 text-pretty wrap-break-word">{{ item.capability }}</span>
              <Hint
                v-if="item.definition"
                :content="item.definition"
                side="auto"
                :aria-label="
                  t('competitorComparisonSection.about', { capability: item.capability })
                "
              />
            </span>
          </th>
          <td
            v-for="platform in platforms"
            :key="platform"
            class="border-b border-s border-(--border-default) px-(--spacing-xs) py-(--spacing-md) text-center align-middle group-data-[last]/row:border-b-0 sm:px-(--spacing-md)"
          >
            <Tooltip :content="labelOf(item[platform])">
              <i
                :data-support="item[platform] ?? 'none'"
                :class="iconOf(item[platform])"
                class="text-body-md data-[support=full]:text-(--success-mark) data-[support=none]:text-(--text-muted) data-[support=partial]:text-(--text-muted)"
                aria-hidden="true"
              />
            </Tooltip>
            <span class="sr-only">{{ labelOf(item[platform]) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </SectionBand>
</template>
