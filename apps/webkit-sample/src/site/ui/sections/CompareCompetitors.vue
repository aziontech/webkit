<script setup lang="ts">
  import { competitor as registryCompetitor } from '@aziontech/webkit/assets/competitor-registry'
  import Brand from '@aziontech/webkit/brand'
  import FrameBox from '@aziontech/webkit/frame-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import Popover from '@aziontech/webkit/popover'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Tooltip from '@aziontech/webkit/tooltip'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  defineOptions({ name: 'CompareCompetitors' })

  /** How far a platform supports a capability. */
  export type CompareCompetitorsSupport = 'full' | 'partial' | 'none'

  export interface CompareCompetitorsCompetitor {
    /** Name of the alternative, read by screen readers and shown when there is no logo. */
    name: string
    /** Logo URL for the dark theme, or the only logo. Falls back to the competitor registry. */
    logo?: string
    /** Logo URL for the light theme. */
    logoLight?: string
  }

  export interface CompareCompetitorsRow {
    /** What is being compared. */
    capability: string
    /** What the capability means, shown in a popover beside it. */
    definition?: string
    /** How far Azion supports it; a missing level reads as none. */
    azion?: CompareCompetitorsSupport
    /** How far the alternative supports it; a missing level reads as none. */
    competitor?: CompareCompetitorsSupport
  }

  export interface CompareCompetitorsGroup {
    /** Category heading over its rows. */
    title: string
    /** One row per capability in the category. */
    rows: CompareCompetitorsRow[]
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** Band title. */
    title?: string
    /** The alternative compared in the second column. */
    competitor: CompareCompetitorsCompetitor
    /** Capabilities grouped by category, in display order. */
    groups: CompareCompetitorsGroup[]
    /** Screen-reader caption of the table. */
    caption?: string
    /** Heading of the capability column. */
    columnLabel?: string
    /** Tooltip and screen-reader text of a full-support cell. */
    fullLabel?: string
    /** Tooltip and screen-reader text of a partial-support cell. */
    partialLabel?: string
    /** Tooltip and screen-reader text of an unsupported cell. */
    noneLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: 'Comparison',
    title: '',
    caption: '',
    columnLabel: 'Capability',
    fullLabel: 'Full support',
    partialLabel: 'Partial support',
    noneLabel: 'Not available',
    anchor: ''
  })

  const competitorMark = computed(() =>
    props.competitor.logo ? props.competitor : registryCompetitor(props.competitor.name)
  )

  const platforms = ['azion', 'competitor'] as const

  const supportIcons: Record<CompareCompetitorsSupport, string> = {
    full: 'pi pi-check-circle',
    partial: 'ai ai-circle-half',
    none: 'ai ai-circle-minus'
  }

  const supportLabels = computed<Record<CompareCompetitorsSupport, string>>(() => ({
    full: props.fullLabel,
    partial: props.partialLabel,
    none: props.noneLabel
  }))

  const levelOf = (row: CompareCompetitorsRow, platform: (typeof platforms)[number]) =>
    row[platform] ?? 'none'

  const isLastRow = (groupIndex: number, rowIndex: number) =>
    groupIndex === props.groups.length - 1 && rowIndex === props.groups[groupIndex].rows.length - 1
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
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
              <span class="inline-flex [&_svg]:h-3! sm:[&_svg]:h-4! md:[&_svg]:h-6!">
                <Brand
                  kind="default"
                  size="small"
                />
              </span>
              <span class="sr-only">Azion</span>
            </th>
            <th
              scope="col"
              :aria-label="competitor.name"
              class="sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0 align-middle font-normal h-(--compare-head) sm:px-(--spacing-lg)"
            >
              <ClientMark
                :client="competitorMark"
                mark="mx-auto block h-3 w-auto max-w-full object-contain sm:h-4 md:h-6"
              />
              <span class="sr-only">{{ competitor.name }}</span>
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
            v-for="(row, rowIndex) in group.rows"
            :key="row.capability"
            :data-last="isLastRow(groupIndex, rowIndex) || null"
            class="group/row"
          >
            <th
              scope="row"
              class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[last]/row:border-b-0"
            >
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <span class="min-w-0 max-sm:truncate">{{ row.capability }}</span>
                <span
                  v-if="row.definition"
                  class="-my-(--spacing-xxs) inline-flex shrink-0"
                >
                  <Popover placement="auto">
                    <Popover.Trigger>
                      <IconButton
                        kind="transparent"
                        size="small"
                        icon="pi pi-info-circle"
                        :aria-label="`About ${row.capability}`"
                      />
                    </Popover.Trigger>
                    <Popover.Content>
                      <div class="flex flex-col gap-(--spacing-xxs) p-(--spacing-sm)">
                        <Popover.Title>{{ row.capability }}</Popover.Title>
                        <Popover.Description>{{ row.definition }}</Popover.Description>
                      </div>
                    </Popover.Content>
                  </Popover>
                </span>
              </span>
            </th>
            <td
              v-for="platform in platforms"
              :key="platform"
              class="border-b border-l border-(--border-default) px-(--spacing-xs) py-(--spacing-md) text-center align-middle group-data-[last]/row:border-b-0 sm:px-(--spacing-md)"
            >
              <Tooltip :text="supportLabels[levelOf(row, platform)]">
                <i
                  :data-support="levelOf(row, platform)"
                  :class="supportIcons[levelOf(row, platform)]"
                  class="text-body-md data-[support=full]:text-(--success-contrast) data-[support=none]:text-(--text-muted) data-[support=partial]:text-(--warning-contrast)"
                  aria-hidden="true"
                />
              </Tooltip>
              <span class="sr-only">{{ supportLabels[levelOf(row, platform)] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </FrameBox>
  </SectionModule>
</template>
