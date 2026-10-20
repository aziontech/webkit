<script setup lang="ts">
  import { competitor } from '@aziontech/webkit/assets/competitor-registry'
  import Brand from '@aziontech/webkit/brand'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  import type { SupportLevel } from '../../data/alternative-guides'

  defineOptions({ name: 'ComparisonTable' })

  export type ComparisonTableSupport = SupportLevel

  export interface ComparisonTableRow {
    /** What is being compared. */
    capability: string
    /** How far Azion supports it. */
    azion: ComparisonTableSupport
    /** How far the alternative supports it. */
    rival: ComparisonTableSupport
  }

  export interface ComparisonTableSupportLabels {
    /** Screen-reader text of a tick. */
    full: string
    /** Visible text of a partial cell. */
    partial: string
    /** Screen-reader text of an em dash. */
    none: string
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** Band title. */
    title?: string
    /** Name of the alternative, as the competitor registry lists it. */
    rival: string
    /** One row per capability. */
    rows: ComparisonTableRow[]
    /** Screen-reader caption of the table. */
    caption?: string
    /** Heading of the capability column. */
    columnLabel?: string
    /** Wording of the three support levels. */
    supportLabels?: ComparisonTableSupportLabels
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: 'Comparison',
    title: '',
    caption: '',
    columnLabel: 'Capability',
    supportLabels: () => ({
      full: 'Full support',
      partial: 'Partial support',
      none: 'Not available'
    }),
    anchor: ''
  })

  const rivalMark = computed(() => competitor(props.rival))

  const platforms = ['azion', 'rival'] as const
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

    <table class="w-full table-auto border-separate border-spacing-0 text-left lg:table-fixed">
      <caption
        v-if="caption"
        class="sr-only"
      >
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
          >
            <span class="text-overline-md text-(--text-muted)">{{ columnLabel }}</span>
          </th>
          <th
            scope="col"
            aria-label="Azion"
            class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) text-center align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
          >
            <span class="inline-flex [&_svg]:h-3! sm:[&_svg]:h-4!">
              <Brand
                kind="default"
                size="small"
              />
            </span>
            <span class="sr-only">Azion</span>
          </th>
          <th
            scope="col"
            :aria-label="rival"
            class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
          >
            <ClientMark
              :client="rivalMark"
              mark="mx-auto h-3 w-auto max-w-full object-contain sm:h-4"
            />
            <span class="sr-only">{{ rival }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="row.capability"
          :data-first="index === 0 || null"
          class="group/row"
        >
          <th
            scope="row"
            class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[first]/row:border-t-0"
          >
            {{ row.capability }}
          </th>
          <td
            v-for="platform in platforms"
            :key="platform"
            class="border-l border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-[first]/row:border-t-0"
          >
            <template v-if="row[platform] === 'full'">
              <i
                class="pi pi-check text-body-sm text-(--success-contrast)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ supportLabels.full }}</span>
            </template>
            <template v-else-if="row[platform] === 'none'">
              <span
                class="text-(--text-muted)"
                aria-hidden="true"
                >—</span
              >
              <span class="sr-only">{{ supportLabels.none }}</span>
            </template>
            <span v-else>{{ supportLabels.partial }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </SectionModule>
</template>
