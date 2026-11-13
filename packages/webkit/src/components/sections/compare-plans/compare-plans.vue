<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Hint from '../../inputs/hint/hint.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Link from '../../navigation/link/link.vue'
  import Overline from '../../overline/overline.vue'
  import Tag from '../../tag/tag.vue'

  defineOptions({
    name: 'ComparePlans',
    inheritAttrs: false
  })

  /** A link or button target: a label and where it goes. */
  export type ComparePlansAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
  }

  /** One plan column. */
  export type ComparePlansPlan = {
    /** Stable id the narrow-screen picker selects by. */
    id: string
    /** Plan name heading its column; a plan without one is dropped. */
    name: string
    /** Marks the recommended plan: accent bar, secondary button, picked first. */
    highlighted?: boolean
    /** The button under the plan name. */
    action: ComparePlansAction
  }

  /** One cell value: `true` or a tick ticks, a dash dashes, other text shows as written, empty is blank. */
  export type ComparePlansValue = string | boolean

  /** One feature row. */
  export type ComparePlansRow = {
    /** The feature, rendered as the row head. */
    label: string
    /** One value per plan, in plan order. */
    values: ComparePlansValue[]
    /** Renders the row as a group heading. */
    group?: boolean
    /** Guidance revealed from a hint next to the label. */
    hint?: string
    /** Short tag next to the label, such as Preview. */
    tag?: string
  }

  /** One product band of the table. */
  export type ComparePlansSection = {
    /** Overline of the band. */
    eyebrow: string
    /** Title of the band. */
    title: string
    /** One-line lead under the title. */
    description?: string
    /** The feature rows, in order. */
    rows: ComparePlansRow[]
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Screen-reader caption naming the table. */
    caption?: string
    /** Heading of the feature column, shown from the large breakpoint up. */
    columnLabel?: string
    /** Accessible name of the plan picker shown below the large breakpoint. */
    pickerAriaLabel?: string
    /** Screen-reader text of a ticked cell. */
    includedLabel?: string
    /** Screen-reader text of a dashed cell. */
    excludedLabel?: string
    /** The plan columns, in order; each is `{ id, name, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped. */
    plans?: ComparePlansPlan[]
    /** The product bands, in order; each is `{ eyebrow, title, description, rows }` and a row is `{ label, values, group?, hint?, tag? }` with one value per plan: `true` or a tick ticks, a dash dashes, other text shows as written, empty is blank. */
    sections?: ComparePlansSection[]
    /** Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent. */
    primaryAction?: ComparePlansAction
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-compare-plans'
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

  const labelHead = (label: string) => label.slice(0, label.lastIndexOf(' ') + 1)

  const labelTail = (label: string) => label.slice(label.lastIndexOf(' ') + 1)

  const isIncluded = (value: ComparePlansValue | undefined) => value === true || value === '✓'

  const isExcluded = (value: ComparePlansValue | undefined) => value === '—'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="columns.length > 0"
      :divided="false"
      :padded="false"
    >
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
              <span class="text-overline-md text-(--text-muted) max-lg:sr-only">{{
                columnLabel
              }}</span>
              <Select
                v-model="visiblePlan"
                :display-value="planName"
                size="large"
                class="w-full lg:hidden"
              >
                <SelectTrigger :aria-label="pickerAriaLabel || undefined" />
                <SelectContent>
                  <SelectOption
                    v-for="{ plan } in columns"
                    :key="plan.id"
                    :value="plan.id"
                  >
                    {{ plan.name }}
                  </SelectOption>
                </SelectContent>
              </Select>
            </th>
            <th
              v-for="{ plan } in columns"
              :key="plan.id"
              scope="col"
              :data-folded="plan.id !== visiblePlan || null"
              :data-highlighted="plan.highlighted || null"
              class="sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal max-lg:data-folded:hidden"
            >
              <span
                v-if="plan.highlighted"
                class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
                aria-hidden="true"
              />
              <div class="flex h-full flex-col items-start gap-(--spacing-sm)">
                <span class="text-heading-md text-(--text-default) max-lg:sr-only">{{
                  plan.name
                }}</span>
                <Button
                  v-if="plan.action"
                  :label="plan.action.label"
                  :kind="plan.highlighted ? 'secondary' : 'outlined'"
                  size="large"
                  class="w-full"
                  :href="plan.action.href"
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
              :colspan="columns.length + 1"
              :data-ruled="sectionIndex > 0 || null"
              class="border-b border-(--border-default) p-(--spacing-lg) pt-(--spacing-xl) text-left font-normal data-ruled:border-t"
            >
              <Overline
                v-if="section.eyebrow"
                prefix="//"
                class="mb-(--spacing-xs)"
              >
                {{ section.eyebrow }}
              </Overline>
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
            :key="rowIndex"
            :data-lead="row.group || null"
            :data-ruled="(row.group && rowIndex > 0) || null"
            class="group/row"
          >
            <th
              scope="row"
              class="border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-muted) group-data-lead/row:text-(--text-default) group-data-ruled/row:border-t"
            >
              <span>
                <template v-if="row.hint">
                  {{ labelHead(row.label)
                  }}<span class="whitespace-nowrap"
                    >{{ labelTail(row.label)
                    }}<Hint
                      :text="row.hint"
                      class="ml-(--spacing-xxs) align-middle"
                  /></span>
                </template>
                <template v-else>{{ row.label }}</template>
                <Tag
                  v-if="row.tag"
                  :label="row.tag"
                  severity="secondary"
                  size="small"
                  class="ml-(--spacing-xs) align-middle"
                />
              </span>
            </th>
            <td
              v-for="{ plan, index } in columns"
              :key="plan.id"
              :data-folded="plan.id !== visiblePlan || null"
              class="border-l border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-ruled/row:border-t max-lg:data-folded:hidden"
            >
              <template v-if="isIncluded(row.values[index])">
                <i
                  class="pi pi-check text-body-sm text-(--success-contrast)"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ includedLabel }}</span>
              </template>
              <template v-else-if="isExcluded(row.values[index])">
                <span
                  class="text-(--text-muted)"
                  aria-hidden="true"
                  >—</span
                >
                <span class="sr-only">{{ excludedLabel }}</span>
              </template>
              <span v-else-if="row.values[index]">{{ row.values[index] }}</span>
            </td>
          </tr>
        </tbody>
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
                icon="pi pi-arrow-right"
                size="medium"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </SectionModule>
  </section>
</template>
