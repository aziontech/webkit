<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import Overline from '@aziontech/webkit/overline'
  import SelectContent from '@aziontech/webkit/select-content'
  import SelectOption from '@aziontech/webkit/select-option'
  import Select from '@aziontech/webkit/select-root'
  import SelectTrigger from '@aziontech/webkit/select-trigger'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteLink } from './types'

  defineOptions({ name: 'PlanMatrix' })

  export type PlanMatrixValue = string | boolean

  export interface PlanMatrixPlan {
    /** Stable key of the column. */
    id: string
    /** Column heading. */
    name: string
    /** One line under the name, saying who the plan is for. */
    description?: string
    /** Marks the recommended plan with the accent bar. */
    highlighted?: boolean
    /** The column's call to action. */
    action: SiteAction
  }

  export interface PlanMatrixRow {
    /** Row label. */
    label: string
    /** Opens a block of rows: full contrast, ruled above. */
    group?: boolean
    /** Definition of a term the label names. */
    hint?: string
    /** Status chip after the label. */
    tag?: string
    /** One cell per plan: true is included, an em dash is not included, any other text is the allowance. */
    values: PlanMatrixValue[]
  }

  export interface PlanMatrixSection {
    /** Overline above the band title. */
    eyebrow?: string
    /** Band title. */
    title: string
    /** One sentence under the band title. */
    description?: string
    /** Link closing the band. */
    link?: SiteLink
    /** The band's rows. */
    rows: PlanMatrixRow[]
  }

  interface Props {
    /** The columns, in order. */
    plans: PlanMatrixPlan[]
    /** The bands, top to bottom. */
    sections: PlanMatrixSection[]
    /** Screen-reader caption of the table. */
    caption?: string
    /** Heading of the label column. */
    columnLabel?: string
    /** Accessible name of the narrow-layout plan picker. */
    pickerLabel?: string
    /** Link closing the whole table. */
    link?: SiteLink | null
    /** Screen-reader text of an included cell. */
    includedLabel?: string
    /** Screen-reader text of a not-included cell. */
    notIncludedLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    caption: '',
    columnLabel: '',
    pickerLabel: '',
    link: null,
    includedLabel: 'Included',
    notIncludedLabel: 'Not included'
  })

  const visiblePlan = ref(
    (props.plans.find((plan) => plan.highlighted) ?? props.plans[0])?.id ?? ''
  )

  const planName = (id: unknown) => props.plans.find((plan) => plan.id === id)?.name ?? ''

  const labelHead = (label: string) => label.slice(0, label.lastIndexOf(' ') + 1)

  const labelTail = (label: string) => label.slice(label.lastIndexOf(' ') + 1)

  const isClosingRow = (sectionIndex: number, rowIndex: number) =>
    !props.link &&
    !props.sections[sectionIndex].link &&
    sectionIndex === props.sections.length - 1 &&
    rowIndex === props.sections[sectionIndex].rows.length - 1
</script>

