<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Item from '../../content/item/item.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemList from '../../content/item/item-list.vue'
  import ItemTitle from '../../content/item/item-title.vue'
  import Table from '../../data/table/table.vue'
  import TableBody from '../../data/table/table-body/table-body.vue'
  import TableCell from '../../data/table/table-cell/table-cell.vue'
  import TableFooter from '../../data/table/table-footer/table-footer.vue'
  import TableHeadCell from '../../data/table/table-head-cell/table-head-cell.vue'
  import TableHeader from '../../data/table/table-header/table-header.vue'
  import TableRow from '../../data/table/table-row/table-row.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ListingTable',
    inheritAttrs: false
  })

  /** Flex weight of a column. */
  export type ListingTableColumnGrow = 1 | 2 | 3

  /** Text alignment of a column. */
  export type ListingTableColumnAlign = 'start' | 'end'

  /** One column of the listing, left to right. */
  export type ListingTableColumn = {
    /** Key of the row value the column shows. */
    key: string
    /** Header text of the column. */
    label: string
    /** Flex weight of the column. */
    grow?: ListingTableColumnGrow
    /** Text alignment of the column. */
    align?: ListingTableColumnAlign
  }

  /** One linked row of the listing. */
  export type ListingTableRow = {
    /** Destination the row links to. */
    href: string
    /** Text of each cell, keyed by column key. */
    values: Record<string, string>
  }

  /** The button into the full listing. */
  export type ListingTableAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** The columns left to right; each is `{ key, label, grow?, align? }` where `key` picks the row value, `grow` is the flex weight (1, 2 or 3) and `align` is `start` or `end`. The first column names the row and the second describes it on phones. */
    columns?: ListingTableColumn[]
    /** The linked rows, in order; each is `{ href, values }` where `values` maps a column key to its text. */
    rows?: ListingTableRow[]
    /** Outlined button into the full listing, in the table footer; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ListingTableAction
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    columns: () => [],
    rows: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-listing-table'
  )

  const hasRows = computed(() => props.rows.length > 0 && props.columns.length > 0)

  const titleKey = computed(() => props.columns[0]?.key ?? '')

  const descriptionKey = computed(() => props.columns[1]?.key ?? '')

  const lastIndex = computed(() => props.columns.length - 1)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="hasRows"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          kind="left"
          :title="title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="sm:hidden">
          <ItemList>
            <Item
              v-for="row in rows"
              :key="row.href"
              role="listitem"
              class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)"
            >
              <ItemContent class="gap-(--spacing-xs)">
                <ItemTitle>
                  <a
                    :href="row.href"
                    class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
                  >
                    {{ row.values[titleKey] }}
                  </a>
                </ItemTitle>
                <ItemDescription
                  v-if="descriptionKey && row.values[descriptionKey]"
                  class="line-clamp-none! text-pretty"
                >
                  {{ row.values[descriptionKey] }}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemList>
          <div
            v-if="primaryAction"
            class="flex border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)"
          >
            <Button
              :label="primaryAction.label"
              :href="primaryAction.href"
              kind="outlined"
              size="large"
              :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
              class="w-full"
            />
          </div>
        </div>

        <Table class="max-sm:hidden!">
          <TableHeader>
            <TableRow>
              <TableHeadCell
                v-for="(column, index) in columns"
                :key="column.key"
                :grow="column.grow"
                :align="column.align"
                class="data-[first]:pl-(--spacing-xl)! data-[last]:pr-(--spacing-xl)!"
                :data-first="index === 0 || null"
                :data-last="index === lastIndex || null"
              >
                <span class="text-overline-md text-(--text-muted)">{{ column.label }}</span>
              </TableHeadCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="row in rows"
              :key="row.href"
              class="cursor-pointer hover:[--table-row-bg:var(--bg-canvas)]"
            >
              <TableCell
                v-for="(column, index) in columns"
                :key="column.key"
                :grow="column.grow"
                :align="column.align"
                :principal="index === 0"
                class="py-(--spacing-lg)! data-[first]:pl-(--spacing-xl)! data-[last]:pr-(--spacing-xl)! data-[value]:text-(--text-muted)"
                :data-first="index === 0 || null"
                :data-last="index === lastIndex || null"
                :data-value="index > 0 || null"
              >
                <a
                  v-if="index === 0"
                  :href="row.href"
                  class="text-label-lg text-(--text-default)"
                  >{{ row.values[column.key] }}</a
                >
                <template v-else>{{ row.values[column.key] }}</template>
              </TableCell>
            </TableRow>
          </TableBody>

          <template
            v-if="primaryAction"
            #footer
          >
            <TableFooter>
              <div class="flex justify-end px-(--spacing-xl) py-(--spacing-lg)">
                <Button
                  :label="primaryAction.label"
                  :href="primaryAction.href"
                  kind="outlined"
                  size="large"
                  :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(primaryAction.trailing)"
                />
              </div>
            </TableFooter>
          </template>
        </Table>
      </FrameBox>
    </SectionModule>
  </section>
</template>
