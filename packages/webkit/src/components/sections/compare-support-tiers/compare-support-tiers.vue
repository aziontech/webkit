<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Link from '../../navigation/link/link.vue'
  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'CompareSupportTiers',
    inheritAttrs: false
  })

  /** A link or button target: a label and where it goes. */
  export type CompareSupportTiersAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
  }

  /** One support tier column. */
  export type CompareSupportTiersTier = {
    /** Stable id the narrow-screen picker selects by. */
    id: string
    /** Tier name heading its column; a tier without one is dropped. */
    name: string
    /** Who the tier is for, under its name. */
    description?: string
    /** Marks the recommended tier: accent bar, secondary button, picked first. */
    highlighted?: boolean
    /** The button under the tier copy. */
    action: CompareSupportTiersAction
  }

  /** One cell value: `true` or a tick ticks, a dash dashes, other text shows as written, empty is blank. */
  export type CompareSupportTiersValue = string | boolean

  /** One service row. */
  export type CompareSupportTiersRow = {
    /** The service, rendered as the row head. */
    label: string
    /** One value per tier, in tier order. */
    values: CompareSupportTiersValue[]
    /** Renders the row as a group heading. */
    group?: boolean
  }

  /** One service band of the table. */
  export type CompareSupportTiersSection = {
    /** Overline of the band. */
    eyebrow: string
    /** Title of the band. */
    title: string
    /** Link that closes the band, opened in a new tab. */
    action?: CompareSupportTiersAction
    /** The service rows, in order. */
    rows: CompareSupportTiersRow[]
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Screen-reader caption naming the table. */
    caption?: string
    /** Heading of the service column, shown from the large breakpoint up. */
    columnLabel?: string
    /** Accessible name of the tier picker shown below the large breakpoint. */
    pickerAriaLabel?: string
    /** Screen-reader text of a ticked cell. */
    includedLabel?: string
    /** Screen-reader text of a dashed cell. */
    excludedLabel?: string
    /** The tier columns, in order; each is `{ id, name, description, highlighted?, action }` with `action` as `{ label, href }`; a tier without a name is dropped. */
    tiers?: CompareSupportTiersTier[]
    /** The service bands, in order; each is `{ eyebrow, title, action?, rows }` where `action` is the closing `{ label, href }` link, and a row is `{ label, values, group? }` with one value per tier: `true` or a tick ticks, a dash dashes, other text shows as written, empty is blank. */
    sections?: CompareSupportTiersSection[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    caption: '',
    columnLabel: '',
    pickerAriaLabel: '',
    includedLabel: '',
    excludedLabel: '',
    tiers: () => [],
    sections: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-compare-support-tiers'
  )

  const columns = computed(() =>
    props.tiers.map((tier, index) => ({ tier, index })).filter(({ tier }) => Boolean(tier.name))
  )

  const picked = ref('')

  const visibleTier = computed({
    get: () =>
      picked.value ||
      columns.value.find(({ tier }) => tier.highlighted)?.tier.id ||
      columns.value[0]?.tier.id ||
      '',
    set: (value: string) => {
      picked.value = value
    }
  })

  const tierName = (id: unknown) =>
    columns.value.find(({ tier }) => tier.id === id)?.tier.name ?? ''

  const isIncluded = (value: CompareSupportTiersValue | undefined) =>
    value === true || value === '✓'

  const isExcluded = (value: CompareSupportTiersValue | undefined) => value === '—'
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
                v-model="visibleTier"
                :display-value="tierName"
                size="large"
                class="w-full lg:hidden"
              >
                <SelectTrigger :aria-label="pickerAriaLabel || undefined" />
                <SelectContent>
                  <SelectOption
                    v-for="{ tier } in columns"
                    :key="tier.id"
                    :value="tier.id"
                  >
                    {{ tier.name }}
                  </SelectOption>
                </SelectContent>
              </Select>
            </th>
            <th
              v-for="{ tier } in columns"
              :key="tier.id"
              scope="col"
              :data-folded="tier.id !== visibleTier || null"
              :data-highlighted="tier.highlighted || null"
              class="sticky top-14 z-20 h-px border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal max-lg:data-folded:hidden"
            >
              <span
                v-if="tier.highlighted"
                class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
                aria-hidden="true"
              />
              <div class="flex h-full flex-col items-start justify-between gap-(--spacing-sm)">
                <div class="flex flex-col gap-(--spacing-sm) max-lg:sr-only">
                  <span class="text-heading-md text-(--text-default)">{{ tier.name }}</span>
                  <span
                    v-if="tier.description"
                    class="text-body-sm text-(--text-muted)"
                    >{{ tier.description }}</span
                  >
                </div>
                <Button
                  v-if="tier.action"
                  :label="tier.action.label"
                  :kind="tier.highlighted ? 'secondary' : 'outlined'"
                  size="large"
                  class="w-full"
                  :href="tier.action.href"
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
              {{ row.label }}
            </th>
            <td
              v-for="{ tier, index } in columns"
              :key="tier.id"
              :data-folded="tier.id !== visibleTier || null"
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
          <tr v-if="section.action">
            <td
              :colspan="columns.length + 1"
              :data-closing="sectionIndex === sections.length - 1 || null"
              class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) data-closing:border-b"
            >
              <Link
                :label="section.action.label"
                :href="section.action.href"
                target="_blank"
                icon="pi pi-arrow-right"
                size="medium"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </SectionModule>
  </section>
</template>