<template>
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
          <span class="text-overline-md text-(--text-muted) max-lg:sr-only">{{ columnLabel }}</span>
          <div class="w-full lg:hidden">
            <Select
              v-model="visiblePlan"
              :display-value="planName"
              size="large"
            >
              <SelectTrigger :aria-label="pickerLabel" />
              <SelectContent>
                <SelectOption
                  v-for="plan in plans"
                  :key="plan.id"
                  :value="plan.id"
                >
                  {{ plan.name }}
                </SelectOption>
              </SelectContent>
            </Select>
          </div>
        </th>
        <th
          v-for="plan in plans"
          :key="plan.id"
          scope="col"
          :data-folded="plan.id !== visiblePlan || null"
          class="sticky top-14 z-20 h-px border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal max-lg:data-folded:hidden"
        >
          <span
            v-if="plan.highlighted"
            class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
            aria-hidden="true"
          />
          <div class="flex h-full flex-col items-start justify-between gap-(--spacing-sm)">
            <div class="flex flex-col gap-(--spacing-sm) max-lg:sr-only">
              <span class="text-heading-md text-(--text-default)">{{ plan.name }}</span>
              <span
                v-if="plan.description"
                class="text-body-sm text-(--text-muted)"
                >{{ plan.description }}</span
              >
            </div>
            <SectionAction
              :action="plan.action"
              class="w-full"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody
      v-for="(section, sectionIndex) in sections"
      :key="section.title"
    >
      <tr>
        <th
          scope="colgroup"
          :colspan="plans.length + 1"
          :data-ruled="sectionIndex > 0 || null"
          class="border-b border-(--border-default) p-(--spacing-lg) pt-(--spacing-xl) text-left font-normal data-ruled:border-t"
        >
          <div
            v-if="section.eyebrow"
            class="mb-(--spacing-xs)"
          >
            <Overline prefix="//">{{ section.eyebrow }}</Overline>
          </div>
          <span class="block text-heading-lg text-(--text-default)">{{ section.title }}</span>
          <span
            v-if="section.description"
            class="mt-(--spacing-xs) block max-w-md text-body-sm text-(--text-muted) md:text-body-md"
          >
            {{ section.description }}
          </span>
        </th>
      </tr>
      <tr
        v-for="(row, rowIndex) in section.rows"
        :key="`${rowIndex}-${row.label}`"
        :data-lead="row.group || null"
        :data-ruled="(row.group && rowIndex > 0) || null"
        :data-closing="isClosingRow(sectionIndex, rowIndex) || null"
        class="group/row"
      >
        <th
          scope="row"
          class="border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-muted) group-data-lead/row:text-(--text-default) group-data-ruled/row:border-t group-data-closing/row:border-b"
        >
          <span>
            <template v-if="row.hint"
              >{{ labelHead(row.label)
              }}<span class="whitespace-nowrap"
                >{{ labelTail(row.label)
                }}<span class="ml-(--spacing-xxs) inline-flex align-middle"
                  ><Hint :text="row.hint" /></span></span
            ></template>
            <template v-else>{{ row.label }}</template>
            <span
              v-if="row.tag"
              class="ml-(--spacing-xs) inline-flex align-middle"
            >
              <Tag
                :label="row.tag"
                severity="secondary"
                size="small"
              />
            </span>
          </span>
        </th>
        <td
          v-for="(plan, planIndex) in plans"
          :key="plan.id"
          :data-folded="plan.id !== visiblePlan || null"
          class="border-l border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-ruled/row:border-t group-data-closing/row:border-b max-lg:data-folded:hidden"
        >
          <template v-if="row.values[planIndex] === true">
            <i
              class="pi pi-check text-body-sm text-(--success-contrast)"
              aria-hidden="true"
            />
            <span class="sr-only">{{ includedLabel }}</span>
          </template>
          <template v-else-if="row.values[planIndex] === '—'">
            <span
              class="text-(--text-muted)"
              aria-hidden="true"
              >—</span
            >
            <span class="sr-only">{{ notIncludedLabel }}</span>
          </template>
          <span v-else-if="row.values[planIndex]">{{ row.values[planIndex] }}</span>
        </td>
      </tr>
      <tr v-if="section.link">
        <td
          :colspan="plans.length + 1"
          :data-closing="(!link && sectionIndex === sections.length - 1) || null"
          class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) data-closing:border-b"
        >
          <Link
            :label="section.link.label"
            :href="section.link.href"
            target="_blank"
            icon="pi pi-arrow-right"
            size="medium"
          />
        </td>
      </tr>
    </tbody>
    <tfoot v-if="link">
      <tr>
        <td
          :colspan="plans.length + 1"
          class="border-y border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
        >
          <Link
            :label="link.label"
            :href="link.href"
            target="_blank"
            icon="pi pi-arrow-right"
            size="medium"
          />
        </td>
      </tr>
    </tfoot>
  </table>
</template>
