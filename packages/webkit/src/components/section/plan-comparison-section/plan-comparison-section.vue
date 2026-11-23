<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import Tag from '../../content/tag/tag.vue'
  import Input from '../../input/input/input.vue'
  import Select from '../../input/select/select.vue'
  import SelectContent from '../../input/select/select-content/select-content.vue'
  import SelectItem from '../../input/select/select-item/select-item.vue'
  import SelectTrigger from '../../input/select/select-trigger/select-trigger.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import Link from '../../navigation/link/link.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverDescription from '../../overlay/popover/popover-description/popover-description.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import { bodiesOf, isCategory } from './lib/plan-bodies'

  defineOptions({
    name: 'PlanComparisonSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** One plan column. */
  export type PlanComparisonSectionPlan = {
    /** Stable id the narrow-screen picker selects by. */
    id: string
    /** Plan name heading its column; a plan without one is dropped. */
    name: string
    /** Marks the recommended plan: accent bar, secondary button, picked first. */
    highlighted?: boolean
    /** One line under the name saying who the plan is for. */
    description?: string
    /** The button under the plan name. */
    action: ModuleHeaderAction
  }

  /** One cell value: `true` or a tick is included, a dash is not included, other text shows as written, empty is blank. */
  export type PlanComparisonSectionValue = string | boolean

  /** One feature row. */
  export type PlanComparisonSectionRow = {
    /** The feature, rendered as the row head. */
    label: string
    /** One value per plan, in plan order. */
    values: PlanComparisonSectionValue[]
    /** Renders the row as a group heading. */
    group?: boolean
    /** Definition of the term the label names, opened in a popover beside the label. */
    hint?: string
    /** Short tag next to the label, such as Preview. */
    tag?: string
  }

  /** One product band of the table. */
  export type PlanComparisonSectionSection = {
    /** Eyebrow of the band. */
    eyebrow: string
    /** Title of the band. */
    title: string
    /** One-line lead under the title. */
    description?: string
    /** The feature rows, in order. */
    rows: PlanComparisonSectionRow[]
    /** Link closing the band, opened in a new tab; `{ label, href }`. */
    action?: ModuleHeaderAction
  }

  export interface PlanComparisonSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Screen-reader caption naming the table. */
    caption?: string
    /** Heading of the feature column, shown from the large breakpoint up. */
    columnLabel?: string
    /** Accessible name of the plan picker shown below the large breakpoint. */
    pickerAriaLabel?: string
    /** Tooltip and screen-reader text of an included cell; empty uses the locale catalog (`Included`). */
    includedLabel?: string
    /** Tooltip and screen-reader text of a not-included cell; empty uses the locale catalog (`Not included`). */
    excludedLabel?: string
    /** The plan columns, in order; each is `{ id, name, description?, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped. */
    plans?: PlanComparisonSectionPlan[]
    /**
     * The product bands, in order; each is `{ eyebrow, title, description, rows, action? }`
     * (`action` closes the band, `{ label, href }`) and a row is `{ label, values, group?, hint?,
     * tag? }` with one value per plan: `true` or a tick is included, a dash is not included,
     * other text shows as written, empty is blank; `hint` defines the label in a popover.
     */
    sections?: PlanComparisonSectionSection[]
    /** Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<PlanComparisonSectionProps>(), {
    anchor: '',
    caption: '',
    columnLabel: '',
    pickerAriaLabel: '',
    includedLabel: '',
    excludedLabel: '',
    plans: () => [],
    sections: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ planComparisonSection: en.planComparisonSection })

  const EYEBROW_PREFIX = '//' as const

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'plan-comparison-section'
  )

  const columns = computed(() =>
    props.plans.map((plan, index) => ({ plan, index })).filter(({ plan }) => Boolean(plan.name))
  )

  const picked = ref('')

  const visiblePlan = computed({
    get: () =>
      picked.value ||
      columns.value.find(({ plan }) => plan.highlighted)?.plan.id ||
      columns.value[0]?.plan.id ||
      '',
    set: (value: string) => {
      picked.value = value
    }
  })

  const planName = (id: unknown) =>
    columns.value.find(({ plan }) => plan.id === id)?.plan.name ?? ''

  const pickerQuery = ref('')

  const matchingColumns = computed(() => {
    const term = pickerQuery.value.trim().toLowerCase()
    return term
      ? columns.value.filter(({ plan }) => plan.name.toLowerCase().includes(term))
      : columns.value
  })

  const resetPickerQuery = () => {
    pickerQuery.value = ''
  }

  const pickerSearchLabel = computed(() =>
    props.pickerAriaLabel
      ? t('planComparisonSection.searchPicker', { picker: props.pickerAriaLabel.toLowerCase() })
      : t('planComparisonSection.search')
  )

  const includedText = computed(() => props.includedLabel || t('planComparisonSection.included'))

  const excludedText = computed(() => props.excludedLabel || t('planComparisonSection.excluded'))

  const labelHead = (label: string) => label.slice(0, label.lastIndexOf(' ') + 1)

  const labelTail = (label: string) => label.slice(label.lastIndexOf(' ') + 1)

  const isIncluded = (value: PlanComparisonSectionValue | undefined) =>
    value === true || value === '✓'

  const isExcluded = (value: PlanComparisonSectionValue | undefined) => value === '—'

  const closingOf = (section: PlanComparisonSectionSection | undefined) => section?.action

  const bands = computed(() =>
    props.sections.map((section) => ({ section, bodies: bodiesOf(section) }))
  )

  const isClosingRow = (sectionIndex: number, rowIndex: number) =>
    !props.primaryAction &&
    sectionIndex === props.sections.length - 1 &&
    !closingOf(props.sections[sectionIndex]) &&
    rowIndex === (props.sections[sectionIndex]?.rows.length ?? 0) - 1

  const PLAN_HEADER_CELL_CLASS =
    'sticky top-(--layout-sticky-top) z-20 border-b border-s border-(--border-default) bg-(--bg-canvas) p-(--spacing-sm) align-top ' +
    'lg:p-(--spacing-lg) font-normal max-lg:data-folded:hidden'

  const ROW_HEADER_CELL_CLASS =
    'border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-start align-middle ' +
    'lg:px-(--spacing-lg) text-label-md font-normal text-(--text-muted) ' +
    'group-data-lead/row:text-(--text-default) ' +
    'group-data-ruled/row:border-t ' +
    'group-data-closing/row:border-b'

  const VALUE_CELL_CLASS =
    'border-s border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) ' +
    'group-data-ruled/row:border-t ' +
    'group-data-closing/row:border-b ' +
    'max-lg:data-folded:hidden'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="columns.length > 0"
      :divided="false"
      :padded="false"
    >
      <table class="w-full table-auto border-separate border-spacing-0 text-start lg:table-fixed">
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
              class="sticky top-(--layout-sticky-top) z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-sm) text-start align-top lg:p-(--spacing-lg) font-normal"
            >
              <span class="text-overline-md text-(--text-muted) max-lg:sr-only">{{
                columnLabel
              }}</span>
              <Select
                v-model="visiblePlan"
                :display-value="planName"
                size="large"
                class="w-full lg:hidden"
                @update:open="resetPickerQuery"
              >
                <SelectTrigger :aria-label="pickerAriaLabel || undefined" />
                <SelectContent>
                  <template #search>
                    <Input
                      v-model="pickerQuery"
                      size="small"
                      :placeholder="t('planComparisonSection.search')"
                      :aria-label="pickerSearchLabel"
                    >
                      <template #leading>
                        <i
                          class="az az-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </template>
                  <SelectItem
                    v-for="{ plan } in matchingColumns"
                    :key="plan.id"
                    :value="plan.id"
                  >
                    {{ plan.name }}
                  </SelectItem>
                  <p
                    v-if="matchingColumns.length === 0"
                    role="status"
                    class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                  >
                    {{ t('planComparisonSection.noMatch') }}
                  </p>
                </SelectContent>
              </Select>
            </th>
            <th
              v-for="{ plan } in columns"
              :key="plan.id"
              scope="col"
              :data-folded="plan.id !== visiblePlan || null"
              :data-highlighted="plan.highlighted || null"
              :class="PLAN_HEADER_CELL_CLASS"
            >
              <span
                v-if="plan.highlighted"
                class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
                aria-hidden="true"
              />
              <div class="flex h-full flex-col items-start gap-(--spacing-sm)">
                <span class="flex flex-col gap-(--spacing-sm) max-lg:sr-only">
                  <span class="text-heading-md text-(--text-default)">{{ plan.name }}</span>
                  <span
                    v-if="plan.description"
                    class="text-body-sm text-(--text-muted)"
                    >{{ plan.description }}</span
                  >
                </span>
                <Button
                  v-if="plan.action"
                  :label="plan.action.label"
                  :variant="plan.highlighted ? 'secondary' : 'outline'"
                  size="large"
                  class="w-full max-lg:h-auto max-lg:min-h-10 max-lg:py-(--spacing-xs) max-lg:text-center max-lg:whitespace-normal"
                  :href="plan.action.href"
                />
              </div>
            </th>
          </tr>
        </thead>
        <template
          v-for="({ section, bodies }, sectionIndex) in bands"
          :key="section.title"
        >
          <tbody
            v-for="(body, bodyIndex) in bodies"
            :key="body.start"
          >
            <tr v-if="bodyIndex === 0">
              <th
                scope="rowgroup"
                :colspan="columns.length + 1"
                :data-ruled="sectionIndex > 0 || null"
                class="border-b border-(--border-default) p-(--spacing-sm) pt-(--spacing-xl) text-start lg:p-(--spacing-lg) lg:pt-(--spacing-xl) font-normal data-ruled:border-t"
              >
                <Eyebrow
                  v-if="section.eyebrow"
                  :prefix="EYEBROW_PREFIX"
                  class="mb-(--spacing-xs)"
                >
                  {{ section.eyebrow }}
                </Eyebrow>
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
              v-for="{ row, rowIndex } in body.rows"
              :key="rowIndex"
              :data-lead="row.group || null"
              :data-ruled="(row.group && rowIndex > 0) || null"
              :data-closing="isClosingRow(sectionIndex, rowIndex) || null"
              class="group/row"
            >
              <th
                :scope="isCategory(row) ? 'rowgroup' : 'row'"
                :colspan="isCategory(row) ? columns.length + 1 : undefined"
                :class="ROW_HEADER_CELL_CLASS"
              >
                <span>
                  <template v-if="row.hint">
                    {{ labelHead(row.label)
                    }}<span class="whitespace-nowrap"
                      >{{ labelTail(row.label)
                      }}<span
                        class="-my-(--spacing-2xs) ms-(--spacing-2xs) inline-flex align-middle"
                        ><Popover side="auto">
                          <PopoverTrigger>
                            <IconButton
                              variant="ghost"
                              size="small"
                              icon="az az-circle-info"
                              :aria-label="t('planComparisonSection.about', { label: row.label })"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div class="flex flex-col gap-(--spacing-2xs) p-(--spacing-sm)">
                              <PopoverTitle>{{ row.label }}</PopoverTitle>
                              <PopoverDescription>{{ row.hint }}</PopoverDescription>
                            </div>
                          </PopoverContent>
                        </Popover></span
                      ></span
                    >
                  </template>
                  <template v-else>{{ row.label }}</template>
                  <Tag
                    v-if="row.tag"
                    :label="row.tag"
                    severity="neutral"
                    size="small"
                    class="ms-(--spacing-xs) align-middle"
                  />
                </span>
              </th>
              <template v-if="!isCategory(row)">
                <td
                  v-for="{ plan, index } in columns"
                  :key="plan.id"
                  :data-folded="plan.id !== visiblePlan || null"
                  :class="VALUE_CELL_CLASS"
                >
                  <template v-if="isIncluded(row.values[index])">
                    <Tooltip :content="includedText">
                      <i
                        class="az az-circle-check text-body-md text-(--success-mark)"
                        aria-hidden="true"
                      />
                    </Tooltip>
                    <span class="sr-only">{{ includedText }}</span>
                  </template>
                  <template v-else-if="isExcluded(row.values[index])">
                    <Tooltip :content="excludedText">
                      <i
                        class="az az-circle-minus text-body-md text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Tooltip>
                    <span class="sr-only">{{ excludedText }}</span>
                  </template>
                  <span v-else-if="row.values[index]">{{ row.values[index] }}</span>
                </td>
              </template>
            </tr>
            <tr v-if="bodyIndex === bodies.length - 1 && closingOf(section)">
              <td
                :colspan="columns.length + 1"
                class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
              >
                <Link
                  :label="closingOf(section)?.label"
                  :href="closingOf(section)?.href"
                  target="_blank"
                  icon="az az-arrow-right"
                  size="medium"
                />
              </td>
            </tr>
          </tbody>
        </template>
        <tfoot v-if="primaryAction">
          <tr>
            <td
              :colspan="columns.length + 1"
              class="border-y border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
            >
              <Link
                :label="primaryAction.label"
                :href="primaryAction.href"
                target="_blank"
                icon="az az-arrow-right"
                size="medium"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </Module>
  </section>
</template>
