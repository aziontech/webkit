<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Brand from '../../content/brand/brand.vue'
  import ThirdPartyLogo, {
    type ThirdPartyLogoArtwork
  } from '../../content/third-party-logo/third-party-logo.vue'
  import Module from '../../layout/module/module.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverDescription from '../../overlay/popover/popover-description/popover-description.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

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
    /** Tooltip and screen-reader text of a full-support cell. */
    fullLabel?: string
    /** Tooltip and screen-reader text of a partial-support cell. */
    partialLabel?: string
    /** Tooltip and screen-reader text of an unsupported cell. */
    noneLabel?: string
    /** The platform compared with Azion; `{ name, logo?, logoLight?, artwork? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. With only a `name`, the logo is taken from the competitor registry once the page is interactive, and the name is the column head until then or when the registry has no entry. */
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

  const isLast = (groupIndex: number, rowIndex: number) =>
    groupIndex === props.groups.length - 1 && rowIndex === props.groups[groupIndex].rows.length - 1
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <Module
      v-if="hasGroups"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <ModuleHeader
          align="start"
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <RegistrationFrame
        flush
        borders="y"
        marks="all"
      >
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
                class="sticky top-(--layout-sticky-top) z-20 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) py-0 sm:px-(--spacing-xl) text-start align-middle font-normal h-(--competitor-comparison-section-head)"
              >
                <span class="text-overline-md text-(--text-muted)">{{ columnLabel }}</span>
              </th>
              <th
                scope="col"
                aria-label="Azion"
                class="sticky top-(--layout-sticky-top) z-20 border-b border-s border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) py-0 text-center align-middle font-normal h-(--competitor-comparison-section-head) sm:px-(--spacing-lg)"
              >
                <Brand
                  variant="default"
                  size="small"
                  class="max-w-full [&>svg]:h-3! [&>svg]:max-w-full sm:[&>svg]:h-4! md:[&>svg]:h-6!"
                />
                <span class="sr-only">Azion</span>
              </th>
              <th
                scope="col"
                :aria-label="competitor.name"
                class="sticky top-(--layout-sticky-top) z-20 border-b border-s border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) py-0 text-center align-middle font-normal h-(--competitor-comparison-section-head) sm:px-(--spacing-lg)"
              >
                <ThirdPartyLogo
                  :name="competitorMark.name"
                  :src="competitorMark.logo"
                  :src-light="competitorMark.logoLight"
                  :artwork="competitorMark.artwork"
                  :data-testid="`${testId}__competitor-logo`"
                  class="h-3 sm:h-4 md:h-6"
                />
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
                class="sticky top-[calc(3.5rem+var(--competitor-comparison-section-head))] z-10 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) sm:px-(--spacing-xl) text-start font-normal"
              >
                <span
                  :data-testid="`${testId}__group-title`"
                  class="text-overline-md text-(--text-brand)"
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
                class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-md) text-start align-middle text-label-md font-normal text-(--text-default) group-data-[last]/row:border-b-0 sm:px-(--spacing-xl)"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span class="min-w-0 text-pretty wrap-break-word">{{ item.capability }}</span>
                  <span
                    v-if="item.definition"
                    class="-my-(--spacing-2xs) inline-flex shrink-0"
                  >
                    <Popover side="auto">
                      <PopoverTrigger>
                        <IconButton
                          variant="ghost"
                          size="small"
                          icon="az az-circle-info"
                          :ariaLabel="
                            t('competitorComparisonSection.about', { capability: item.capability })
                          "
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div class="flex flex-col gap-(--spacing-2xs) p-(--spacing-sm)">
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
      </RegistrationFrame>
    </Module>
  </section>
</template>
